export class UIComponent {
  name: string;
  selector: string;

  constructor(name: string, selector: string) {
    this.name = name;
    this.selector = selector;
  }

  toString() {
    return `${this.name}`;
  }
}