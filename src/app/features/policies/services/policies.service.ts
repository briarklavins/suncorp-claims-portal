import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { LoggingService } from '../../../core/services/logging.service';
import { Policy, PolicySummary } from '../../../shared/models/policy.model';

/** `policy-admin-service` serialises dates with `spring.jackson.date-format=dd/MM/yyyy`. */
const POLICY_DATE_CONTRACT = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/([0-9]{4})$/;

@Injectable({ providedIn: 'root' })
export class PoliciesService {

  private readonly baseUrl = environment.policyApiBaseUrl + '/policies';

  constructor(private http: HttpClient, private loggingService: LoggingService) {
  }

  findByPolicyNumber(policyNumber: string): Observable<Policy> {
    return this.http.get<Policy>(this.baseUrl + '/' + policyNumber)
      .pipe(map(policy => ({
        ...policy,
        inceptionDate: this.parsePolicyDate(policy.inceptionDate, 'inceptionDate'),
        expiryDate: this.parsePolicyDate(policy.expiryDate, 'expiryDate')
      })));
  }

  findByCustomer(customerMasterId: string): Observable<PolicySummary[]> {
    return this.http.get<PolicySummary[]>(this.baseUrl + '/customer/' + customerMasterId)
      .pipe(map(policies => policies.map(policy => ({
        ...policy,
        expiryDate: this.parsePolicyDate(policy.expiryDate, 'expiryDate')
      }))));
  }

  search(brandCode: string, status: string, page: number = 0): Observable<any> {
    const params = new HttpParams()
      .set('brand', brandCode)
      .set('status', status)
      .set('page', String(page))
      .set('size', '25');
    return this.http.get(this.baseUrl, { params: params });
  }

  private parsePolicyDate(value: Date | string, field: string): Date {
    const parts = POLICY_DATE_CONTRACT.exec(String(value));

    if (!parts) {
      const message = 'policy-admin-service returned ' + field + '="' + value + '", expected dd/MM/yyyy';
      this.loggingService.error(message);
      throw new Error(message);
    }

    return new Date(Number(parts[3]), Number(parts[2]) - 1, Number(parts[1]));
  }
}
