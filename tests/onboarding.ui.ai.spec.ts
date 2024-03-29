import { test, Page } from "@playwright/test";
import { ai } from '@zerostep/playwright';
import { WhatStateDoYouLiveIn_Page } from './pageobjects/onboarding/weight-loss/what-state-do-you-live-in-page';
import { NextAvailableTime_Page } from './pageobjects/onboarding/weight-loss/next-available-time-page';
import { NextSteps_Page } from './pageobjects/onboarding/weight-loss/next-steps-page';
import { ContactDetails_Page } from './pageobjects/onboarding/weight-loss/contact-details-page';
import { Shipping_Page } from './pageobjects/onboarding/weight-loss/shipping-page';
import { Payment_Page } from './pageobjects/onboarding/weight-loss/payment-page';
import ClientPersonBuilder, { ClientPerson, PreferredPronounsText, SexAssignedAtBirthText, StateText, Therapy } from "./types/clientPerson";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// This test uses Zerostep to interpret natural language commands to perform the page operations. 
// Zerostep uses GPT 3.5, sending the HTML and instructions over to OpenAI and acting on the response. 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ZEROSTEP_TOKEN must be set an environment variable, get it from https://app.zerostep.com/account
// From your terminal : export ZEROSTEP_TOKEN='0step:the-rest-of-your-token-here'
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
test("Onboarding test using AI", async ({ page }) => {

    test.setTimeout(60000); // This test can take a little while longer due to the calls to ZeroStep

    const weightLossClient: ClientPerson = new ClientPersonBuilder().setTherapy(Therapy.WEIGHT_LOSS).build();

    await WhatStateDoYouLiveIn_Page.navigate(page);
    await ai("Click on the button labeled '" + StateText[weightLossClient.state] + "'", { page, test });

    await NextAvailableTime_Page.verifyOnPage(page);
    await ai("Click the first button with a time of day on it", { page, test });

    await NextSteps_Page.verifyOnPage(page);
    await ai("Click the 'Continue' button", { page, test });

    await ContactDetails_Page.verifyOnPage(page);
    await ContactDetailsPage_FillInWithAI(page, weightLossClient);

    await Shipping_Page.verifyOnPage(page);
    await ShippingPage_FillInWithAI(page, weightLossClient);

    await Payment_Page.verifyOnPage(page);
    await Payment_Page.verifyFirstName(page, weightLossClient.legalFirstName);
    await Payment_Page.verifyLastName(page, weightLossClient.legalLastName);

});

async function ShippingPage_FillInWithAI(page: Page, weightLossClient: ClientPerson) {
    
    //Parallelize the form fill
    let shippingPageFormFill: string[] = [];
    shippingPageFormFill.push("Fill in Address Line 1 with '" + weightLossClient.shippingAddressLine1 + "'");
    shippingPageFormFill.push("Fill in Address Line 2 with '" + weightLossClient.shippingAddressLine2 + "'");
    shippingPageFormFill.push("Fill in City with '" + weightLossClient.shippingCity + "'");
    shippingPageFormFill.push("Fill in Zip with '" + weightLossClient.shippingZip + "'");
    await ai(shippingPageFormFill, { page, test });

    await ai("Click 'Continue'", { page, test });
}

async function ContactDetailsPage_FillInWithAI(page: Page, weightLossClient: ClientPerson) {

    //Parallelize the form fill
    let contactDetailsFormFill: string[] = [];
    contactDetailsFormFill.push("Fill in the first name with + '" + weightLossClient.legalFirstName + "'");
    contactDetailsFormFill.push("Fill in the last name with '" + weightLossClient.legalLastName + "'");
    contactDetailsFormFill.push("Fill in the text field 'Email Address *' with + '" + weightLossClient.email + "'");
    contactDetailsFormFill.push("Fill in the text field 'Verify Email Address *' with + '" + weightLossClient.email + "'");
    contactDetailsFormFill.push("Fill in the Date of Birth with + '" + weightLossClient.dateOfBirth + "'");
    contactDetailsFormFill.push("Fill in the Phone Number with + '" + weightLossClient.phoneNumber + "'");
    contactDetailsFormFill.push("For Sex Assigned At Birth, choose + '" + SexAssignedAtBirthText[weightLossClient.sexAssignedAtBirth] + "'");
    contactDetailsFormFill.push("For 'Preferred Gender Pronouns', choose + '" + PreferredPronounsText[weightLossClient.preferredPronouns] + "'");
    contactDetailsFormFill.push("Click the checkbox to accept the terms and conditions");
    await ai(contactDetailsFormFill, { page, test });

    await ai("Click 'Continue'", { page, test });
}
