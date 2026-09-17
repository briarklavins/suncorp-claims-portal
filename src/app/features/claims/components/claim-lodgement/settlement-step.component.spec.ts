import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { SettlementStepComponent } from './settlement-step.component';
import { SmashRepairer, SmashRepairerService } from '../../services/smash-repairer.service';

describe('SettlementStepComponent', () => {

  let form: UntypedFormGroup;

  beforeEach(() => form = new UntypedFormBuilder().group({ method: 'REPAIR' }));

  it('should load nearby repairers for the incident postcode', () => {
    const component = build({ findNearby: () => of([repairer()]) });
    component.postcode = '4300';

    component.ngOnInit();

    expect(component.repairers.length).toBe(1);
    expect(component.loadingRepairers).toBe(false);
  });

  it('should stop the spinner when the repairer network is unavailable', () => {
    const component = build({ findNearby: () => throwError(() => new Error('unavailable')) });
    component.postcode = '4300';

    component.ngOnInit();

    expect(component.repairers).toEqual([]);
    expect(component.loadingRepairers).toBe(false);
  });

  it('should not call the repairer network without a postcode', () => {
    const findNearby = jasmine.createSpy('findNearby');
    build({ findNearby }).ngOnInit();

    expect(findNearby).not.toHaveBeenCalled();
  });

  it('should flag a cash settlement', () => {
    const component = build({ findNearby: () => of([]) });

    expect(component.isCashSettlement).toBe(false);
    form.get('method').setValue('CASH_SETTLEMENT');
    expect(component.isCashSettlement).toBe(true);
  });

  function build(serviceStub: any): SettlementStepComponent {
    const component = new SettlementStepComponent(serviceStub as SmashRepairerService);
    component.form = form;
    return component;
  }

  function repairer(): SmashRepairer {
    return {
      repairerId: 'R1',
      tradingName: 'Springfield Smash',
      suburb: 'Springfield',
      state: 'QLD',
      postcode: '4300',
      phone: '07 3000 0000',
      preferred: true,
      nextAvailableDate: new Date('2025-11-10T00:00:00')
    };
  }
});
