import {
  Annotations,
  PropertyDecoratorContextCallback
} from './annotations';

/**
 * 创建参数装饰器的工厂函数
 */
export function makeParamDecorator(token: any, metadata): ParameterDecorator {
  return function (target, propertyKey, parameterIndex) {
    const annotations = getAnnotations(target);
    annotations.pushParamMetadata(token, {
      propertyKey,
      parameterIndex,
      metadata
    });
  }
}

/**
 * 创建属性装饰器的工厂函数
 */
export function makePropertyDecorator(token: any, contextCallback: PropertyDecoratorContextCallback): PropertyDecorator {
  return function (target, propertyKey) {
    const annotations = getAnnotations(target.constructor);
    annotations.pushPropMetadata(token, {
      propertyKey,
      contextCallback
    });
  }
}

/**
 * 创建方法装饰器的工厂函数
 */
export function makeMethodDecorator(token: any, ...params: any[]): MethodDecorator {
  return function (target, methodName) {
    const annotations = getAnnotations(target.constructor);
    annotations.pushMethodMetadata(token, {
      methodName,
      params
    });
  }
}

/**
 * 创建类装饰器的工厂函数
 */
export function makeClassDecorator(token: any, metadata: any): ClassDecorator {
  return function (target) {
    const annotations = getAnnotations(target);
    annotations.setClassMetadata(token, {
      paramTypes: Reflect.getMetadata('design:paramtypes', target),
      metadata
    });
  }
}

/**
 * 获取类注解的工具函数
 */
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
