export class ForwardRef<T = any> {
  constructor(private forwardRefFn: () => T) {
  }

  getRef() {
    return this.forwardRefFn();
  }
}

export function forwardRef<T>(fn: () => T) {
  return new ForwardRef<T>(fn);
}
