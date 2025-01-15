import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  // Send the selected goals and metadata to the backend
  startQualityAssessment(data: any): Observable<any> {
    return this.http.post(`${this.backendUrl}/quality-assessment`, data);
  }
}
