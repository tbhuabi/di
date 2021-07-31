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

@Injectable()
class Test {
  name = 'test'
}

const injectionToken = new InjectionToken('')
const injector = new ReflectiveInjector(rootInjector, [{
  provide: injectionToken,
  useValue: null
}])

const testInstance = injector.get(injectionToken)

console.log(testInstance)
