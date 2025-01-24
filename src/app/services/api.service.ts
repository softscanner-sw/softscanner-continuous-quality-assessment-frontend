import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ProgressApiData {
  type: 'progress'
  message?: string; // For progress updates
}

export interface MetricsApiData {
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
  name: string,
  metrics: MetricData[]
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

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private backendUrl = 'http://localhost:3000/api';
  private metricsSubject = new Subject<MetricsApiData>();

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
  startInstrumentation(data: any): Observable<{ assessmentId: string; progressEndpoint: string; metricsEndpoint: string }> {
    return this.http.post<{ assessmentId: string; progressEndpoint: string; metricsEndpoint: string }>(
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
  * Starts an SSE stream to receive metrics updates.
  * @param assessmentId The assessment ID to track metrics updates.
  * @returns Observable providing metrics updates.
  */
  getMetricsStream(assessmentId: string): Observable<MetricsApiData> {
    return new Observable((observer) => {
      if (!assessmentId) {
        observer.error('Assessment ID is not set. Start assessment first.');
        return;
      }

      const eventSource = new EventSource(`${this.backendUrl}/metrics?assessmentId=${assessmentId}`);

      eventSource.onmessage = (event) => {
        try {
          const data: MetricsApiData = JSON.parse(event.data);
          this.metricsSubject.next(data);
          observer.next(data);
        } catch (error) {
          console.error('Error parsing metrics SSE:', error);
          observer.error(error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('Error with metrics SSE stream:', error);
        observer.error(error);
        eventSource.close();
      };

      return () => eventSource.close();
    });
  }

  /**
   * Provides an observable for the latest metrics updates.
   * @returns Observable emitting metrics updates.
   */
  getMetricsUpdates(): Observable<MetricsApiData> {
    return this.metricsSubject.asObservable();
  }
}
