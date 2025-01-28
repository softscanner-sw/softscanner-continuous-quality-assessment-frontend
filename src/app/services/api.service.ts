import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AppMetadata, AssessmentsApiData, ProgressApiData } from '../shared/models/types.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private backendUrl = 'http://localhost:3000/api';
  private assessmentsSubject = new Subject<AssessmentsApiData>();

  constructor(private http: HttpClient) { }

  /**
  * Retrieves the quality model from the backend.
  * @returns Observable<any> containing the quality model.
  */
  getQualityModel(): Observable<any> {
    return this.http.get(`${this.backendUrl}/quality-model`);
  }

  /**
   * Sends metadata and selected goals to the backend.
   * @param data Object containing metadata and selected goals.
   * @returns Observable with the server response containing the assessment ID.
   */
  startAssessment(data: { metadata: AppMetadata, selectedGoals: string[] }):
    Observable<{ assessmentId: string; progressEndpoint: string; assessmentEndpoint: string }> {
    return this.http.post<{ assessmentId: string; progressEndpoint: string; assessmentEndpoint: string }>(
      `${this.backendUrl}/assessment`,
      data,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  /**
   * Starts an SSE stream to receive progress updates.
   * @param assessmentId The assessment ID to track the progress.
   * @returns Observable providing progress updates.
   */
  startProgressStream(assessmentId: string): Observable<ProgressApiData> {
    return new Observable((observer) => {
      if (!assessmentId) {
        observer.error('Assessment ID is not set. Start assessment first.');
        return;
      }

      const eventSource = new EventSource(`${this.backendUrl}/progress?assessmentId=${assessmentId}`);

      eventSource.onmessage = (event) => {
        try {
          const data: ProgressApiData = JSON.parse(event.data);
          observer.next(data);
        } catch (error) {
          console.error('Error parsing progress SSE:', error);
          observer.error(error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('Error with SSE stream:', error);
        observer.error(error);
        eventSource.close();
      };

      return () => eventSource.close();
    });
  }

  /**
   * Starts an SSE stream to receive assessment results.
   * @param assessmentId The assessment ID to track results.
   * @returns Observable providing metrics updates.
   */
  getAssessmentsStream(assessmentId: string): Observable<AssessmentsApiData> {
    return new Observable((observer) => {
      if (!assessmentId) {
        observer.error('Assessment ID is not set. Start assessment first.');
        return;
      }

      const eventSource = new EventSource(`${this.backendUrl}/assessments?assessmentId=${assessmentId}`);

      eventSource.onmessage = (event) => {
        try {
          const data: AssessmentsApiData = JSON.parse(event.data);
          this.assessmentsSubject.next(data);
          observer.next(data);
        } catch (error) {
          console.error('Error parsing assessments SSE:', error);
          observer.error(error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('Error with assessments SSE stream:', error);
        observer.error(error);
        eventSource.close();
      };

      return () => eventSource.close();
    });
  }

  /**
   * Provides an observable for the latest assessment updates.
   * @returns Observable emitting assessment updates.
   */
  getAssessmentsUpdates(): Observable<AssessmentsApiData> {
    return this.assessmentsSubject.asObservable();
  }
}
