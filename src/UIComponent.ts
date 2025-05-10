import { Locator } from "@playwright/test";

export class UIComponent {
  name: string;
  selector: string | Locator;

  constructor(name: string, selector: string | Locator) {
    this.name = name;
    this.selector = selector;
  }

  toString() {
    return `${this.name}`;
  }
}