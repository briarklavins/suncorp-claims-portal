import { BrandHeaderComponent } from './brand-header.component';

describe('BrandHeaderComponent', () => {

  it('should emit when the navigation menu is toggled', () => {
    const component = new BrandHeaderComponent();
    let toggled = false;
    component.menuToggled.subscribe(() => toggled = true);

    component.toggleMenu();

    expect(toggled).toBe(true);
  });
});
