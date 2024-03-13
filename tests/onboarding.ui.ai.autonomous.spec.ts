import { test, Page } from "@playwright/test";
import { OpenAI } from "openai";
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ai } from '@zerostep/playwright';
import { WhatStateDoYouLiveIn_Page } from './pageobjects/onboarding/weight-loss/what-state-do-you-live-in-page';
import { NextAvailableTime_Page } from './pageobjects/onboarding/weight-loss/next-available-time-page';
import { NextSteps_Page } from './pageobjects/onboarding/weight-loss/next-steps-page';
import { ContactDetails_Page } from './pageobjects/onboarding/weight-loss/contact-details-page';
import { Shipping_Page } from './pageobjects/onboarding/weight-loss/shipping-page';
import { Payment_Page } from './pageobjects/onboarding/weight-loss/payment-page';
import ClientPersonBuilder, { ClientPerson, PreferredPronounsText, SexAssignedAtBirthText, StateText, Therapy } from "./types/clientPerson";
import { PageUtils } from "./utils/pageUtils";
import { APITestType } from "@zerostep/playwright/lib/types";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// This test uses Zerostep to interpret natural language commands to perform the page operations. 
// Zerostep uses GPT 3.5, sending the HTML and instructions over to OpenAI and acting on the response. 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ZEROSTEP_TOKEN must be set an environment variable, get it from https://app.zerostep.com/account
// From your terminal : export ZEROSTEP_TOKEN='0step:the-rest-of-your-token-here'
//
// OPENAI_API_KEY must be set as an environment variable, get it from https://platform.openai.com/account/api-keys
// From your terminal : export OPENAI_API_KEY='your-key-here'
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
test("Onboarding test using Autonomous AI", async ({ page }) => {

    test.setTimeout(120000); // This test can take a little while longer due to the calls to ZeroStep

    const weightLossClient: ClientPerson = new ClientPersonBuilder().setTherapy(Therapy.WEIGHT_LOSS).build();

    const instructions = 
        "You are a browser interaction tool testing a web page. " + 
        "The page you are interacting with is part of an onboarding process." + 
        "If the page asks to select next available time, click the button with the first available time. " + 
        "If a form needs to be filled in, please indicate what to fill in each field, including the label on the field and the contents that should be filled in. " +
        "If you see checkboxes, give instructions to click each of them." +
        "If there is more than one action needed to interact with a page, return it in the format of [ACTION1],[ACTION2],[ACTION3], etc.  " +
        "Some examples actions are [Fill in first name with 'Thomas'], or [Click the button labeled 'Continue'] . " + 
        "Ignore any elements that are related to cookies or privacy policies. " +
        "If you see the words '" + Payment_Page.pageText + "', on the page, return 'FINISHED'. " +
        "This is some test user information that should be used to fill in forms  : " + weightLossClient.toString();


    await WhatStateDoYouLiveIn_Page.navigate(page);

    let pageLoadCount = 0;
    let maxPageLoadCount = 10;

    while (pageLoadCount < maxPageLoadCount) {
        pageLoadCount++;
        console.log(`Loop ${pageLoadCount}: Current page title is [${await page.title()}]`);
        
        const pageActions = await OpenAI_Chat(page, instructions);

        if (pageActions.length === 1 && pageActions[0] === "FINISHED") {
            console.log("Breaking out of the loop, AI says we're finished");
            break; // This exits the while loop
        }

        await performPageActions(page, test, pageActions);
        
        PageUtils.waitForPageLoad(page);

        await page.waitForTimeout(5000);
    }


    await Payment_Page.verifyOnPage(page);
    await Payment_Page.verifyFirstName(page, weightLossClient.legalFirstName);
    await Payment_Page.verifyLastName(page, weightLossClient.legalLastName);


    // await WhatStateDoYouLiveIn_Page.navigate(page);

    // await ai(await OpenAI_Chat(page, instructions), { page, test });
 
    // //await PageUtils.waitForPageLoad(page);

    // await NextAvailableTime_Page.verifyOnPage(page);

    // await ai(await OpenAI_Chat(page, instructions), { page, test });

    // await NextSteps_Page.verifyOnPage(page);

    // await ai(await OpenAI_Chat(page, instructions), { page, test });

    ////////////////////////////////
    // await WhatStateDoYouLiveIn_Page.navigate(page);
    // await WhatStateDoYouLiveIn_Page.clickStateButton(page, weightLossClient.state);
  
    // await NextAvailableTime_Page.clickFirstAppointment(page);
  
    // await NextSteps_Page.clickContinue(page);

    // await ContactDetails_Page.verifyOnPage(page);

    // const pageActions = await OpenAI_Chat(page, instructions);

    // await performActions(page, test, pageActions);

    // await Shipping_Page.verifyOnPage(page);

    // const pageActions2 = await OpenAI_Chat(page, instructions);

    // await performActions(page, test, pageActions2);

    // await Payment_Page.verifyOnPage(page);
    // await Payment_Page.verifyFirstName(page, weightLossClient.legalFirstName);
    // await Payment_Page.verifyLastName(page, weightLossClient.legalLastName);
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
        temperature : 0.1,
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


async function Anthropic_Chat(page: Page, message: string): Promise<string> {

    const anthropicApiKey = process.env['ANTHROPIC_API_KEY'];
    if (!anthropicApiKey) {
        throw new Error("ANTHROPIC_API_KEY is not defined in the environment variables");
    }

    const anthropic = new Anthropic({apiKey: anthropicApiKey});

    const content = message + "This the html of the page I'm looking at now: " + await stripDownHTML(page);

    const claudeResponse = await anthropic.messages.create({
        max_tokens: 4000,
        messages: [{
            role: 'user',
            content
        }],
        model: 'claude-2.1', 
        });

    const response = claudeResponse.content[0].text;

    // Output the result
    if(response){
        console.log("Anthropic response [" + response + "]");
        return response;
    }else{
        throw new Error("Response was empty");
    }
}


async function Gemini_Chat(page: Page, message: string): Promise<string> {

    const content = message + "This the html of the page I'm looking at now: " + await page.content();

    console.log(content);
    const geminiApiKey = process.env['GEMINI_API_KEY'];
    if (!geminiApiKey) {
        throw new Error("GEMINI_API_KEY is not defined in the environment variables");
    }
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const prompt = content;
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
   
    // Output the result
    if(response){
        console.log("Gemini response [" + response + "]");
        return response;
    }else{
        throw new Error("Response was empty");
    }
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