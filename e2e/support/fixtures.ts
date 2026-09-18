import { Page, Route } from '@playwright/test';

export const CLAIMS_API = '/claims-api/v1';
export const POLICY_API = '/policy-admin/api/v1';

export const consultant = {
  consultantId: 'C0012345',
  displayName: 'Jordan Consultant',
  roles: ['CLAIMS_CONSULTANT']
};

export const policy = {
  policyNumber: '1300012345',
  brandCode: 'SUN',
  productType: 'Comprehensive Motor',
  status: 'ACTIVE',
  customerMasterId: 'CM-778899',
  riskState: 'QLD',
  riskPostcode: '4000',
  inceptionDate: '12/03/2026',
  expiryDate: '12/03/2027',
  basePremium: 1180.5,
  stampDuty: 106.25,
  gst: 118.05,
  totalPremium: 1404.8,
  paymentFrequency: 'ANNUAL',
  coverages: [
    { coverageCode: 'MOTOR_COMP', sumInsured: 32000, excess: 650, premium: 1180.5, optional: false }
  ]
};

export const customerPolicies = [
  { policyNumber: '1300012345', brandCode: 'SUN', brandName: 'Suncorp', productType: 'Comprehensive Motor',
    status: 'ACTIVE', policyHolderName: 'Sam Customer', expiryDate: '12/03/2027', totalPremium: 1404.8 },
  { policyNumber: '1400098765', brandCode: 'SUN', brandName: 'Suncorp', productType: 'Home and Contents',
    status: 'ACTIVE', policyHolderName: 'Sam Customer', expiryDate: '01/11/2026', totalPremium: 2210 }
];

const statuses = ['LODGED', 'UNDER_ASSESSMENT', 'ASSESSOR_BOOKED', 'REPAIR_IN_PROGRESS', 'SETTLED', 'DECLINED', 'WITHDRAWN'];

export function buildClaims(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    const day = String((n % 28) + 1).padStart(2, '0');
    return {
      claimNumber: 'CLM' + String(n).padStart(6, '0'),
      policyNumber: String(1300000000 + n),
      brandCode: 'SUN',
      status: statuses[i % statuses.length],
      lodgedAt: `2026-05-${day}T09:30:00Z`,
      excess: 650,
      estimatedSettlement: 4200,
      lastUpdated: `2026-05-${day}T11:00:00Z`,
      incident: {
        claimType: i % 2 === 0 ? 'MOTOR_COLLISION' : 'HOME_STORM',
        incidentDate: `2026-05-${day}`,
        incidentTime: '16:45',
        description: 'Fixture claim ' + n,
        incidentSuburb: 'Brisbane',
        incidentState: 'QLD',
        incidentPostcode: '4000',
        policeReported: false,
        thirdPartyInvolved: false,
        driveable: true
      },
      thirdParties: [],
      settlement: { method: 'REPAIR' },
      documents: []
    };
  });
}

export const repairers = [
  { repairerId: 'R-100', tradingName: 'Q Plus Smash Repairs', suburb: 'Woolloongabba', state: 'QLD',
    postcode: '4102', phone: '07 3000 0000', preferred: true, nextAvailableDate: '2026-06-02' },
  { repairerId: 'R-200', tradingName: 'Capalaba Panel Works', suburb: 'Capalaba', state: 'QLD',
    postcode: '4157', phone: '07 3000 0001', preferred: true, nextAvailableDate: '2026-06-05' }
];

export const fileNetDocuments = [
  { documentId: 'DOC-1', fileName: 'front-bumper.jpg', contentType: 'image/jpeg', sizeBytes: 204800,
    category: 'PHOTO', uploadedAt: '2026-05-03T10:00:00Z' },
  { documentId: 'DOC-2', fileName: 'repair-quote.pdf', contentType: 'application/pdf', sizeBytes: 81920,
    category: 'QUOTE', uploadedAt: '2026-05-03T10:05:00Z' }
];

function json(route: Route, body: unknown, status = 200) {
  return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
}

/**
 * Seeds the SiteMinder session cookie (satisfies AuthGuard) and intercepts every
 * backend call the portal makes so the suite runs without the Suncorp APIs.
 */
export async function setupPortal(page: Page, options: { claimCount?: number } = {}) {
  const claims = buildClaims(options.claimCount ?? 30);
  const uploaded: string[] = [];

  await page.context().addCookies([{
    name: 'SMSESSION', value: 'e2e-session', domain: 'localhost', path: '/'
  }]);

  await page.route(`**${CLAIMS_API}/session/profile`, route => json(route, consultant));

  await page.route(`**${CLAIMS_API}/claims?**`, route => json(route, claims));

  await page.route(`**${CLAIMS_API}/claims`, (route, request) => {
    if (request.method() === 'POST') {
      const lodged = { ...request.postDataJSON(), claimNumber: 'CLM999001', lodgedAt: '2026-05-30T09:00:00Z',
        lastUpdated: '2026-05-30T09:00:00Z' };
      claims.unshift(lodged);
      return json(route, lodged, 201);
    }
    return json(route, claims);
  });

  await page.route(new RegExp(`${CLAIMS_API}/claims/(CLM\\d+)$`), (route, request) => {
    const claimNumber = request.url().split('/').pop();
    const claim = claims.find(c => c.claimNumber === claimNumber);
    if (!claim) {
      return json(route, { message: 'Not found' }, 404);
    }
    if (request.method() === 'PATCH') {
      claim.status = request.postDataJSON().status;
    }
    return json(route, claim);
  });

  await page.route(`**${CLAIMS_API}/repairers?**`, route => json(route, repairers));

  await page.route(`**${CLAIMS_API}/documents?claimNumber=**`, (route, request) => {
    const accept = request.headers()['accept'];
    const source = request.headers()['x-source-system'];
    if (accept !== 'application/json' || source !== 'CLAIMS-PORTAL') {
      return json(route, { message: 'FileNet headers missing' }, 400);
    }
    return json(route, { FILENET_RESPONSE: { DOCUMENTS: fileNetDocuments } });
  });

  await page.route(`**${CLAIMS_API}/documents`, (route, request) => {
    if (request.method() !== 'POST') {
      return route.continue();
    }
    const body = request.postData() || '';
    const match = /filename="([^"]+)"/.exec(body);
    const fileName = match ? match[1] : 'upload.bin';
    uploaded.push(fileName);
    return json(route, {
      documentId: 'DOC-NEW-' + uploaded.length,
      fileName,
      contentType: fileName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
      sizeBytes: body.length,
      category: fileName.endsWith('.pdf') ? 'QUOTE' : 'PHOTO',
      uploadedAt: '2026-05-30T09:10:00Z'
    }, 201);
  });

  await page.route(`**${CLAIMS_API}/documents/*/content`, route =>
    route.fulfill({ status: 200, contentType: 'application/pdf', body: '%PDF-1.4 fixture',
      headers: { 'content-disposition': 'attachment; filename="repair-quote.pdf"' } }));

  await page.route(`**${POLICY_API}/policies/customer/*`, (route, request) => {
    const id = request.url().split('/').pop();
    return json(route, id === policy.customerMasterId ? customerPolicies : []);
  });

  await page.route(`**${POLICY_API}/policies/*`, (route, request) => {
    const number = request.url().split('/').pop();
    return number === policy.policyNumber ? json(route, policy) : json(route, { message: 'Not found' }, 404);
  });

  return { claims, uploaded };
}
