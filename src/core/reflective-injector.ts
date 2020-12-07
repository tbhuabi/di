import { Provider } from './provider';
import { Injector } from './injector';
import { NormalizedProvider, normalizeProviders, ReflectiveDependency } from './reflective-provider';
import { Self, SkipSelf } from './metadata';
import { makeInjectError } from './utils/inject-error';
import { ForwardRef } from './forward-ref';

const reflectiveInjectorErrorFn = makeInjectError('ReflectiveInjectorError');

export class ReflectiveInjector extends Injector {
  private normalizedProviders: NormalizedProvider[];
  private reflectiveValues = new Map<any, any>();


  constructor(public parentInjector: Injector, private staticProviders: Provider[]) {
    super()
    this.normalizedProviders = normalizeProviders(staticProviders);
  }

  get<T>(token: any, notFoundValue?: any): T {
    if (this.reflectiveValues.has(token)) {
      return this.reflectiveValues.get(token);
    }
    for (let i = 0; i < this.normalizedProviders.length; i++) {
      const {provide, deps, factory} = this.normalizedProviders[i];
      if (provide === token || token instanceof ForwardRef && token.getRef() === provide) {
        const ff = factory(this);
        const params = this.resolveDeps(deps || [], notFoundValue);
        const reflectiveValue = ff(...params);
        this.reflectiveValues.set(token, reflectiveValue);
        return reflectiveValue;
      }
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
