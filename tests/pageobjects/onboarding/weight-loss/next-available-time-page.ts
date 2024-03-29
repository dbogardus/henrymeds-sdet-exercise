import { Page } from '@playwright/test';
import { PageUtils } from '../../../utils/pageUtils';

export class NextAvailableTime_Page {

  static async clickFirstAppointment(page: Page): Promise<void> {
    await this.verifyOnPage(page);
    console.log('Clicking first appointment on NextAvailableTimePage');
    await page.locator((`button:has-text(":")`)).first().click();
  }

  static async verifyOnPage(page: Page) {
    console.log('Verifying on NextAvailableTimePage');
    await page.locator('button:text("PM")').nth(0).waitFor();
    await PageUtils.verifyTextIsOnPage(page, 'Next Available Time');
  }
}
