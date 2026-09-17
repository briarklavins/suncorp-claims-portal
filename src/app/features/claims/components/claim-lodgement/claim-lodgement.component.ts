import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';

import { ClaimsService } from '../../services/claims.service';
import { PoliciesService } from '../../../policies/services/policies.service';
import { ClaimInProgress } from '../../../../core/guards/unsaved-claim.guard';
import { Claim } from '../../../../shared/models/claim.model';
import { Policy } from '../../../../shared/models/policy.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'sun-claim-lodgement',
  templateUrl: './claim-lodgement.component.html',
  styleUrls: ['./claim-lodgement.component.scss']
})
export class ClaimLodgementComponent implements OnInit, ClaimInProgress {

  @ViewChild(MatStepper, { static: false })
  stepper: MatStepper;

  policyForm: FormGroup;
  incidentForm: FormGroup;
  settlementForm: FormGroup;
  declarationForm: FormGroup;

  policy: Policy;
  submitting = false;
  lodgedClaimNumber: string;

  readonly states = ['QLD', 'NSW', 'VIC', 'SA', 'WA', 'TAS', 'NT', 'ACT'];

  constructor(private formBuilder: FormBuilder,
              private claimsService: ClaimsService,
              private policiesService: PoliciesService,
              private dialog: MatDialog,
              private router: Router) {
  }

  ngOnInit(): void {
    this.policyForm = this.formBuilder.group({
      policyNumber: ['', [Validators.required, Validators.pattern(/^(13|14|15|16|17|18|19|20)[0-9]{8}$/)]],
      registration: ['']
    });

    this.incidentForm = this.formBuilder.group({
      claimType: ['', Validators.required],
      incidentDate: ['', Validators.required],
      incidentTime: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      incidentSuburb: ['', Validators.required],
      incidentState: ['QLD', Validators.required],
      incidentPostcode: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
      policeReported: [false],
      policeEventNumber: [''],
      thirdPartyInvolved: [false],
      driveable: [true]
    });

    this.settlementForm = this.formBuilder.group({
      method: ['REPAIR', Validators.required],
      accountName: [''],
      bsb: ['', Validators.pattern(/^[0-9]{3}-?[0-9]{3}$/)],
      accountNumber: ['', Validators.pattern(/^[0-9]{5,10}$/)],
      preferredRepairerId: ['']
    });

    this.declarationForm = this.formBuilder.group({
      declarationAccepted: [false, Validators.requiredTrue],
      privacyAccepted: [false, Validators.requiredTrue]
    });

    this.incidentForm.get('policeReported').valueChanges.subscribe(reported => {
      const control = this.incidentForm.get('policeEventNumber');
      if (reported) {
        control.setValidators([Validators.required]);
      } else {
        control.clearValidators();
        control.setValue('');
      }
      control.updateValueAndValidity();
    });
  }

  lookupPolicy(): void {
    if (this.policyForm.invalid) {
      this.policyForm.get('policyNumber').markAsTouched();
      return;
    }
    this.policiesService.findByPolicyNumber(this.policyForm.value.policyNumber)
      .subscribe(policy => {
        this.policy = policy;
        this.stepper.next();
      });
  }

  submit(): void {
    if (this.declarationForm.invalid) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '460px',
      data: {
        title: 'Lodge this claim?',
        message: 'The claim will be sent to the assessment team and the customer will receive an SMS confirmation.',
        confirmLabel: 'Lodge claim'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.submitting = true;
        this.claimsService.lodge(this.buildClaim()).subscribe({
          next: claim => {
            this.submitting = false;
            this.lodgedClaimNumber = claim.claimNumber;
            this.router.navigate(['/claims', claim.claimNumber]);
          },
          error: () => this.submitting = false
        });
      }
    });
  }

  hasUnsavedChanges(): boolean {
    return !this.lodgedClaimNumber && (this.incidentForm.dirty || this.policyForm.dirty);
  }

  private buildClaim(): Claim {
    return {
      policyNumber: this.policyForm.value.policyNumber,
      brandCode: this.policy ? this.policy.brandCode : 'SUN',
      status: 'LODGED',
      incident: this.incidentForm.value,
      thirdParties: [],
      settlement: this.settlementForm.value,
      documents: []
    };
  }
}
