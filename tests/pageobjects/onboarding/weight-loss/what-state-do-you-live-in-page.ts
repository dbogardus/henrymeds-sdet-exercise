import { Page, Locator, expect } from '@playwright/test';
import { PageUtils } from '../../../utils/pageUtils';
import { State, StateText } from '../../../types/clientPerson';


export class WhatStateDoYouLiveIn_Page {

  static readonly pageURL: string = "https://onboard.henrymeds.com/app/appointment/weightloss-phen"; 
  
  static async navigate(page: Page) {
    console.log('Loading WhatStatePage with url [' + WhatStateDoYouLiveIn_Page.pageURL + ']');
    await page.goto(WhatStateDoYouLiveIn_Page.pageURL, { waitUntil: 'networkidle' });
    await this.verifyOnPage(page);
  }

  static async clickStateButton(page: Page, state: State): Promise<void> {
    await this.verifyOnPage(page);
    const stateName = StateText[state];
    console.log('Clicking state button with name [' + stateName + '] on WhatStatePage');
    await page.locator((`button:has-text("${stateName}")`)).click();
  }

  static async verifyOnPage(page: Page) {
    console.log('Verifying on WhatStatePage');
    await PageUtils.verifyTextIsOnPage(page, 'What state do you live in');
  }

}
