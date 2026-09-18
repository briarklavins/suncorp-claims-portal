import { expect, test } from '@playwright/test';

import { policy, setupPortal } from './support/fixtures';

test.describe('Claim lodgement', () => {

  test.beforeEach(async ({ page }) => {
    await setupPortal(page);
    await page.goto('/claims/lodge');
  });

  test('should display the lodgement wizard', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Lodge a claim');
    await expect(page.locator('mat-horizontal-stepper .mat-step-label')).toHaveText([
      'Policy', 'Incident', 'Photos and documents', 'Settlement', 'Declaration'
    ]);
  });

  test('should validate the policy number format', async ({ page }) => {
    await page.locator('input[formcontrolname="policyNumber"]').fill('123');
    await page.getByRole('button', { name: 'Find policy' }).click();

    await expect(page.locator('mat-error')).toContainText('Enter the 10 digit policy number');
    await expect(page.locator('mat-select[formcontrolname="claimType"]')).toHaveCount(0);
  });

  test('should lodge a claim through the five-step wizard', async ({ page }) => {
    const lodgeRequest = page.waitForRequest(request =>
      request.url().includes('/claims-api/v1/claims') && request.method() === 'POST');

    // Step 1 - policy
    await page.locator('input[formcontrolname="policyNumber"]').fill(policy.policyNumber);
    await page.locator('input[formcontrolname="registration"]').fill('abc123');
    await expect(page.locator('input[formcontrolname="registration"]')).toHaveValue('ABC123');
    await page.getByRole('button', { name: 'Find policy' }).click();
    await expect(page.locator('.sun-policy-summary')).toContainText('Comprehensive Motor');
    await expect(page.locator('.sun-policy-summary')).toContainText('Expires 12/03/2027');

    // Step 2 - incident
    await page.locator('mat-select[formcontrolname="claimType"]').click();
    await page.getByRole('option', { name: 'Motor - collision' }).click();
    await page.locator('input[formcontrolname="incidentDate"]').fill('15/05/2026');
    await page.locator('input[formcontrolname="incidentTime"]').fill('16:45');
    await page.locator('textarea[formcontrolname="description"]').fill('Rear ended at traffic lights on Coronation Drive.');
    await page.locator('input[formcontrolname="incidentSuburb"]').fill('Toowong');
    await page.locator('input[formcontrolname="incidentPostcode"]').fill('4066');
    await page.locator('mat-checkbox[formcontrolname="policeReported"] input').check();
    await page.locator('input[formcontrolname="policeEventNumber"]').fill('QP2600123456');
    await expect(page.locator('mat-checkbox[formcontrolname="driveable"]')).toBeVisible();
    await page.locator('.mat-horizontal-stepper-content')
      .filter({ has: page.locator('sun-incident-details-step') })
      .getByRole('button', { name: 'Continue' }).click();

    // Step 3 - photos and documents
    await expect(page.locator('sun-document-upload h2')).toHaveText('Photos and documents');
    await page.locator('sun-document-upload input[type="file"]').setInputFiles({
      name: 'damage.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('jpeg-bytes')
    });
    await expect(page.locator('sun-document-upload li')).toHaveText(['damage.jpg (PHOTO)']);
    await page.locator('.mat-horizontal-stepper-content')
      .filter({ has: page.locator('sun-document-upload') })
      .getByRole('button', { name: 'Continue' }).click();

    // Step 4 - settlement
    await page.locator('mat-select[formcontrolname="preferredRepairerId"]').click();
    await page.getByRole('option', { name: /Q Plus Smash Repairs/ }).click();
    await page.locator('.mat-horizontal-stepper-content')
      .filter({ has: page.locator('sun-settlement-step') })
      .getByRole('button', { name: 'Continue' }).click();

    // Step 5 - declaration
    const lodgeButton = page.getByRole('button', { name: 'Lodge claim' });
    await expect(lodgeButton).toBeDisabled();
    await page.locator('mat-checkbox[formcontrolname="declarationAccepted"] input').check();
    await page.locator('mat-checkbox[formcontrolname="privacyAccepted"] input').check();
    await lodgeButton.click();

    await expect(page.locator('mat-dialog-container')).toContainText('Lodge this claim?');
    await page.locator('mat-dialog-container').getByRole('button', { name: 'Lodge claim' }).click();

    const request = await lodgeRequest;
    const payload = request.postDataJSON();
    expect(payload.policyNumber).toBe(policy.policyNumber);
    expect(payload.incident.claimType).toBe('MOTOR_COLLISION');
    expect(payload.incident.policeEventNumber).toBe('QP2600123456');
    expect(payload.settlement.preferredRepairerId).toBe('R-100');

    await expect(page).toHaveURL(/\/claims\/CLM999001$/);
    await expect(page.locator('h1')).toHaveText('Claim CLM999001');
  });
});
