import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthService } from './services/auth.service';
import { BrandThemeService } from './services/brand-theme.service';
import { SessionTimeoutService } from './services/session-timeout.service';
import { LoggingService } from './services/logging.service';
import { AuthGuard } from './guards/auth.guard';
import { UnsavedClaimGuard } from './guards/unsaved-claim.guard';
import { AuthTokenInterceptor } from './interceptors/auth-token.interceptor';
import { CorrelationIdInterceptor } from './interceptors/correlation-id.interceptor';

@NgModule({
  imports: [CommonModule],
  providers: [
    AuthService,
    BrandThemeService,
    SessionTimeoutService,
    LoggingService,
    AuthGuard,
    UnsavedClaimGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CorrelationIdInterceptor, multi: true }
  ]
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in AppModule only.');
    }
  }
}
