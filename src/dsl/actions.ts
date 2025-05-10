import { expect, Locator, test } from '@playwright/test';
import { CommandRunner } from '../CommandRunner';

let _page: any;
let _runner: CommandRunner;

function resolveLocator(selector: string | Locator): Locator {
  return typeof selector === 'string' ? _page.locator(selector) : selector;
}

function locatorToString(selector: string | Locator): String {
  return typeof selector === 'string' ? selector : selector.toString();
}

export function setup(page: any, runner: CommandRunner) {
  _page = page;
  _runner = runner;
}

export function Goto(url: string) {
  if (!_runner) {
    throw new Error('CommandRunner is not initialized. Call setup() before using this function.');
  }
  _runner.add(() => test.step(`Navigating to URL: ${url}`, () => _page.goto(url)));
}

export function ClickOn(selector: string | Locator) {
  _runner.add(() =>
    test.step(`Clicking on element: ${locatorToString(selector)}`, () =>
      resolveLocator(selector).click()
    )
  );
}

export function WaitUntilURLIs(url: string | RegExp) {
  _runner.add(() =>
    test.step(`Waiting until URL is: ${url}`, () => _page.waitForURL(url))
  );
}

export function Enter(text: string) {
  return {
    into(selector: string | Locator) {
      _runner.add(() =>
        test.step(`Entering text "${text}" into element: ${locatorToString(selector)}`, () =>
          resolveLocator(selector).fill(text)
        )
      );
    }
  };
}

export function PressKeyOn(selector: string | Locator, key: string) {
  _runner.add(() =>
    test.step(`Pressing key "${key}" on element: ${locatorToString(selector)}`, () =>
      resolveLocator(selector).press(key)
    )
  );
}

export function HoverOver(selector: string | Locator) {
  _runner.add(() =>
    test.step(`Hovering over element: ${locatorToString(selector)}`, () =>
      resolveLocator(selector).hover()
    )
  );
}

export function PressEnterOn(selector: string | Locator) {
  PressKeyOn(selector, 'Enter');
}

export function PressBackspaceOn(selector: string | Locator) {
  PressKeyOn(selector, 'Backspace');
}

export function PressEscapeOn(selector: string | Locator) {
  PressKeyOn(selector, 'Escape');
}

export function Expect(selector: string | Locator) {
  return {
    ToHaveText(expected: string | RegExp | string[]) {
      _runner.add(() =>
        test.step(`Expecting element "${locatorToString(selector)}" to have text: ${expected}`, async () => {
          const locatorObj = resolveLocator(selector);
          await expect(locatorObj).toHaveText(expected);
        })
      );
    },
    IsVisible() {
      _runner.add(() =>
        test.step(`Expecting element "${locatorToString(selector)}" to be visible`, async () => {
          const isVisible = await resolveLocator(selector).isVisible();
          if (!isVisible) {
            throw new Error(`Expected element "${locatorToString(selector)}" to be visible, but it is not`);
          }
        })
      );
    },
    IsHidden() {
      _runner.add(() =>
        test.step(`Expecting element "${locatorToString(selector)}" to be hidden`, async () => {
          const isHidden = await resolveLocator(selector).isHidden();
          if (!isHidden) {
            throw new Error(`Expected element "${locatorToString(selector)}" to be hidden, but it is visible`);
          }
        })
      );
    },
    IsEmpty() {
      _runner.add(() =>
        test.step(`Expecting input "${locatorToString(selector)}" to be empty`, async () => {
          const value = await resolveLocator(selector).inputValue();
          if (value !== '') {
            throw new Error(`Expected input to be empty, but got "${value}"`);
          }
        })
      );
    },
    HasAttribute(attribute: string, value: string) {
      _runner.add(() =>
        test.step(
          `Expecting element "${locatorToString(selector)}" to have attribute "${attribute}" with value "${value}"`,
          async () => {
            const actual = await resolveLocator(selector).getAttribute(attribute);
            if (actual !== value) {
              throw new Error(
                `Expected element "${locatorToString(selector)}" to have attribute "${attribute}" with value "${value}", but got "${actual}"`
              );
            }
          }
        )
      );
    },
    CountIs(expectedCount: number) {
      _runner.add(() =>
        test.step(`Expecting element "${locatorToString(selector)}" to have count: ${expectedCount}`, async () => {
          const count = await resolveLocator(selector).count();
          if (count !== expectedCount) {
            throw new Error(
              `Expected "${locatorToString(selector)}" to have ${expectedCount} elements, but found ${count}`
            );
          }
        })
      );
    }
  };
}

export function SaveResultAs(name: string, fn: () => Promise<any>) {
  _runner.add(() =>
    test.step(`Saving result as "${name}"`, async () => {
      const value = await _page.evaluate(fn);
      _runner.set(name, value);
    })
  );
}

export function When(
  condition: (context: Record<string, any>) => boolean | Promise<boolean>,
  actionBlock: () => void
) {
  _runner.add(() =>
    test.step(`Executing conditional block if condition is met`, async () => {
      if (await condition(_runner.context)) {
        const tempQueue: (() => Promise<any>)[] = [];
        const originalAdd = _runner.add.bind(_runner);
        _runner.add = (step) => tempQueue.push(step);
        actionBlock();
        _runner.add = originalAdd;
        for (const step of tempQueue) {
          await step();
        }
      }
    })
  );
}

export function WhenContextEquals(key: string, expected: any, actionBlock: () => void) {
  return When(ctx => ctx[key] === expected, actionBlock);
}

export function ExpectContext(key: string) {
  return {
    ToEqual(expected: any) {
      _runner.add(() =>
        test.step(`Expecting context property "${key}" to equal "${expected}"`, async () => {
          const actual = _runner.context[key];
          if (actual !== expected) {
            throw new Error(`Expected context property "${key}" to equal "${expected}", but got "${actual}"`);
          }
        })
      );
    },
    ToContain(expected: any) {
      _runner.add(() =>
        test.step(`Expecting context property "${key}" to contain "${expected}"`, async () => {
          const actual = _runner.context[key];
          if (!actual || !actual.includes(expected)) {
            throw new Error(`Expected context property "${key}" to contain "${expected}", but got "${actual}"`);
          }
        })
      );
    },
    ToBeDefined() {
      _runner.add(() =>
        test.step(`Expecting context property "${key}" to be defined`, async () => {
          const actual = _runner.context[key];
          if (actual === undefined) {
            throw new Error(`Expected context property "${key}" to be defined, but it is undefined`);
          }
        })
      );
    }
  };
}

export function WaitForFunction(fn: () => boolean | Promise<boolean>) {
  _runner.add(() =>
    test.step(`Waiting for function to return true`, async () => await _page.waitForFunction(fn))
  );
}