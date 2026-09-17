import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PoliciesService } from './policies.service';
import { environment } from '../../../../environments/environment';

const POLICY_DATE_CONTRACT = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/[0-9]{4}$/;

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

  it('should look a policy up by policy number', () => {
    service.findByPolicyNumber('1400000001').subscribe(policy => expect(policy.policyNumber).toBe('1400000001'));

    httpMock.expectOne(environment.policyApiBaseUrl + '/policies/1400000001').flush(policyPayload());
  });

  it('should receive policy dates as dd/MM/yyyy strings', () => {
    let inceptionDate: unknown;
    let expiryDate: unknown;

    service.findByPolicyNumber('1400000001').subscribe(policy => {
      inceptionDate = policy.inceptionDate;
      expiryDate = policy.expiryDate;
    });

    httpMock.expectOne(environment.policyApiBaseUrl + '/policies/1400000001').flush(policyPayload());

    expect(inceptionDate).toMatch(POLICY_DATE_CONTRACT);
    expect(expiryDate).toMatch(POLICY_DATE_CONTRACT);
  });

  it('should not accept ISO-8601 policy dates under the current dd/MM/yyyy contract', () => {
    expect('2025-03-01T00:00:00Z').not.toMatch(POLICY_DATE_CONTRACT);
    expect('01/03/2025').toMatch(POLICY_DATE_CONTRACT);
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

  function policyPayload(): any {
    return {
      policyNumber: '1400000001',
      brandCode: 'AAM',
      productType: 'MOTOR',
      status: 'ACTIVE',
      customerMasterId: 'CM0000991',
      riskState: 'QLD',
      riskPostcode: '4300',
      inceptionDate: '01/03/2025',
      expiryDate: '28/02/2026',
      basePremium: 812.4,
      stampDuty: 74.5,
      gst: 81.24,
      totalPremium: 968.14,
      paymentFrequency: 'MONTHLY',
      coverages: []
    };
  }
});
