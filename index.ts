import 'reflect-metadata';
import {
  forwardRef,
  Inject,
  Injectable,
  InjectFlags, InjectionToken,
  Optional,
  Prop, Provider, Scope,
  ReflectiveInjector,
  Self,
  SkipSelf, Type
} from '@tanbo/di';
const scope = new Scope('scope')
const rootInjector = new ReflectiveInjector(null, [], scope)

@Injectable({
  provideIn: scope
})
class Test {
  name = 'test'
}
const injector = new ReflectiveInjector(rootInjector, [])

const testInstance = injector.get(Test)

console.log(testInstance)
