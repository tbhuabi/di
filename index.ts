import 'reflect-metadata';
import {
  forwardRef,
  Inject,
  Injectable,
  InjectFlags,
  NullInjector,
  ReflectiveInjector,
  THROW_IF_NOT_FOUND
} from '@tanbo/di';

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



const injector = new ReflectiveInjector(new NullInjector(), [Parent, Child, Child2])

const instance = injector.get(Parent);
// console.log(instance)
console.log(injector.get(Child));

const childInjector = new ReflectiveInjector(injector, [Child, ])

const instance1 = childInjector.get(Child)
console.log(instance1);
