export interface ConstructAnnotation {
  arguments: any[];
  params: any[];
}

export interface ParamAnnotation {
  parameterIndex: number;
  params: any[];
}

export interface PropertyAnnotation {
  propertyKey: string | Symbol;
  params: any[];
}

export interface MethodAnnotation {
  methodName: string | Symbol;
  params: any[];
}

export class Annotations {
  private klass = new Map<any, ConstructAnnotation>();
  private prop = new Map<any, PropertyAnnotation[]>();
  private method = new Map<any, MethodAnnotation[]>();
  private param = new Map<any, ParamAnnotation[]>();

  pushClassMetadata(token: any, params: ConstructAnnotation) {
    this.klass.set(token, params);
  }

  getClassMetadata(token: any) {
    return this.klass.get(token);
  }

  pushParamMetadata(token: any, params: ParamAnnotation) {
    if (!this.param.has(token)) {
      this.param.set(token, [params]);
    } else {
      this.param.get(token).push(params)
    }
  }

  getParamMetadata(token: any) {
    return this.param.get(token);
  }

  pushPropMetadata(token: any, params: PropertyAnnotation) {
    if (!this.prop.has(token)) {
      this.prop.set(token, [params]);
    } else {
      this.prop.get(token).push(params)
    }
  }

  getPropMetadata(token: any) {
    return this.prop.get(token);
  }

  pushMethodMetadata(token: any, params: MethodAnnotation) {
    if (!this.method.has(token)) {
      this.method.set(token, [params]);
    } else {
      this.method.get(token).push(params)
    }
  }

  getMethodMetadata(token: any) {
    return this.method.get(token);
  }
}
