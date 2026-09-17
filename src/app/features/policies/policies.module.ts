import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { PolicyLookupComponent } from './components/policy-lookup/policy-lookup.component';

const routes: Routes = [
  { path: '', redirectTo: 'lookup', pathMatch: 'full' },
  { path: 'lookup', component: PolicyLookupComponent }
];

@NgModule({
  declarations: [PolicyLookupComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class PoliciesModule { }
