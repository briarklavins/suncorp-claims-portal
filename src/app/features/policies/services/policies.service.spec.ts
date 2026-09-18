import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';

import { PoliciesService } from './policies.service';
import { Policy, PolicySummary } from '../../../shared/models/policy.model';
import { environment } from '../../../../environments/environment';

describe('PoliciesService', () => {

  let service: PoliciesService;
  let httpMock: HttpTestingController;
  const datePipe = new DatePipe('en-AU');
  const baseUrl = environment.policyApiBaseUrl + '/policies';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PoliciesService]
    });
    service = TestBed.inject(PoliciesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should decode dd/MM/yyyy policy dates so they render with date:dd/MM/yyyy', () => {
    let policy: Policy;
    service.findByPolicyNumber('1300012345').subscribe(result => policy = result);

    httpMock.expectOne(baseUrl + '/1300012345').flush({
      ...motorPolicy(), inceptionDate: '12/03/2026', expiryDate: '12/03/2027'
    });

    expect(datePipe.transform(policy.inceptionDate, 'dd/MM/yyyy')).toBe('12/03/2026');
    expect(datePipe.transform(policy.expiryDate, 'dd/MM/yyyy')).toBe('12/03/2027');
    expect(policy.productType).toBe('Comprehensive Motor');
  });

  it('should decode ISO-8601 policy dates identically', () => {
    let policy: Policy;
    service.findByPolicyNumber('1300012345').subscribe(result => policy = result);

    httpMock.expectOne(baseUrl + '/1300012345').flush({
      ...motorPolicy(), inceptionDate: '2026-03-12', expiryDate: '2027-03-12'
    });

    expect(datePipe.transform(policy.inceptionDate, 'dd/MM/yyyy')).toBe('12/03/2026');
    expect(datePipe.transform(policy.expiryDate, 'dd/MM/yyyy')).toBe('12/03/2027');
  });

  it('should decode expiry dates on customer policy summaries', () => {
    let summaries: PolicySummary[];
    service.findByCustomer('CM-778899').subscribe(result => summaries = result);

    httpMock.expectOne(baseUrl + '/customer/CM-778899').flush([
      { policyNumber: '1300012345', brandCode: 'SUN', brandName: 'Suncorp', productType: 'Comprehensive Motor',
        status: 'ACTIVE', policyHolderName: 'Sam Customer', expiryDate: '01/11/2026', totalPremium: 1404.8 },
      { policyNumber: '1400098765', brandCode: 'SUN', brandName: 'Suncorp', productType: 'Home and Contents',
        status: 'ACTIVE', policyHolderName: 'Sam Customer', expiryDate: '2026-11-01', totalPremium: 2210 }
    ]);

    expect(summaries.map(s => datePipe.transform(s.expiryDate, 'dd/MM/yyyy'))).toEqual(['01/11/2026', '01/11/2026']);
  });

  it('should search policies by brand and status', () => {
    service.search('AAM', 'ACTIVE', 2).subscribe();

    const request = httpMock.expectOne(req => req.url === baseUrl);
    expect(request.request.params.get('brand')).toBe('AAM');
    expect(request.request.params.get('status')).toBe('ACTIVE');
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('size')).toBe('25');
    request.flush({ content: [] });
  });

  function motorPolicy(): Policy {
    return {
      policyNumber: '1300012345',
      brandCode: 'SUN',
      productType: 'Comprehensive Motor',
      status: 'ACTIVE',
      customerMasterId: 'CM-778899',
      riskState: 'QLD',
      riskPostcode: '4000',
      inceptionDate: null,
      expiryDate: null,
      basePremium: 1180.5,
      stampDuty: 106.25,
      gst: 118.05,
      totalPremium: 1404.8,
      paymentFrequency: 'ANNUAL',
      coverages: []
    };
  }
});
