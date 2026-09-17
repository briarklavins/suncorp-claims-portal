import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { ClaimLodgementComponent } from './claim-lodgement.component';
import { ClaimsService } from '../../services/claims.service';
import { PoliciesService } from '../../../policies/services/policies.service';
import { SharedModule } from '../../../../shared/shared.module';
import { Policy } from '../../../../shared/models/policy.model';

describe('ClaimLodgementComponent', () => {

  let fixture: ComponentFixture<ClaimLodgementComponent>;
  let component: ClaimLodgementComponent;

  const policy: Policy = {
    policyNumber: '1400000001',
    brandCode: 'AAM',
    productType: 'Comprehensive Motor',
    status: 'ACTIVE',
    customerMasterId: 'C123',
    riskState: 'QLD',
    riskPostcode: '4000',
    inceptionDate: new Date(2024, 0, 1),
    expiryDate: new Date(2025, 0, 1),
    basePremium: 900,
    stampDuty: 81,
    gst: 90,
    totalPremium: 1071,
    paymentFrequency: 'ANNUAL',
    coverages: []
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule, NoopAnimationsModule],
      declarations: [ClaimLodgementComponent],
      providers: [
        { provide: ClaimsService, useValue: { lodge: () => of(null) } },
        { provide: PoliciesService, useValue: { findByPolicyNumber: () => of(policy) } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimLodgementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should require a police event number only when the incident was reported to police', () => {
    const eventNumber = component.incidentForm.get('policeEventNumber');
    expect(eventNumber.valid).toBe(true);

    component.incidentForm.get('policeReported').setValue(true);
    expect(eventNumber.hasError('required')).toBe(true);

    eventNumber.setValue('QP2400012345');
    expect(eventNumber.valid).toBe(true);

    component.incidentForm.get('policeReported').setValue(false);
    expect(eventNumber.value).toBe('');
    expect(eventNumber.valid).toBe(true);
  });

  it('should reject a policy number that is not 10 digits with a valid brand prefix', () => {
    const policyNumber = component.policyForm.get('policyNumber');
    policyNumber.setValue('1234');
    expect(policyNumber.hasError('pattern')).toBe(true);
    policyNumber.setValue('1400000001');
    expect(policyNumber.valid).toBe(true);
  });

  it('should advance the stepper once the policy is found', () => {
    component.policyForm.get('policyNumber').setValue('1400000001');
    component.lookupPolicy();
    fixture.detectChanges();

    expect(component.policy).toEqual(policy);
    expect(component.stepper.selectedIndex).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Expires 01/01/2025');
  });

  it('should flag unsaved changes while a claim is being drafted', () => {
    expect(component.hasUnsavedChanges()).toBe(false);
    component.incidentForm.markAsDirty();
    expect(component.hasUnsavedChanges()).toBe(true);
    component.lodgedClaimNumber = 'CLM0000123456';
    expect(component.hasUnsavedChanges()).toBe(false);
  });
});
