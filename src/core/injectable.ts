import { makeClassDecorator } from './decorators';

export class Scope {
  constructor(public name: string) {
  }
  toString() {
    return this.name || '[anonymous provide scope]'
  }
}

export type ProvideScope = 'root' | Scope;

export interface InjectableOptions {
  provideIn: ProvideScope
}

export interface Injectable {
  provideIn?: ProvideScope
}

export interface InjectableDecorator {
  (options?: InjectableOptions): ClassDecorator;

  new(options?: InjectableOptions): Injectable;
}

/**
 * 可注入类的装饰器
 */
export const Injectable: InjectableDecorator = function InjectableDecorator(options?: InjectableOptions): ClassDecorator {
  if (this instanceof InjectableDecorator) {
    this.provideIn = options?.provideIn || null
  } else {
    return makeClassDecorator(Injectable, new Injectable(options));
  }
} as InjectableDecorator
