
# Henry Meds SDET Exercise


### Candidate : Don Bogardus
- [Resume](Resume_Don_Bogardus.pdf) 


## Planning done prior to writing code

- Video recap of project : [https://jam.dev/c/3e30e7cd-4a43-4d3c-847b-17ed19c25278]
- Complete the exercise in the language and libraries used by Henry Meds
- Make for a fluent test writing experience by using autocomplete features of IDE to make for a 
- Short methods for readability 
- Don't create instances of Page objects, just use static methods, we don't want references to our Page object spread around
- Each setter on a page verifies the value was set successfully
- ClientPerson information in stored in it's own object that will be used by pages to populate the data on their pages
- Use AI to maximize speed of development (Copilot, GPT4, Perplexity, Phind)

## Misc Notes
- I noticed on Contact Details page, the preffered pronouns "they/them" are not capitalized like "He/Him" and "She/Her", is consistent

#### **To run the cappedAvailableTimes api test**

    npx playwright test cappedAvailableTimes.api.spec.ts

#### **To run the onboarding browser test** 

    npx playwright test onboarding.ui.spec.ts

#### ** Run same test in headed browser **

    npx playwright test onboarding.ui.spec.ts --headed

#### **To open Playwright's unified Html report of test results**

    npm run play-report

