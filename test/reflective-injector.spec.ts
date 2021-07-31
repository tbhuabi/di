import 'reflect-metadata'
import {
  forwardRef,
  Inject,
  Injectable,
  InjectFlags,
  InjectionToken, NullInjector,
  Optional,
  Prop, ProvideScopeModule,
  ReflectiveInjector,
  Self,
  SkipSelf
} from '@tanbo/di';

describe('ReflectiveInjector', () => {
  const valueProvide = {}
  const valueInjectionToken = new InjectionToken('')

  test('value provide', () => {
    const injector = new ReflectiveInjector(null, [{
      provide: valueInjectionToken,
      useValue: valueProvide
    }])
    expect(injector.get(valueInjectionToken)).toBe(valueProvide)
  })

  test('factory provide', () => {
    const injector = new ReflectiveInjector(null, [{
      provide: valueInjectionToken,
      useFactory() {
        return valueProvide
      }
    }])

    expect(injector.get(valueInjectionToken)).toBe(valueProvide)
  })

  test('existing provide', () => {
    const token2 = new InjectionToken('')
    const injector = new ReflectiveInjector(null, [{
      provide: valueInjectionToken,
      useValue: valueProvide
    }, {
      provide: token2,
      useExisting: valueInjectionToken
    }])
    expect(injector.get(token2)).toBe(injector.get(valueInjectionToken))
    expect(injector.get(token2)).toBe(valueProvide)
  })

  test('construct provide', () => {
    @Injectable()
    class Klass {
    }

    const injector = new ReflectiveInjector(null, [Klass])
    expect(injector.get(Klass) instanceof Klass).toBeTruthy()
  })

  test('class provide', () => {
    @Injectable()
    class A {

    }

    @Injectable()
    class B {

    }

    const injector = new ReflectiveInjector(null, [B, {
      provide: A,
      useClass: B
    }])

    expect(injector.get(A) instanceof B).toBeTruthy()
  })

  test('useClass 只实例化一次顺序获取', () => {
    @Injectable()
    class A {

    }
    let i = 0;

    @Injectable()
    class B {
      constructor() {
        i++
      }
    }

    const injector = new ReflectiveInjector(null, [B, {
      provide: A,
      useClass: B
    }])

    injector.get(B);
    injector.get(A);

    expect(i).toBe(1)
  })
  test('useClass 只实例化一次倒序获取', () => {
    @Injectable()
    class A {

    }
    let i = 0;

    @Injectable()
    class B {
      constructor() {
        i++
      }
    }

    const injector = new ReflectiveInjector(null, [B, {
      provide: A,
      useClass: B
    }])

    injector.get(A);
    injector.get(B);

    expect(i).toBe(1)
  })
  test('单例', () => {
    @Injectable()
    class A {

    }

    @Injectable()
    class B {

    }

    const injector = new ReflectiveInjector(null, [A, B])

    expect(injector.get(A)).toBe(injector.get(A))
    expect(injector.get(B)).toBe(injector.get(B))
  })


  test('依赖分析', () => {
    @Injectable()
    class A {
    }

    @Injectable()
    class B {
      constructor(public a: A) {
      }
    }

    const injector = new ReflectiveInjector(null, [A, B])
    expect(injector.get(B).a instanceof A).toBeTruthy()
    expect(injector.get(B).a === injector.get(A)).toBeTruthy()
  })

  test('改变指向', () => {
    @Injectable()
    class A {
    }

    @Injectable()
    class Test{

    }
    @Injectable()
    class B {
      constructor(@Inject(Test) public a: A) {
      }
    }

    const injector = new ReflectiveInjector(null, [A, B, Test])
    expect(injector.get(B).a instanceof Test).toBeTruthy()
  })

  test('属性注入', () => {
    @Injectable()
    class A {
    }

    @Injectable()
    class B {
      @Prop(A)
      a: A
      @Prop(forwardRef(() => A))
      b: A
    }

    const injector = new ReflectiveInjector(null, [A, B])
    expect(injector.get(B).a instanceof A).toBeTruthy()
    expect(injector.get(B).a === injector.get(A)).toBeTruthy()


    expect(injector.get(B).b instanceof A).toBeTruthy()
    expect(injector.get(B).b === injector.get(A)).toBeTruthy()
  })


  test('可选属性注入', () => {
    const tryValue = {}

    @Injectable()
    class A {
    }

    @Injectable()
    class B {
      @Prop(A, tryValue, InjectFlags.Optional)
      a: A
      @Prop(forwardRef(() => A), null, InjectFlags.Optional)
      b: A
    }

    const injector = new ReflectiveInjector(null, [B])

    expect(injector.get(B).a).toBe(tryValue)
    expect(injector.get(B).b).toBeNull()
  })

  test('向后引用', () => {
    @Injectable()
    class B {
      constructor(@Inject(forwardRef(() => A)) public a: A) {
      }
    }

    @Injectable()
    class A {
    }

    const injector = new ReflectiveInjector(null, [A, B])
    expect(injector.get(B).a instanceof A).toBeTruthy()
    expect(injector.get(B).a === injector.get(A)).toBeTruthy()
  })

  test('当依赖不存在时，抛出异常', () => {
    @Injectable()
    class A {
    }

    @Injectable()
    class B {
      constructor(public a: A) {
      }
    }

    const injector = new ReflectiveInjector(null, [B])

    expect(() => injector.get(B)).toThrow()
  })

  test('可选依赖', () => {
    @Injectable()
    class A {
    }

    @Injectable()
    class B {
      constructor(@Optional() public a: A) {
      }
    }

    const injector = new ReflectiveInjector(null, [B])
    expect(injector.get(B).a).toBeNull()
  })
  test('多级依赖', () => {
    @Injectable()
    class A {
    }

    @Injectable()
    class B {
      constructor(public a: A) {
      }
    }

    const rootInjector = new ReflectiveInjector(null, [A])
    const injector = new ReflectiveInjector(rootInjector, [B])
    expect(injector.get(B).a instanceof A).toBeTruthy()
    expect(injector.get(B).a).toBe(rootInjector.get(A))
  })

  test('多级异步依赖', async () => {
    @Injectable()
    class A {
    }

    @Injectable()
    class B {
      constructor(public a: A) {
      }
    }

    const rootInjector = new ReflectiveInjector(null, [A])
    const injector = await new ReflectiveInjector(rootInjector, [B])
    expect(injector.get(B).a instanceof A).toBeTruthy()
    expect(injector.get(B).a).toBe(rootInjector.get(A))
  })

  test('多例，查找最近的', () => {
    @Injectable()
    class A {
    }

    @Injectable()
    class B {
      constructor(public a: A) {
      }
    }

    const rootInjector = new ReflectiveInjector(null, [A])
    const injector = new ReflectiveInjector(rootInjector, [A, B])
    expect(injector.get(B).a instanceof A).toBeTruthy()
    expect(injector.get(A) instanceof A).toBeTruthy()

    expect(rootInjector.get(A) instanceof A).toBeTruthy()
    expect(rootInjector.get(A) !== injector.get(A)).toBeTruthy()
  })

  test('跳过同级依赖', () => {
    @Injectable()
    class A {
    }

    @Injectable()
    class B {
      constructor(@SkipSelf() public a: A) {
      }
    }

    const rootInjector = new ReflectiveInjector(null, [A])
    const injector = new ReflectiveInjector(rootInjector, [A, B])

    expect(injector.get(B).a).toBe(rootInjector.get(A))
    expect(injector.get(B).a !== injector.get(A)).toBeTruthy()
  })

  test('锁定同级依赖', () => {
    @Injectable()
    class A {
    }

    @Injectable()
    class B {
      constructor(@Self() public a: A) {
      }
    }

    const rootInjector = new ReflectiveInjector(null, [A])
    const injector = new ReflectiveInjector(rootInjector, [B])

    const injector2 = new ReflectiveInjector(null, [B])

    expect(() => injector.get(B)).toThrow()
    expect(() => injector2.get(B)).toThrow()
  })

  test('可选同级依赖', () => {
    @Injectable()
    class A {
    }

    @Injectable()
    class B {
      constructor(@Optional() @Self() public a: A) {
      }
    }

    const rootInjector = new ReflectiveInjector(null, [A])
    const injector = new ReflectiveInjector(rootInjector, [B])

    const injector2 = new ReflectiveInjector(null, [B])

    expect(injector.get(B).a).toBeNull()
    expect(injector2.get(B).a).toBeNull()
  })

  test('可选父级依赖', () => {
    @Injectable()
    class A {
    }

    @Injectable()
    class B {
      constructor(@Optional() @SkipSelf() public a: A) {
      }
    }

    const rootInjector = new ReflectiveInjector(null, [A])
    const injector = new ReflectiveInjector(rootInjector, [B])

    const injector2 = new ReflectiveInjector(null, [B])

    expect(injector.get(B).a instanceof A).toBeTruthy()
    expect(injector2.get(B).a).toBeNull()
  })

  test('正常调用 null 注入器', () => {
    @Injectable()
    class A {
    }

    @Injectable()
    class B {
      constructor(public a: A) {
      }
    }
    const injector = new ReflectiveInjector(new NullInjector(), [B])

    const fn = jest.spyOn(injector.parentInjector, 'get')

    expect(injector.parentInjector instanceof NullInjector).toBeTruthy()
    expect(() => injector.get(B)).toThrow()
    expect(fn).toBeCalled()
  })
})

