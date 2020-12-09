import { Type } from './type';
import { InjectionToken } from './injection-token';

export abstract class Injector {
  abstract parentInjector: Injector;
  abstract get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T): T
}


