import 'reflect-metadata';
import { forwardRef, Inject, Injectable, InjectFlags, ReflectiveInjector } from '@tanbo/di';

@Injectable()
class Parent {
  name = 'parent'
  constructor(@Inject(forwardRef(() => Child)) public child: Child) {
  }
}
let i = 0

@Injectable()
class Child {
  name = 'child'
  index: number
  constructor() {
    this.index= i;
    i++
  }
}

class Child2 extends Child {
  name = 'child2'
}



const injector = new ReflectiveInjector(null, [Parent, Child])

const instance = injector.get(Parent);
// console.log(instance)
console.log(injector.get(Child2, null));

const childInjector = new ReflectiveInjector(injector, [Child, Child2])

const instance1 = childInjector.get(Child2, 3 as any, InjectFlags.SkipSelf)
console.log(instance1);
