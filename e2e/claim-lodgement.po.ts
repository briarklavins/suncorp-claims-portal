import { Locator, Page } from '@playwright/test';

export class ClaimLodgementPage {

  constructor(private readonly page: Page) {
  }

  async navigateTo(): Promise<void> {
    await this.page.goto('/claims/lodge');
  }

  pageHeading(): Locator {
    return this.page.locator('h1');
  }

  policyNumberField(): Locator {
    return this.page.locator('input[formcontrolname="policyNumber"]');
  }

  policyNumberError(): Locator {
    return this.page.locator('mat-error', { hasText: '10 digit policy number' });
  }

  findPolicyButton(): Locator {
    return this.page.getByRole('button', { name: 'Find policy' });
  }

  policySummary(): Locator {
    return this.page.locator('.sun-policy-summary');
  }

  claimTypeSelect(): Locator {
    return this.page.locator('mat-select[formcontrolname="claimType"]');
  }

  policeReportedCheckbox(): Locator {
    return this.page.locator('mat-checkbox[formcontrolname="policeReported"]');
  }

  policeEventNumberField(): Locator {
    return this.page.locator('input[formcontrolname="policeEventNumber"]');
  }

  descriptionField(): Locator {
    return this.page.locator('textarea[formcontrolname="description"]');
  }

  lodgeButton(): Locator {
    return this.page.getByRole('button', { name: 'Lodge claim' });
  }
}
