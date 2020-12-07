import 'reflect-metadata';
import { forwardRef, Inject, Injectable, NullInjector, ReflectiveInjector, Self, SkipSelf } from '@tanbo/di';
@Injectable()
class Parent {
  name = 'parent'
  constructor(@Inject(forwardRef(() => Child)) public child: Child) {
  }
}

@Injectable()
class Child {
  name = 'child'
}

class Child2 extends Child {
  name = 'child2'
}



const injector = new ReflectiveInjector(new NullInjector(), [Parent, {
  provide: Child,
  useClass: Child2
}, {
  provide: 'test',
  useValue: 'test'
}])

const instance = injector.get(Parent);
// injector.get(Test);

console.log(instance)
