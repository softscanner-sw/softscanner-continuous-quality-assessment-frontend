import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { GoalsData } from '../../models/types.model';

/**
 * Component for rendering collapsible panels for each goal.
 * Each panel displays the goal's assessment overview and metrics dashboard.
 */
@Component({
  selector: 'app-collapsible-goal-panels',
  templateUrl: './collapsible-goal-panels.component.html',
  styleUrl: './collapsible-goal-panels.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush // Optimizes performance by reducing unnecessary re-renders
})
export class CollapsibleGoalPanelsComponent {
  @Input() goalsData: GoalsData[] = []; // Input property to receive the list of goals
  expandedGoals: string[] = []; // Array to track which goals are currently expanded

  constructor(private cdr: ChangeDetectorRef) { }

  /**
   * Toggles the expanded state of a goal panel.
   * @param goalName - The name of the goal to toggle.
   */
  toggleGoalPanel(goalName: string): void {
    this.expandedGoals = this.expandedGoals.includes(goalName)
      ? this.expandedGoals.filter(name => name !== goalName) // Remove the goal from the expanded list if it's already expanded
      : [...this.expandedGoals, goalName]; // Add the goal to the expanded list if it's not already expanded

    this.cdr.markForCheck(); // Ensures that Angular detects the change and updates the view
    console.log('CollapsibleGoalPanelsComponent: Goal name: ', goalName);
    console.log('CollapsibleGoalPanelsComponent: Expanded goals:', this.expandedGoals);
    this.cdr.markForCheck();
  }
}