describe('ReflectiveInjector Scope 注入', () => {
  test('正确获取到实例', () => {
    const scope = new ProvideScopeModule('scope')
    const rootInjector = new ReflectiveInjector(null, [], scope)

    @Injectable({
      provideIn: scope
    })
    class Test {
      name = 'test'
    }
    const injector = new ReflectiveInjector(rootInjector, [])

    const testInstance = injector.get(Test)

    expect(testInstance).toBeInstanceOf(Test)
  })
  test('确保重复获取实例均为同一实例', () => {
    const scope = new ProvideScopeModule('scope')
    const rootInjector = new ReflectiveInjector(null, [], scope)

    @Injectable({
      provideIn: scope
    })
    class Test {
      name = 'test'
    }
    const injector = new ReflectiveInjector(rootInjector, [])

    const testInstance = injector.get(Test)
    const testInstance2 = injector.get(Test)

    expect(testInstance).toBe(testInstance2)
  })
  test('确保 provide 挂载到正确位置', () => {
    const scope = new ProvideScopeModule('scope')
    const rootInjector = new ReflectiveInjector(null, [])

    @Injectable({
      provideIn: scope
    })
    class Test {
      name = 'test'
    }
    const scopeInjector = new ReflectiveInjector(rootInjector, [], scope)

    const injector = new ReflectiveInjector(scopeInjector, [])

    injector.get(Test)
    expect((scopeInjector as any).normalizedProviders[0].provide).toBe(Test)
    expect((rootInjector as any).normalizedProviders).toEqual([])
    expect((injector as any).normalizedProviders).toEqual([])
  })
  test('确保多个 injector 获取不会重复注册', () => {
    const scope = new ProvideScopeModule('scope')
    const rootInjector = new ReflectiveInjector(null, [])

    @Injectable({
      provideIn: scope
    })
    class Test {
      name = 'test'
    }
    const scopeInjector = new ReflectiveInjector(rootInjector, [], scope)

    const injector = new ReflectiveInjector(scopeInjector, [])
    const injector2 = new ReflectiveInjector(scopeInjector, [])

    injector.get(Test)
    injector2.get(Test)
    expect((scopeInjector as any).normalizedProviders.length).toBe(1)
    expect((scopeInjector as any).normalizedProviders[0].provide).toBe(Test)
  })
  test('确保多个 injector 获取实例相同', () => {
    const scope = new ProvideScopeModule('scope')
    const rootInjector = new ReflectiveInjector(null, [])

    @Injectable({
      provideIn: scope
    })
    class Test {
      name = 'test'
    }
    const scopeInjector = new ReflectiveInjector(rootInjector, [], scope)

    const injector = new ReflectiveInjector(scopeInjector, [])
    const injector2 = new ReflectiveInjector(scopeInjector, [])

    const instance1 = injector.get(Test)
    const instance2 = injector2.get(Test)
    expect(instance1).toBe(instance2)
  })
  test('确保 scope 声明时也注册到正确位置', () => {
    const scope = new ProvideScopeModule('scope')
    const rootInjector = new ReflectiveInjector(null, [])

    @Injectable({
      provideIn: scope
    })
    class Test {
      name = 'test'
    }
    const scopeInjector = new ReflectiveInjector(rootInjector, [], scope)

    const injector = new ReflectiveInjector(scopeInjector, [Test])

    expect((injector as any).normalizedProviders.length).toBe(0)
    expect((scopeInjector as any).normalizedProviders.length).toBe(1)
  })
})

