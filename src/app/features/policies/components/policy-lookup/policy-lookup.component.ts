import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PoliciesService } from '../../services/policies.service';
import { Policy, PolicySummary } from '../../../../shared/models/policy.model';

@Component({
  selector: 'sun-policy-lookup',
  templateUrl: './policy-lookup.component.html'
})
export class PolicyLookupComponent {

  form: FormGroup;
  policy: Policy;
  customerPolicies: PolicySummary[] = [];
  searching = false;
  notFound = false;

  constructor(private formBuilder: FormBuilder, private policiesService: PoliciesService) {
    this.form = this.formBuilder.group({
      searchType: ['POLICY_NUMBER', Validators.required],
      searchValue: ['', Validators.required]
    });
  }

  search(): void {
    if (this.form.invalid) {
      return;
    }
    this.searching = true;
    this.notFound = false;
    this.policy = null;
    this.customerPolicies = [];

    const value = this.form.value.searchValue;

    if (this.form.value.searchType === 'POLICY_NUMBER') {
      this.policiesService.findByPolicyNumber(value).subscribe({
        next: policy => {
          this.policy = policy;
          this.searching = false;
        },
        error: () => {
          this.notFound = true;
          this.searching = false;
        }
      });
    } else {
      this.policiesService.findByCustomer(value).subscribe({
        next: policies => {
          this.customerPolicies = policies;
          this.notFound = policies.length === 0;
          this.searching = false;
        },
        error: () => {
          this.notFound = true;
          this.searching = false;
        }
      });
    }
  }
}
