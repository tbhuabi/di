import { Injector } from './injector';
import { Type } from './type';
import { ReflectiveDependency } from './reflective-provider';

export interface ClassDecoratorContextCallback {
  (paramsTypes: any[], annotations: Annotations, constructor: Type<any>): any[] | void; // return dependency declaration
}

export interface ClassDecoratorInvokeFn {
  (constructor: Type<any>, paramTypes: any[]): void;
}

export interface ClassDecoratorPreset {
  invoke: ClassDecoratorInvokeFn;
  // contextCallback?:
}

export interface ClassAnnotation {
  paramTypes: any[];
  decoratorArguments: any[];
  invoke?: ClassDecoratorInvokeFn,
  contextCallback?: ClassDecoratorContextCallback;
}

export interface ParamDecoratorConfig {
  metadataGenerator: () => any;
  reflectiveController?: (reflectiveDependency: ReflectiveDependency) => void;
}

export interface ParamAnnotation {
  propertyKey: string | symbol;
  parameterIndex: number;
  config: ParamDecoratorConfig,
  decoratorArguments: any[];
}

export interface PropertyDecoratorContextCallback {
  (instance: any, propertyName: string | symbol, injector: Injector): void;
}

export interface PropertyAnnotation {
  propertyKey: string | symbol;
  contextCallback: PropertyDecoratorContextCallback;
}

export interface MethodAnnotation {
  methodName: string | symbol;
  params: any[];
}

/**
 * 用于保存 class 的元数据
 */
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

  getParamMetadataKeys() {
    return Array.from(this.params.keys());
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
