import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { AppMetadata, AssessmentResponseData, GoalsData } from '../../shared/models/types.model';

@Component({
  selector: 'app-quality-assessment',
  templateUrl: './quality-assessment.component.html',
  styleUrl: './quality-assessment.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush  // Optimize rendering using OnPush strategy
})
export class QualityAssessmentComponent implements OnDestroy {
  // Data coming from the metadata form and quality model
  metadata: AppMetadata | any = {}; // Holds application metadata
  selectedGoals: string[] = []; // Holds selected goal names
  goalsData: GoalsData[] = []; // Array to store received goals and their assessments
  progressMessages: string[] = []; // Progress messages for the progress bar

  // State flags
  assessmentInProgress: boolean = false; // Flag to indicate if assessment is running
  progressVisible: boolean = false; // Flag to show or hide the progress bar

  // Subscriptions for SSE streams
  private progressSub: Subscription | null = null;
  private assessmentsSub: Subscription | null = null;

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef, private ngZone: NgZone) { }

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
   * Starts or stops an ongoing quality assessment process
   */
  toggleAssessment() {
    // If an assessment is already in progress, stop it.
    if (this.assessmentInProgress) {
      this.stopAssessment();
      return;
    }

    else this.startAssessment();
  }

  /**
   * Start the quality assessment process.
   * Combines metadata and selected goals into a single request and triggers the assessment.
   */
  startAssessment() {
    if (this.metadata && this.selectedGoals.length > 0) {
      // Combines metadata and selected goals into a single request
      const assessmentData = {
        metadata: this.metadata,
        selectedGoals: this.selectedGoals
      };

      // Show progress bar when the assessment starts
      this.progressVisible = true;
      this.assessmentInProgress = true;

      // Start assessment by sending a request to the backend
      this.apiService.startAssessment(assessmentData).subscribe({
        next: (response) => {
          console.log('Quality Assessment Component: Assessment started:', response);
          // Start progress stream
          this.progressSub = this.startProgressStream(response);
          // Start assessments stream
          this.assessmentsSub = this.startAssessmentStream(response);
        },
        error: (error) => {
          console.error('Quality Assessment Component: Error starting assessment:', error);
          alert('Quality Assessment Component: Failed to start assessment. Please try again.');
          this.progressVisible = false;
          this.assessmentInProgress = false;
          this.cdr.detectChanges();
        },
        complete: () => {
          console.log('Quality Assessment Component: Instrumentation request completed.');
        }
      });
    } else {
      alert('Quality Assessment Component: Please fill out the metadata and select at least one goal.');
    }
  }

  stopAssessment() {
    // Unsubscribe from SSE streams if they exist
    if (this.progressSub) {
      this.progressSub.unsubscribe();
      this.progressSub = null;
    }
    if (this.assessmentsSub) {
      this.assessmentsSub.unsubscribe();
      this.assessmentsSub = null;
    }
    // Reset state
    this.assessmentInProgress = false;
    this.progressVisible = false;
    this.metadata = {};
    this.selectedGoals = [];
    this.goalsData = [];
    this.progressMessages = [];
    this.cdr.detectChanges();
    alert('Quality Assessment Component: Assessment stopped. Please provide new metadata and goals to start a new assessment.');
  }

  /**
   * Start monitoring progress updates from the server via Server-Sent Events (SSE).
   * @param response - The server response for the assessment request whose progress to stream
   */
  private startProgressStream(response: AssessmentResponseData) {
    return this.apiService.startProgressStream(response.assessmentId)
      .subscribe({
        next: (data) => {
          console.log('Quality Assessment Component: Progress update received:', data);
          if (data.message) {
            // Append new message to progress logs
            this.progressMessages.push(data.message);
            // Keep the last 100 messages
            if (this.progressMessages.length > 100) {
              this.progressMessages.shift();
            }
            this.cdr.detectChanges();
            // When instrumentation is done, prompt the user to start interacting with the instrumented application
            if (data.message.includes('injection completed'))
              // Prompt to open instrumented application in a new tab
              this.promptToOpenApplication();
          }
        },
        error: (err) => console.error('Quality Assessment Component: Error in progress stream:', err),
        complete: () => console.log('Quality Assessment Component: Progress stream completed.')
      });
  }

  /**
   * Prompt the user to open the instrumented application in a browser.
   */
  private promptToOpenApplication() {
    const userConfirmed = confirm('Instrumentation is complete. Do you want to open your application to interact with it?');

    if (userConfirmed && this.metadata.url) {
      // Open the application URL in a new browser tab
      window.open(this.metadata.url, '_blank');
    }
    else
      alert('You can manually open your application later if needed.');
  }

  /**
   * Start monitoring asssessment data from the server via Server-Sent Events (SSE).
   * @param response - The server response for the assessment request whose assessments to stream
   */
  private startAssessmentStream(response: AssessmentResponseData) {
    return this.apiService.getAssessmentsStream(response.assessmentId)
      .subscribe({
        next: (data) => {
          // Run inside Angular zone so change detection works reliably
          this.ngZone.run(() => {
            console.log('Quality Assessment Component: Assessment update received:', data);
            this.goalsData = [...data.selectedGoals];
            this.cdr.detectChanges();
          });
        },
        error: (err) => console.error('Quality Assessment Component: Error in assessments stream:', err)
      });
  }

  ngOnDestroy() {
    this.stopAssessment();
  }
}
