import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  providers: [
    CurrencyPipe
  ]
})
export class SharedModule { }
