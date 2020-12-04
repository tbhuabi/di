import { stringify } from './stringify';

export function makeInjectError(name: string) {
  return function injectError(token: any) {
    const error =  new Error(`No provide for ${stringify(token)}!`);
    error.name = name;
    return error;
  }
}
