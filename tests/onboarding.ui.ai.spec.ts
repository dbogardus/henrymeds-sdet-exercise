import { test, expect } from "@playwright/test";
import { ai } from '@zerostep/playwright';
import { WhatStateDoYouLiveIn_Page } from './pageobjects/onboarding/weight-loss/what-state-do-you-live-in-page';
import { NextAvailableTime_Page } from './pageobjects/onboarding/weight-loss/next-available-time-page';
import { NextSteps_Page } from './pageobjects/onboarding/weight-loss/next-steps-page';
import { ContactDetails_Page } from './pageobjects/onboarding/weight-loss/contact-details-page';
import { Shipping_Page } from './pageobjects/onboarding/weight-loss/shipping-page';
import { Payment_Page } from './pageobjects/onboarding/weight-loss/payment-page';
import ClientPersonBuilder, { ClientPerson, PreferredPronounsText, SexAssignedAtBirthText, StateText, Therapy } from "./types/clientPerson";

test("Onboarding test using AI", async ({ page }) => {

    //ZEROSTEP_TOKEN must be set an environment variable - https://app.zerostep.com/account

    test.setTimeout(120000); // This test can take a while to run due to the AI calls       

    const weightLossClient: ClientPerson = new ClientPersonBuilder().setTherapy(Therapy.WEIGHT_LOSS).build();

    await WhatStateDoYouLiveIn_Page.navigate(page);

    // `auto` can query data
    // In this case, the result is plain-text contents of the header
    const headerText = await ai("Get the header text", {page, test});

    console.log('>>>>>>>>>>>>>>>>>>> headerText1: ' + await ai("Get the header text", {page, test}));

    await ai("Click on the button labeled '" + StateText[weightLossClient.state] + "'", {page, test});

    await NextAvailableTime_Page.verifyOnPage(page);

    console.log('>>>>>>>>>>>>>>>>>>> headerText2:  ' + await ai("Get the header text", {page, test}));
    await ai("Click the first button with a time of day on it", {page, test});

    await NextSteps_Page.verifyOnPage(page);

    console.log('>>>>>>>>>>>>>>>>>>> headerText3: ' + await ai("Get the header text", {page, test}));

    await ai("Click the 'Continue' button", {page, test});

    await ContactDetails_Page.verifyOnPage(page);

    console.log('>>>>>>>>>>>>>>>>>>> headerText4: ' + await ai("Get the header text", {page, test}));

    await ai("Fill in the first name with + '" + weightLossClient.legalFirstName + "'", {page, test});

    await ai("Fill in the last name with '" + weightLossClient.legalLastName + "'", {page, test});

    await ai("Fill in the text fields 'Email Address *' and 'Verify Email Address *' with + '" + weightLossClient.email + "'", {page, test});

    await ai("Fill in the Date of Birth with + '" + weightLossClient.dateOfBirth + "'", {page, test});

    await ai("Fill in the Phone Number with + '" + weightLossClient.phoneNumber + "'", {page, test});

    await ai("For Sex Assigned At Birth, choose + '" + SexAssignedAtBirthText[weightLossClient.sexAssignedAtBirth] + "'", {page, test});

    await ai("For 'Preferred Gender Pronouns', choose + '" + PreferredPronounsText[weightLossClient.preferredPronouns] + "'", {page, test});

    await ai("Click the checkbox to accept the terms and conditions", {page, test});

    await ai("Click 'Continue'", {page, test});

    await Shipping_Page.verifyOnPage(page);

    await ai("Fill in Address Line 1 with '" + weightLossClient.shippingAddressLine1 + "'", {page, test});
    await ai("Fill in Address Line 2 with '" + weightLossClient.shippingAddressLine2 + "'", {page, test});
    await ai("Fill in City with '" + weightLossClient.shippingCity + "'", {page, test});
    await ai("Fill in Zip with '" + weightLossClient.shippingZip + "'", {page, test})

    await ai("Click 'Continue'", {page, test});

    await Payment_Page.verifyOnPage(page);

    Payment_Page.verifyFirstName(page, weightLossClient.legalFirstName);
    Payment_Page.verifyLastName(page, weightLossClient.legalLastName);
    


});