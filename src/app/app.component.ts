import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './services/api.service';
import { AssessmentsApiData, GoalsData } from './shared/models/types.model';

/**
 * The main component of the application.
 * It coordinates metadata submission, goal selection, progress monitoring, and quality assessment.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush  // Optimize rendering using OnPush strategy
})
export class AppComponent {
  title = 'SoftScanner: Continuous Quality Web Assessment UI'; // Application title
  metadata: any = {}; // Holds application metadata
  selectedGoals: string[] = []; // Holds selected goal names
  assessments$: Observable<AssessmentsApiData> = of(); // Observable for assessment data
  progressMessages: string[] = []; // Progress messages for the progress bar
  assessmentInProgress: boolean = false; // Flag to indicate if assessment is running
  goalsData: GoalsData[] = []; // Array to store received goals and their assessments
  progressVisible: boolean = false; // Flag to show or hide the progress bar

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) { }

  /**
   * Handle metadata submission from the metadata form.
   * @param metadata - The submitted metadata
   */
  onMetadataSubmit(metadata: any) {
    this.metadata = metadata;
  }

  /**
   * Handle selected goals from the Quality Model component.
   * @param goals - Array of selected goal names
   */
  onGoalsSelected(goals: string[]) {
    this.selectedGoals = goals;
  }

  /**
   * Start the quality assessment process.
   * Combines metadata and selected goals into a single request and triggers the assessment.
   */
  startAssessment() {
    if (this.assessmentInProgress) {
      alert('AppComponent: Assessment is already in progress. Please wait for it to complete.');
      return;
    }

    if (this.metadata && this.selectedGoals.length > 0) {
      const assessmentData = {
        metadata: this.metadata,
        selectedGoals: this.selectedGoals,
      };

      // Show progress bar when the assessment starts
      this.progressVisible = true;

      // Start assessment by sending a request to the backend
      this.apiService.startAssessment(assessmentData).subscribe({
        next: (response) => {
          console.log('AppComponent: Assessment started:', response);

          // Start progress and metrics monitoring with received assessmentId
          this.startProgressMonitoring(response.assessmentId);
          this.startAssessmentsMonitoring(response.assessmentId);
        },
        error: (error) => {
          console.error('AppComponent: Error starting assessment:', error);
          alert('AppComponent: Failed to start assessment. Please try again.');
          this.progressVisible = false;
        },
        complete: () => {
          console.log('AppComponent: Instrumentation request completed.');
        }
      });

      this.assessmentInProgress = true;
    }
    else
      alert('AppComponent: Please fill out the metadata and select at least one goal.');
  }

  /**
   * Start monitoring progress updates from the server via Server-Sent Events (SSE).
   * @param assessmentId - The ID of the assessment
   */
  private startProgressMonitoring(assessmentId: string) {
    this.apiService.startProgressStream(assessmentId).subscribe({
      next: (data) => {
        console.log('AppComponent: Progress update received:', data);
        if (data.message)
          this.updateProgress(data.message);
      },
      error: (error) => {
        console.error('AppComponent: Error receiving progress updates:', error);
      },
      complete: () => {
        console.log('AppComponent: Progress stream completed.');
      },
    });
  }

  /**
   * Update progress messages and ensure the progress bar is visible.
   * @param message - Progress message from the server
   */
  private updateProgress(message: string) {
    // Append new message to progress logs
    this.progressMessages.push(message);

    // Keep only the last 100 messages
    if (this.progressMessages.length > 100) {
      this.progressMessages.shift();
    }

    this.progressVisible = true; // Ensure visibility during progress updates
    this.cdr.detectChanges();

    if (message.includes('injection completed'))
      this.completeInstrumentation();
  }

  /**
   * Handle completion of the instrumentation process.
   * Prompt the user to open the application in a browser.
   */
  completeInstrumentation() {
    this.assessmentInProgress = false;

    // Prompt the user to open their application in a browser
    this.promptToOpenApplication();
  }

  /**
   * Prompt the user to open the instrumented application in a browser.
   */
  promptToOpenApplication() {
    const userConfirmed = confirm('Instrumentation is complete. Do you want to open your application to interact with it?');

    if (userConfirmed && this.metadata.url) {
      // Open the application URL in a new browser tab
      window.open(this.metadata.url, '_blank');
    }
    else
      alert('You can manually open your application later if needed.');
  }

  /**
   * Start monitoring assessment data updates via SSE.
   * @param assessmentId - The ID of the assessment
   */
  private startAssessmentsMonitoring(assessmentId: string) {
    this.assessments$ = this.apiService.getAssessmentsStream(assessmentId);
    this.assessments$.subscribe({
      next: (data) => {
        console.log('AppComponent: Assessment update received:', data);
        this.processAssessmentData(data);
      },
      error: (error) => {
        console.error('AppComponent: Error receiving assessment updates:', error);
      },
    });
  }

  /**
   * Process the received assessment data and update the UI.
   * @param data - The assessment data
   */
  private processAssessmentData(data: AssessmentsApiData) {
    this.goalsData = [...data.selectedGoals]; // Ensures a new array reference
    this.cdr.markForCheck(); // Ensure change detection
  }
}