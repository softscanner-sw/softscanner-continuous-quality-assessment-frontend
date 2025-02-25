import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GoalNode } from '../../models/types.model';

/**
 * Component to display detailed information about a specific goal.
 * It receives a goal object as input and emits an event when the close button is clicked.
 */
@Component({
  selector: 'app-goal-details',
  templateUrl: './goal-details.component.html',
  styleUrl: './goal-details.component.css'
})
export class GoalDetailsComponent {
  /**
   * The goal to display details for.
   * It is passed as input from a parent component.
   */
  @Input() goal: GoalNode | null = null;

  /**
   * Emits an event when the user clicks the close button.
   * The parent component can handle this event to hide the details panel.
   */
  @Output() closeDetails = new EventEmitter<void>();

  constructor(
    public dialogRef: MatDialogRef<GoalDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) goal: GoalNode) {
    this.goal = goal;
  }

  /**
   * Method to handle the Close button click.
   * Emits the closeDetails event to notify the parent component.
   */
  close() {
    this.dialogRef.close();
    this.closeDetails.emit();
  }
}