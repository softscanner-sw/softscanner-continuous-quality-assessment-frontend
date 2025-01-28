import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ChartDataService } from '../../../services/chart-data.service';
import { BarChartData, GoalsData, LineChartData, MetricData } from '../../models/types.model';

@Component({
  selector: 'app-goal-assessment-overview',
  templateUrl: './goal-assessment-overview.component.html',
  styleUrl: './goal-assessment-overview.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoalAssessmentOverviewComponent {
  @Input() goal!: GoalsData;
  goalSelected: boolean = false;
  metricSelected: boolean = false;
  selectedMetric: MetricData | null = null;

  constructor(private chartDataService: ChartDataService, private cdr: ChangeDetectorRef) { }

  getLineChartData(): LineChartData {
    return this.chartDataService.generateGlobalScoreData(this.goal);
  }

  getBarChartData(): BarChartData {
    return this.chartDataService.generateMetricsContributionData(this.goal);
  }

  // Handle legend click event
  onGoalLegendClick(event: any): void {
    console.log('Goal Legend clicked:', event);
    this.goalSelected = true;
    this.cdr.detectChanges();
  }

  onMetricLegendClick(event: any): void {
    console.log('Metric Legend clicked:', event);
    // Extract acronym and find corresponding metric
    const metricAcronym = event.split(' ')[0]; // Extract acronym from legend
    const metric = this.findMetricByAcronym(metricAcronym);

    if (metric){
      this.selectedMetric = metric;
      this.metricSelected = true;
    }

    else {
      this.selectedMetric = null;
      this.metricSelected = false;
    }

    this.cdr.detectChanges();
  }

  private findMetricByAcronym(acronym: string): MetricData | null {
    return this.goal.metrics.find((metric) => metric.acronym === acronym) || null;
  }

  // Close goal details view
  closeGoalDetails(): void {
    this.goalSelected = false;
    this.cdr.detectChanges();
  }

  closeMetricDetails(): void {
    this.selectedMetric = null;
    this.metricSelected = false;
    this.cdr.detectChanges();
  }
}
