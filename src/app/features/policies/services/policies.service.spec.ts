import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PoliciesService } from './policies.service';
import { LoggingService } from '../../../core/services/logging.service';
import { environment } from '../../../../environments/environment';

const POLICY_DATE_CONTRACT = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/[0-9]{4}$/;

describe('PoliciesService', () => {

  let service: PoliciesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PoliciesService, LoggingService]
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
    const payload = policyPayload();

    expect(payload.inceptionDate).toMatch(POLICY_DATE_CONTRACT);
    expect(payload.expiryDate).toMatch(POLICY_DATE_CONTRACT);
    expect('2025-03-01T00:00:00Z').not.toMatch(POLICY_DATE_CONTRACT);
  });

  it('should parse dd/MM/yyyy policy dates as local dates', () => {
    let policy: any;

    service.findByPolicyNumber('1400000001').subscribe(found => policy = found);

    httpMock.expectOne(environment.policyApiBaseUrl + '/policies/1400000001').flush(policyPayload());

    expect(policy.inceptionDate).toEqual(new Date(2025, 2, 1));
    expect(policy.expiryDate).toEqual(new Date(2026, 1, 28));
  });

  it('should fail loudly when policy-admin-service switches to ISO-8601', () => {
    const logged = spyOn(TestBed.inject(LoggingService), 'error');
    let failure: Error;

    service.findByPolicyNumber('1400000001').subscribe({ error: error => failure = error });

    httpMock.expectOne(environment.policyApiBaseUrl + '/policies/1400000001')
      .flush({ ...policyPayload(), inceptionDate: '2025-03-01T00:00:00Z' });

    expect(failure.message).toContain('expected dd/MM/yyyy');
    expect(logged).toHaveBeenCalled();
  });

  it('should reject impossible calendar dates instead of rolling them over', () => {
    spyOn(TestBed.inject(LoggingService), 'error');
    let failure: Error;

    service.findByPolicyNumber('1400000001').subscribe({ error: error => failure = error });

    httpMock.expectOne(environment.policyApiBaseUrl + '/policies/1400000001')
      .flush({ ...policyPayload(), expiryDate: '31/02/2026' });

    expect(failure.message).toContain('expiryDate="31/02/2026"');
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
