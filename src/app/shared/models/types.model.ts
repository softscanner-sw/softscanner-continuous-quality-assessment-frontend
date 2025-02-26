/**
 * Defines the structure of data used for rendering line charts.
 * Each data point contains a name and a series of values over time.
 */
export type LineChartData = {
  name: string;                             // Name of the data series (e.g., "User Engagement").
  series: {
    name: string;                           // The label for the data point (e.g., timestamp or category).
    value: number                           // The numeric value associated with the data point.
  }[]
}[];

/**
 * Defines the structure for bar chart data.
 * Each data point has a name and a corresponding value.
 */
export type BarChartData = {
  name: string;                             // The label for the bar (e.g., "Metric A").
  value: any                                // The numeric value represented by the bar.
}[];

/**
 * Represents a goal in a hierarchical quality model, allowing nesting and additional properties for visualization.
 */
export interface GoalNode {
  name: string;                             // Name of the goal (e.g., "Performance").
  description: string;                      // Description of the goal's purpose.
  children?: GoalNode[];                    // Optional nested sub-goals.
  x?: number;                               // Optional x-coordinate for visualization positioning.
  y?: number;                               // Optional y-coordinate for visualization positioning.
  parent?: GoalNode;                        // Reference to the parent goal.
  level?: number;                           // Level of the goal in the quality model in the UI
  expanded?: boolean;                       // Indicates whether the goal is expanded in the UI.
  visible?: boolean;                        // Indicates whether the goal is currently visible in the UI.
  selected?: boolean;                       // Indicates whether goal is currently selected in the quality model in the UI.
}

/**
 * Represents data received from the progress API, primarily for progress updates during long-running tasks.
 */
export interface ProgressApiData {
  type: 'progress';                         // The type of update, in this case always 'progress'.
  message?: string;                         // Optional message describing the current progress state.
}

/**
 * Represents the data structure for quality assessments retrieved from the backend.
 */
export interface AssessmentsApiData {
  metadata: AppMetadata;                    // Metadata about the application being assessed.
  selectedGoals: GoalsData[];               // List of goals selected for quality assessment, including details and assessments.
}

export interface AssessmentRequestData {
  metadata: AppMetadata;
  selectedGoals: string[];
}

export interface AssessmentResponseData {
  assessmentId: string;
  progressEndpoint: string;
  assessmentEndpoint: string
}

/**
 * Contains metadata about the application under assessment.
 */
export interface AppMetadata {
  "_name": string;                          // Application name (e.g., "MyApp").
  "_type": string;                          // Type of application (e.g., "Web (Frontend)").
  "_technology": string;                    // The technology stack used (e.g., "Angular").
  "_path": string;                          // File system path of the application.
  "_url": string;                           // URL where the application is running.
}

/**
 * Represents a goal in the quality model along with associated metrics and assessment results.
 */
export interface GoalsData {
  name: string;                             // Name of the goal.
  description: string;                      // Detailed description of the goal.
  weight: number;                           // Weight assigned to the goal for assessment calculations.
  parent?: GoalsData;                       // Optional parent goal of the current goal
  metrics: MetricData[];                    // List of metrics associated with the goal.
  assessments: GoalAssessmentData[];        // Assessment results for the goal.
}


/**
 * Represents data about a specific metric associated with a goal.
 */
export interface MetricData {
  "name": string;                           // Name of the metric (e.g., "User Interaction Frequency").
  "acronym": string;                        // Abbreviation or acronym for the metric (e.g., "UIF").
  "description": string;                    // Description of what the metric measures.
  "value": any;                             // The current value of the metric.
  "unit": string;                           // Unit of measurement for the metric (e.g., "interactions/session").
  "history": MetricTimestampedData[];       // Historical data for the metric over time.
}

/**
 * Represents a single data point in the history of a metric.
 */
export interface MetricTimestampedData {
  timestamp: string;                        // Timestamp when the metric value was recorded.
  value: any;                               // The recorded value of the metric at the given timestamp.
}


/**
 * Represents the result of a goal assessment at a specific point in time.
 */
export interface GoalAssessmentData {
  timestamp: string;                        // Timestamp when the assessment was performed.
  globalScore: number;                      // The overall score computed for the goal.
  details: MetricAssessmentData[];          // Detailed assessments for each metric contributing to the goal.
}

/**
 * Represents the result of an assessment for a specific metric within a goal.
 */
export interface MetricAssessmentData {
  metric: string;                           // Name of the assessed metric.
  value: number;                            // Computed value for the metric during the assessment.
  weight: number;                           // Weight assigned to the metric in the assessment calculation.
  timestamp: string;                        // Timestamp when the metric assessment was recorded.
}