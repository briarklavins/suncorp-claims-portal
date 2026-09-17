import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ClaimsService } from '../claims/services/claims.service';
import { Claim } from '../../shared/models/claim.model';
import { BrandThemeService } from '../../core/services/brand-theme.service';

@Component({
  selector: 'sun-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  recentClaims: Claim[] = [];
  loading = true;
  brandName: string;

  constructor(private claimsService: ClaimsService, private brandThemeService: BrandThemeService) {
  }

  ngOnInit(): void {
    const brand = this.brandThemeService.getActiveBrand();
    this.brandName = brand ? brand.displayName : 'Suncorp Insurance';

    this.claimsService.findRecentClaims(10).subscribe(
      claims => {
        this.recentClaims = claims;
        this.loading = false;
      },
      () => this.loading = false
    );
  }

  countByStatus(status: string): number {
    return this.recentClaims.filter(claim => claim.status === status).length;
  }
}
