export class Page {
  name: string;
  url: string;

  constructor(name: string, url: string) {
    this.name = name;
    this.url = url;
  }

  toString() {
    return `${this.name}`;
  }
}