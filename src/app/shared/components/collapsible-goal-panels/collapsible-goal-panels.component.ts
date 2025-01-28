import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { GoalsData } from '../../models/types.model';

@Component({
  selector: 'app-collapsible-goal-panels',
  templateUrl: './collapsible-goal-panels.component.html',
  styleUrl: './collapsible-goal-panels.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollapsibleGoalPanelsComponent {
  @Input() goalsData: GoalsData[] = [];
  expandedGoals: string[] = [];

  constructor(private cdr: ChangeDetectorRef) { }

  toggleGoalPanel(goalName: string): void {
    this.expandedGoals = this.expandedGoals.includes(goalName)
      ? this.expandedGoals.filter(name => name !== goalName) // Remove goal if expanded
      : [...this.expandedGoals, goalName]; // Add goal if collapsed

    this.cdr.markForCheck(); // 🚀 Ensures that Angular recognizes the update
    console.log('Goal name: ', goalName);
    console.log('Expanded goals:', this.expandedGoals);
    this.cdr.markForCheck();
  }
}
