import { Type } from './type';
import { InjectionToken } from './injection-token';

export enum InjectFlags {
  Default = 'Default',
  Self = 'Self',
  SkipSelf = 'SkipSelf',
  Optional = 'Optional'
}

export abstract class Injector {
  abstract parentInjector: Injector;

  abstract get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T, flags?: InjectFlags): T
}


