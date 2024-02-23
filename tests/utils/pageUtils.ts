import { Page } from '@playwright/test';

export class PageUtils {

  static async verifyTextIsOnPage(page: Page, textToWaitFor: string): Promise<void> {
    await page.waitForLoadState();
    const timeout = 10000;
    try {
      await page.waitForFunction(
        (text) => {
          const body = document.querySelector('body');
          return body && body.textContent && body.textContent.includes(text);
        },
        textToWaitFor,
        { timeout }
      );
    } catch (e) {
      throw new Error("Expected text doesn't exist on page [" + textToWaitFor + "]. " + 
        "Current page has title [" + await page.title() + "]"); 
    }
  }

  static async fillInputField(page: Page, testId: string, value: string): Promise<void> {
    console.log('Filling input field with testId [' + testId + '] and value [' + value + ']');
    await page.fill(`[data-testid="${testId}"]`, value);
    await this.waitForInputValue(page, testId, value); // Verify the value was set
  }

  static async waitForInputValue(page: Page, testId: string, expectedValue: string): Promise<void> {
    console.log('Waiting for input field with testId [' + testId + '] to have value [' + expectedValue + ']');
    await page.waitForFunction(
      ([selector, value]) => {
        const element = document.querySelector(selector) as HTMLInputElement;
        return element && element.value === value;
      },
      [`[data-testid="${testId}"]`, expectedValue]
    );
  }

  static async selectDropdownOption(page: Page, testId: string, optionValue: string): Promise<void> {
    console.log('Selecting dropdown option with testId [' + testId + '] to value [' + optionValue + ']');
    const selector = `[data-testid="${testId}"]`;
    await page.selectOption(selector, optionValue);
    await this.waitForDropdownValue(page, testId, optionValue); // Verify the value was set
  }

  static async waitForDropdownValue(page: Page, testId: string, expectedText: string): Promise<void> {
    console.log('Waiting for Dropdown with testId [' + testId + '] to have value [' + expectedText + ']');
    await page.waitForFunction(
      ([testId, expectedText]) => {
          const select = document.querySelector(`[data-testid="${testId}"]`) as HTMLSelectElement;;
          const selectedOption = select.options[select.selectedIndex];
          return selectedOption && selectedOption.text === expectedText;
      },
      [testId, expectedText] // Pass parameters as an array
  );
  }

  static async clickButtonByText(page: Page, buttonText: string): Promise<void> {
    console.log('Clicking button with text [' + buttonText + ']');
    await page.click(`button:has-text("${buttonText}")`);
  }

  static async setCheckboxValue(page: Page, testId: string, value: boolean): Promise<void> {
    console.log('Setting checkbox with testId [' + testId + '] to value [' + value + ']');
    const checked = await page.isChecked(`[data-testid="${testId}"]`);
    if (value !== checked) {
        await page.click(`[data-testid="${testId}"]`);
    }
    await this.getCheckboxValue (page, testId) === value;
  }

  static async getCheckboxValue(page: Page, testId: string): Promise<boolean> {
    console.log('Getting checkbox value with testId [' + testId + ']'); 
    return page.isChecked(`[data-testid="${testId}"]`);
  }


  static async submitForm(page: Page): Promise<void> {
    console.log('Submitting form');
    await page.click('button[type="submit"]');
  }

}
