import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
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

  @ViewChild(MatSidenav, { static: false })
  sidenav: MatSidenav;

  @ViewChild('mainContent', { static: false })
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
      this.authService.currentUser$.subscribe({
        next: user => this.consultantName = user ? user.displayName : null,
        error: error => console.error('Unable to resolve the signed in consultant', error)
      })
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
