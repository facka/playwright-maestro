
export class CommandRunner {
  private queue: (() => Promise<any>)[] = [];
  public context: Record<string, any> = {};

  add(step: () => Promise<any>) {
    this.queue.push(step);
  }

  async run() {
    for (const step of this.queue) {
      await step();
    }
  }

  set(name: string, value: any) {
    this.context[name] = value;
  }

  get(name: string) {
    return this.context[name];
  }
}

export function createAsyncContext(page: any) {
  const runner = new CommandRunner();
  return { page, runner };
}
