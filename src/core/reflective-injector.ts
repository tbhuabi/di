import { Provider } from './provider';
import { Injector } from './injector';
import { NormalizedProvider, normalizeProviders, ReflectiveDependency } from './reflective-provider';
import { Self, SkipSelf } from './metadata';
import { makeInjectError } from './utils/inject-error';
import { ForwardRef } from './forward-ref';
import { Type } from './type';
import { InjectionToken } from './injection-token';

const reflectiveInjectorErrorFn = makeInjectError('ReflectiveInjectorError');

export class ReflectiveInjector extends Injector {
  private readonly normalizedProviders: NormalizedProvider[];
  private readonly reflectiveValues = new Map<any, any>();


  constructor(public parentInjector: Injector, private staticProviders: Provider[]) {
    super()
    this.normalizedProviders = normalizeProviders(staticProviders);
  }

  get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T): T {
    if (this.reflectiveValues.has(token)) {
      return this.reflectiveValues.get(token);
    }
    for (let i = 0; i < this.normalizedProviders.length; i++) {
      const {provide, deps, factory} = this.normalizedProviders[i];
      if (provide === token || token instanceof ForwardRef && token.getRef() === provide) {
        const ff = factory(this, (token: Type<any>, value: any) => {
          this.reflectiveValues.set(token, value)
        });
        const params = this.resolveDeps(deps || [], notFoundValue);
        let reflectiveValue = ff(...params);
        this.reflectiveValues.set(token, reflectiveValue);
        return reflectiveValue;
      }
    }
    if (this.parentInjector) {
      return this.parentInjector.get(token, notFoundValue);
    }
    throw reflectiveInjectorErrorFn(token);
  }

  private resolveDeps(deps: ReflectiveDependency[], notFoundValue): any[] {
    return deps.map(dep => {
      let reflectiveValue;
      if (dep.visibility instanceof Self) {
        reflectiveValue = this.get(dep.injectKey);
      } else if (dep.visibility instanceof SkipSelf) {
        if (this.parentInjector) {
          reflectiveValue = this.parentInjector.get(dep.injectKey, notFoundValue);
        } else {
          throw reflectiveInjectorErrorFn(dep.injectKey);
        }
      }
      reflectiveValue = this.get(dep.injectKey) || this.parentInjector?.get(dep.injectKey);
      if (reflectiveValue === null || typeof reflectiveValue === 'undefined' && !dep.optional) {
        if (!dep.optional) {
          throw reflectiveInjectorErrorFn(dep.injectKey);
        } else {
          reflectiveValue = null
        }
      }
      return reflectiveValue;
    })
  }
}
