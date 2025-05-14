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

// Add more tests as needed