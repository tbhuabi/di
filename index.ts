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
  SkipSelf
} from '@tanbo/di';
const scope = new Scope('scope')

@Injectable({
  provideIn: scope
})
class Test {
  name = 'test'
}

@Injectable()
class Test2 {
  constructor(@Optional()public test: Test) {
  }
}
const rootInjector = new ReflectiveInjector(null, [], scope)
const injector = new ReflectiveInjector(rootInjector, [Test2])

const instance = injector.get(Test2)
console.log(instance)
