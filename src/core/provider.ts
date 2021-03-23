import { Type } from './type';

export interface ClassProvider<T = any> {
  provide: any;
  useClass: Type<T>;
  deps?: any[];
}

export interface FactoryProvider<T = any> {
  provide: any;
  useFactory: (...args: any[]) => T;
  deps?: any[];
}

export interface ValueProvider<T = any> {
  provide: any;
  useValue: T;
}

export interface ExistingProvider<T = any> {
  provide: any;
  useExisting: T;
}

export interface ConstructorProvider<T = any> {
  provide: Type<T>;
  deps?: [];
}

export interface TypeProvider<T = any> extends Type<T> {
}

export type StaticProvider<T = any> = ClassProvider<T> | FactoryProvider<T> | ValueProvider<T> | ExistingProvider<T> | ConstructorProvider<T>;

export type Provider<T = any> = TypeProvider<T> | ValueProvider<T> | ClassProvider<T> | ConstructorProvider<T> | ExistingProvider<T> | FactoryProvider<T>
