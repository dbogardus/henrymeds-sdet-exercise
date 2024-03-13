import { test, Page } from "@playwright/test";
import { OpenAI } from "openai";
import { ai } from '@zerostep/playwright';
import { WhatStateDoYouLiveIn_Page } from './pageobjects/onboarding/weight-loss/what-state-do-you-live-in-page';
import { Payment_Page } from './pageobjects/onboarding/weight-loss/payment-page';
import ClientPersonBuilder, { ClientPerson, Therapy } from "./types/clientPerson";
import { PageUtils } from "./utils/pageUtils";
import { APITestType } from "@zerostep/playwright/lib/types";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// This test uses OpenAI to analyze web pages and get instructions on interacting with the page, 
// then usese Zerostep to perform the interaction. 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ZEROSTEP_TOKEN must be set an environment variable, get it from https://app.zerostep.com/account
// From your terminal : export ZEROSTEP_TOKEN='0step:the-rest-of-your-token-here'
//
// OPENAI_API_KEY must be set as an environment variable, get it from https://platform.openai.com/account/api-keys
// From your terminal : export OPENAI_API_KEY='your-key-here'
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

test("Onboarding test using Autonomous AI", async ({ page }) => {

    test.setTimeout(120000); // Test can take a while due to calls to 2 different AI APIs

    const weightLossClient: ClientPerson = new ClientPersonBuilder().setTherapy(Therapy.WEIGHT_LOSS).build();

    const instructions_for_ai = 
        "You are a browser interaction tool testing a web page. " + 
        "The page you are interacting with is part of an onboarding process." + 
        "If the page asks to select next available time, click the button with the first available time. " + 
        "If a form needs to be filled in, please indicate what to fill in each field, including the label on the field and the contents that should be filled in. " +
        "If you see checkboxes that aren't checked, give instructions to check them. " +
        "Be vigalant to ensure that if there's a 'Continue' button, it is clicked last. " +
        "If there is more than one action needed to interact with a page, return it in the format of [ACTION1],[ACTION2],[ACTION3], etc.  " +
        "Example actions : [Fill in first name with 'Thomas'],[Click the button labeled 'Continue'] ." + 
        "Ignore any elements that are related to cookies or privacy policies. " +
        "If you see the words '" + Payment_Page.pageText + "' on the page, return 'FINISHED'. " +
        "Use this test user information to fill in forms  : " + weightLossClient.toString();


    await WhatStateDoYouLiveIn_Page.navigate(page);

    let pageLoadCount = 0;
    let maxPageLoadCount = 10; // We don't want to loop forever

    while (pageLoadCount < maxPageLoadCount) {
        pageLoadCount++;
        console.log(`Loop ${pageLoadCount}: Page title is [${await page.title()}]`);
        
        const pageActions = await OpenAI_Chat(page, instructions_for_ai);

        if (pageActions.length === 1 && pageActions[0] === "FINISHED") {
            console.log("Breaking out of the loop, AI says we're finished");
            break; 
        }

        await performPageActions(page, test, pageActions);
        
        PageUtils.waitForPageLoad(page);

        await page.waitForTimeout(2500); //page.waitForLoadState doesn't work reliably ¯\_(ツ)_/¯
    }


    await Payment_Page.verifyOnPage(page);
    await Payment_Page.verifyFirstName(page, weightLossClient.legalFirstName);
    await Payment_Page.verifyLastName(page, weightLossClient.legalLastName);

});

async function performPageActions(page: Page, test: APITestType, pageActions: string[]): Promise<void> {
    for (const pageAction of pageActions) {
        await ai(pageAction, { page, test });
    }
}

async function OpenAI_Chat(page: Page, message: string): Promise<string[]> {

    const apiKey = process.env['OPENAI_API_KEY'];
    if (!apiKey) {
        throw new Error("OPENAI_API_KEY is not defined in the environment variables");
    }  
    const openai = new OpenAI({apiKey});

    const strippedDownHTML = await stripDownHTML(page);

    const content = message + "This the html of the page I'm looking at now: " + strippedDownHTML;

    // Create a chat completion
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content}],
        model: 'gpt-4-turbo-preview', // https://platform.openai.com/docs/models/
        temperature : 0, //Lower temperature means more deterministic responses (0 is no randomness)
    });

    const response = chatCompletion.choices[0].message.content;
    // Output the result
    if(response){
        console.log("OpenAI response [" + response + "]");
        return splitString(response);
    }else{
        throw new Error("Response was empty");
    }
}

function splitString(inputString: string): string[] {
    // Check if the input string contains "],["
    if (!inputString.includes("],[")) {
        // If it doesn't contain the pattern, return the original string inside an array
        return [inputString];
    }

    // Split the string at each occurrence of "],["
    const result = inputString.split("],[");
    
    // The first and last elements will contain additional brackets ("[[" and "]]"), so we trim those
    if (result.length > 0) {
        result[0] = result[0].replace(/^\[\[/, ""); // Remove the leading "[["
        const lastIndex = result.length - 1;
        result[lastIndex] = result[lastIndex].replace(/\]\]$/, ""); // Remove the trailing "]]"
    }
    
    return result;
}


async function stripDownHTML(page: Page): Promise<string> {
    // Evaluate script within the page context to manipulate the DOM directly
    return await page.evaluate(() => {

        const clonedDocument = document.cloneNode(true) as Document;

        // Remove <style>, <link> with rel="stylesheet", and <script> elements
        clonedDocument.querySelectorAll('style, link[rel="stylesheet"], script').forEach(e => e.remove());
        
        // Optionally, remove any inline styles
        clonedDocument.querySelectorAll('[style]').forEach(e => e.removeAttribute('style'));

        return clonedDocument.documentElement.outerHTML;
    });
}