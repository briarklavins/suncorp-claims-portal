import { expect, test } from '@playwright/test';

import { ClaimLodgementPage } from './claim-lodgement.po';
import { signInAsConsultant } from './fixtures';

test.describe('Claim lodgement', () => {

  let page: ClaimLodgementPage;
  const severeErrors: string[] = [];

  test.beforeEach(async ({ page: browserPage }) => {
    severeErrors.length = 0;
    browserPage.on('console', message => {
      if (message.type() === 'error') {
        severeErrors.push(message.text());
      }
    });
    await signInAsConsultant(browserPage);
    page = new ClaimLodgementPage(browserPage);
    await page.navigateTo();
  });

  test('should display the lodgement wizard', async () => {
    await expect(page.pageHeading()).toHaveText('Lodge a claim');
    await expect(page.policyNumberField()).toBeFocused();
  });

  test('should validate the policy number format', async () => {
    await page.policyNumberField().fill('123');
    await page.findPolicyButton().click();
    await expect(page.policyNumberError()).toBeVisible();
    await expect(page.policySummary()).toHaveCount(0);
    // the horizontal stepper renders every step's content up front; the incident step must stay hidden
    await expect(page.claimTypeSelect()).toBeHidden();
  });

  test('should show the policy in dd/MM/yyyy and advance to the incident step', async () => {
    await page.policyNumberField().fill('1400000001');
    await page.findPolicyButton().click();

    await expect(page.policySummary()).toContainText('Expires 15/01/2025');
    await expect(page.policySummary()).toContainText('$1,071.50');
    await expect(page.claimTypeSelect()).toBeVisible();
  });

  test('should only require a police event number once the incident is reported', async () => {
    await page.policyNumberField().fill('1400000001');
    await page.findPolicyButton().click();
    await expect(page.claimTypeSelect()).toBeVisible();

    await expect(page.policeEventNumberField()).toHaveCount(0);
    await page.policeReportedCheckbox().click();
    await expect(page.policeEventNumberField()).toBeVisible();
    await page.policeEventNumberField().fill('QP123');
    await page.policeReportedCheckbox().click();
    await expect(page.policeEventNumberField()).toHaveCount(0);
  });

  test.afterEach(() => {
    expect(severeErrors).toEqual([]);
  });
});
