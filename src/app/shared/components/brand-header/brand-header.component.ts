import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Brand } from '../../models/brand.model';

@Component({
  selector: 'sun-brand-header',
  templateUrl: './brand-header.component.html',
  styleUrls: ['./brand-header.component.scss']
})
export class BrandHeaderComponent {

  @Input()
  brand: Brand;

  @Input()
  consultantName: string;

  @Output()
  menuToggled = new EventEmitter<void>();

  toggleMenu(): void {
    this.menuToggled.emit();
  }
}
