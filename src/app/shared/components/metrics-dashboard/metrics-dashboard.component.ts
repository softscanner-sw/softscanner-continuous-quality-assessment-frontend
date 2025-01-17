import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-metrics-dashboard',
  templateUrl: './metrics-dashboard.component.html',
  styleUrl: './metrics-dashboard.component.css'
})
export class MetricsDashboardComponent implements OnInit, OnChanges {
  @Input() metrics: any[] = []; // Array of metric data from the backend

  // Data for charts
  lineChartData: any[] = [];
  barChartData: any[] = [];
  pieChartData: any[] = [];

  constructor() { }

  ngOnInit(): void {
    console.log('MetricsDashboardComponent initialized.');
    this.updateCharts(); // for initial data load
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['metrics'] && changes['metrics'].currentValue) {
      console.log('Metrics updated in dashboard:', this.metrics);
      this.updateCharts();
    }
  }

  // Dynamically update chart data
  updateCharts(): void {
    if (!this.metrics || this.metrics.length === 0) {
      console.error('No metrics data to display in dashboard.');
      return;
    }

    // Update Line Chart Data
    this.lineChartData = this.metrics.map((metric) => ({
      name: metric._acronym, // Use _acronym as series name
      series: metric._history?.length // Check if _history exists and has data
        ? metric._history.map((entry: any, index: number) => ({
          name: entry.timestamp || `Point ${index + 1}`, // Fallback to index if timestamp is missing
          value: entry.value || 0, // Fallback to 0 if value is missing
        }))
        : [{ name: 'No Data', value: 0 }], // Fallback for missing history
    }));

    console.log('Line chart data:', this.lineChartData);

    // Update Bar Chart Data
    this.barChartData = this.metrics.map((metric) => ({
      name: metric._acronym, // Use _acronym
      value: metric._value, // Use _value
    }));

    console.log('Bar chart data:', this.barChartData);


    // Update Pie Chart Data
    this.pieChartData = this.metrics.map((metric) => ({
      name: metric._acronym || metric._name, // Fallback for undefined _acronym
      value: metric._value || 0, // Ensure value is never undefined
    }));

    console.log('Pie chart data:', this.pieChartData);
  }

  onLegendClick(event: any): void {
    console.log('Legend click event:', event); // Debug the event
    const metricName = event; // Extract the label string
    const metric = this.metrics.find((m) => m._acronym === metricName || m._name === metricName);
    if (metric) {
      alert(`Metric Details:\nName: ${metric._name}\nDescription: ${metric._description}`);
    } else {
      console.error('Metric not found:', metricName);
    }
  }

  formatPieLabel(data: any): string {
    const total = this.pieChartData?.reduce((sum, metric) => sum + (metric.value || 0), 0) || 0;
    const name = data.name || 'Unknown'; // Fallback for undefined names
    if (total === 0) return `${name} (0%)`; // Avoid division by zero
    const percentage = ((data.value / total) * 100).toFixed(1);
    return `${name} (${percentage}%)`;
  }
}
