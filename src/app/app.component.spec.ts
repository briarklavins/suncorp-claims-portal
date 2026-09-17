import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { AuthService } from './core/services/auth.service';
import { BrandThemeService } from './core/services/brand-theme.service';
import { SessionTimeoutService } from './core/services/session-timeout.service';
import { BRANDS } from './shared/models/brand.model';

describe('AppComponent', () => {

  const authServiceStub = {
    currentUser$: of({ displayName: 'Rebecca Tran', consultantId: 'SUN12345' })
  };

  const brandThemeServiceStub = {
    applyBrandFromHost: () => BRANDS[0]
  };

  const sessionTimeoutServiceStub = {
    start: jasmine.createSpy('start'),
    stop: jasmine.createSpy('stop')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        { provide: BrandThemeService, useValue: brandThemeServiceStub },
        { provide: SessionTimeoutService, useValue: sessionTimeoutServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  it('should create the shell', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should resolve the signed in consultant', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.consultantName).toBe('Rebecca Tran');
  });

  it('should start the session timeout watcher', () => {
    const timeoutService = TestBed.get(SessionTimeoutService);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(timeoutService.start).toHaveBeenCalled();
  });
});
