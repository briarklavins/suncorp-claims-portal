import { expect, test } from '@playwright/test';

import { ClaimLodgementPage } from './claim-lodgement.po';

test.describe('Claim lodgement', () => {

  let severeConsoleErrors: string[];

  test.beforeEach(({ page }) => {
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

    await expect(lodgement.claimTypeSelect()).toHaveCount(0);
  });
});
