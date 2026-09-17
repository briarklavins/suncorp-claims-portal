import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { PageNotFoundComponent } from './features/page-not-found/page-not-found.component';
import { SessionTimeoutDialogComponent } from './core/components/session-timeout-dialog/session-timeout-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PageNotFoundComponent,
    SessionTimeoutDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // Still required by LegacyDocumentService until the document store migration lands (SUNCL-2291)
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    AppRoutingModule
  ],
  entryComponents: [
    SessionTimeoutDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
