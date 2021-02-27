import { makeClassDecorator } from './decorators';
import { stringify } from './utils/stringify';
import { Inject, Optional, Self, SkipSelf } from './metadata';

export interface Injectable {
}

export interface InjectableDecorator {
  (): ClassDecorator;

  new(): Injectable;
}

export const Injectable: InjectableDecorator = function InjectableDecorator(): ClassDecorator {
  if (!(this instanceof InjectableDecorator)) {
    return makeClassDecorator(Injectable, (params, annotations, construct) => {
      const metadata = annotations.getClassMetadata(Injectable);
      if (typeof metadata === 'undefined') {
        throw new Error(`class/function \`${stringify(construct)}\` is not injectable!`);
      }
      const deps = (metadata.paramTypes || []).map(i => [i]);
      (annotations.getParamMetadata(Inject) || []).forEach(item => {
        deps[item.parameterIndex].push(item.decoratorArguments[0].token);
      });
      (annotations.getParamMetadata(Self) || []).map(item => {
        deps[item.parameterIndex].push(new Self());
      });
      (annotations.getParamMetadata(SkipSelf) || []).map(item => {
        deps[item.parameterIndex].push(new SkipSelf());
      });
      (annotations.getParamMetadata(Optional) || []).forEach(item => {
        deps[item.parameterIndex].push(new Optional());
      })
      return deps;
    });
  }
} as InjectableDecorator
