import { browser, by, element, ElementFinder } from 'protractor';

export class ClaimLodgementPage {

  navigateTo(): Promise<any> {
    return browser.get('/claims/lodge') as Promise<any>;
  }

  policyNumberField(): ElementFinder {
    return element(by.css('input[formcontrolname="policyNumber"]'));
  }

  findPolicyButton(): ElementFinder {
    return element(by.buttonText('Find policy'));
  }

  claimTypeSelect(): ElementFinder {
    return element(by.css('mat-select[formcontrolname="claimType"]'));
  }

  descriptionField(): ElementFinder {
    return element(by.css('textarea[formcontrolname="description"]'));
  }

  lodgeButton(): ElementFinder {
    return element(by.buttonText('Lodge claim'));
  }

  pageHeading(): Promise<string> {
    return element(by.css('h1')).getText() as Promise<string>;
  }
}
