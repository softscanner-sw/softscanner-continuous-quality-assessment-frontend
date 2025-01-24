import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProcessedMetricData } from '../metrics-dashboard/metrics-dashboard.component';

@Component({
  selector: 'app-metric-details',
  templateUrl: './metric-details.component.html',
  styleUrl: './metric-details.component.css'
})
export class MetricDetailsComponent {
  @Input() metric: ProcessedMetricData | null = null;
  @Output() closeDetails = new EventEmitter<void>();

  close() {
    this.closeDetails.emit();
  }
}
