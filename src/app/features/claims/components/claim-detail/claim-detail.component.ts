import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { switchMap } from 'rxjs/operators';

import { ClaimsService } from '../../services/claims.service';
import { LegacyDocumentService } from '../../services/legacy-document.service';
import { Claim, ClaimDocument } from '../../../../shared/models/claim.model';

@Component({
  selector: 'sun-claim-detail',
  templateUrl: './claim-detail.component.html'
})
export class ClaimDetailComponent implements OnInit {

  claim: Claim;
  documents: ClaimDocument[] = [];
  loading = true;

  constructor(private route: ActivatedRoute,
              private claimsService: ClaimsService,
              private legacyDocumentService: LegacyDocumentService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(switchMap(params => this.claimsService.findByClaimNumber(params.get('claimNumber'))))
      .subscribe(
        claim => {
          this.claim = claim;
          this.loading = false;
          this.loadDocuments(claim.claimNumber);
        },
        () => {
          this.loading = false;
          this.snackBar.open('This claim could not be retrieved. Try again shortly.', 'Dismiss', { duration: 6000 });
        }
      );
  }

  withdraw(): void {
    this.claimsService.updateStatus(this.claim.claimNumber, 'WITHDRAWN').subscribe(updated => {
      this.claim = updated;
      this.snackBar.open('Claim ' + updated.claimNumber + ' has been withdrawn', 'Dismiss', { duration: 5000 });
    });
  }

  documentLink(document: ClaimDocument): string {
    return this.legacyDocumentService.downloadUrl(document.documentId);
  }

  private loadDocuments(claimNumber: string): void {
    this.legacyDocumentService.listDocuments(claimNumber).subscribe(
      documents => this.documents = documents,
      () => this.documents = []
    );
  }
}
