import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Continuous Quality Web Assessment';
  metadata: any = {};
  selectedGoals: string[] = [];
  metrics: any[] = []; // Real-time metrics data
  progress: number = 0;
  progressMessage: string = '';
  assessmentInProgress: boolean = false;
  progressVisible: boolean = false; // Initially hidden
  metricsVisible: boolean = false; // Initially hidden

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

      // Start the progress stream
      this.apiService.startProgressStream().subscribe({
        next: (data) => {
          console.log(`Received data from backend: ${JSON.stringify(data, null, 2)}`);
          if (data.type === "metrics" && data.metrics) {
            this.metrics = data.metrics;
            this.metricsVisible = this.metrics.length > 0; // Only show if metrics exist
            this.cdr.detectChanges(); // Force UI update
            console.log('Updated metrics:', this.metrics);
            console.log('Dashboard should be visible now?: ', this.metricsVisible);
          }
          else if (data.type === "progress" && data.message){
            this.updateProgress(data.message);
          }
        },
        error: (error) => {
          console.error('Error receiving progress updates:', error);
        },
        complete: () => {
          this.completeInstrumentation();
        }
      });

      // console.log('Sending assessment data:', assessmentData);

      // Start the instrumentation process
      this.apiService.startInstrumentation(assessmentData).subscribe({
        next: (response) => {
          console.log('Instrumentation started:', response);
        },
        error: (error) => {
          console.error('Error starting instrumentation:', error);
        },
        complete: () => {
          console.log('Instrumentation complete.');
        }
      });

      this.assessmentInProgress = true;
    } else {
      alert('Please fill out the metadata and select at least one goal.');
    }
  }

  // Update progress bar with the message from the server
  updateProgress(message: string) {
    this.progressMessage = message;

    // Increment progress in smaller steps
    if (this.progress < 100) {
      this.progress += 5; // Increment by 5% on each message
    }

    if (message.includes('injection completed'))
      this.completeInstrumentation();
  }

  // Handle instrumentation completion
  completeInstrumentation() {
    this.progress = 100;
    this.progressMessage = 'Instrumentation bundle generated and injected successfully!';
    this.assessmentInProgress = false;

    // Prompt the user to open their application in a browser
    this.promptToOpenApplication();

    // Reset progress bar after a short delay
    setTimeout(() => this.resetProgressBar(), 5000);
  }

  // Prompt the user to open the application
  promptToOpenApplication() {
    const userConfirmed = confirm(
      'Instrumentation is complete. Do you want to open your application to interact with it?'
    );

    if (userConfirmed && this.metadata.url) {
      // Open the application URL in a new browser tab
      window.open(this.metadata.url, '_blank');
    } else {
      alert('You can manually open your application later if needed.');
    }
  }

  // Reset progress bar values
  resetProgressBar() {
    this.progressVisible = false;
    this.progress = 0;
    this.progressMessage = '';

    // Manually trigger change detection to ensure the UI updates
    this.cdr.detectChanges();
  }
}
