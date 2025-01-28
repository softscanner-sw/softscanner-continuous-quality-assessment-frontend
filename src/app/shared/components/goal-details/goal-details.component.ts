import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GoalNode } from '../../models/types.model';

@Component({
  selector: 'app-goal-details',
  templateUrl: './goal-details.component.html',
  styleUrl: './goal-details.component.css'
})
export class GoalDetailsComponent {
  @Input() goal: GoalNode | null = null;
  @Output() closeDetails = new EventEmitter<void>();

  close() {
    this.closeDetails.emit();
  }
}
