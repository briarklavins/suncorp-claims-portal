import { BrandThemeService } from './brand-theme.service';
import { BRANDS } from '../../shared/models/brand.model';
import { environment } from '../../../environments/environment';

describe('BrandThemeService', () => {

  let service: BrandThemeService;

  beforeEach(() => service = new BrandThemeService());

  it('should apply the brand body class and remember the active brand', () => {
    const brand = service.applyBrand('AAM');

    expect(brand.code).toBe('AAM');
    expect(document.body.classList.contains('sun-brand-' + brand.cssKey)).toBe(true);
    expect(service.getActiveBrand()).toBe(brand);
  });

  it('should fall back to the first brand for an unknown brand code', () => {
    expect(service.applyBrand('ZZZ')).toBe(BRANDS[0]);
  });

  it('should resolve a brand from the current host', () => {
    const brand = service.applyBrandFromHost();
    const expected = BRANDS.filter(b => b.code === environment.defaultBrand)[0];

    expect(brand).toBe(expected);
  });
});
