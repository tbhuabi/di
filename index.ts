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

abstract class Test {
  name: string
}
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
const injector = new ReflectiveInjector(null, [Test1, Test2])
injector.get(Test)
console.log(injector.get(Test2))
