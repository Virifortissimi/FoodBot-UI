import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CommunicationsService {
  private readonly apiUrl = `${environment.apiUrl}/communications`;

  constructor(private readonly http: HttpClient) {}

  submitContact(payload: {
    name: string;
    email: string;
    message: string;
    category?: string;
    subject?: string;
    company?: string;
  }): Observable<{ submitted: boolean; id: string }> {
    return this.http
      .post<{ success: boolean; data: { submitted: boolean; id: string } }>(`${this.apiUrl}/contact`, payload)
      .pipe(map(response => response.data));
  }

  submitApiAccessRequest(payload: {
    name: string;
    email: string;
    company: string;
    useCase: string;
    expectedTraffic?: string;
    requestedEndpoints?: string;
  }): Observable<{ submitted: boolean; id: string }> {
    return this.http
      .post<{ success: boolean; data: { submitted: boolean; id: string } }>(`${this.apiUrl}/api-access-request`, payload)
      .pipe(map(response => response.data));
  }

  subscribeNewsletter(email: string): Observable<{ subscribed: boolean; email: string; newlySubscribed: boolean }> {
    return this.http
      .post<{ success: boolean; data: { subscribed: boolean; email: string; newlySubscribed: boolean } }>(
        `${this.apiUrl}/newsletter/subscribe`,
        { email }
      )
      .pipe(map(response => response.data));
  }
}
