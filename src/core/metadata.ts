import { makeParamDecorator, makePropertyDecorator } from './decorators';
import { Type } from './type';
import { InjectFlags, Injector } from './injector';
import { InjectionToken } from './injection-token';
import { ForwardRef } from './forward-ref';
import { THROW_IF_NOT_FOUND } from './null-injector';

export interface Inject {
  token: any;
}

export interface InjectDecorator {
  (token: any): ParameterDecorator;

  new(token: any): Inject;
}

/**
 * 构造函数参数装饰器，用于改变注入 token
 */
export const Inject: InjectDecorator = function InjectDecorator(token: any): ParameterDecorator {
  if (this instanceof InjectDecorator) {
    this.token = token
  } else {
    return makeParamDecorator(Inject, {
      metadataGenerator() {
        return new Inject(token);
      },
      reflectiveController(dep) {
        dep.injectKey = token instanceof ForwardRef ? token.getRef() : token;
      }
    }, token);
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
    return makeParamDecorator(Self, {
      metadataGenerator() {
        return new Self()
      },
      reflectiveController(dep) {
        dep.visibility = Self;
      }
    });
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
    return makeParamDecorator(SkipSelf, {
      metadataGenerator() {
        return new SkipSelf()
      },
      reflectiveController(dep) {
        dep.visibility = SkipSelf;
      }
    });
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
    return makeParamDecorator(Optional, {
      metadataGenerator() {
        return new Optional()
      },
      reflectiveController(dep) {
        dep.visibility = Optional;
      }
    });
  }
} as OptionalDecorator;

export interface TypeDecorator {
  <T extends Type<any>>(type: T): T;

  (target: unknown, propertyKey?: string | symbol, parameterIndex?: number): void;
}

export interface Prop {
}

export interface PropDecorator {
  <T>(token: Type<T> | InjectionToken<T> | ForwardRef<T>, notFoundValue?: T, flags?: InjectFlags): PropertyDecorator;

  new(token: any): Prop;
}

export const Prop: PropDecorator = function PropDecorator<T>(token: Type<T> | InjectionToken<T>, notFoundValue: T = THROW_IF_NOT_FOUND as T, flags?: InjectFlags): PropertyDecorator {
  if (!(this instanceof Prop)) {
    return makePropertyDecorator(Prop, function (instance: any, propertyName: string, injector: Injector) {
      instance[propertyName] = injector.get(token instanceof ForwardRef ? token.getRef() : token, notFoundValue, flags);
    });
  }
} as PropDecorator
