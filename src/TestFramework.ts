import { setup, Goto } from './dsl/actions';
import { test as baseTest } from '@playwright/test';
import { createAsyncContext } from './CommandRunner';

export async function initializeTestContext(page: any, url: string) {
  const { runner } = createAsyncContext(page);
  setup(page, runner);

  // Automatically navigate to the specified URL
  Goto(url);

  return { qPage: page, runner };
}

export class TestBuilder {
  private description: string;
  private url: string | null = null;

  constructor(description: string) {
    this.description = description;
  }

  at(url: string) {
    this.url = url;
    return this;
  }

  do(testFn: () => void) {
    baseTest(this.description, async ({ page }) => {
      if (!this.url) {
        throw new Error('URL must be specified using the "at" method before calling "do".');
      }

      // Initialize the test context (qPage and runner)
      const { runner } = await initializeTestContext(page, this.url);

      // Call the provided test function with the context
      testFn();

      // Execute the queued actions
      await runner.run();
    });
  }
}

export function test(description: string) {
  return new TestBuilder(description);
}

export * from './dsl/actions';