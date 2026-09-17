import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { ClaimsRoutingModule } from './claims-routing.module';
import { ClaimListComponent } from './components/claim-list/claim-list.component';
import { ClaimDetailComponent } from './components/claim-detail/claim-detail.component';
import { ClaimLodgementComponent } from './components/claim-lodgement/claim-lodgement.component';
import { IncidentDetailsStepComponent } from './components/claim-lodgement/incident-details-step.component';
import { SettlementStepComponent } from './components/claim-lodgement/settlement-step.component';
import { DocumentUploadComponent } from './components/document-upload/document-upload.component';
import { ClaimsService } from './services/claims.service';
import { LegacyDocumentService } from './services/legacy-document.service';
import { SmashRepairerService } from './services/smash-repairer.service';

@NgModule({
  declarations: [
    ClaimListComponent,
    ClaimDetailComponent,
    ClaimLodgementComponent,
    IncidentDetailsStepComponent,
    SettlementStepComponent,
    DocumentUploadComponent
  ],
  imports: [
    SharedModule,
    ClaimsRoutingModule
  ],
  providers: [
    ClaimsService,
    LegacyDocumentService,
    SmashRepairerService
  ]
})
export class ClaimsModule { }
