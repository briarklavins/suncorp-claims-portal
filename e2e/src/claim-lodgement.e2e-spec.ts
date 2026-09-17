import { expect, test } from '@playwright/test';

import { ClaimLodgementPage } from './claim-lodgement.po';

test.describe('Claim lodgement', () => {

  let severeConsoleErrors: string[];

  test.beforeEach(async ({ context, page }) => {
    await context.addCookies([{
      name: 'SMSESSION',
      value: 'e2e-consultant-session',
      url: page.url().startsWith('http') ? page.url() : (process.env.E2E_BASE_URL || 'http://localhost:4200')
    }]);

    severeConsoleErrors = [];
    page.on('console', message => {
      if (message.type() === 'error') {
        severeConsoleErrors.push(message.text());
      }
    });
  });

  test.afterEach(() => {
    expect(severeConsoleErrors).toEqual([]);
  });

  test('should display the lodgement wizard', async ({ page }) => {
    const lodgement = new ClaimLodgementPage(page);

    await lodgement.navigateTo();

    await expect(lodgement.pageHeading()).toHaveText('Lodge a claim');
  });

  test('should validate the policy number format', async ({ page }) => {
    const lodgement = new ClaimLodgementPage(page);

    await lodgement.navigateTo();
    await lodgement.policyNumberField().fill('123');
    await lodgement.findPolicyButton().click();

    await expect(lodgement.policyNumberError()).toBeVisible();
    await expect(lodgement.selectedStepLabel()).toHaveText('Policy');
  });
});
