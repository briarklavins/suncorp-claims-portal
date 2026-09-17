import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SmashRepairerService, SmashRepairer } from '../../services/smash-repairer.service';

@Component({
  selector: 'sun-settlement-step',
  templateUrl: './settlement-step.component.html'
})
export class SettlementStepComponent implements OnInit {

  @Input()
  form: FormGroup;

  @Input()
  postcode: string;

  repairers: SmashRepairer[] = [];
  loadingRepairers = false;

  constructor(private smashRepairerService: SmashRepairerService) {
  }

  ngOnInit(): void {
    if (this.postcode) {
      this.loadingRepairers = true;
      this.smashRepairerService.findNearby(this.postcode).subscribe(
        repairers => {
          this.repairers = repairers;
          this.loadingRepairers = false;
        },
        () => this.loadingRepairers = false
      );
    }
  }

  get isCashSettlement(): boolean {
    return this.form.get('method').value === 'CASH_SETTLEMENT';
  }
}
