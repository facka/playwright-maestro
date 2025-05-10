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
