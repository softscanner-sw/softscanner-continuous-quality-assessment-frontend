import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AssessmentRequestData, AssessmentResponseData, AssessmentsApiData, ProgressApiData } from '../shared/models/types.model';

@Injectable({
  providedIn: 'root' // This service will be available throughout the application.
})
export class ApiService {
  // Base URL for the backend API
  private backendUrl = 'http://localhost:3000/api';

  // Subject to hold and emit assessment data updates
  private assessmentsSubject = new Subject<AssessmentsApiData>();

  constructor(private http: HttpClient) { }

  /**
   * Retrieves the quality model from the backend.
   * @returns An observable containing the quality model data.
   */
  getQualityModel(): Observable<any> {
    return this.http.get(`${this.backendUrl}/quality-model`);
  }

  /**
   * Sends application metadata and selected goals to the backend to initiate the quality assessment process.
   * @param data An object containing application metadata and a list of selected goals.
   * @returns An observable with the server response containing the assessment ID and related endpoints.
   */
  startAssessment(data: AssessmentRequestData):
    Observable<AssessmentResponseData> {
    return this.http.post<AssessmentResponseData>(
      `${this.backendUrl}/assessment`,
      data,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  /**
   * Starts a Server-Sent Events (SSE) stream to track the assessment progress.
   * @param assessmentId The ID of the assessment to track.
   * @returns An observable that emits progress updates as `ProgressApiData`.
   */
  startProgressStream(assessmentId: string): Observable<ProgressApiData> {
    return new Observable((observer) => {
      if (!assessmentId) {
        observer.error('Backend API Service: Assessment ID is not set. Start assessment first.');
        return;
      }

      const eventSource = new EventSource(`${this.backendUrl}/progress?assessmentId=${assessmentId}`);

      eventSource.onmessage = (event) => {
        try {
          const data: ProgressApiData = JSON.parse(event.data);
          observer.next(data);
        } catch (error) {
          console.error('Backend API Service: Error parsing progress SSE:', error);
          observer.error(error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('Backend API Service: Error with SSE stream:', error);
        observer.error(error);
        eventSource.close();
      };

      return () => eventSource.close();
    });
  }

  /**
   * Starts a Server-Sent Events (SSE) stream to receive assessment results in real-time.
   * @param assessmentId The ID of the assessment to track results.
   * @returns An observable that emits the assessment data as `AssessmentsApiData`.
   */
  getAssessmentsStream(assessmentId: string): Observable<AssessmentsApiData> {
    return new Observable((observer) => {
      if (!assessmentId) {
        observer.error('Backend API Service: Assessment ID is not set. Start assessment first.');
        return;
      }

      const eventSource = new EventSource(`${this.backendUrl}/assessments?assessmentId=${assessmentId}`);

      eventSource.onmessage = (event) => {
        try {
          const data: AssessmentsApiData = JSON.parse(event.data);
          this.assessmentsSubject.next(data);
          observer.next(data);
        } catch (error) {
          console.error('Backend API Service: Error parsing assessments SSE:', error);
          observer.error(error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('Backend API Service: Error with assessments SSE stream:', error);
        observer.error(error);
        eventSource.close();
      };

      return () => eventSource.close();
    });
  }

  /**
   * Provides an observable for the latest assessment data updates.
   * @returns An observable that emits the latest `AssessmentsApiData`.
   */
  getAssessmentsUpdates(): Observable<AssessmentsApiData> {
    return this.assessmentsSubject.asObservable();
  }
}
