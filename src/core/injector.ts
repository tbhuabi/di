import { Type } from './type';
import { InjectionToken } from './injection-token';

export enum InjectFlags {
  Default,
  Self,
  SkipSelf,
  Optional
}

export abstract class Injector {
  abstract parentInjector: Injector;

  abstract get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T, flags?: InjectFlags): T
}


