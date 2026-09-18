import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { Policy, PolicySummary } from '../../../shared/models/policy.model';

const AU_DATE = /^(\d{2})\/(\d{2})\/(\d{4})$/;

/**
 * policy-admin-service serialises dates with `spring.jackson.date-format=dd/MM/yyyy`.
 * `DatePipe` cannot parse that form, so dates are normalised here; ISO-8601 (what Jackson
 * emits for `java.time.LocalDate`) is accepted too so a Java-side change does not break the portal.
 */
export function parsePolicyDate(value: string | Date | null | undefined): Date | null {
  if (value == null || value === '') {
    return null;
  }
  if (value instanceof Date) {
    return value;
  }
  const au = AU_DATE.exec(value);
  if (au) {
    return new Date(Number(au[3]), Number(au[2]) - 1, Number(au[1]));
  }
  return new Date(value);
}

@Injectable({ providedIn: 'root' })
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
      map(policies => policies.map(policy => ({ ...policy, expiryDate: parsePolicyDate(policy.expiryDate) })))
    );
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
