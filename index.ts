import 'reflect-metadata';
import {
  forwardRef,
  Inject,
  Injectable,
  InjectFlags,
  Optional,
  Prop,
  ReflectiveInjector,
  Self,
  SkipSelf
} from '@tanbo/di';


@Injectable()
class Child {

  index: number
}

@Injectable()
class Parent {
  name = 'parent'

  constructor(@Optional() @SkipSelf() private child: Child) {
  }
}

const rootInjector = new ReflectiveInjector(null, [Child])

const injector = new ReflectiveInjector(null, [Parent])

const instance = injector.get(Parent)
console.log(instance)

