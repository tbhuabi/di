import { makeParamDecorator } from './decorators';

export interface Inject {
  token: any;
}

export interface InjectDecorator {
  (token: any): any;

  new(token: any): Inject;
}

export const Inject: InjectDecorator = function InjectDecorator(token: any): any {
  if (this instanceof InjectDecorator) {
    this.token = token
  } else {
    return makeParamDecorator(Inject, new Inject(token));
  }
} as InjectDecorator

export interface Self {
}

export interface SelfDecorator {
  (): any;

  new(): Self;
}

export const Self: SelfDecorator = function SelfDecorator(): ParameterDecorator {
  if (!(this instanceof Self)) {
    return makeParamDecorator(Self);
  }
} as SelfDecorator;

export interface SkipSelf {
}

export interface SkipSelfDecorator {
  (): any;

  new(): SkipSelf;
}

export const SkipSelf: SkipSelfDecorator = function SkipSelfDecorator(): ParameterDecorator {
  if (!(this instanceof SkipSelf)) {
    return makeParamDecorator(SkipSelf);
  }
} as SkipSelfDecorator;

export interface Optional {
}

export interface OptionalDecorator {
  (): any;

  new(): Optional;
}

export const Optional: OptionalDecorator = function OptionalDecorator(): ParameterDecorator {
  if (!(this instanceof Optional)) {
    return makeParamDecorator(Optional);
  }
} as OptionalDecorator;
