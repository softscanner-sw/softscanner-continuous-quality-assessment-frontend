import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './services/api.service';
import { AssessmentsApiData, GoalsData } from './shared/models/types.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'Continuous Quality Web Assessment';
  metadata: any = {};
  selectedGoals: string[] = [];
  assessments$: Observable<AssessmentsApiData> = of(); // Initialize with an empty observable
  progressMessages: string[] = [];
  assessmentInProgress: boolean = false;
  goalsData: GoalsData[] = []; // Use raw GoalsData
  progressVisible: boolean = false; // Initially hidden
  // metricsVisible: boolean = false; // Initially hidden

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) { }

  // Handle metadata submission
  onMetadataSubmit(metadata: any) {
    // console.log('Received metadata from form:', metadata);
    this.metadata = metadata;
  }

  // Handle selected goals from the Quality Model component
  onGoalsSelected(goals: string[]) {
    this.selectedGoals = goals;
  }

  // Combine metadata and selected goals into a single request
  startAssessment() {
    if (this.assessmentInProgress) {
      alert('Assessment is already in progress. Please wait for it to complete.');
      return;
    }

    if (this.metadata && this.selectedGoals.length > 0) {
      const assessmentData = {
        metadata: this.metadata,
        selectedGoals: this.selectedGoals,
      };

      // Make progress bar visible when the assessment starts
      this.progressVisible = true;

      // Start the assessment process
      this.apiService.startAssessment(assessmentData).subscribe({
        next: (response) => {
          console.log('Assessment started:', response);

          // Start progress and metrics monitoring with received assessmentId
          this.startProgressMonitoring(response.assessmentId);
          this.startAssessmentsMonitoring(response.assessmentId);
        },
        error: (error) => {
          console.error('Error starting assessment:', error);
          alert('Failed to start assessment. Please try again.');
          this.progressVisible = false;
        },
        complete: () => {
          console.log('Instrumentation request completed.');
        }
      });

      this.assessmentInProgress = true;
    }
    else
      alert('Please fill out the metadata and select at least one goal.');
  }

  // Start progress monitoring via SSE
  private startProgressMonitoring(assessmentId: string) {
    this.apiService.startProgressStream(assessmentId).subscribe({
      next: (data) => {
        console.log('Progress update received:', data);
        if (data.message)
          this.updateProgress(data.message);
      },
      error: (error) => {
        console.error('Error receiving progress updates:', error);
      },
      complete: () => {
        console.log('Progress stream completed.');
      },
    });
  }

  // Update progress bar with the message from the server
  private updateProgress(message: string) {
    // Append new message to progress logs
    this.progressMessages.push(message);

    // Ensure only last 100 messages are displayed
    if (this.progressMessages.length > 100) {
      this.progressMessages.shift();
    }

    this.progressVisible = true; // Ensure visibility during progress updates
    this.cdr.detectChanges();

    if (message.includes('injection completed'))
      this.completeInstrumentation();
  }

  // Handle instrumentation completion
  completeInstrumentation() {
    // this.progress = 100;
    this.assessmentInProgress = false;


    // Prompt the user to open their application in a browser
    this.promptToOpenApplication();

    // Manually trigger UI changes
    // setTimeout(() => this.cdr.detectChanges(), 5000);
  }

  // Prompt the user to open the application
  promptToOpenApplication() {
    const userConfirmed = confirm(
      'Instrumentation is complete. Do you want to open your application to interact with it?'
    );

    if (userConfirmed && this.metadata.url) {
      // Open the application URL in a new browser tab
      window.open(this.metadata.url, '_blank');
    }
    else
      alert('You can manually open your application later if needed.');
  }

  // Start metrics monitoring via SSE
  private startAssessmentsMonitoring(assessmentId: string) {
    this.assessments$ = this.apiService.getAssessmentsStream(assessmentId);

    this.assessments$.subscribe({
      next: (data) => {
        console.log('Assessment update received:', data);
        this.processAssessmentData(data);
      },
      error: (error) => {
        console.error('Error receiving assessment updates:', error);
      },
    });
  }

  private processAssessmentData(data: AssessmentsApiData) {
    this.goalsData = [...data.selectedGoals]; // Ensures a new array reference
    this.cdr.markForCheck(); // Ensure change detection
  }
}