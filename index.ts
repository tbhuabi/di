import 'reflect-metadata';
import { forwardRef, Inject, Injectable, InjectFlags, Prop, ReflectiveInjector } from '@tanbo/di';

@Injectable()
class Parent {
  name = 'parent'
  constructor(private child: Child) {
  }
}
let i = 0

@Injectable()
class Child {

  index: number
  constructor() {
    this.index= i;
    i++
  }

  show() {

  }
}

class Child2 extends Child {
  name = 'child2'
}



const injector = new ReflectiveInjector(null, [Child, Parent])

const instance = injector.get(Parent);
console.log(instance)
