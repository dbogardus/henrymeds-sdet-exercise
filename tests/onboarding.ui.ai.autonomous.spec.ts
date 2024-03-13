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

    test.setTimeout(60000); // This test can take a little while longer due to the calls to ZeroStep

    const weightLossClient: ClientPerson = new ClientPersonBuilder().setTherapy(Therapy.WEIGHT_LOSS).build();

    await WhatStateDoYouLiveIn_Page.navigate(page);

    const instructions = "I am a new weight loss patient, trying to complete onboarding to get some medication. Tell me what action I need to take in my web browser to proceed to the next page if I live in the state of California. Give me the instructions to click the button for California. Your reply should be one sentence with the exact action I need to take.";

    const instructionsForPageInteractions = await OpenAI_Chat(page, instructions);

    await ai(instructionsForPageInteractions, { page, test });
 
    await NextAvailableTime_Page.verifyOnPage(page);

    //await Anthropic_Chat(page, instructions);

    //await Gemini_Chat(page, instructions);
});

async function OpenAI_Chat(page: Page, message: string): Promise<string> {

    const apiKey = process.env['OPENAI_API_KEY'];
    if (!apiKey) {
        throw new Error("OPENAI_API_KEY is not defined in the environment variables");
    }  
    const openai = new OpenAI({apiKey});

    const content = message + "This the html of the page I'm looking at now: " + await stripDownHTML(page);

    // Create a chat completion
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content}],
        model: 'gpt-3.5-turbo', // Specify the model you want to use
    });

    const response = chatCompletion.choices[0].message.content;
    // Output the result
    if(response){
        console.log(response);
        return response;
    }else{
        throw new Error("Response was empty");
    }
}


async function Anthropic_Chat(page: Page, message: string) {

    const anthropic = new Anthropic({
        apiKey: process.env['ANTHROPIC_API_KEY'] || '', // Ensure your API key is stored in your environment variables
      });

    const content = message + "This the html of the page I'm looking at now: " + await stripDownHTML(page);

    try {
        const message = await anthropic.messages.create({
            max_tokens: 4000,
            messages: [{
              role: 'user',
              content
            }],
            model: 'claude-2.1', 
          });
    
        // Output the result
        console.log(message.content);
      } catch (error) {
        // Handle any errors that occur during the API call
        console.error(error);
      }
}


async function Gemini_Chat(page: Page, message: string) {

    const content = message + "This the html of the page I'm looking at now: " + await page.content();

    console.log(content);

    try {
        const geminiApiKey = process.env['GEMINI_API_KEY'];
        if (!geminiApiKey) {
            throw new Error("GEMINI_API_KEY is not defined in the environment variables");
        }
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});
        const prompt = content;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);

      } catch (error) {
        // Handle any errors that occur during the API call
        console.error(error);
      }
}


async function stripDownHTML(page: Page): Promise<string> {
    // Evaluate script within the page context to manipulate the DOM directly
    await page.evaluate(() => {
        // Remove <style>, <link> with rel="stylesheet", and <script> elements
        document.querySelectorAll('style, link[rel="stylesheet"], script').forEach(e => e.remove());
        
        // Optionally, remove any inline styles
        document.querySelectorAll('[style]').forEach(e => e.removeAttribute('style'));
    });

    // Return the modified HTML
    return await page.content();
}