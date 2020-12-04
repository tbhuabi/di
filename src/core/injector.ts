export abstract class Injector {
  abstract parentInjector: Injector;
  abstract get<T>(token: any, notFoundValue?: any): T
}


