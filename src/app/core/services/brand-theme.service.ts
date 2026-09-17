import { Injectable } from '@angular/core';

import { Brand, BRANDS } from '../../shared/models/brand.model';
import { environment } from '../../../environments/environment';

/**
 * The portal is served from a single build and themed per brand host:
 * claims.aami.com.au, claims.gio.com.au, claims.apia.com.au, claims.suncorp.com.au
 */
@Injectable()
export class BrandThemeService {

  private static readonly HOST_BRAND_MAP: { [host: string]: string } = {
    'claims.suncorp.com.au': 'SUN',
    'claims.aami.com.au': 'AAM',
    'claims.gio.com.au': 'GIO',
    'claims.apia.com.au': 'APA',
    'claims.shannons.com.au': 'SHA',
    'claims.bingle.com.au': 'BIN'
  };

  private activeBrand: Brand;

  applyBrandFromHost(): Brand {
    const code = BrandThemeService.HOST_BRAND_MAP[window.location.hostname] || environment.defaultBrand;
    return this.applyBrand(code);
  }

  applyBrand(brandCode: string): Brand {
    const brand = BRANDS.filter(b => b.code === brandCode)[0] || BRANDS[0];
    const body = document.getElementsByTagName('body')[0];
    BRANDS.forEach(b => body.classList.remove('sun-brand-' + b.cssKey));
    body.classList.add('sun-brand-' + brand.cssKey);
    this.activeBrand = brand;
    return brand;
  }

  getActiveBrand(): Brand {
    return this.activeBrand;
  }
}
