import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ProgressData {
  type: 'progress' | 'metrics';
  message?: string; // For progress updates
  metrics?: any[];  // For metric updates
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private backendUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Get the quality model from the backend
  getQualityModel(): Observable<any> {
    return this.http.get(`${this.backendUrl}/quality-model`);
  }

  // Send metadata and selected goals to the backend
  startInstrumentation(data: any): Observable<any> {
    return this.http.post(`${this.backendUrl}/assessment`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Stream progress and metrics from the backend
  startProgressStream(): Observable<ProgressData> {
    return new Observable((observer) => {
      const eventSource = new EventSource(`${this.backendUrl}/progress`);

      eventSource.onmessage = (event) => {
        const data: ProgressData = JSON.parse(event.data);
        observer.next(data);
      };

      eventSource.onerror = (error) => {
        console.error('Error with SSE stream:', error);
        observer.error(error);
        eventSource.close();
      };

      return () => eventSource.close();
    });
  }
}
