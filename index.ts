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
class Test1 {

}

@Injectable()
class Test2 {
  constructor(private test1: Test1) {
  }
}
const value = {
  name: 'name'
}
const injector = new ReflectiveInjector(null, [{
  provide: Test2,
  useValue: value
}])

console.log(injector.get(Test2))
