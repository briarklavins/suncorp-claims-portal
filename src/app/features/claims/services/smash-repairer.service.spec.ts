import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SmashRepairerService } from './smash-repairer.service';
import { environment } from '../../../../environments/environment';

describe('SmashRepairerService', () => {

  let service: SmashRepairerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SmashRepairerService]
    });

    service = TestBed.inject(SmashRepairerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should search the preferred repairer network around a postcode', () => {
    service.findNearby('4300').subscribe(repairers => expect(repairers).toEqual([]));

    const request = httpMock.expectOne(req => req.url === environment.claimsApiBaseUrl + '/repairers');
    expect(request.request.params.get('postcode')).toBe('4300');
    expect(request.request.params.get('radiusKm')).toBe('25');
    expect(request.request.params.get('network')).toBe('PREFERRED');
    request.flush([]);
  });
});
