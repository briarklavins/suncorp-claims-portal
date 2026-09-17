import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LoggingService } from './logging.service';
import { environment } from '../../../environments/environment';

describe('LoggingService', () => {

  let service: LoggingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoggingService]
    });

    service = TestBed.inject(LoggingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should ship client errors to the logging endpoint', () => {
    service.error('Unable to lodge the claim', new Error('boom'));

    const request = httpMock.expectOne(environment.claimsApiBaseUrl + '/client-logs');
    expect(request.request.body.level).toBe('ERROR');
    expect(request.request.body.message).toBe('Unable to lodge the claim');
    expect(request.request.body.detail).toBe('boom');
    request.flush({});
  });

  it('should tolerate an error without a detail payload', () => {
    service.error('No detail');

    const request = httpMock.expectOne(environment.claimsApiBaseUrl + '/client-logs');
    expect(request.request.body.detail).toBeNull();
    request.flush({});
  });

  it('should post an audit event', () => {
    service.audit('CLAIM_LODGED', 'CLM0000123456');

    const request = httpMock.expectOne(environment.claimsApiBaseUrl + '/audit');
    expect(request.request.body.action).toBe('CLAIM_LODGED');
    expect(request.request.body.claimNumber).toBe('CLM0000123456');
    request.flush({});
  });
});
