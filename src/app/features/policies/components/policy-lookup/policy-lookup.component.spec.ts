import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { PolicyLookupComponent } from './policy-lookup.component';
import { PoliciesService } from '../../services/policies.service';
import { SharedModule } from '../../../../shared/shared.module';

describe('PolicyLookupComponent', () => {

  let fixture: ComponentFixture<PolicyLookupComponent>;
  let component: PolicyLookupComponent;
  const policiesService = jasmine.createSpyObj<PoliciesService>('PoliciesService', ['findByPolicyNumber', 'findByCustomer']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule, NoopAnimationsModule],
      declarations: [PolicyLookupComponent],
      providers: [{ provide: PoliciesService, useValue: policiesService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render a policy with dd/MM/yyyy dates and AUD premiums', () => {
    policiesService.findByPolicyNumber.and.returnValue(of({
      policyNumber: '1400000001',
      productType: 'Comprehensive Motor',
      status: 'ACTIVE',
      riskState: 'QLD',
      riskPostcode: '4000',
      inceptionDate: new Date(2024, 0, 15),
      expiryDate: new Date(2025, 0, 15),
      totalPremium: 1071.5,
      coverages: [{ coverageCode: 'COMP', sumInsured: 25000, excess: 650, premium: 1000, optional: false }]
    } as any));

    component.form.setValue({ searchType: 'POLICY_NUMBER', searchValue: '1400000001' });
    component.search();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(component.searching).toBe(false);
    expect(text).toContain('15/01/2024 to 15/01/2025');
    expect(text).toContain('$1,071.50');
    expect(text).toContain('sum insured $25,000');
  });

  it('should list a customer\'s policies and flag when none exist', () => {
    policiesService.findByCustomer.and.returnValue(of([]));
    component.form.setValue({ searchType: 'CUSTOMER_ID', searchValue: 'C123' });
    component.search();
    expect(component.notFound).toBe(true);

    policiesService.findByCustomer.and.returnValue(of([{ policyNumber: '1400000001' } as any]));
    component.search();
    expect(component.notFound).toBe(false);
    expect(component.customerPolicies.length).toBe(1);
  });

  it('should report not found when the register rejects the lookup', () => {
    policiesService.findByPolicyNumber.and.returnValue(throwError(new Error('404')));
    component.form.setValue({ searchType: 'POLICY_NUMBER', searchValue: '9999999999' });
    component.search();
    expect(component.notFound).toBe(true);
    expect(component.searching).toBe(false);
  });

  it('should ignore an invalid form submission', () => {
    policiesService.findByPolicyNumber.calls.reset();
    component.form.setValue({ searchType: 'POLICY_NUMBER', searchValue: '' });
    component.search();
    expect(policiesService.findByPolicyNumber).not.toHaveBeenCalled();
  });
});
