import { stringify } from './stringify';

export function makeInjectError(name: string) {
  return function injectError(token: any) {
    const error =  new Error(`No provide for \`${stringify(token)}\`!`);
    error.name = name;
    return error;
  }
}

export function makeProvideScopeError(name: string) {
  return function provideError(token: any) {
    const error =  new Error(`Can not found provide scope \`${stringify(token)}\`!`);
    error.name = name;
    return error;
  }
}
