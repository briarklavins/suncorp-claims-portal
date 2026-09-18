import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
import { ClaimsService } from '../claims/services/claims.service';
import { BrandThemeService } from '../../core/services/brand-theme.service';
import { SharedModule } from '../../shared/shared.module';
import { BRANDS } from '../../shared/models/brand.model';

describe('DashboardComponent', () => {

  let fixture: ComponentFixture<DashboardComponent>;
  const claimsService = { findRecentClaims: jasmine.createSpy('findRecentClaims') };
  const brandThemeService = { getActiveBrand: jasmine.createSpy('getActiveBrand') };

  const claims = [
    { claimNumber: 'CLM1', policyNumber: '1400000001', status: 'LODGED', lodgedAt: new Date(), incident: { claimType: 'MOTOR_HAIL' } },
    { claimNumber: 'CLM2', policyNumber: '1400000002', status: 'LODGED', lodgedAt: new Date(), incident: { claimType: 'MOTOR_HAIL' } },
    { claimNumber: 'CLM3', policyNumber: '1400000003', status: 'UNDER_ASSESSMENT', lodgedAt: new Date(), incident: { claimType: 'HOME_STORM' } }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      declarations: [DashboardComponent],
      providers: [
        { provide: ClaimsService, useValue: claimsService },
        { provide: BrandThemeService, useValue: brandThemeService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  it('should show recent claims and per-status counts for the active brand', () => {
    claimsService.findRecentClaims.and.returnValue(of(claims));
    brandThemeService.getActiveBrand.and.returnValue(BRANDS[1]);

    fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.brandName).toBe('AAMI');
    expect(component.loading).toBe(false);
    expect(component.countByStatus('LODGED')).toBe(2);
    expect(component.countByStatus('UNDER_ASSESSMENT')).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(3);
  });

  it('should stop loading when the claims api fails', () => {
    claimsService.findRecentClaims.and.returnValue(throwError(new Error('down')));
    brandThemeService.getActiveBrand.and.returnValue(null);

    fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.brandName).toBe('Suncorp Insurance');
    expect(fixture.componentInstance.loading).toBe(false);
    expect(fixture.nativeElement.textContent).toContain('No claims have been lodged');
  });
});
