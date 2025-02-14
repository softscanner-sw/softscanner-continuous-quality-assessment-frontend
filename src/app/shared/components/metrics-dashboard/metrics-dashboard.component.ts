import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ChartDataService } from '../../../services/chart-data.service';
import { BarChartData, GoalsData, LineChartData, MetricData } from '../../models/types.model';

/**
 * Component that represents the Metrics Dashboard.
 * It displays detailed metric information and visualizes it through charts.
 */
@Component({
  selector: 'app-metrics-dashboard',
  templateUrl: './metrics-dashboard.component.html',
  styleUrl: './metrics-dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush // Optimize for performance by reducing unnecessary checks
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
    private cdr: ChangeDetectorRef // Change detector to trigger manual change detection
  ) { }

  /**
   * Handles click events on the chart legend.
   * Toggles the display of detailed information for the selected metric.
   * @param event The click event containing the metric acronym
   * @param goalName The name of the goal associated with the clicked metric
   */
  onLegendClick(event: any, goalName: string): void {
    const metricAcronym = event.split(' ')[0]; // Extract metric acronym from legend
    const metric = this.findMetricByAcronym(metricAcronym); // Find the corresponding metric

    if (metric) {
      // If the metric is found, display its details
      this.selectedMetric = metric;
      this.selectedMetricAcronyms = { ...this.selectedMetricAcronyms, [goalName]: metricAcronym };
    }
    else {
      // If not found, reset the selected metric
      this.selectedMetric = null;
      this.selectedMetricAcronyms = { ...this.selectedMetricAcronyms, [goalName]: null };
    }

    // Trigger change detection to update the view
    this.cdr.detectChanges();
  }

  /**
   * Closes the detailed view of the currently selected metric.
   * @param goalName The name of the goal for which the detailed view should be closed
   */
  closeMetricDetails(goalName: string): void {
    this.selectedMetricAcronyms[goalName] = null;
    this.selectedMetric = null;
    this.cdr.detectChanges();
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
