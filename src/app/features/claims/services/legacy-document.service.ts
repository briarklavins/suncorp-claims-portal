import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { ClaimDocument } from '../../../shared/models/claim.model';

interface FileNetEnvelope {
  FILENET_RESPONSE: {
    DOCUMENTS: ClaimDocument[];
  };
}

/**
 * Talks to the legacy FileNet document store, which returns a non standard
 * envelope that has to be unwrapped before the rest of the portal sees it.
 * Scheduled for retirement with SUNCL-2291.
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
        map(envelope => this.decode(envelope)),
        catchError((error: HttpErrorResponse) => throwError(error))
      );
  }

  downloadUrl(documentId: string): string {
    return this.documentUrl + '/' + documentId + '/content';
  }

  private decode(envelope: FileNetEnvelope): ClaimDocument[] {
    const response = envelope && envelope.FILENET_RESPONSE;
    return response && response.DOCUMENTS ? response.DOCUMENTS : [];
  }
}
