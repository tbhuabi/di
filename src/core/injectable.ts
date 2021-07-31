import { makeClassDecorator } from './decorators';

export interface InjectableOptions {
  provideIn: 'root'
}

export interface Injectable {
  provideIn?: 'root'
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
