import { makeClassDecorator } from './decorators';

export interface Injectable {
}

export interface InjectableDecorator {
  (): ClassDecorator;

  new(): Injectable;
}

/**
 * 可注入类的装饰器
 */
export const Injectable: InjectableDecorator = function InjectableDecorator(): ClassDecorator {
  if (!(this instanceof InjectableDecorator)) {
    return makeClassDecorator(Injectable);
  }
} as InjectableDecorator
