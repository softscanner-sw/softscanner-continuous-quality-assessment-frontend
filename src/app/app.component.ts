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
  progress: number = 0;
  progressMessage: string = '';
  instrumentationInProgress: boolean = false;
  progressVisible: boolean = false; // Initially hidden

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
  startInstrumentation() {
    if (this.instrumentationInProgress) {
      alert('Instrumentation is already in progress. Please wait for it to complete.');
      return;
    }

    if (this.metadata && this.selectedGoals.length > 0) {
      const assessmentData = {
        metadata: this.metadata,
        selectedGoals: this.selectedGoals,
      };

      // Make progress bar visible when the instrumentation starts
      this.progressVisible = true;

      // Start the progress stream
      this.apiService.startProgressStream().subscribe({
        next: (progressMessage) => {
          this.updateProgress(progressMessage);
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

      this.instrumentationInProgress = true;
    } else {
      alert('Please fill out the metadata and select at least one goal.');
    }
  }

  // Update progress bar with the message from the server
  updateProgress(message: string) {
    this.progressMessage = message;

    // Increment progress in smaller steps
    if (this.progress < 100) {
      this.progress += 10; // Increment by 10% on each message
    }

    if (message.includes('complete'))
      this.completeInstrumentation();
  }

  // Handle instrumentation completion
  completeInstrumentation() {
    this.progress = 100;
    this.progressMessage = 'Instrumentation bundle generated and injected successfully!';
    this.instrumentationInProgress = false;

    // Reset progress bar after a short delay
    setTimeout(() => this.resetProgressBar(), 5000);
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
