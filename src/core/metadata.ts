import { makeParamDecorator, makePropertyDecorator } from './decorators';
import { AbstractType, Type } from './type';
import { InjectFlags, Injector } from './injector';
import { InjectionToken } from './injection-token';
import { ForwardRef } from './forward-ref';
import { THROW_IF_NOT_FOUND } from './null-injector';

export interface Inject {
  token: InjectionToken<any> | Type<any> | ForwardRef<InjectionToken<any> | Type<any>>;
}

export interface InjectDecorator {
  (token: InjectionToken<any> | Type<any> | ForwardRef<InjectionToken<any> | Type<any>>): ParameterDecorator;

  new(token: InjectionToken<any> | Type<any> | ForwardRef<InjectionToken<any> | Type<any>>): Inject;
}

/**
 * 构造函数参数装饰器，用于改变注入 token
 */
export const Inject: InjectDecorator = function InjectDecorator(token: InjectionToken<any> | Type<any> | ForwardRef<InjectionToken<any> | Type<any>>): ParameterDecorator {
  if (this instanceof Inject) {
    this.token = token
  } else {
    return makeParamDecorator(Inject, new Inject(token));
  }
} as InjectDecorator

export interface Self {
}

export interface SelfDecorator {
  (): ParameterDecorator;

  new(): Self;
}

export const Self: SelfDecorator = function SelfDecorator(): ParameterDecorator {
  if (!(this instanceof Self)) {
    return makeParamDecorator(Self, new Self());
  }
} as SelfDecorator;

export interface SkipSelf {
}

export interface SkipSelfDecorator {
  (): ParameterDecorator;

  new(): SkipSelf;
}

export const SkipSelf: SkipSelfDecorator = function SkipSelfDecorator(): ParameterDecorator {
  if (!(this instanceof SkipSelf)) {
    return makeParamDecorator(SkipSelf, new SkipSelf());
  }
} as SkipSelfDecorator;

export interface Optional {
}

export interface OptionalDecorator {
  (): ParameterDecorator;

  new(): Optional;
}

export const Optional: OptionalDecorator = function OptionalDecorator(): ParameterDecorator {
  if (!(this instanceof Optional)) {
    return makeParamDecorator(Optional, new Optional());
  }
} as OptionalDecorator;

export interface TypeDecorator {
  <T extends Type<any>>(type: T): T;

  (target: unknown, propertyKey?: string | symbol, parameterIndex?: number): void;
}

export interface Prop {
}

export interface PropDecorator {
  <T>(token?: Type<T> | AbstractType<T> | InjectionToken<T> | ForwardRef<T>,
      notFoundValue?: T,
      flags?: InjectFlags): PropertyDecorator;

  new(token: any): Prop;
}

export const Prop: PropDecorator = function PropDecorator<T>(token?: Type<T> | AbstractType<T> | InjectionToken<T> | ForwardRef<T>, notFoundValue: T = THROW_IF_NOT_FOUND as T, flags?: InjectFlags): PropertyDecorator {
  if (!(this instanceof Prop)) {
    return makePropertyDecorator(Prop, token, function (instance: any, propertyName: string, token: any, injector: Injector) {
      instance[propertyName] = injector.get(token instanceof ForwardRef ? token.getRef() : token, notFoundValue, flags);
    });
  }
} as PropDecorator
