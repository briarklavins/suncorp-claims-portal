import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'sun-incident-details-step',
  templateUrl: './incident-details-step.component.html'
})
export class IncidentDetailsStepComponent {

  @Input()
  form: UntypedFormGroup;

  @Input()
  states: string[] = [];

  readonly claimTypes = [
    { value: 'MOTOR_COLLISION', label: 'Motor - collision' },
    { value: 'MOTOR_THEFT', label: 'Motor - theft' },
    { value: 'MOTOR_HAIL', label: 'Motor - hail or storm' },
    { value: 'MOTOR_WINDSCREEN', label: 'Motor - windscreen only' },
    { value: 'HOME_STORM', label: 'Home - storm' },
    { value: 'HOME_FLOOD', label: 'Home - flood' },
    { value: 'HOME_BURGLARY', label: 'Home - burglary' },
    { value: 'HOME_FUSION', label: 'Home - fusion or motor burnout' },
    { value: 'HOME_ACCIDENTAL_DAMAGE', label: 'Home - accidental damage' }
  ];

  get isMotorClaim(): boolean {
    const claimType = this.form.get('claimType').value;
    return typeof claimType === 'string' && claimType.indexOf('MOTOR') === 0;
  }
}
