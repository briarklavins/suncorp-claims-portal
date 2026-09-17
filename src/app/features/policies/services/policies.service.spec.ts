import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';

import { PoliciesService, parsePolicyDate } from './policies.service';
import { Policy, PolicySummary } from '../../../shared/models/policy.model';
import { environment } from '../../../../environments/environment';

/**
 * Pins the date contract with policy-admin-service: dates arrive as dd/MM/yyyy strings
 * (spring.jackson.date-format) and are rendered back through `date:'dd/MM/yyyy'`.
 */
describe('PoliciesService', () => {

  let service: PoliciesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PoliciesService]
    });
    service = TestBed.inject(PoliciesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should look a policy up by number', () => {
    let received: Policy;
    service.findByPolicyNumber('1400000001').subscribe(policy => received = policy);

    httpMock.expectOne(environment.policyApiBaseUrl + '/policies/1400000001').flush({
      policyNumber: '1400000001',
      inceptionDate: '01/01/2025',
      expiryDate: '31/12/2025'
    });

    expect(received.policyNumber).toBe('1400000001');
    expect(received.inceptionDate).toEqual(new Date(2025, 0, 1));
    expect(new DatePipe('en-AU').transform(received.expiryDate, 'dd/MM/yyyy')).toBe('31/12/2025');
  });

  it('should accept dd/MM/yyyy (java.util.Date) and ISO-8601 (java.time.LocalDate) wire formats', () => {
    expect(parsePolicyDate('15/01/2025')).toEqual(new Date(2025, 0, 15));
    expect(parsePolicyDate('2025-01-15')).toEqual(new Date('2025-01-15'));
    expect(parsePolicyDate('2025-01-15T00:00:00.000+10:00')).toEqual(new Date('2025-01-15T00:00:00.000+10:00'));
    expect(parsePolicyDate(null)).toBeNull();
    expect(parsePolicyDate('')).toBeNull();
  });

  it('should list a customer\'s policies', () => {
    let received: PolicySummary[];
    service.findByCustomer('C123').subscribe(policies => received = policies);
    httpMock.expectOne(environment.policyApiBaseUrl + '/policies/customer/C123')
      .flush([{ expiryDate: '31/12/2025' }, { expiryDate: null }]);
    expect(received.length).toBe(2);
    expect(received[0].expiryDate).toEqual(new Date(2025, 11, 31));
    expect(received[1].expiryDate).toBeNull();
  });

  it('should page a brand and status search', () => {
    service.search('AAM', 'ACTIVE', 2).subscribe();
    const request = httpMock.expectOne(req => req.url === environment.policyApiBaseUrl + '/policies');
    expect(request.request.params.get('brand')).toBe('AAM');
    expect(request.request.params.get('status')).toBe('ACTIVE');
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('size')).toBe('25');
    request.flush({ content: [] });
  });
});
