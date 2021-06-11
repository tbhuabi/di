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
class A {

}

let i = 0;

@Injectable()
class B {
  constructor() {
    i++
  }
}

const injector = new ReflectiveInjector(null, [B, {
  provide: A,
  useClass: B
}])

const a = injector.get(B);
const b = injector.get(A);
console.log(a === b)
