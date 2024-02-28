import { Page, expect } from '@playwright/test';

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
    //await expect(page.getByTestId(testId)).toHaveValue(value);
    await this.verifyInputValue(page, testId, value); // Verify the value was set
  }

  static async verifyInputValue(page: Page, testId: string, expectedValue: string): Promise<void> {
    console.log('Verifying Input field with testId [' + testId + '] to have value [' + expectedValue + ']');
    await expect(page.getByTestId(testId)).toHaveValue(expectedValue);
  }

  static async selectDropdownOption(page: Page, testId: string, optionValue: string): Promise<void> {
    console.log('Selecting dropdown option with testId [' + testId + '] to value [' + optionValue + ']');
    const selector = `[data-testid="${testId}"]`;
    await page.selectOption(selector, optionValue);
    await this.verifyDropdownValue(page, testId, optionValue); // Verify the value was set
  }

  static async verifyDropdownValue(page: Page, testId: string, expectedText: string): Promise<void> {
    console.log('Verifying Dropdown with testId [' + testId + '] to have value [' + expectedText + ']');
    await expect(page.locator('select[data-testid="' + testId + '"] option:checked')).toHaveText(expectedText);
  }

  static async clickButtonByText(page: Page, buttonText: string): Promise<void> {
    console.log('Clicking button with text [' + buttonText + ']');
    await page.click(`button:has-text("${buttonText}")`);
  }

  static async setCheckboxValue(page: Page, testId: string, isChecked: boolean): Promise<void> {
    console.log('Setting checkbox with testId [' + testId + '] to value [' + isChecked + ']');
    const checked = await page.isChecked(`[data-testid="${testId}"]`);
    if (isChecked !== checked) {
        await page.click(`[data-testid="${testId}"]`);
    }
    await this.verifyCheckboxValue (page, testId, isChecked); // Verify the value was set
  }

  static async verifyCheckboxValue(page: Page, testId: string, isChecked: boolean): Promise<void> {
    console.log('Verifying checkbox with testId [' + testId + '] is checked [' + isChecked + ']'); 
    await expect(page.locator('[data-testid="' + testId + '"]')).toBeChecked({checked: isChecked});
  }

  static async submitForm(page: Page): Promise<void> {
    console.log('Submitting form');
    await page.click('button[type="submit"]');
  }

}
