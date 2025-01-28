import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ChartDataService } from '../../../services/chart-data.service';
import { BarChartData, GoalsData, LineChartData, MetricData } from '../../models/types.model';

@Component({
  selector: 'app-metrics-dashboard',
  templateUrl: './metrics-dashboard.component.html',
  styleUrl: './metrics-dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetricsDashboardComponent {
  @Input() selectedGoal!: GoalsData; // Expecting a single goal as input
  selectedMetric: MetricData | null = null;
  selectedMetricAcronyms: { [goalName: string]: string | null } = {};  // Store selected metric acronyms per goal

  constructor(private chartDataService: ChartDataService, private cdr: ChangeDetectorRef) { }

  onLegendClick(event: any, goalName: string): void {
    // console.log('Legend click event:', event); // Debug the event

    // Extract acronym and find corresponding metric
    const metricAcronym = event.split(' ')[0]; // Extract acronym from legend
    const metric = this.findMetricByAcronym(metricAcronym);

    // Toggle the metric details visibility
    if (metric) {
      this.selectedMetric = metric;
      this.selectedMetricAcronyms = { ...this.selectedMetricAcronyms, [goalName]: metricAcronym };
    }
    else {
      this.selectedMetric = null;
      this.selectedMetricAcronyms = { ...this.selectedMetricAcronyms, [goalName]: null };
    }

    // console.log('Selected Metric Acronyms in the map for the selected goal:', this.selectedMetricAcronyms[goalName]);
    // console.log('Selected Metric Acronym:', this.selectedMetric?.acronym);

    this.cdr.detectChanges();
  }

  closeMetricDetails(goalName: string): void {
    this.selectedMetricAcronyms[goalName] = null;
    this.selectedMetric = null;
    this.cdr.detectChanges();
  }

  private findMetricByAcronym(acronym: string): MetricData | null {
    return this.selectedGoal.metrics.find((metric) => metric.acronym === acronym) || null;
  }

  // Generate line chart data for all metrics of the goal
  getMetricLineChartData(metric: MetricData): LineChartData {
    return this.chartDataService.generateMetricLineChartData(metric);
  }

  // Generate bar chart data for the goal's metrics
  getMetricBarChartData(metric: MetricData): BarChartData {
    return this.chartDataService.generateMetricBarChartData(metric);
  }
}
