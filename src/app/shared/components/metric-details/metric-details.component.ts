import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MetricData } from '../../models/types.model';

/**
 * Component for displaying detailed information about a specific metric,
 * including its name, description, unit, current value, and history of values over time.
 * It provides a close button to notify the parent component to hide this panel.
 */
@Component({
  selector: 'app-metric-details',
  templateUrl: './metric-details.component.html',
  styleUrl: './metric-details.component.css'
})
export class MetricDetailsComponent {
  /**
   * The metric data to be displayed in the details panel.
   * It includes properties such as name, acronym, description, unit, value, and history.
   */
  @Input() metric: MetricData | null = null;

  /**
   * Event emitted when the user clicks the close button.
   * This notifies the parent component to close the metric details panel.
   */
  @Output() closeDetails = new EventEmitter<void>();

  /**
   * Triggers the closeDetails event to notify the parent component that the panel should be closed.
   */
  close() {
    this.closeDetails.emit();
  }
}
