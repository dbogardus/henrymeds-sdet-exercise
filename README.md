
# Henry Meds SDET Exercise


### Candidate : Don Bogardus
- [Resume](Resume_Don_Bogardus.pdf)

- Video recap of project : [https://jam.dev/c/17ddd990-83e7-4988-8f14-9e6456f71897]


## Principles applied
- Complete the exercise in the language and libraries used by Henry Meds
- Complete the onboarding browser test with Playwright best practices
    - Short methods for readability 
    - Don't create instances of Page objects, just use static methods, we don't want references to our Page object spread around
    - Each action taken verifies it was successful
    - ClientPerson information in stored in it's own object that will be used by pages to populate the data on their pages
- Complete the same onboarding test using AI, which uses natural language prompts for all page actions 
- Use AI to maximize speed of development (Copilot, GPT4, Perplexity, Phind)
- [The API test](tests/cappedAvailableTimes.api.spec.ts) was quick and easy by using Firefox to capture [a HTTP Archive file](onboard.henrymeds.com_v1call.har), of the network call to cappedAvailableTimes. Then had GPT4 write the network interaction code. 

#### **To run the [cappedAvailableTimes](tests/cappedAvailableTimes.api.spec.ts) api test**

    npx playwright test cappedAvailableTimes.api.spec.ts

#### **To run the ["standard" onboarding browser test](tests/onboarding.ui.spec.ts)** 

    npx playwright test onboarding.ui.spec.ts --headed

#### **To run the [AI based onboarding test](tests/onboarding.ui.ai.spec.ts), which uses natural language prompts**

    export ZEROSTEP_TOKEN='0step:the-rest-of-your-token-here' // ZEROSTEP_TOKEN must be set, get it from https://app.zerostep.com/account

    npx playwright test onboarding.ui.ai.spec.ts --headed


