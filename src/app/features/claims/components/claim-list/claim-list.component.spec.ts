import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SharedModule } from '../../../../shared/shared.module';
import { ClaimListComponent } from './claim-list.component';
import { ClaimsService } from '../../services/claims.service';
import { Claim } from '../../../../shared/models/claim.model';

describe('ClaimListComponent', () => {

  let fixture: ComponentFixture<ClaimListComponent>;
  let component: ClaimListComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimListComponent],
      imports: [SharedModule, NoopAnimationsModule, RouterTestingModule],
      providers: [
        { provide: ClaimsService, useValue: { findRecentClaims: () => of([hailClaim()]) } }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should wire the paginator and sort to the table after the view initialises', () => {
    expect(component.paginator).toBeDefined();
    expect(component.sort).toBeDefined();
    expect(component.dataSource.paginator).toBe(component.paginator);
    expect(component.dataSource.sort).toBe(component.sort);
  });

  it('should load recent claims into the table data source', () => {
    expect(component.loading).toBe(false);
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].claimNumber).toBe('CLM0000123456');
  });

  function hailClaim(): Claim {
    return {
      claimNumber: 'CLM0000123456',
      policyNumber: '1400000001',
      brandCode: 'AAM',
      status: 'LODGED',
      incident: {
        claimType: 'MOTOR_HAIL',
        incidentDate: new Date('2025-10-31T00:00:00'),
        incidentTime: '16:45',
        description: 'Hail damage to roof and bonnet',
        incidentSuburb: 'Springfield Lakes',
        incidentState: 'QLD',
        incidentPostcode: '4300',
        policeReported: false,
        thirdPartyInvolved: false,
        driveable: true
      },
      thirdParties: [],
      settlement: { method: 'REPAIR' },
      documents: []
    };
  }
});
