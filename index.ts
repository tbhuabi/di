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
class Test0 {
  name = 'test0'
}
@Injectable()
class Test1 {
  constructor(@Optional() private test0: Test0) {
  }
}

@Injectable()
class Test2 {
  constructor(private child: Test1) {
  }
}
const value = {
  name: 'name'
}
const injector = new ReflectiveInjector(null, [Test1, Test2])
console.log(injector.get(Test2))
