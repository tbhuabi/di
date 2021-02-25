import 'reflect-metadata';
import { forwardRef, Inject, Injectable, InjectFlags, Prop, ReflectiveInjector } from '@tanbo/di';

@Injectable()
class Parent {
  name = 'parent'

}
let i = 0

@Injectable()
class Child {
  @Prop(Parent)
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



const injector = new ReflectiveInjector(null, [Child, Parent])

const instance = injector.get(Child);
console.log(instance)
