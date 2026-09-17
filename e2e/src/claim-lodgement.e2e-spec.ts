import { browser, logging } from 'protractor';

import { ClaimLodgementPage } from './claim-lodgement.po';

describe('Claim lodgement', () => {

  let page: ClaimLodgementPage;

  beforeEach(() => {
    page = new ClaimLodgementPage();
  });

  it('should display the lodgement wizard', () => {
    page.navigateTo();
    expect(page.pageHeading()).toEqual('Lodge a claim');
  });

  it('should validate the policy number format', () => {
    page.navigateTo();
    page.policyNumberField().sendKeys('123');
    page.findPolicyButton().click();
    expect(page.claimTypeSelect().isPresent()).toBeFalsy();
  });

  afterEach(async () => {
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({ level: logging.Level.SEVERE } as logging.Entry));
  });
});
