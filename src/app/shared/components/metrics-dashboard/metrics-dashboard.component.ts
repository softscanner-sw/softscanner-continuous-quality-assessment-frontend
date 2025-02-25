import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChartDataService } from '../../../services/chart-data.service';
import { BarChartData, GoalsData, LineChartData, MetricData } from '../../models/types.model';
import { MetricDetailsComponent } from '../metric-details/metric-details.component';

/**
 * Component that represents the Metrics Dashboard.
 * It displays detailed metric information and visualizes it through charts.
 */
@Component({
  selector: 'app-metrics-dashboard',
  templateUrl: './metrics-dashboard.component.html',
  styleUrl: './metrics-dashboard.component.css'
})
export class MetricsDashboardComponent {
  /** 
   * Input property to receive the selected goal from the parent component.
   * Contains goal details, associated metrics, and assessments.
   */
  @Input() selectedGoal!: GoalsData;

  /** The currently selected metric for detailed view. */
  selectedMetric: MetricData | null = null;

  /**
   * A map to track the selected metric acronym for each goal.
   * This helps in toggling the detailed view for specific metrics.
   */
  selectedMetricAcronyms: { [goalName: string]: string | null } = {};

  constructor(
    private chartDataService: ChartDataService, // Service to generate chart data for metrics
    private cdr: ChangeDetectorRef, // Change detector to trigger manual change detection
    private dialog: MatDialog
  ) { }

  /**
   * Handles click events on the chart legend.
   * Toggles the display of detailed information for the selected metric.
   * @param event The click event containing the metric acronym
   * @param goalName The name of the goal associated with the clicked metric
   */
  onLegendClick(event: any): void {
    // Extract metric data from event
    let metricAcronym = this.extractDataFromEvent(event);

    // Extract metric from the extracted metric data
    const metric = this.findMetricByAcronym(metricAcronym);

    if (metric)
      this.openMetricDetails(JSON.parse(JSON.stringify(metric)));

    // Trigger change detection to update the view
    this.cdr.detectChanges();
  }

  openMetricDetails(metric: MetricData): void {
    this.dialog.open(MetricDetailsComponent, {
      data: metric,
      width: '600px'
    });
  }

  private extractDataFromEvent(event: any) {
    let data: string;

    // If event is an object, use its name property; if a string, split it.
    if (typeof event === 'object' && event.name) {
      data = event.name.split(' ')[0];
    } else if (typeof event === 'string') {
      data = event.split(' ')[0];
    } else {
      console.error('Unexpected event format', event);
      data = '';
    }

    return data;
  }

  /**
   * Finds a metric by its acronym in the selected goal.
   * @param acronym The acronym of the metric to find
   * @returns The corresponding MetricData object, or null if not found
   */
  private findMetricByAcronym(acronym: string): MetricData | null {
    return this.selectedGoal.metrics.find((metric) => metric.acronym === acronym) || null;
  }

  /**
   * Generates line chart data for the specified metric.
   * Used to visualize the historical values of the metric.
   * @param metric The metric for which to generate line chart data
   * @returns LineChartData for the metric
   */
  getMetricLineChartData(metric: MetricData): LineChartData {
    return this.chartDataService.generateMetricLineChartData(metric);
  }

  /**
   * Generates bar chart data for the specified metric.
   * Used to represent metric values in a bar chart format.
   * @param metric The metric for which to generate bar chart data
   * @returns BarChartData for the metric
   */
  getMetricBarChartData(metric: MetricData): BarChartData {
    return this.chartDataService.generateMetricBarChartData(metric);
  }
}
