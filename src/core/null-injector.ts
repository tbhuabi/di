import { Injector } from './injector';
import { makeInjectError } from './utils/_api';

export const THROW_IF_NOT_FOUND: any = {
  __debug_value__: 'THROW_IF_NOT_FOUND'
};

const nullInjectorErrorFn = makeInjectError('NullInjectorError');

export class NullInjector implements Injector {
  parentInjector = null;
  get(token: any, notFoundValue: any = THROW_IF_NOT_FOUND): any {
    if (notFoundValue === THROW_IF_NOT_FOUND) {
      throw nullInjectorErrorFn(token);
    }
    return notFoundValue;
  }
}
