import { Injectable } from '@angular/core';
import { BarChartData, GoalsData, LineChartData, MetricData } from '../shared/models/types.model';

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {

  constructor() { }

  // Generate LineChartData for a goal
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


  // Generate BarChartData for a goal
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
        value: avgValue * 100, // Convert to percentage
      };
    }).filter(entry => entry.value !== undefined);
  }



  // Generate LineChartData for a specific metric
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

  // Generate BarChartData for a specific metric
  generateMetricBarChartData(metric: MetricData): BarChartData {
    return [
      {
        name: `${metric.acronym || metric.name} (${metric.unit})`,
        value: metric.value,
      },
    ];
  }
}
