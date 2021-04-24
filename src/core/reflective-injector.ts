import { Provider } from './provider';
import { InjectFlags, Injector } from './injector';
import { NormalizedProvider, normalizeProviders, ReflectiveDependency } from './reflective-provider';
import { Self, SkipSelf } from './metadata';
import { makeInjectError } from './utils/inject-error';
import { ForwardRef } from './forward-ref';
import { Type } from './type';
import { InjectionToken } from './injection-token';
import { THROW_IF_NOT_FOUND } from './null-injector';

const reflectiveInjectorErrorFn = makeInjectError('ReflectiveInjectorError');

export class ReflectiveInjector extends Injector {
  private readonly normalizedProviders: NormalizedProvider[];
  private readonly reflectiveValues = new Map<any, any>();


  constructor(public parentInjector: Injector, private staticProviders: Provider[]) {
    super()
    this.normalizedProviders = normalizeProviders(staticProviders);
  }

  get<T>(token: Type<T> | InjectionToken<T>, notFoundValue: T = THROW_IF_NOT_FOUND as T, flags?: InjectFlags): T {
    flags = flags || InjectFlags.Default;
    if (flags === InjectFlags.SkipSelf) {
      if (this.parentInjector) {
        return this.parentInjector.get(token, notFoundValue);
      }
      throw reflectiveInjectorErrorFn(token);
    }
    if (this.reflectiveValues.has(token)) {
      return this.reflectiveValues.get(token);
    }
    for (let i = 0; i < this.normalizedProviders.length; i++) {
      const {provide, deps, generateFactory} = this.normalizedProviders[i];
      if (provide === token) {
        const factory = generateFactory(this, (token: Type<any>, value: any) => {
          this.reflectiveValues.set(token, value)
        });
        const params = this.resolveDeps(deps || [], notFoundValue);
        let reflectiveValue = factory(...params);
        this.reflectiveValues.set(token, reflectiveValue);
        return reflectiveValue
      }
    }

    if (flags === InjectFlags.Self && notFoundValue === THROW_IF_NOT_FOUND) {
      throw reflectiveInjectorErrorFn(token);
    }
    if (this.parentInjector) {
      return this.parentInjector.get(token, notFoundValue,
        flags === InjectFlags.Optional ? InjectFlags.Optional : InjectFlags.Default);
    }
    if (notFoundValue === THROW_IF_NOT_FOUND) {
      throw reflectiveInjectorErrorFn(token);
    }
    return notFoundValue;
  }

  private resolveDeps(deps: ReflectiveDependency[], notFoundValue): any[] {
    return deps.map(dep => {
      let reflectiveValue;
      const tryValue = {};
      const injectToken = dep.injectKey instanceof ForwardRef ? dep.injectKey.getRef() : dep.injectKey;
      if (dep.visibility instanceof Self) {
        reflectiveValue = this.get(injectToken, tryValue, InjectFlags.Self);
      } else if (dep.visibility instanceof SkipSelf) {
        if (this.parentInjector) {
          reflectiveValue = this.parentInjector.get(injectToken, tryValue, InjectFlags.Default);
        } else {
          throw reflectiveInjectorErrorFn(injectToken);
        }
      } else {
        reflectiveValue = this.get(injectToken, tryValue) || this.parentInjector?.get(injectToken, tryValue);
      }
      if (reflectiveValue === tryValue) {
        if (dep.optional) {
          if (notFoundValue === THROW_IF_NOT_FOUND) {
            return null;
          }
          return notFoundValue;
        }
        throw reflectiveInjectorErrorFn(injectToken);
      }
      return reflectiveValue;
    })
  }
}
