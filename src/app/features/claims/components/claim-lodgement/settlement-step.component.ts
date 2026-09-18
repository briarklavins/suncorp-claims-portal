import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import { SmashRepairerService, SmashRepairer } from '../../services/smash-repairer.service';

@Component({
  selector: 'sun-settlement-step',
  templateUrl: './settlement-step.component.html'
})
export class SettlementStepComponent implements OnChanges {

  @Input()
  form: UntypedFormGroup;

  @Input()
  postcode: string;

  repairers: SmashRepairer[] = [];
  loadingRepairers = false;

  constructor(private smashRepairerService: SmashRepairerService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['postcode'] && /^[0-9]{4}$/.test(this.postcode || '')) {
      this.loadingRepairers = true;
      this.smashRepairerService.findNearby(this.postcode).subscribe({
        next: repairers => {
          this.repairers = repairers;
          this.loadingRepairers = false;
        },
        error: () => this.loadingRepairers = false
      });
    }
  }

  get isCashSettlement(): boolean {
    return this.form.get('method').value === 'CASH_SETTLEMENT';
  }
}
