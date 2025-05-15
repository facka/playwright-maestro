import { UIComponent, Enter, PressEnterOn, Step } from 'playwright-maestro';

// Define UIComponents
const todoAppSection = new UIComponent('Todo App Section', '.todoapp');
const todoListSection = new UIComponent('Todo List Section', '.todo-list', todoAppSection);
const todoInput = new UIComponent('Todo Input', '[placeholder="What needs to be done?"]', todoAppSection);
const todoTitle = new UIComponent('Todo Title', '[data-testid="todo-title"]', todoListSection);

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