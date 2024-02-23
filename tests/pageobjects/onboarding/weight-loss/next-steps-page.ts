import { Page } from '@playwright/test';
import { PageUtils } from '../../../utils/pageUtils';

export class NextStepsPage {

  static async clickContinue(page: Page): Promise<void> {
    this.verifyOnPage(page);
    console.log('Clicking Continue on NextStepsPage');
    await PageUtils.clickButtonByText(page, 'Continue');
  }

  static async verifyOnPage(page: Page) {
    console.log('Verifying on NextStepsPage');
    await PageUtils.verifyTextIsOnPage(page, 'Next Steps');
  }
}
