import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { ClaimDocument } from '../../../shared/models/claim.model';

/**
 * Shape of the envelope returned by the legacy FileNet document store. It is not a
 * plain document array, so the parsed JSON has to be unwrapped explicitly.
 */
export interface FileNetEnvelope {
  FILENET_RESPONSE: {
    DOCUMENTS: ClaimDocument[];
  };
}

/**
 * Talks to the legacy FileNet document store. Scheduled for retirement with SUNCL-2291.
 */
@Injectable()
export class LegacyDocumentService {

  private readonly documentUrl = environment.documentUploadUrl;

  constructor(private http: HttpClient) {
  }

  listDocuments(claimNumber: string): Observable<ClaimDocument[]> {
    const headers = new HttpHeaders({ Accept: 'application/json', 'X-Source-System': 'CLAIMS-PORTAL' });
    const params = new HttpParams().set('claimNumber', claimNumber);

    return this.http.get<FileNetEnvelope>(this.documentUrl, { headers, params })
      .pipe(
        map(envelope => envelope.FILENET_RESPONSE.DOCUMENTS),
        catchError((error: HttpErrorResponse) => throwError(error))
      );
  }

  downloadUrl(documentId: string): string {
    return this.documentUrl + '/' + documentId + '/content';
  }
}
