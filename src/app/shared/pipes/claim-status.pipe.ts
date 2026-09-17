import { Pipe, PipeTransform } from '@angular/core';

import { ClaimStatus } from '../models/claim.model';

@Pipe({ name: 'claimStatus' })
export class ClaimStatusPipe implements PipeTransform {

  private static readonly LABELS: { [key: string]: string } = {
    DRAFT: 'Draft',
    LODGED: 'Lodged',
    UNDER_ASSESSMENT: 'Under assessment',
    ASSESSOR_BOOKED: 'Assessor booked',
    REPAIR_IN_PROGRESS: 'Repair in progress',
    SETTLED: 'Settled',
    DECLINED: 'Declined',
    WITHDRAWN: 'Withdrawn'
  };

  transform(status: ClaimStatus): string {
    return ClaimStatusPipe.LABELS[status] || status;
  }
}
