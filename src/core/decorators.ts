import { Annotations, ClassDecoratorContextCallback, PropertyDecoratorContextCallback } from './annotations';

export function makeParamDecorator(token: any, ...params: any[]): ParameterDecorator {
  return function (target, propertyKey, parameterIndex) {
    const annotations = getAnnotations(target);
    annotations.pushParamMetadata(token, {
      parameterIndex,
      params
    });
  }
}

export function makePropertyDecorator(token: any, contextCallback: PropertyDecoratorContextCallback): PropertyDecorator {
  return function (target, propertyKey) {
    const annotations = getAnnotations(target.constructor);
    annotations.pushPropMetadata(token, {
      propertyKey,
      contextCallback
    });
  }
}

export function makeMethodDecorator(token: any, ...params: any[]): MethodDecorator {
  return function (target, methodName) {
    const annotations = getAnnotations(target.constructor);
    annotations.pushMethodMetadata(token, {
      methodName,
      params
    });
  }
}

export function makeClassDecorator(token: any, contextCallback: ClassDecoratorContextCallback): ClassDecorator {
  return function (target) {
    const annotations = getAnnotations(target);
    annotations.pushClassMetadata(token, {
      params: Reflect.getMetadata('design:paramtypes', target),
      contextCallback
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
