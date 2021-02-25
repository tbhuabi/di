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
  private classes = new Map<any, ConstructAnnotation>();
  private props = new Map<any, PropertyAnnotation[]>();
  private methods = new Map<any, MethodAnnotation[]>();
  private params = new Map<any, ParamAnnotation[]>();

  pushClassMetadata(token: any, params: ConstructAnnotation) {
    this.classes.set(token, params);
  }

  getClassMetadata(token: any) {
    return this.classes.get(token);
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
