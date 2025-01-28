export type LineChartData = { name: string; series: { name: string; value: number }[] }[];
export type BarChartData = { name: string, value: any }[];

export interface GoalNode {
  name: string;
  description: string;
  children?: GoalNode[];
  x?: number;
  y?: number;
  parent?: GoalNode;
  expanded?: boolean;
  visible?: boolean;
}

export interface ProgressApiData {
  type: 'progress'
  message?: string; // For progress updates
}

export interface AssessmentsApiData {
  metadata: AppMetadata,
  selectedGoals: GoalsData[]
}

export interface AppMetadata {
  "_name": string,
  "_type": string,
  "_technology": string,
  "_path": string,
  "_url": string,
}

export interface GoalsData {
  name: string;
  description: string;
  weight: number;
  metrics: MetricData[];
  assessments: GoalAssessmentData[];
}

export interface MetricData {
  "name": string,
  "acronym": string,
  "description": string,
  "value": any,
  "unit": string,
  "history": MetricTimestampedData[]
}

export interface MetricTimestampedData {
  timestamp: string,
  value: any
}

export interface GoalAssessmentData {
  timestamp: string;
  globalScore: number;
  details: MetricAssessmentData[];
}

export interface MetricAssessmentData {
  metric: string;
  value: number;
  weight: number;
  timestamp: string;
}