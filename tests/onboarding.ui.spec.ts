import { test, expect, Page } from '@playwright/test';
import { ClientPersonBuilder, ClientPerson, Therapy, StateText } from './types/clientPerson';
import { WhatStatePage } from './pageobjects/onboarding/weight-loss/what-state-page';
import { NextAvailableTimePage } from './pageobjects/onboarding/weight-loss/next-available-time-page';
import { NextStepsPage } from './pageobjects/onboarding/weight-loss/next-steps-page';
import { ContactDetailsPage } from './pageobjects/onboarding/weight-loss/contact-details-page';
import { ShippingPage } from './pageobjects/onboarding/weight-loss/shipping-page';
import { PaymentPage } from './pageobjects/onboarding/weight-loss/payment-page';

test('Weight Loss Onboarding', async ({ page }) => {  
  
  const weightLossClient: ClientPerson = new ClientPersonBuilder().setTherapy(Therapy.WEIGHT_LOSS).build();

  await WhatStatePage.navigate(page);
  await WhatStatePage.clickStateButton(page, weightLossClient.state);

  await NextAvailableTimePage.clickFirstAppointment(page);

  await NextStepsPage.clickContinue(page);

  await ContactDetailsPage.fillInContactInfo(page, weightLossClient);

  await ShippingPage.fillInShippingInfo(page, weightLossClient);

  await PaymentPage.verifyFirstName(page, weightLossClient.legalFirstName);
  await PaymentPage.verifyLastName(page, weightLossClient.legalLastName);

});

