import { Locator, Page } from '@playwright/test';

export class ClaimLodgementPage {

  constructor(private readonly page: Page) {
  }

  async navigateTo(): Promise<void> {
    await this.page.goto('/claims/lodge');
  }

  policyNumberField(): Locator {
    return this.page.locator('input[formcontrolname="policyNumber"]');
  }

  findPolicyButton(): Locator {
    return this.page.getByRole('button', { name: 'Find policy' });
  }

  policyNumberError(): Locator {
    return this.page.locator('mat-error');
  }

  selectedStepLabel(): Locator {
    return this.page.locator('.mat-step-header[aria-selected="true"] .mat-step-text-label');
  }

  claimTypeSelect(): Locator {
    return this.page.locator('mat-select[formcontrolname="claimType"]');
  }

  descriptionField(): Locator {
    return this.page.locator('textarea[formcontrolname="description"]');
  }

  lodgeButton(): Locator {
    return this.page.getByRole('button', { name: 'Lodge claim' });
  }

  pageHeading(): Locator {
    return this.page.locator('h1');
  }
}
