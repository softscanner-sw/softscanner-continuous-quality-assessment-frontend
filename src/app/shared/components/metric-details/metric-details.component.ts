import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MetricData } from '../../models/types.model';

@Component({
  selector: 'app-metric-details',
  templateUrl: './metric-details.component.html',
  styleUrl: './metric-details.component.css'
})
export class MetricDetailsComponent {
  @Input() metric: MetricData | null = null;
  @Output() closeDetails = new EventEmitter<void>();

  close() {
    this.closeDetails.emit();
  }
}
