import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { GoalsData, MetricData, MetricsApiData } from '../../../services/api.service';

type LineChartData = { name: string; series: { name: string; value: number }[] }[];
type BarChartData = { name: string, value: any }[];

export interface ProcessedMetricData extends MetricData {
  lineChartData: LineChartData;
  barChartData: BarChartData;
}

interface ProcessedGoalData extends GoalsData {
  metrics: ProcessedMetricData[];
}

@Component({
  selector: 'app-metrics-dashboard',
  templateUrl: './metrics-dashboard.component.html',
  styleUrl: './metrics-dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetricsDashboardComponent implements OnInit, OnDestroy {
  @Input() metrics$: Observable<MetricsApiData> = of(); // Initialize with an empty observable
  goalsData: ProcessedGoalData[] = [];
  selectedMetric: ProcessedMetricData | null = null;
  private subscription: Subscription | undefined;
  selectedMetricAcronyms: { [goalName: string]: string | null } = {};  // Store selected metric acronyms per goal

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subscription = this.metrics$.subscribe({
      next: (metricsData: MetricsApiData) => {
        if (!metricsData || !metricsData.selectedGoals.length) {
          console.warn('Received empty metrics, skipping update.');
          return;
        }

        console.log('Metrics update received:', metricsData);
        this.processMetrics(metricsData);
        this.cdr.detectChanges(); // Ensure UI updates
      },
      error: (error) => console.error('Error processing metrics:', error),
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private processMetrics(data: MetricsApiData): void {
    this.goalsData = data.selectedGoals.map((goal: GoalsData) => ({
      ...goal,
      metrics: goal.metrics.map((metric: MetricData) => ({
        ...metric,

        // Prepare data for line chart
        lineChartData: [
          {
            name: metric.acronym || metric.name,
            series: metric.history.length
              ? metric.history.map((entry) => ({
                name: new Date(entry.timestamp).toLocaleTimeString(),
                value: entry.value,
              }))
              : [{ name: 'No Data', value: 0 }],
          },
        ],
        // Prepare data for bar chart
        barChartData: [
          {
            name: `${metric.acronym || metric.name} (${metric.unit})`, // Use acronym if available
            value: metric.value,
          },
        ],
      })),
    }));

    // Initialize selected metrics map
    this.goalsData.forEach(goal => {
      this.selectedMetricAcronyms[goal.name] = null;
    });

    console.log('Processed goals data:', this.goalsData);
  }

  onLegendClick(event: any, goalName: string): void {
    // console.log('Legend click event:', event); // Debug the event

    // Extract acronym and find corresponding metric
    const metricAcronym = event.split(' ')[0]; // Extract acronym from legend
    const metric = this.findMetricByAcronym(goalName, metricAcronym);

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

  getBarChartData(goal: ProcessedGoalData): BarChartData {
    return goal.metrics.map(metric => ({
      name: `${metric.acronym || metric.name} (${metric.unit})`,
      value: metric.value,
    }));
  }

  private findMetricByAcronym(goalName: string, acronym: string): ProcessedMetricData | null {
    const goal = this.goalsData.find(g => g.name === goalName);
    return goal ? goal.metrics.find((metric) => metric.acronym === acronym) || null : null;
  }
}
