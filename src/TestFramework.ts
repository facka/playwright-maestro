import { setup, Goto } from './dsl/actions';
import { createAsyncContext } from './CommandRunner';
import { Page } from './Page';
import { PlaywrightTestArgs, PlaywrightTestOptions, TestInfo } from '@playwright/test';

export const Steps = (testFn: () => void) => {
  return async ({ page }: PlaywrightTestArgs & PlaywrightTestOptions, testInfo: TestInfo): Promise<void> => {
    // Initialize the test context (runner)
    const { runner } = createAsyncContext(page);
    setup(page, runner);

    // Call the provided test function with the page instance
    testFn();

    // Execute the queued actions
    await runner.run();
  }
};

export * from './dsl/actions';

export * from './UIComponent';
export { Page };