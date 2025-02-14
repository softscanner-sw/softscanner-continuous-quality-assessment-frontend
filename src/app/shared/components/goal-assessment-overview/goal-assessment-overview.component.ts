import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ChartDataService } from '../../../services/chart-data.service';
import { BarChartData, GoalsData, LineChartData, MetricData } from '../../models/types.model';

/**
 * Component to display an overview of goal assessments.
 * Provides charts for global score evolution and metrics contribution breakdown.
 * Allows users to view detailed information for individual goals and metrics.
 */
@Component({
  selector: 'app-goal-assessment-overview',
  templateUrl: './goal-assessment-overview.component.html',
  styleUrl: './goal-assessment-overview.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush // Optimizes performance by updating only when inputs change
})
export class GoalAssessmentOverviewComponent {
  @Input() goal!: GoalsData; // The goal data to be displayed
  goalSelected: boolean = false; // Tracks whether the goal details view is open
  metricSelected: boolean = false; // Tracks whether the metric details view is open
  selectedMetric: MetricData | null = null; // Stores the currently selected metric for detailed view

  constructor(
    private chartDataService: ChartDataService, // Service to generate chart data
    private cdr: ChangeDetectorRef // Used to manually trigger change detection
  ) { }

  /**
   * Generates data for the line chart representing the global assessment score evolution.
   * @returns Line chart data for the global score
   */
  getLineChartData(): LineChartData {
    return this.chartDataService.generateGlobalScoreData(this.goal);
  }

  /**
   * Generates data for the bar chart representing the contribution of metrics to the assessment.
   * @returns Bar chart data for metrics contribution
   */
  getBarChartData(): BarChartData {
    return this.chartDataService.generateMetricsContributionData(this.goal);
  }

  /**
   * Handles click events on the goal legend in the line chart.
   * Opens the goal details view.
   * @param event Click event data
   */
  onGoalLegendClick(event: any): void {
    console.log('GoalAssessmentOverviewComponent: Goal Legend clicked:', event);
    this.goalSelected = true;

    // Trigger change detection to update the view
    this.cdr.detectChanges();
  }

  /**
   * Handles click events on the metric legend in the bar chart.
   * Opens the metric details view for the selected metric.
   * @param event Click event data
   */
  onMetricLegendClick(event: any): void {
    console.log('GoalAssessmentOverviewComponent: Metric Legend clicked:', event);
    
    // Extract acronym from the clicked legend
    const metricAcronym = event.split(' ')[0]; // Extract acronym from legend
    const metric = this.findMetricByAcronym(metricAcronym);

    if (metric) {
      this.selectedMetric = metric;
      this.metricSelected = true;
    }

    else {
      this.selectedMetric = null;
      this.metricSelected = false;
    }

    // Trigger change detection to update the view
    this.cdr.detectChanges();
  }

  /**
   * Finds a metric by its acronym in the current goal's metrics.
   * @param acronym Metric acronym
   * @returns The corresponding MetricData or null if not found
   */
  private findMetricByAcronym(acronym: string): MetricData | null {
    return this.goal.metrics.find((metric) => metric.acronym === acronym) || null;
  }

  /**
   * Closes the goal details view.
   */
  closeGoalDetails(): void {
    this.goalSelected = false;

    // Trigger change detection to update the view
    this.cdr.detectChanges();
  }

  /**
   * Closes the metric details view.
   */
  closeMetricDetails(): void {
    this.selectedMetric = null;
    this.metricSelected = false;

    // Trigger change detection to update the view
    this.cdr.detectChanges();
  }
}