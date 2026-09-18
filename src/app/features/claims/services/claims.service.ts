import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, lastValueFrom, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { Claim, ClaimStatus } from '../../../shared/models/claim.model';
import { LoggingService } from '../../../core/services/logging.service';

@Injectable()
export class ClaimsService {

  private readonly baseUrl = environment.claimsApiBaseUrl + '/claims';

  constructor(private http: HttpClient, private loggingService: LoggingService) {
  }

  findRecentClaims(limit: number): Observable<Claim[]> {
    const params = new HttpParams().set('limit', String(limit)).set('sort', 'lodgedAt,desc');
    return this.http.get<Claim[]>(this.baseUrl, { params: params })
      .pipe(catchError(error => this.handleError('Unable to retrieve recent claims', error)));
  }

  findByClaimNumber(claimNumber: string): Observable<Claim> {
    return this.http.get<Claim>(this.baseUrl + '/' + claimNumber)
      .pipe(catchError(error => this.handleError('Unable to retrieve claim ' + claimNumber, error)));
  }

  findByPolicyNumber(policyNumber: string): Observable<Claim[]> {
    return this.http.get<Claim[]>(this.baseUrl, { params: new HttpParams().set('policyNumber', policyNumber) })
      .pipe(catchError(error => this.handleError('Unable to retrieve claims for policy ' + policyNumber, error)));
  }

  lodge(claim: Claim): Observable<Claim> {
    return this.http.post<Claim>(this.baseUrl, claim)
      .pipe(
        map(lodged => {
          this.loggingService.audit('CLAIM_LODGED', lodged.claimNumber);
          return lodged;
        }),
        catchError(error => this.handleError('Unable to lodge the claim', error))
      );
  }

  updateStatus(claimNumber: string, status: ClaimStatus): Observable<Claim> {
    return this.http.patch<Claim>(this.baseUrl + '/' + claimNumber, { status: status })
      .pipe(catchError(error => this.handleError('Unable to update claim ' + claimNumber, error)));
  }

  /**
   * Used by the print view, which needs the claim resolved before the window opens.
   */
  getClaimSnapshot(claimNumber: string): Promise<Claim> {
    return lastValueFrom(this.http.get<Claim>(this.baseUrl + '/' + claimNumber));
  }

  private handleError(message: string, error: unknown): Observable<never> {
    this.loggingService.error(message, error);
    return throwError(() => error);
  }
}
