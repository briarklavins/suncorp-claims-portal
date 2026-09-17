import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './features/dashboard/dashboard.component';
import { PageNotFoundComponent } from './features/page-not-found/page-not-found.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  {
    path: 'claims',
    canActivate: [AuthGuard],
    loadChildren: './features/claims/claims.module#ClaimsModule'
  },
  {
    path: 'policies',
    canActivate: [AuthGuard],
    loadChildren: './features/policies/policies.module#PoliciesModule'
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false, scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
