import { Annotations } from './annotations';

export function makeParamDecorator(token: any, ...params: any[]): ParameterDecorator {
  return function (target, propertyKey, parameterIndex) {
    const annotations = getAnnotations(target);
    annotations.pushParamMetadata(token, {
      parameterIndex,
      params
    });
  }
}

export function makePropertyDecorator(token: any, ...params: any[]): PropertyDecorator {
  return function (target, propertyKey) {
    const annotations = getAnnotations(target);
    annotations.pushPropMetadata(token, {
      propertyKey,
      params
    });
  }
}

export function makeMethodDecorator(token: any, ...params: any[]): MethodDecorator {
  return function (target, methodName) {
    const annotations = getAnnotations(target);
    annotations.pushMethodMetadata(token, {
      methodName,
      params
    });
  }
}

export function makeClassDecorator(token: any, ...params: any[]): ClassDecorator {
  return function (target) {
    const annotations = getAnnotations(target);
    annotations.pushClassMetadata(token, {
      arguments: Reflect.getMetadata('design:paramtypes', target),
      params
    });
  }
}

export function getAnnotations(target: any): Annotations {
  if (!target.hasOwnProperty('__annotaions__')) {
    const annotations = new Annotations();
    Reflect.defineProperty(target, '__annotations__', {
      get() {
        return annotations
      }
    })
  }
  return (target as any).__annotations__ as Annotations;
}
