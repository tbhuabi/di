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

@Injectable()
class Base {
}

@Injectable()
class Extends {
  constructor() {
    console.log('-------')
  }
}

const injector = new ReflectiveInjector(null, [{
  provide: Base,
  useClass: Extends
}])

const childInjector = new ReflectiveInjector(injector, [{
  provide: Base,
  useClass: Extends
}])

const instance1 = injector.get(Base)
const instance2 = childInjector.get(Base)
console.log(instance1 === instance2)
