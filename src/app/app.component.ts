import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Subscription } from 'rxjs';

import { AuthService } from './core/services/auth.service';
import { BrandThemeService } from './core/services/brand-theme.service';
import { SessionTimeoutService } from './core/services/session-timeout.service';
import { Brand } from './shared/models/brand.model';

@Component({
  selector: 'sun-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  // No static flag - relies on the Angular 8 default resolution behaviour
  @ViewChild(MatSidenav)
  sidenav: MatSidenav;

  @ViewChild('mainContent')
  mainContent: ElementRef;

  brand: Brand;
  consultantName: string;
  private subscriptions = new Subscription();

  constructor(private authService: AuthService,
              private brandThemeService: BrandThemeService,
              private sessionTimeoutService: SessionTimeoutService) {
  }

  ngOnInit(): void {
    this.brand = this.brandThemeService.applyBrandFromHost();

    this.subscriptions.add(
      this.authService.currentUser$.subscribe(
        user => this.consultantName = user ? user.displayName : null,
        error => console.error('Unable to resolve the signed in consultant', error)
      )
    );

    this.sessionTimeoutService.start();
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
  }

  skipToContent(): void {
    this.mainContent.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.sessionTimeoutService.stop();
  }
}
