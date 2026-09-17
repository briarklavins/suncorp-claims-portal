import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { asyncScheduler, scheduled } from 'rxjs';

import { ClaimListComponent } from './claim-list.component';
import { ClaimsService } from '../../services/claims.service';
import { SharedModule } from '../../../../shared/shared.module';
import { Claim } from '../../../../shared/models/claim.model';

describe('ClaimListComponent', () => {

  let fixture: ComponentFixture<ClaimListComponent>;
  let component: ClaimListComponent;

  const claims: Claim[] = Array.from({ length: 12 }, (_, i) => claim('CLM00000000' + (10 + i), i));

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule, NoopAnimationsModule],
      declarations: [ClaimListComponent],
      providers: [
        // Claims arrive asynchronously, as they do from the claims API, so the sortable
        // table (behind *ngIf="!loading") does not exist yet when the view initialises.
        { provide: ClaimsService, useValue: { findRecentClaims: () => scheduled([claims], asyncScheduler) } }
      ]
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ClaimListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.loading).toBe(true);
    expect(component.dataSource.paginator).toBe(component.paginator);
    expect(component.dataSource.sort).toBeFalsy();
    fixture.whenStable().then(() => fixture.detectChanges());
  }));

  it('should wire the paginator and sort to the data source once the claims render', () => {
    expect(component.loading).toBe(false);
    expect(component.dataSource.paginator).toBe(component.paginator);
    expect(component.dataSource.sort).toBeTruthy();
    expect(component.dataSource.sort).toBe(component.sort);
  });

  it('should page the table to the paginator page size', () => {
    expect(component.dataSource.data.length).toBe(12);
    expect(component.paginator.pageSize).toBe(10);
    expect(component.dataSource.connect().value.length).toBe(10);
    expect(fixture.nativeElement.querySelectorAll('tr[mat-row]').length).toBe(10);
  });

  it('should sort by lodgement date when the sort changes', () => {
    component.sort.sort({ id: 'lodgedAt', start: 'desc', disableClear: false });
    fixture.detectChanges();
    expect(component.dataSource.connect().value[0].claimNumber).toBe('CLM0000000021');
  });

  function claim(claimNumber: string, dayOffset: number): Claim {
    return {
      claimNumber,
      policyNumber: '1400000001',
      brandCode: 'SUN',
      status: 'LODGED',
      lodgedAt: new Date(2024, 9, 1 + dayOffset),
      incident: {
        claimType: 'MOTOR_HAIL',
        incidentDate: new Date(2024, 9, 1),
        incidentTime: '10:00',
        description: 'Hail',
        incidentSuburb: 'Brisbane',
        incidentState: 'QLD',
        incidentPostcode: '4000',
        policeReported: false,
        thirdPartyInvolved: false
      },
      thirdParties: [],
      settlement: { method: 'REPAIR' },
      documents: []
    };
  }
});
