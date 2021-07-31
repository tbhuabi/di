import 'reflect-metadata';
import {
  forwardRef,
  Inject,
  Injectable,
  InjectFlags, InjectionToken,
  Optional,
  Prop, Provider, ProvideScopeModule,
  ReflectiveInjector,
  Self,
  SkipSelf
} from '@tanbo/di';
const scope = new ProvideScopeModule('scope')
const rootInjector = new ReflectiveInjector(null, [])

@Injectable({
  provideIn: scope
})
class Test {
  name = 'test'
}
const scopeInjector = new ReflectiveInjector(rootInjector, [], scope)

const injector = new ReflectiveInjector(scopeInjector, [Test])

const instance1= scopeInjector.get(Test)
const instance2 = injector.get(Test)

console.log(injector)
