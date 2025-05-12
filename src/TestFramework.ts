import { setup, Goto } from './dsl/actions';
import { createAsyncContext } from './CommandRunner';

export const AtPage = async ({page, url}: {page: any; url: string}) => ({
  async do(testFn: () => void) {
    // Initialize the test context (runner)
    const { runner } = createAsyncContext(page);
    setup(page, runner);

    // Automatically navigate to the specified URL
    Goto(url);

    // Call the provided test function with the context
    testFn();

    // Execute the queued actions
    await runner.run();
  },
});

export * from './dsl/actions';