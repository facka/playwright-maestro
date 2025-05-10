# Playwright Maestro

A custom framework for Playwright tests with a DSL for writing readable and maintainable test cases.

## Features
- DSL for actions like `Enter`, `Click`, `Expect`, etc.
- Context-based assertions.
- Modular and reusable test structure.

## Installation
```bash
npm install playwright-maestro
```

## Usage

```
import { test, Enter, Expect } from 'playwright-framework';

test('should allow me to add todo items')
  .at('https://demo.playwright.dev/todomvc')
  .do(() => {
    // Add first todo item
    Enter('Install Playwright Maestro').into('[placeholder="What needs to be done?"]');
    PressEnterOn('[placeholder="What needs to be done?"]');
    Expect('[data-testid="todo-title"]').ToHaveText('Install Playwright Maestro');

    // Verify item is present
    Expect('[data-testid="todo-title"]').ToHaveText('Install Playwright Maestro');
    SaveResultAs('todosCount', () => JSON.parse(localStorage['react-todos']).length);
    ExpectContext('todosCount').ToEqual(1);
  });

```

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

