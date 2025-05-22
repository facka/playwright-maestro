"use strict;"

import { expect, Locator, test } from '@playwright/test';
import { CommandRunner } from '../CommandRunner';
import { UIComponent } from '../UIComponent';

let _page: any;
let _runner: CommandRunner;

function resolveUIComponent(
  input: string | Locator | UIComponent
): { locator: Locator; description: string } {
  console.log('Input:', input);
  if (isUIComponent(input)) {
    const selectors = [];
    let current: UIComponent | undefined = input;

    while (current) {
      selectors.unshift(current.selector);
      current = current.parent;
    }

    let locator = _page.locator(selectors[0]);
    for (let i = 1; i < selectors.length; i++) {
      locator = locator.locator(selectors[i]);
    }

    return {
      locator,
      description: input.toString(),
    };
  } else if (typeof input === 'string') {
    return {
      locator: _page.locator(input),
      description: input,
    };
  } else if (input && typeof input === 'object' && 'click' in input) {
    // Assuming it's a Playwright Locator if it has a `click` method
    return {
      locator: input as Locator,
      description: input.toString(),
    };
  } else {
    throw new Error(
      `Invalid input type for resolveUIComponent. Expected string, Locator, or UIComponent, but received: ${typeof input}`
    );
  }
}

function isUIComponent(input: any): input is UIComponent {
  return (
    input &&
    typeof input === 'object' &&
    'selector' in input &&
    'name' in input &&
    typeof input.selector === 'string' && 
    typeof input.name === 'string'
  );
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

export function Step(name: string, fn: (params?: any) => any) {
  return (params?: any) => {
    if (!_runner) {
      throw new Error('CommandRunner is not initialized. Call setup() before using this function.');
    }
    _runner.add(async () => {
      await test.step(`${name}${params ? ` (${JSON.stringify(params)})` : ''}`, async () => {
        const tempQueue: (() => Promise<any>)[] = [];
        const originalAdd = _runner.add.bind(_runner);
        _runner.add = (step) => tempQueue.push(step);
        fn(params);
        _runner.add = originalAdd;
        for (const step of tempQueue) {
          await step();
        }
      });
    });
    return params
  };
}

export function ClickOn(input: string | Locator | UIComponent) {
  const { locator, description } = resolveUIComponent(input);
  _runner.add(() =>
    test.step(`Clicking on element: ${description}`, () => locator.click())
  );
}

export function DoubleClickOn(input: string | Locator | UIComponent) {
  const { locator, description } = resolveUIComponent(input);
  _runner.add(() =>
    test.step(`Double-clicking on element: ${description}`, () => locator.dblclick())
  );
}

export function WaitUntilURLIs(url: string | RegExp) {
  _runner.add(() =>
    test.step(`Waiting until URL is: ${url}`, () => _page.waitForURL(url))
  );
}

export function Enter(text: string) {
  return {
    into(input: string | Locator | UIComponent) {
      console.log('typeof input:', typeof input);
      console.log('instanceof UIComponent?:', input instanceof UIComponent);
      const { locator, description } = resolveUIComponent(input);
      console.log(`Entering text "${text}" into element: ${description}`);
      console.log(`Locator: ${locator}`);
      _runner.add(() =>
        test.step(`Entering text "${text}" into element: ${description}`, () => locator.fill(text))
      );
    }
  };
}

export function PressKeyOn(input: string | Locator | UIComponent, key: string) {
  const { locator, description } = resolveUIComponent(input);
  _runner.add(() =>
    test.step(`Pressing key "${key}" on element: ${description}`, () => locator.press(key))
  );
}

export function HoverOver(input: string | Locator | UIComponent) {
  const { locator, description } = resolveUIComponent(input);
  _runner.add(() =>
    test.step(`Hovering over element: ${description}`, () => locator.hover())
  );
}

export function PressEnterOn(input: string | Locator | UIComponent) {
  PressKeyOn(input, 'Enter');
}

export function PressBackspaceOn(input: string | Locator | UIComponent) {
  PressKeyOn(input, 'Backspace');
}

export function PressEscapeOn(input: string | Locator | UIComponent) {
  PressKeyOn(input, 'Escape');
}

export function Expect(input: string | Locator | UIComponent) {
  const { locator, description } = resolveUIComponent(input);
  return {
    ToHaveText(expected: string | RegExp | string[]) {
      _runner.add(() =>
        test.step(`Expecting element "${description}" to have text: ${expected}`, async () => {
          await expect(locator).toHaveText(expected);
        })
      );
    },
    IsVisible() {
      _runner.add(() =>
        test.step(`Expecting element "${description}" to be visible`, async () => {
          const isVisible = await locator.isVisible();
          if (!isVisible) {
            throw new Error(`Expected element "${description}" to be visible, but it is not`);
          }
        })
      );
    },
    IsHidden() {
      _runner.add(() =>
        test.step(`Expecting element "${description}" to be hidden`, async () => {
          const isHidden = await locator.isHidden();
          if (!isHidden) {
            throw new Error(`Expected element "${description}" to be hidden, but it is visible`);
          }
        })
      );
    },
    IsEmpty() {
      _runner.add(() =>
        test.step(`Expecting input "${description}" to be empty`, async () => {
          const value = await locator.inputValue();
          if (value !== '') {
            throw new Error(`Expected input to be empty, but got "${value}"`);
          }
        })
      );
    },
    HasAttribute(attribute: string, value: string) {
      _runner.add(() =>
        test.step(
          `Expecting element "${description}" to have attribute "${attribute}" with value "${value}"`,
          async () => {
            const actual = await locator.getAttribute(attribute);
            if (actual !== value) {
              throw new Error(
                `Expected element "${description}" to have attribute "${attribute}" with value "${value}", but got "${actual}"`
              );
            }
          }
        )
      );
    },
    CountIs(expectedCount: number) {
      _runner.add(() =>
        test.step(`Expecting element "${description}" to have count: ${expectedCount}`, async () => {
          const count = await locator.count();
          if (count !== expectedCount) {
            throw new Error(
              `Expected "${description}" to have ${expectedCount} elements, but found ${count}`
            );
          }
        })
      );
    }
  };
}

export function SaveResultAs(name: string, fn: () => Promise<any>) {
  _runner.add(() =>
    /* test.step(`Saving result as "${name}"`, async () => {
      const value = await _page.evaluate(fn);
      _runner.set(name, value);
    }) */
    test.step(`Evaluating function "${fn}"`, async () => {
      const value = await _page.evaluate(fn);
      _runner.set(name, value);
    })
  );
  
  _runner.add(() =>
    test.step(`Saving result '${_runner.get(name)}' as '${name}'`, async () => {
      console.log(`Saving result "${_runner.get(name)}" as "${name}"`);
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
          expect(actual).toBe(expected)
        })
      );
    },
    ToContain(expected: any) {
      _runner.add(() =>
        test.step(`Expecting context property "${key}" to contain "${expected}"`, async () => {
          const actual = _runner.context[key];
          expect(actual).toContain(expected)
        })
      );
    },
    ToBeDefined() {
      _runner.add(() =>
        test.step(`Expecting context property "${key}" to be defined`, async () => {
          const actual = _runner.context[key];
          expect(actual).toBeDefined()
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