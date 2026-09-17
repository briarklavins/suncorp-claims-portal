import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { environment } from '../../../../environments/environment';
import { ClaimDocument } from '../../../shared/models/claim.model';

/**
 * Talks to the legacy FileNet document store, which returns a non standard
 * envelope that the newer HttpClient JSON handling cannot parse without a custom
 * decoder. Scheduled for retirement with SUNCL-2291.
 */
@Injectable()
export class LegacyDocumentService {

  private readonly documentUrl = environment.documentUploadUrl;

  constructor(private http: Http) {
  }

  listDocuments(claimNumber: string): Observable<ClaimDocument[]> {
    const headers = new Headers({ Accept: 'application/json', 'X-Source-System': 'CLAIMS-PORTAL' });
    const options = new RequestOptions({ headers });

    return this.http.get(this.documentUrl + '?claimNumber=' + claimNumber, options)
      .map((response: Response) => {
        const envelope = response.json();
        return envelope.FILENET_RESPONSE.DOCUMENTS as ClaimDocument[];
      })
      .catch((error: Response) => Observable.throw(error));
  }

  downloadUrl(documentId: string): string {
    return this.documentUrl + '/' + documentId + '/content';
  }
}
