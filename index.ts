import 'reflect-metadata';
import { forwardRef, Inject, Injectable, InjectFlags, Prop, ReflectiveInjector } from '@tanbo/di';

class Parent {
  name = 'parent'

}
let i = 0

@Injectable()
class Child {

  index: number
  constructor(@Inject(Parent)private parent: Parent) {
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
