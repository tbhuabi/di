import 'reflect-metadata';
import { Inject, Injectable, NullInjector, ReflectiveInjector, Self, SkipSelf } from '@tanbo/di';

@Injectable()
class Child {
  name = 'child'
}

class Child2 extends Child {
  name = 'child2'
}

@Injectable()
class Parent {
  name = 'parent'
  constructor(public child: Child, @Inject('test') public d: string, @SkipSelf() @Inject('test') public f: string) {
  }
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
