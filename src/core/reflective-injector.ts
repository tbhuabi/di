import { Provider } from './provider';
import { InjectFlags, Injector } from './injector';
import { NormalizedProvider, normalizeProvider, ReflectiveDependency } from './reflective-provider';
import { Self, SkipSelf } from './metadata';
import { makeProvideScopeError, makeInjectError } from './utils/inject-error';
import { ForwardRef } from './forward-ref';
import { AbstractType, Type } from './type';
import { InjectionToken } from './injection-token';
import { NullInjector, THROW_IF_NOT_FOUND } from './null-injector';
import { Injectable, Scope } from './injectable';
import { getAnnotations } from './decorators';

const reflectiveInjectorErrorFn = makeInjectError('ReflectiveInjectorError');
const provideScopeError = makeProvideScopeError('ReflectiveInjectorError');

/**
 * 反射注入器
 */
export class ReflectiveInjector extends Injector {
  private readonly normalizedProviders: NormalizedProvider[];
  private readonly recordValues = new Map<Type<any> | AbstractType<any> | InjectionToken<any>, any>();

  constructor(public parentInjector: Injector,
              private staticProviders: Provider[],
              private scope?: Scope) {
    super()
    this.normalizedProviders = staticProviders.map(provide => {
      return normalizeProvider(provide)
    })
  }

  /**
   * 用于获取当前注入器上下文内的实例、对象或数据
   * @param token 访问 token
   * @param notFoundValue 如未查找到的返回值
   * @param flags 查询规则
   */
  get<T>(token: Type<T> | AbstractType<T> | InjectionToken<T>, notFoundValue: T = THROW_IF_NOT_FOUND as T, flags?: InjectFlags): T {
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

    for (let i = 0; i < this.normalizedProviders.length; i++) {
      const normalizedProvider = this.normalizedProviders[i];
      if (normalizedProvider.provide === token) {
        return this.getValue(token, notFoundValue, normalizedProvider);
      }
    }

    if (!(token instanceof InjectionToken)) {
      const scope = getAnnotations(token).getClassMetadata(Injectable)?.metadata.provideIn
      if (scope) {
        const normalizedProvider = normalizeProvider(token)
        if (this.scope === scope) {
          this.normalizedProviders.push(normalizedProvider)
          return this.getValue(token, notFoundValue, normalizedProvider);
        }
        const parentInjector = this.parentInjector;

        if (!parentInjector || parentInjector instanceof NullInjector) {
          if (normalizedProvider.scope === 'root') {
            this.normalizedProviders.push(normalizedProvider)
            return this.getValue(token, notFoundValue, normalizedProvider);
          }
          if (notFoundValue !== THROW_IF_NOT_FOUND) {
            return notFoundValue;
          }
          throw provideScopeError(normalizedProvider.scope)
        }
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

  private getValue<T>(token: Type<T> | AbstractType<T> | InjectionToken<T>, notFoundValue: T = THROW_IF_NOT_FOUND as T, normalizedProvider: NormalizedProvider) {
    const {generateFactory, deps} = normalizedProvider;
    const params = this.resolveDeps(deps || [], notFoundValue);
    let value = this.recordValues.get(token)
    if (value) {
      return value
    }
    const factory = generateFactory(this, (token: Type<any>, value: any) => {
      this.recordValues.set(token, value)
    });
    value = factory(...params);
    this.recordValues.set(token, value);
    return value;
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
          reflectiveValue = this.parentInjector.get(injectToken, tryValue);
        } else {
          if (dep.optional) {
            if (notFoundValue === THROW_IF_NOT_FOUND) {
              return null;
            }
          }
          throw reflectiveInjectorErrorFn(injectToken);
        }
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
