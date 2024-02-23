import { Page } from '@playwright/test';
import { PageUtils } from '../../../utils/pageUtils';
import { ClientPerson } from '../../../types/clientPerson';

export class ShippingPage {

  static async fillInShippingInfo(page: Page, client: ClientPerson): Promise<void> {
    await this.verifyOnPage(page);
    console.log('Filling in Shipping details on ShippingDetailsPage');
    await PageUtils.fillInputField(page, 'addressLine1', client.shippingAddressLine1);
    await PageUtils.fillInputField(page, 'addressLine2', client.shippingAddressLine2);
    await PageUtils.fillInputField(page, 'city', client.shippingCity);  

    await PageUtils.fillInputField(page, 'zip', client.shippingZip);

    await PageUtils.clickButtonByText(page, 'Continue');
  }

  static async verifyOnPage(page: Page) {
    console.log('Verifying on ShippingPage');
    await PageUtils.verifyTextIsOnPage(page, 'Shipping');
  }
}
