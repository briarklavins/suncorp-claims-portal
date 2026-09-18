import { Page } from '@playwright/test';

export const CONSULTANT = { consultantId: 'SUN12345', displayName: 'Rebecca Tran', roles: ['CLAIMS_CONSULTANT'] };

export const ACTIVE_POLICY = {
  policyNumber: '1400000001',
  productType: 'Comprehensive Motor',
  status: 'ACTIVE',
  riskState: 'QLD',
  riskPostcode: '4000',
  inceptionDate: '15/01/2024',
  expiryDate: '15/01/2025',
  totalPremium: 1071.5,
  coverages: []
};

/**
 * The portal sits behind SiteMinder: AuthGuard only lets a request through when an
 * SMSESSION cookie is present, and the shell immediately exchanges it for a profile.
 * The backend APIs are internal to Suncorp, so they are stubbed at the network layer.
 */
export async function signInAsConsultant(page: Page): Promise<void> {
  await page.context().addCookies([{ name: 'SMSESSION', value: 'e2e-session', url: 'http://localhost:4200' }]);

  await page.route('**/claims-api/v1/session/profile', route => route.fulfill({ json: CONSULTANT }));
  await page.route('**/claims-api/v1/audit', route => route.fulfill({ json: {} }));
  await page.route('**/claims-api/v1/client-logs', route => route.fulfill({ json: {} }));
  await page.route('**/claims-api/v1/claims?**', route => route.fulfill({ json: [] }));
  await page.route('**/policy-admin/api/v1/policies/**', route => {
    const policyNumber = route.request().url().split('/').pop();
    return policyNumber === ACTIVE_POLICY.policyNumber
      ? route.fulfill({ json: ACTIVE_POLICY })
      : route.fulfill({ status: 404, json: { message: 'Policy not found' } });
  });
}
