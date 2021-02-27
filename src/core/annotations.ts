import { Injector } from './injector';
import { Type } from './type';

export interface ClassDecoratorContextCallback {
  (paramsTypes: any[], annotations: Annotations, constructor: Type<any>): any[] | void; // return dependency declaration
}

export interface ClassAnnotation {
  paramTypes: any[];
  decoratorArguments: any[];
  contextCallback: ClassDecoratorContextCallback;
}

export interface ParamAnnotation {
  parameterIndex: number;
  decoratorArguments: any[];
}

export interface PropertyDecoratorContextCallback {
  (instance: any, propertyName: string | Symbol, injector: Injector): void;
}

export interface PropertyAnnotation {
  propertyKey: string | Symbol;
  contextCallback: PropertyDecoratorContextCallback;
}

export interface MethodAnnotation {
  methodName: string | Symbol;
  params: any[];
}

export class Annotations {
  private classes = new Map<any, ClassAnnotation>();
  private props = new Map<any, PropertyAnnotation[]>();
  private methods = new Map<any, MethodAnnotation[]>();
  private params = new Map<any, ParamAnnotation[]>();

  setClassMetadata(token: any, params: ClassAnnotation) {
    this.classes.set(token, params);
  }

  getClassMetadata(token: any) {
    return this.classes.get(token);
  }

  getClassMetadataKeys() {
    return Array.from(this.classes.keys());
  }

  pushParamMetadata(token: any, params: ParamAnnotation) {
    if (!this.params.has(token)) {
      this.params.set(token, [params]);
    } else {
      this.params.get(token).push(params)
    }
  }

  getParamMetadata(token: any) {
    return this.params.get(token);
  }

  getPropMetadataKeys() {
    return Array.from(this.props.keys());
  }

  pushPropMetadata(token: any, params: PropertyAnnotation) {
    if (!this.props.has(token)) {
      this.props.set(token, [params]);
    } else {
      this.props.get(token).push(params)
    }
  }

  getPropMetadata(token: any) {
    return this.props.get(token);
  }

  pushMethodMetadata(token: any, params: MethodAnnotation) {
    if (!this.methods.has(token)) {
      this.methods.set(token, [params]);
    } else {
      this.methods.get(token).push(params)
    }
  }

  getMethodMetadata(token: any) {
    return this.methods.get(token);
  }
}
