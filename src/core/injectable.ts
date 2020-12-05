import { makeClassDecorator } from './decorators';

export interface Injectable {
}

export interface InjectableDecorator {
  (): ClassDecorator;

  new(): Injectable;
}

export const Injectable: InjectableDecorator = function InjectableDecorator(): ClassDecorator {
  if (!(this instanceof InjectableDecorator)) {
    return makeClassDecorator(Injectable);
  }
} as InjectableDecorator
