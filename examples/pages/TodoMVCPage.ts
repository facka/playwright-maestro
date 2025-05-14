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