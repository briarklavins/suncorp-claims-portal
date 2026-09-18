import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { Policy, PolicySummary } from '../../../shared/models/policy.model';
import { parsePolicyDate } from '../../../shared/utils/policy-date';

@Injectable()
export class PoliciesService {

  private readonly baseUrl = environment.policyApiBaseUrl + '/policies';

  constructor(private http: HttpClient) {
  }

  findByPolicyNumber(policyNumber: string): Observable<Policy> {
    return this.http.get<Policy>(this.baseUrl + '/' + policyNumber).pipe(
      map(policy => ({
        ...policy,
        inceptionDate: parsePolicyDate(policy.inceptionDate),
        expiryDate: parsePolicyDate(policy.expiryDate)
      }))
    );
  }

  findByCustomer(customerMasterId: string): Observable<PolicySummary[]> {
    return this.http.get<PolicySummary[]>(this.baseUrl + '/customer/' + customerMasterId).pipe(
      map(policies => policies.map(summary => ({ ...summary, expiryDate: parsePolicyDate(summary.expiryDate) })))
    );
  }

  search(brandCode: string, status: string, page: number = 0): Observable<unknown> {
    const params = new HttpParams()
      .set('brand', brandCode)
      .set('status', status)
      .set('page', String(page))
      .set('size', '25');
    return this.http.get(this.baseUrl, { params: params });
  }
}
