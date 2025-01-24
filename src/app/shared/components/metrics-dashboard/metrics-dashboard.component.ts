import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { GoalsData, MetricData, MetricsApiData } from '../../../services/api.service';

@Component({
  selector: 'app-metrics-dashboard',
  templateUrl: './metrics-dashboard.component.html',
  styleUrl: './metrics-dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetricsDashboardComponent implements OnInit, OnDestroy {
  @Input() metrics$: Observable<MetricsApiData> = of(); // Initialize with an empty observable
  goalsData: { name: string; metrics: any[]; barChartData: any[] }[] = [];
  private subscription: Subscription | undefined;

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
      name: goal.name,
      metrics: goal.metrics.map((metric: MetricData) => ({
        name: metric.name,
        acronym: metric.acronym,
        unit: metric.unit,
        value: metric.value,
        history: metric.history,

        // Prepare data for line chart
        lineChartData: [
          {
            name: metric.name,
            series: metric.history.length
              ? metric.history.map((entry) => ({
                name: new Date(entry.timestamp).toLocaleTimeString(),
                value: entry.value,
              }))
              : [{ name: 'No Data', value: 0 }],
          },
        ],
      })),

      // Prepare data for bar chart
      barChartData: goal.metrics.map((metric) => ({
        name: `${metric.name} (${metric.unit})`,
        value: metric.value,
      })),
    }));

    console.log('Processed goals data:', this.goalsData);
  }

  onLegendClick(event: any): void {
    console.log('Legend click event:', event); // Debug the event
  }
}
