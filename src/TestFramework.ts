import { setup, Goto } from './dsl/actions';
import { createAsyncContext } from './CommandRunner';

export function initializeTestContext(page: any, url: string) {
  const { runner } = createAsyncContext(page);
  setup(page, runner);

  // Automatically navigate to the specified URL
  Goto(url);

  return { runner };
}

export const AtPage = ({page, url}: {page: any; url: string}) => ({
  async do(testFn: () => void) {
    // Initialize the test context (qPage and runner)
    const { runner } = initializeTestContext(page, url);

    // Call the provided test function with the context
    testFn();

    // Execute the queued actions
    runner.run();
  },
});

export * from './dsl/actions';