import { Page } from '@playwright/test';
import { PageUtils } from '../../../utils/pageUtils';
import { ClientPerson, SexAssignedAtBirthText, PreferredPronounsText } from '../../../types/clientPerson';

export class ContactDetailsPage {

  static async fillInContactInfo(page: Page, client: ClientPerson): Promise<void> {
    await this.verifyOnPage(page);
    console.log('Filling in contact details on ContactDetailsPage');
    await PageUtils.fillInputField(page, 'firstName', client.legalFirstName);
    await PageUtils.fillInputField(page, 'lastName', client.legalLastName);
    await PageUtils.fillInputField(page, 'email', client.email);
    await PageUtils.fillInputField(page, 'verifyEmail', client.email);
    await PageUtils.fillInputField(page, 'dob', client.dateOfBirth);
    await PageUtils.fillInputField(page, 'phoneNumber', client.phoneNumber);

    await PageUtils.selectDropdownOption(page, 'sex', SexAssignedAtBirthText[client.sexAssignedAtBirth]);
    await PageUtils.selectDropdownOption(page, 'preferredPronouns', PreferredPronounsText[client.preferredPronouns]);

    await PageUtils.setCheckboxValue(page, 'tosConsent', true);

    await PageUtils.clickButtonByText(page, 'Continue');
  }

  static async verifyOnPage(page: Page) {
    console.log('Verifying on ContactDetailsPage');
    await PageUtils.verifyTextIsOnPage(page, 'Contact Details');
  }

}
