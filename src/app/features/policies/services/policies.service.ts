import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Policy, PolicySummary } from '../../../shared/models/policy.model';

@Injectable()
export class PoliciesService {

  private readonly baseUrl = environment.policyApiBaseUrl + '/policies';

  constructor(private http: HttpClient) {
  }

  findByPolicyNumber(policyNumber: string): Observable<Policy> {
    return this.http.get<Policy>(this.baseUrl + '/' + policyNumber);
  }

  findByCustomer(customerMasterId: string): Observable<PolicySummary[]> {
    return this.http.get<PolicySummary[]>(this.baseUrl + '/customer/' + customerMasterId);
  }

  search(brandCode: string, status: string, page: number = 0): Observable<any> {
    const params = new HttpParams()
      .set('brand', brandCode)
      .set('status', status)
      .set('page', String(page))
      .set('size', '25');
    return this.http.get(this.baseUrl, { params });
  }
}
