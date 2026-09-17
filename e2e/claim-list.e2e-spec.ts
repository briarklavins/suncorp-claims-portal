import { expect, test } from '@playwright/test';

import { signInAsConsultant } from './fixtures';

const claims = Array.from({ length: 12 }, (_, i) => ({
  claimNumber: 'CLM00000000' + String(i + 1).padStart(2, '0'),
  policyNumber: '14000000' + String(i + 1).padStart(2, '0'),
  status: i % 2 === 0 ? 'LODGED' : 'UNDER_ASSESSMENT',
  lodgedAt: new Date(2025, 0, i + 1).toISOString(),
  incident: { claimType: 'MOTOR_HAIL', incidentDate: new Date(2025, 0, i + 1).toISOString() }
}));

test.describe('Claim list', () => {

  test.beforeEach(async ({ page }) => {
    await signInAsConsultant(page);
    await page.route('**/claims-api/v1/claims?**', route => route.fulfill({ json: claims }));
    await page.goto('/claims');
  });

  test('should page the MatTableDataSource', async ({ page }) => {
    const rows = page.locator('table tbody tr');
    await expect(rows).toHaveCount(10);
    await expect(page.locator('.mat-mdc-paginator-range-label')).toContainText('1 – 10 of 12');

    await page.getByRole('button', { name: 'Next page' }).click();
    await expect(rows).toHaveCount(2);
  });

  test('should sort by claim number', async ({ page }) => {
    const firstCell = page.locator('table tbody tr').first().locator('td').first();
    await expect(firstCell).toHaveText(/CLM0000000001/);

    await page.locator('th', { hasText: /^Claim$/ }).click();
    await page.locator('th', { hasText: /^Claim$/ }).click();
    await expect(firstCell).toHaveText(/CLM0000000012/);
  });
});
