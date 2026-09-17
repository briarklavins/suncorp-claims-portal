import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClaimListComponent } from './components/claim-list/claim-list.component';
import { ClaimDetailComponent } from './components/claim-detail/claim-detail.component';
import { ClaimLodgementComponent } from './components/claim-lodgement/claim-lodgement.component';
import { UnsavedClaimGuard } from '../../core/guards/unsaved-claim.guard';

const routes: Routes = [
  { path: '', component: ClaimListComponent },
  { path: 'lodge', component: ClaimLodgementComponent, canDeactivate: [UnsavedClaimGuard] },
  { path: ':claimNumber', component: ClaimDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaimsRoutingModule { }
