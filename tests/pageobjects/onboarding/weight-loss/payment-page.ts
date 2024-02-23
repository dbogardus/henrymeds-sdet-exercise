import { Page } from '@playwright/test';
import { PageUtils } from '../../../utils/pageUtils';

export class PaymentPage {

  static async verifyFirstName(page: Page, expectedValue: string): Promise<void> {
    await this.verifyOnPage(page);
    await PageUtils.waitForInputValue(page, `firstName`, expectedValue);
  }

  static async verifyLastName(page: Page, expectedValue: string): Promise<void> {
    await this.verifyOnPage(page);
    await PageUtils.waitForInputValue(page, `lastName`, expectedValue);
  }

  static async verifyOnPage(page: Page) {
    console.log('Verifying on PaymentPage');
    await PageUtils.verifyTextIsOnPage(page, 'Payment Method');
  }
}
