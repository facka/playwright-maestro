export class UIComponent {
  name: string;
  selector: string;
  parent?: UIComponent;

  constructor(name: string, selector: string, parent?: UIComponent) {
    this.name = name;
    this.selector = selector;
    this.parent = parent;
  }

  toString() {
    return this.parent ? `[${this.parent.name} > ${this.name}]` : `[${this.name}]`;
  }
}