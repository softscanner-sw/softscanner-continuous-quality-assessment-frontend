import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { GoalsData } from '../../models/types.model';

/**
 * Component for rendering collapsible panels for each goal.
 * Each panel displays the goal's assessment overview and metrics dashboard.
 */
@Component({
  selector: 'app-collapsible-goal-panels',
  templateUrl: './collapsible-goal-panels.component.html',
  styleUrl: './collapsible-goal-panels.component.css'
})
export class CollapsibleGoalPanelsComponent {
  @Input() goalsData: GoalsData[] = []; // Input property to receive the list of goals
  expandedGoals: string[] = []; // Array to track which goals are currently expanded

  constructor(private cdr: ChangeDetectorRef) { }

  onPanelOpened(goal: GoalsData): void {
    if (!this.expandedGoals.includes(goal.name)) {
      this.expandedGoals.push(goal.name);
    }
    this.cdr.detectChanges();
  }

  onPanelClosed(goal: GoalsData): void {
    this.expandedGoals = this.expandedGoals.filter(name => name !== goal.name);
    this.cdr.detectChanges();
  }

  isExpanded(goal: GoalsData): boolean {
    return this.expandedGoals.includes(goal.name);
  }

  trackByGoal(index: number, goal: GoalsData): string {
    return goal.name; // or another unique identifier
  }
}
