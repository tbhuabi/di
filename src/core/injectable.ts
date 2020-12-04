import { makeClassDecorator } from './decorators';

export interface Injectable {
}

export interface InjectableDecorator {
  (): any;

  new(): Injectable;
}

export const Injectable: InjectableDecorator = function InjectableDecorator(): any {
  if (!(this instanceof InjectableDecorator)) {
    return makeClassDecorator(Injectable);
  }
} as InjectableDecorator
