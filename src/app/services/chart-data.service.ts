import { Injectable } from '@angular/core';
import { BarChartData, GoalsData, LineChartData, MetricData } from '../shared/models/types.model';

@Injectable({
  providedIn: 'root' // This service will be available throughout the application.
})
export class ChartDataService {

  constructor() { }

  /**
   * Generates `LineChartData` for the global score history of a specific goal.
   * @param goal The goal for which to generate the global score data.
   * @returns An array of `LineChartData` representing the goal's global score over time.
   */
  generateGlobalScoreData(goal: GoalsData): LineChartData {
    return [
      {
        name: goal.name,
        series: goal.assessments.map((assessment) => ({
          name: new Date(assessment.timestamp).toLocaleTimeString(), // Use time for better granularity
          value: assessment.globalScore * 100, // Convert to percentage
        })) || [],
      },
    ];
  }

  /**
   * Generates `BarChartData` representing the contribution of each metric to a specific goal.
   * @param goal The goal for which to generate metrics contribution data.
   * @returns An array of `BarChartData` representing the average contribution of each metric.
   */
  generateMetricsContributionData(goal: GoalsData): BarChartData {
    if (!goal.assessments.length) return []; // If no assessments exist, return empty array

    return goal.metrics.map((metric) => {
      const metricAssessments = goal.assessments.flatMap(a =>
        a.details.filter(d => d.metric === metric.acronym || d.metric === metric.name)
      );

      if (!metricAssessments.length) return { name: metric.acronym || metric.name, value: 0 };

      // Compute the average contribution over all assessments
      const avgValue = metricAssessments.reduce((sum, entry) => sum + entry.value, 0) / metricAssessments.length;

      return {
        name: metric.acronym || metric.name,
        value: avgValue * 100, // Convert value to percentage
      };
    }).filter(entry => entry.value !== undefined);
  }

  /**
   * Generates `LineChartData` for a specific metric's historical data.
   * @param metric The metric for which to generate the line chart data.
   * @returns An array of `LineChartData` representing the metric's values over time.
   */
  generateMetricLineChartData(metric: MetricData): LineChartData {
    return [
      {
        name: metric.acronym || metric.name,
        series: metric.history.map((entry) => ({
          name: new Date(entry.timestamp).toLocaleTimeString(),
          value: entry.value,
        })),
      },
    ];
  }

  /**
   * Generates `BarChartData` representing the latest value of a specific metric.
   * @param metric The metric for which to generate the bar chart data.
   * @returns An array of `BarChartData` representing the metric's current value.
   */
  generateMetricBarChartData(metric: MetricData): BarChartData {
    return [
      {
        name: `${metric.acronym || metric.name} (${metric.unit})`,
        value: metric.value,
      },
    ];
  }
}
