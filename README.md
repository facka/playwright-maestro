# Playwright Maestro

A custom framework for Playwright tests with a DSL for writing readable and maintainable test cases.

## Features
- DSL for actions like `Enter`, `Click`, `Expect`, etc.
- **Enhanced Reporting**: Each DSL method uses `test.step` to provide detailed and structured output in Playwright reports.
- Context-based assertions.
- Modular and reusable test structure.


## Under the Hood: How the DSL Works
playwright-maestro is a domain-specific language (DSL) built on top of the Playwright testing library. While the syntax aims to improve readability and reduce repetitive await statements, it still uses Playwright's powerful core under the hood.

This means:

✅ Selectors use Playwright locators (page.locator(...))

✅ Assertions are powered by Playwright's expect() API

✅ Actions like Click, Enter, PressEnterOn call native Playwright methods

You're not replacing Playwright — you're writing more expressive tests with it.

## Installation
```bash
npm install playwright-maestro
```

## 📦 NPM Package

You can find the Playwright Maestro package on [npm](https://www.npmjs.com/package/playwright-maestro).

## Usage

### Using Playwright Maestro with POM

```typescript
// ./pages/TodoMVCPage.ts
import { UIComponent, Enter, PressEnterOn, Step } from 'playwright-maestro';

// Define UIComponents
const todoInput = new UIComponent('Todo Input', '[placeholder="What needs to be done?"]');
const todoTitle = new UIComponent('Todo Title', '[data-testid="todo-title"]');

const addItem = Step('Add Item', (params: {
  item: string
}) => {
  const { item } = params;
  Enter(item).into(todoInput);
  PressEnterOn(todoInput); 
});

export default {
  todoInput, todoTitle,
  addItem
};
```

```typescript
// example
import { ExpectContext, Expect, SaveResultAs, Goto, Steps } from 'playwright-maestro';
import { test } from '@playwright/test'; 
import TodoMVCPage from './pages/TodoMVCPage';


test('Add items to the todo list', Steps(() => {
  Goto('https://demo.playwright.dev/todomvc');
  TodoMVCPage.addItem({ item: 'Install Playwright Maestro'});

  // Verify item is present
  Expect(TodoMVCPage.todoTitle).ToHaveText('Install Playwright Maestro');
  SaveResultAs('todosCount', () => JSON.parse(localStorage['react-todos']).length);
  ExpectContext('todosCount').ToEqual(1);
}));
```

### Comparison with Plain Playwright using POM

Using plain Playwright, the same test would look like this:

```typescript
// ./pages/TodoMVCPage.ts
import { Page } from '@playwright/test';

export class TodoMVCPage {
  private page: Page;
  private todoInput = '[placeholder="What needs to be done?"]';
  private todoTitle = '[data-testid="todo-title"]';

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('https://demo.playwright.dev/todomvc');
  }

  async addTodoItem(item: string) {
    await this.page.fill(this.todoInput, item);
    await this.page.press(this.todoInput, 'Enter');
  }

  async getTodoTitle(): Promise<string> {
    return this.page.textContent(this.todoTitle);
  }

  async getTodosCount(): Promise<number> {
    return JSON.parse(await this.page.evaluate(() => localStorage['react-todos'])).length;
  }
}
```

```typescript
// example
import { test, expect } from '@playwright/test';
import { TodoMVCPage } from './pages/TodoMVCPage';

test('should allow me to add todo items', async ({ page }) => {
  const todoPage = new TodoMVCPage(page);

  // Navigate to the page
  await todoPage.navigate();

  // Add first todo item
  await todoPage.addTodoItem('Install Playwright Maestro');

  // Verify item is present
  const todoTitle = await todoPage.getTodoTitle();
  expect(todoTitle).toBe('Install Playwright Maestro');

  // Verify item count in localStorage
  const todosCount = await todoPage.getTodosCount();
  expect(todosCount).toBe(1);
});
```

### Key Differences

1. **No `await` Statements**: With Playwright Maestro, you don't need to explicitly use `await` for each action. The framework handles asynchronous operations internally, making the code cleaner and easier to read.
2. **Readable DSL**: Actions like `Enter`, `Expect`, and `PressEnterOn` provide a more natural and descriptive way to define test steps compared to raw Playwright methods.
3. **Context Management**: Playwright Maestro allows saving and reusing context (e.g., `SaveResultAs` and `ExpectContext`), reducing boilerplate code for managing intermediate values.
4. **Improved Maintainability**: The DSL abstracts common patterns, making tests more maintainable and less prone to errors.

By using Playwright Maestro, you can focus on the intent of the test rather than the mechanics of interacting with the browser.

## Roadmap

The following features and improvements are planned for future releases of this project:

### Short-Term Goals
1. **Improve DSL Actions**:
   - Add more user-friendly actions like `DoubleClick`, `RightClick`, and `DragAndDrop`.
   - Enhance existing actions with better error handling and logging.

2. **Enhanced Assertions**:
   - Add more assertion methods, such as `ToHaveClass`, `ToHaveStyle`, and `ToBeEnabled`.
   - Support custom error messages for assertions.

3. **Detailed Playwright Logs**:
   - Improve Playwright logs to include detailed descriptions of each action being performed.
   - Ensure logs capture the selector, action type, and expected outcome for better traceability.
   - Integrate logs with Playwright's trace viewer for easier debugging.

4. **Documentation**:
   - Provide detailed examples for using the framework.
   - Add API documentation for all DSL actions and utilities.

### Mid-Term Goals
1. **Reusable Page Objects**:
   - Introduce a `PageObject` pattern for managing reusable components and selectors.
   - Provide utilities for creating and managing page objects.


### Long-Term Goals
1. **Plugin System**:
   - Allow users to extend the framework with custom plugins.

