import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';

import { BrandHeaderComponent } from './components/brand-header/brand-header.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { AuCurrencyPipe } from './pipes/au-currency.pipe';
import { BsbPipe } from './pipes/bsb.pipe';
import { ClaimStatusPipe } from './pipes/claim-status.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { AutofocusDirective } from './directives/autofocus.directive';
import { UppercaseRegoDirective } from './directives/uppercase-rego.directive';

const MATERIAL_MODULES = [
  MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule,
  MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule,
  MatNativeDateModule, MatPaginatorModule, MatProgressSpinnerModule, MatRadioModule,
  MatSelectModule, MatSidenavModule, MatSnackBarModule, MatSortModule, MatStepperModule,
  MatTableModule, MatToolbarModule, MatTooltipModule
];

@NgModule({
  declarations: [
    BrandHeaderComponent,
    LoadingSpinnerComponent,
    ConfirmDialogComponent,
    AuCurrencyPipe,
    BsbPipe,
    ClaimStatusPipe,
    TimeAgoPipe,
    AutofocusDirective,
    UppercaseRegoDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FlexLayoutModule,
    ...MATERIAL_MODULES
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    ...MATERIAL_MODULES,
    BrandHeaderComponent,
    LoadingSpinnerComponent,
    ConfirmDialogComponent,
    AuCurrencyPipe,
    BsbPipe,
    ClaimStatusPipe,
    TimeAgoPipe,
    AutofocusDirective,
    UppercaseRegoDirective
  ],
  entryComponents: [
    ConfirmDialogComponent
  ]
})
export class SharedModule { }
