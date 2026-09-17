import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';

import { PoliciesService } from './policies.service';
import { Policy } from '../../../shared/models/policy.model';
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
      expiryDate: '31/12/2025'
    });

    expect(received.policyNumber).toBe('1400000001');
    expect(new DatePipe('en-AU').transform(new Date(2025, 11, 31), 'dd/MM/yyyy')).toBe('31/12/2025');
  });

  it('should list a customer\'s policies', () => {
    service.findByCustomer('C123').subscribe(policies => expect(policies.length).toBe(2));
    httpMock.expectOne(environment.policyApiBaseUrl + '/policies/customer/C123').flush([{}, {}]);
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
