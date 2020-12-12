import {
  ClassProvider,
  ConstructorProvider,
  ExistingProvider,
  FactoryProvider,
  Provider, TypeProvider,
  ValueProvider
} from './provider';
import { Injector } from './injector';
import { Inject, Optional, Self, SkipSelf } from './metadata';
import { Annotations } from './annotations';
import { Injectable } from './injectable';
import { Type } from './type';

export interface ReflectiveDependency {
  injectKey: any;
  visibility: SkipSelf | Self;
  optional: boolean;
}

export interface NormalizedProvider {
  provide: any,
  factory: (injector: Injector) => (...args: any[]) => any;
  deps: ReflectiveDependency[]
}

export function normalizeProviders(providers: Provider[]): NormalizedProvider[] {
  return providers.map(item => {
    if ((item as ValueProvider).useValue) {
      return normalizeValueProviderFactory(item as ValueProvider);
    } else if ((item as ClassProvider).useClass) {
      return normalizeClassProviderFactory(item as ClassProvider);
    } else if ((item as ExistingProvider).useExisting) {
      return normalizeExistingProviderFactory(item as ExistingProvider);
    } else if ((item as FactoryProvider).useFactory) {
      return normalizeFactoryProviderFactory(item as FactoryProvider);
    } else if ((item as ConstructorProvider).provide) {
      return normalizeConstructorProviderFactory(item as ConstructorProvider);
    } else {
      return normalizeTypeProviderFactory(item as TypeProvider);
    }
  })
}

function normalizeValueProviderFactory(provider: ValueProvider): NormalizedProvider {
  return {
    provide: provider.provide,
    factory() {
      return function () {
        return provider.useValue
      }
    },
    deps: []
  }
}

function normalizeClassProviderFactory(provider: ClassProvider): NormalizedProvider {
  let deps: ReflectiveDependency[]
  if (provider.deps) {
    deps = normalizeDeps(provider.deps);
  } else {
    deps = normalizeDeps(resolveClassParams(provider.useClass));
  }
  return {
    provide: provider.provide,
    factory() {
      return function (...args: any[]) {
        return new provider.useClass(...args);
      }
    },
    deps
  }
}

function normalizeExistingProviderFactory(provider: ExistingProvider): NormalizedProvider {
  return {
    provide: provider.provide,
    factory(injector: Injector) {
      return function () {
        return injector.get(provider.useExisting)
      }
    },
    deps: []
  }
}

function normalizeFactoryProviderFactory(provider: FactoryProvider): NormalizedProvider {
  return {
    provide: provider.provide,
    factory() {
      return function (...args: any[]) {
        return provider.useFactory(...args);
      }
    },
    deps: normalizeDeps(provider.deps || [])
  }
}

function normalizeConstructorProviderFactory(provider: ConstructorProvider): NormalizedProvider {
  return normalizeClassProviderFactory({
    ...provider,
    useClass: provider.provide
  })
}

function normalizeTypeProviderFactory(provider: TypeProvider): NormalizedProvider {
  return normalizeClassProviderFactory({
    provide: provider,
    useClass: provider
  })
}

function resolveClassParams(construct: Type<any>) {
  const annotations = (construct as any as { __annotations__: Annotations }).__annotations__;
  if (typeof annotations === 'undefined' || typeof annotations.getClassMetadata(Injectable) === 'undefined') {
    throw new Error(`class \`${construct.name}\` is not injectable!`);
  }

  const deps = (annotations.getClassMetadata(Injectable).arguments || []).map(i => [i]);
  (annotations.getParamMetadata(Inject) || []).forEach(item => {
    deps[item.parameterIndex].push(item.params[0].token);
  });
  (annotations.getParamMetadata(Self) || []).map(item => {
    deps[item.parameterIndex].push(new Self());
  });
  (annotations.getParamMetadata(SkipSelf) || []).map(item => {
    deps[item.parameterIndex].push(new SkipSelf());
  });
  (annotations.getParamMetadata(Optional) || []).forEach(item => {
    deps[item.parameterIndex].push(new Optional());
  })
  return deps;
}

function normalizeDeps(deps: any[]): ReflectiveDependency[] {
  return deps.map(dep => {
    const r: ReflectiveDependency = {
      injectKey: null,
      optional: false,
      visibility: null
    }
    if (!Array.isArray(dep)) {
      r.injectKey = dep
    } else {
      for (let i = 0; i < dep.length; i++) {
        const item = dep[i];
        if (item instanceof Inject) {
          r.injectKey = item.token
        } else if (item instanceof Self || item instanceof SkipSelf) {
          r.visibility = item
        } else if (item instanceof Optional) {
          r.optional = true
        } else {
          r.injectKey = item;
        }
      }
    }
    return r;
  })
}
