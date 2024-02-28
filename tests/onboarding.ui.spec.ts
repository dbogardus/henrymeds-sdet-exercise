import { test } from '@playwright/test';
import { ClientPersonBuilder, ClientPerson, Therapy } from './types/clientPerson';
import { WhatStateDoYouLiveIn_Page } from './pageobjects/onboarding/weight-loss/what-state-do-you-live-in-page';
import { NextAvailableTime_Page } from './pageobjects/onboarding/weight-loss/next-available-time-page';
import { NextSteps_Page } from './pageobjects/onboarding/weight-loss/next-steps-page';
import { ContactDetails_Page } from './pageobjects/onboarding/weight-loss/contact-details-page';
import { Shipping_Page } from './pageobjects/onboarding/weight-loss/shipping-page';
import { Payment_Page } from './pageobjects/onboarding/weight-loss/payment-page';

test('Weight Loss Onboarding', async ({ page }) => {

  const weightLossClient: ClientPerson = new ClientPersonBuilder().setTherapy(Therapy.WEIGHT_LOSS).build();

  await WhatStateDoYouLiveIn_Page.navigate(page);
  await WhatStateDoYouLiveIn_Page.clickStateButton(page, weightLossClient.state);

  await NextAvailableTime_Page.clickFirstAppointment(page);

  await NextSteps_Page.clickContinue(page);

  await ContactDetails_Page.fillInContactInfo(page, weightLossClient);

  await Shipping_Page.fillInShippingInfo(page, weightLossClient);

  await Payment_Page.verifyFirstName(page, weightLossClient.legalFirstName);
  await Payment_Page.verifyLastName(page, weightLossClient.legalLastName);

});

