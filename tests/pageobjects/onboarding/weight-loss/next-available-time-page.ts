import { Page } from '@playwright/test';
import { PageUtils } from '../../../utils/pageUtils';

export class NextAvailableTimePage {

  static async clickFirstAppointment(page: Page): Promise<void> {
    await this.verifyOnPage(page);
    console.log('Clicking first appointment on NextAvailableTimePage');
    await page.locator((`button:has-text(":")`)).first().click();
  }

  static async verifyOnPage(page: Page) {
    console.log('Verifying on NextAvailableTimePage');
    await PageUtils.verifyTextIsOnPage(page, 'Next Available Time');
  }
}
