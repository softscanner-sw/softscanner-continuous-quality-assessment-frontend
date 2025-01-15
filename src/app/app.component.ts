import { Component } from '@angular/core';
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

  constructor(private apiService: ApiService) { }

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
  startQualityAssessment() {
    if (this.metadata && this.selectedGoals.length > 0) {
      const assessmentData = {
        metadata: this.metadata,
        selectedGoals: this.selectedGoals,
      };

      // console.log('Sending assessment data:', assessmentData);

      this.apiService.startQualityAssessment(assessmentData).subscribe({
        next: (response) => {
          console.log('Assessment started:', response);
        },
        error: (error) => {
          console.error('Error starting assessment:', error);
        },
        complete: () => {
          console.log('Quality assessment process complete.');
        }
      });
    } else {
      alert('Please fill out the metadata and select at least one goal.');
    }
  }
}
