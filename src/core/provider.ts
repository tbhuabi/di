import { Type } from './type';

export interface ClassProvider {
  provide: any;
  useClass: Type<any>;
  deps?: any[];
}

export interface FactoryProvider {
  provide: any;
  useFactory: (...args: any[]) => any;
  deps?: any[];
}

export interface ValueProvider {
  provide: any;
  useValue: any;
}

export interface ExistingProvider {
  provide: any;
  useExisting: any;
}

export interface ConstructorProvider {
  provide: Type<any>;
  deps?: [];
}

export interface TypeProvider extends Type<any> {
}

export type StaticProvider = ClassProvider | FactoryProvider | ValueProvider | ExistingProvider | ConstructorProvider;

export type Provider = TypeProvider | ValueProvider | ClassProvider | ConstructorProvider | ExistingProvider | FactoryProvider
