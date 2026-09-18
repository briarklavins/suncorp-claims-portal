import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { ClaimDocument } from '../../../shared/models/claim.model';

export interface FileNetEnvelope {
  FILENET_RESPONSE: {
    DOCUMENTS: ClaimDocument[];
  };
}

/**
 * Talks to the legacy FileNet document store, which wraps its payload in a
 * non standard envelope. Scheduled for retirement with SUNCL-2291.
 */
@Injectable()
export class LegacyDocumentService {

  private readonly documentUrl = environment.documentUploadUrl;

  constructor(private http: HttpClient) {
  }

  listDocuments(claimNumber: string): Observable<ClaimDocument[]> {
    const headers = new HttpHeaders({ Accept: 'application/json', 'X-Source-System': 'CLAIMS-PORTAL' });

    return this.http.get<FileNetEnvelope>(this.documentUrl, { headers, params: { claimNumber } })
      .pipe(
        map(envelope => envelope.FILENET_RESPONSE.DOCUMENTS),
        catchError((error: HttpErrorResponse) => throwError(() => error))
      );
  }

  downloadUrl(documentId: string): string {
    return this.documentUrl + '/' + documentId + '/content';
  }
}
