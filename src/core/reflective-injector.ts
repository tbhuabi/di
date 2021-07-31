import { Provider } from './provider';
import { InjectFlags, Injector } from './injector';
import { NormalizedProvider, normalizeProvider, ReflectiveDependency } from './reflective-provider';
import { Scope, Self, SkipSelf } from './metadata';
import { madeProvideScopeError, makeInjectError } from './utils/inject-error';
import { ForwardRef } from './forward-ref';
import { Type } from './type';
import { InjectionToken } from './injection-token';
import { NullInjector, THROW_IF_NOT_FOUND } from './null-injector';
import { ProvideScope } from './injectable';

const reflectiveInjectorErrorFn = makeInjectError('ReflectiveInjectorError');
const provideScopeError = madeProvideScopeError('ReflectiveInjectorError');

/**
 * 反射注入器
 */
export class ReflectiveInjector extends Injector {
  private readonly normalizedProviders: NormalizedProvider[] = [];
  private readonly recordScopeToken: Type<any>[] = [];
  private readonly recordValues = new Map<Type<any> | InjectionToken<any>, any>();


  constructor(public parentInjector: Injector,
              private staticProviders: Provider[],
              private scope?: ProvideScope) {
    super()
    staticProviders.forEach(provide => {
      const p = normalizeProvider(provide)
      if (p.scope) {
        this.handleProvideScope(p)
        return;
      }
      this.normalizedProviders.push(p);
    })
  }

  /**
   * 用于获取当前注入器上下文内的实例、对象或数据
   * @param token 访问 token
   * @param notFoundValue 如未查找到的返回值
   * @param flags 查询规则
   */
  get<T>(token: Type<T> | InjectionToken<T>, notFoundValue: T = THROW_IF_NOT_FOUND as T, flags?: InjectFlags): T {
    flags = flags || InjectFlags.Default;
    if (flags === InjectFlags.SkipSelf) {
      if (this.parentInjector) {
        return this.parentInjector.get(token, notFoundValue);
      }
      if (notFoundValue !== THROW_IF_NOT_FOUND) {
        return notFoundValue;
      }
      throw reflectiveInjectorErrorFn(token);
    }
    if (this.recordValues.has(token)) {
      return this.recordValues.get(token);
    }
    if (!(token instanceof InjectionToken)) {
      const normalizedProvider = normalizeProvider(token)
      if (normalizedProvider.scope && !this.recordScopeToken.includes(token)) {
        this.handleProvideScope(normalizedProvider)
        this.recordScopeToken.push(token);
      }
    }

    for (let i = 0; i < this.normalizedProviders.length; i++) {
      const {provide, deps, generateFactory} = this.normalizedProviders[i];
      if (provide === token) {
        const factory = generateFactory(this, (token: Type<any>, value: any) => {
          this.recordValues.set(token, value)
        });
        const params = this.resolveDeps(deps || [], notFoundValue);
        const reflectiveValue = factory(...params);
        this.recordValues.set(token, reflectiveValue);
        return reflectiveValue
      }
    }

    if (flags === InjectFlags.Self) {
      if (notFoundValue === THROW_IF_NOT_FOUND) {
        throw reflectiveInjectorErrorFn(token);
      }
      return notFoundValue
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

  private handleProvideScope(normalizedProvider: NormalizedProvider) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let injector: ReflectiveInjector = this;
    while (injector) {
      if (injector.scope === normalizedProvider.scope) {
        for (const item of injector.normalizedProviders) {
          if (item.scope === normalizedProvider.scope) {
            return;
          }
        }
        injector.normalizedProviders.push(normalizedProvider)
        return
      } else {
        injector = injector.parentInjector as ReflectiveInjector
        if (injector instanceof NullInjector) {
          break;
        }
      }
    }
    throw provideScopeError(normalizedProvider.scope)
  }

  /**
   * 解决并获取依赖参数
   * @param deps 依赖规则
   * @param notFoundValue 未查找到时的返回值
   * @private
   */
  private resolveDeps(deps: ReflectiveDependency[], notFoundValue): any[] {
    return deps.map(dep => {
      let reflectiveValue;
      const tryValue = {};
      const injectToken = dep.injectKey instanceof ForwardRef ? dep.injectKey.getRef() : dep.injectKey;
      if (dep.visibility instanceof Self) {
        reflectiveValue = this.get(injectToken, tryValue, InjectFlags.Self);
      } else if (dep.visibility instanceof SkipSelf) {
        if (this.parentInjector) {
          reflectiveValue = this.parentInjector.get(injectToken, tryValue, dep.optional ? InjectFlags.Optional : InjectFlags.Default);
        } else {
          if (dep.optional) {
            if (notFoundValue === THROW_IF_NOT_FOUND) {
              return null;
            }
          }
          throw reflectiveInjectorErrorFn(injectToken);
        }
      } else if (dep.visibility instanceof Scope) {
        const scope = dep.visibility.scope;
        const s = scope instanceof ForwardRef ? scope.getRef() : scope;
        reflectiveValue = this.get(injectToken, tryValue, this.scope === s ? InjectFlags.Self : InjectFlags.Default)
      } else {
        reflectiveValue = this.get(injectToken, tryValue);
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
