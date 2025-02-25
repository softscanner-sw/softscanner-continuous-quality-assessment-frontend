import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChartDataService } from '../../../services/chart-data.service';
import { BarChartData, GoalsData, LineChartData, MetricData } from '../../models/types.model';
import { GoalDetailsComponent } from '../goal-details/goal-details.component';
import { MetricDetailsComponent } from '../metric-details/metric-details.component';

/**
 * Component to display an overview of goal assessments.
 * Provides charts for global score evolution and metrics contribution breakdown.
 * Allows users to view detailed information for individual goals and metrics.
 */
@Component({
  selector: 'app-goal-assessment-overview',
  templateUrl: './goal-assessment-overview.component.html',
  styleUrl: './goal-assessment-overview.component.css'
})
export class GoalAssessmentOverviewComponent {
  @Input() goal!: GoalsData; // The goal data to be displayed

  constructor(
    private chartDataService: ChartDataService, // Service to generate chart data
    private cdr: ChangeDetectorRef, // Used to manually trigger change detection
    private dialog: MatDialog
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
    console.log('Goal Assessment Overview Component: Goal Legend clicked:', event);

    this.openGoalDetails(this.goal);

    // Trigger change detection to update the view
    this.cdr.detectChanges();
  }

  openGoalDetails(goal: GoalsData) {
    this.dialog.open(GoalDetailsComponent, {
      data: goal,
      width: '600px'
    });
  }

  /**
   * Handles click events on the metric legend in the bar chart.
   * Opens the metric details view for the selected metric.
   * @param event Click event data
   */
  onMetricLegendClick(event: any): void {
    console.log('Goal Assessment Overview Component: Metric legend/chart item clicked:', event);

    // Extract metric data from event
    let metricAcronym = this.extractDataFromEvent(event);

    // Extract metric from the extracted metric data
    const metric = this.findMetricByAcronym(metricAcronym);

    if (metric)
      // Open metric details
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
   * Finds a metric by its acronym in the current goal's metrics.
   * @param acronym Metric acronym
   * @returns The corresponding MetricData or null if not found
   */
  private findMetricByAcronym(acronym: string): MetricData | null {
    return this.goal.metrics.find((metric) => metric.acronym === acronym) || null;
  }
}