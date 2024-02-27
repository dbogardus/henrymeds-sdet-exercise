
# Henry Meds SDET Exercise


### Candidate : Don Bogardus
- [Resume](Resume_Don_Bogardus.pdf)

- Video recap of project : [https://jam.dev/c/3e30e7cd-4a43-4d3c-847b-17ed19c25278]


## Principles applied
- Complete the exercise in the language and libraries used by Henry Meds
- Short methods for readability 
- Don't create instances of Page objects, just use static methods, we don't want references to our Page object spread around
- Each action taken verifies it was successful
- ClientPerson information in stored in it's own object that will be used by pages to populate the data on their pages
- Use AI to maximize speed of development (Copilot, GPT4, Perplexity, Phind)
- [The API test](tests/cappedAvailableTimes.api.spec.ts) was quick and easy by using Firefox to capture [a HTTP Archive file](onboard.henrymeds.com_v1call.har), of the network call to cappedAvailableTimes. Then had GPT4 write the network interaction code. 

#### **To run the cappedAvailableTimes api test**

    npx playwright test cappedAvailableTimes.api.spec.ts

#### **To run the onboarding browser test** 

    npx playwright test onboarding.ui.spec.ts

#### ** Run same test in headed browser **

    npx playwright test onboarding.ui.spec.ts --headed

#### **To open Playwright's unified Html report of test results**

    npm run play-report
