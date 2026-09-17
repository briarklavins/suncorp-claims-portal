import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SharedModule } from '../../../../shared/shared.module';
import { ClaimLodgementComponent } from './claim-lodgement.component';
import { IncidentDetailsStepComponent } from './incident-details-step.component';
import { SettlementStepComponent } from './settlement-step.component';
import { ClaimsService } from '../../services/claims.service';
import { PoliciesService } from '../../../policies/services/policies.service';
import { SmashRepairerService } from '../../services/smash-repairer.service';
import { LoggingService } from '../../../../core/services/logging.service';

describe('ClaimLodgementComponent', () => {

  let fixture: ComponentFixture<ClaimLodgementComponent>;
  let component: ClaimLodgementComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimLodgementComponent, IncidentDetailsStepComponent, SettlementStepComponent],
      imports: [SharedModule, NoopAnimationsModule, RouterTestingModule, HttpClientTestingModule],
      providers: [
        ClaimsService,
        PoliciesService,
        SmashRepairerService,
        {
          provide: LoggingService,
          useValue: { error: jasmine.createSpy('error'), audit: jasmine.createSpy('audit') }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimLodgementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should build the five wizard step forms', () => {
    expect(component.policyForm).toBeDefined();
    expect(component.incidentForm).toBeDefined();
    expect(component.settlementForm).toBeDefined();
    expect(component.declarationForm).toBeDefined();
    expect(component.stepper).toBeDefined();
  });

  it('should require a police event number only once the incident is police reported', () => {
    const policeEventNumber = component.incidentForm.get('policeEventNumber');
    expect(policeEventNumber.valid).toBe(true);

    component.incidentForm.get('policeReported').setValue(true);
    expect(policeEventNumber.valid).toBe(false);

    policeEventNumber.setValue('QP2511001234');
    expect(policeEventNumber.valid).toBe(true);

    component.incidentForm.get('policeReported').setValue(false);
    expect(policeEventNumber.value).toBe('');
    expect(policeEventNumber.valid).toBe(true);
  });

  it('should reject policy numbers outside the Suncorp policy number range', () => {
    const policyNumber = component.policyForm.get('policyNumber');

    policyNumber.setValue('9900000001');
    expect(policyNumber.valid).toBe(false);

    policyNumber.setValue('1400000001');
    expect(policyNumber.valid).toBe(true);
  });
});
