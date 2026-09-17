import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

/**
 * Front end errors are shipped to Splunk through the claims API logging endpoint.
 */
@Injectable()
export class LoggingService {

  constructor(private http: HttpClient) {
  }

  error(message: string, error?: any): void {
    if (!environment.production) {
      console.error(message, error);
    }
    this.http.post(environment.claimsApiBaseUrl + '/client-logs', {
      level: 'ERROR',
      application: 'claims-portal',
      message: message,
      detail: error ? String(error.message || error) : null,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    }).subscribe({ error: () => { } });
  }

  audit(action: string, claimNumber: string): void {
    this.http.post(environment.claimsApiBaseUrl + '/audit', {
      action: action,
      claimNumber: claimNumber,
      timestamp: new Date().toISOString()
    }).subscribe();
  }
}
