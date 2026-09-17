import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

export interface SmashRepairer {
  repairerId: string;
  tradingName: string;
  suburb: string;
  state: string;
  postcode: string;
  phone: string;
  preferred: boolean;
  nextAvailableDate: Date;
}

/**
 * Suncorp preferred repairer network (Q Plus and the AAMI/GIO preferred smash repairers).
 */
@Injectable()
export class SmashRepairerService {

  constructor(private http: HttpClient) {
  }

  findNearby(postcode: string, radiusKm: number = 25): Observable<SmashRepairer[]> {
    const params = new HttpParams()
      .set('postcode', postcode)
      .set('radiusKm', String(radiusKm))
      .set('network', 'PREFERRED');

    return this.http.get<SmashRepairer[]>(environment.claimsApiBaseUrl + '/repairers', { params: params });
  }
}
