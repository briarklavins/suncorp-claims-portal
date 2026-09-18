import { expect, test } from '@playwright/test';

import { fileNetDocuments, policy, setupPortal } from './support/fixtures';

test.describe('Claim list', () => {

  test('should paginate and sort the recent claims table', async ({ page }) => {
    await setupPortal(page, { claimCount: 30 });
    await page.goto('/claims');

    const rows = page.locator('table[mat-table] tbody tr');
    await expect(rows).toHaveCount(10);
    await expect(page.locator('.mat-mdc-paginator-range-label')).toContainText('1 – 10 of 30');
    await expect(rows.first().locator('td').first()).toHaveText('CLM000001');

    await page.getByRole('button', { name: 'Next page' }).click();
    await expect(page.locator('.mat-mdc-paginator-range-label')).toContainText('11 – 20 of 30');
    await expect(rows.first().locator('td').first()).toHaveText('CLM000011');

    await page.getByRole('button', { name: 'Last page' }).click();
    await expect(page.locator('.mat-mdc-paginator-range-label')).toContainText('21 – 30 of 30');

    await page.getByRole('button', { name: 'First page' }).click();
    await page.getByRole('button', { name: 'Claim' }).click();
    await expect(rows.first().locator('td').first()).toHaveText('CLM000001');
    await page.getByRole('button', { name: 'Claim' }).click();
    await expect(rows.first().locator('td').first()).toHaveText('CLM000030');

    await page.locator('mat-paginator mat-select').click();
    await page.getByRole('option', { name: '25' }).click();
    await expect(rows).toHaveCount(25);

    await page.getByPlaceholder('Search by claim or policy number').fill('CLM000007');
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText('CLM000007');
    await expect(rows.first()).toContainText('07/05/2026');
  });
});

test.describe('Claim detail documents', () => {

  test('should list FileNet documents and expose a download link', async ({ page }) => {
    await setupPortal(page);
    await page.goto('/claims/CLM000003');

    await expect(page.locator('h1')).toHaveText('Claim CLM000003');
    await expect(page.locator('dd').first()).toHaveText('MOTOR_COLLISION');

    const links = page.locator('.sun-card').filter({ hasText: 'Documents' }).locator('a');
    await expect(links).toHaveText(fileNetDocuments.map(d => d.fileName));
    await expect(links.nth(1)).toHaveAttribute('href', '/claims-api/v1/documents/DOC-2/content');

    const downloadResponse = page.waitForResponse('**/claims-api/v1/documents/DOC-2/content');
    const [popup] = await Promise.all([page.waitForEvent('popup'), links.nth(1).click()]);
    const response = await downloadResponse;
    expect(response.status()).toBe(200);
    expect(response.headers()['content-disposition']).toContain('repair-quote.pdf');
    await popup.close();
  });

  test('should reject uploads that are not JPG, PNG, HEIC or PDF', async ({ page }) => {
    await setupPortal(page);
    await page.goto('/claims/lodge');

    const fileInput = page.locator('sun-document-upload input[type="file"]');
    await fileInput.setInputFiles({ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('nope') });
    await expect(page.locator('sun-document-upload .sun-error'))
      .toHaveText('Only JPG, PNG, HEIC and PDF files can be attached to a claim.');
  });
});

test.describe('Policy lookup', () => {

  test.beforeEach(async ({ page }) => {
    await setupPortal(page);
    await page.goto('/policies/lookup');
  });

  test('should find a policy by number and render dd/MM/yyyy dates', async ({ page }) => {
    await page.getByPlaceholder('Search value').fill(policy.policyNumber);
    await page.getByRole('button', { name: 'Search' }).click();

    const card = page.locator('.sun-card').filter({ hasText: policy.policyNumber });
    await expect(card.locator('h2')).toHaveText(policy.policyNumber);
    await expect(card).toContainText('Comprehensive Motor');
    await expect(card).toContainText('12/03/2026 to 12/03/2027');
    await expect(card).toContainText('$1,404.80');
    await expect(card).toContainText('MOTOR_COMP - sum insured $32,000');

    await card.getByRole('button', { name: 'Lodge a claim on this policy' }).click();
    await expect(page).toHaveURL(/\/claims\/lodge$/);
  });

  test('should list policies held by a customer master id', async ({ page }) => {
    await page.getByRole('radio', { name: 'Customer Master ID' }).check();
    await page.getByPlaceholder('Search value').fill(policy.customerMasterId);
    await page.getByRole('button', { name: 'Search' }).click();

    const held = page.locator('.sun-card').filter({ hasText: 'Policies held' }).locator('li');
    await expect(held).toHaveCount(2);
    await expect(held.first()).toContainText('1300012345 - Suncorp Comprehensive Motor (ACTIVE)');
  });

  test('should report when no policy is found', async ({ page }) => {
    await page.getByPlaceholder('Search value').fill('1399999999');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByText('No policy was found for that search.')).toBeVisible();
  });
});
