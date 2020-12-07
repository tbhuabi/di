export class ForwardRef {
  constructor(private forwardRefFn: () => any) {
  }

  getRef() {
    return this.forwardRefFn();
  }
}

export function forwardRef(fn: () => any) {
  return new ForwardRef(fn);
}
