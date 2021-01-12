# 依赖注入库 - DI
IoC（Inversion of Control）控制反转，是面向对象编程中的一种设计原则，用来降低计算机代码之间的耦合度，而DI则是实现IOC的一种实现技术，简单来说就是我们将依赖注入给调用方，而不需要调用方来主动获取依赖。  

实现原理：
    1. 需要注册到 IoC 容器中的类能够在程序启动时自动进行注册
    2. 在 IoC 容器中的类实例化时可以直接拿到依赖对象的实例，而不用在构造函数中手动指定

基于TypeScript装饰器特性,而JavaScript中则需要安装reflect-metadata(https://rbuckton.github.io/reflect-metadata)，才能使用装饰器。

## 安装
```
npm install @tanbo/di reflect-metadata
```

## 示例
```typescript
import 'reflect-metadata';
import { forwardRef, Inject, Injectable, ReflectiveInjector, Self, SkipSelf, Optional } from '@tanbo/di';
```
@Injectable() 该装饰器用于表示此类可以自动注入其依赖项
@Inject 该装饰器用于注入值类型
@Self 该装饰器用于在自身查找依赖项，不会向父元素查找
@SkipSelf 该装饰器用于跳过自身，在父元素查找依赖项
@Optional 该装饰器将依赖项视为可选依赖，在运行解析时，找不到依赖项是会解析为null,而不会抛出异常
@forwardRef 该装饰器是一个向前引用，可以先使用后定义的依赖项


```typescript
@Injectable()
class Child {
  name = 'child'
  index: number
  constructor() {}
}

@Injectable()
class Parent {
  name = 'parent'
  constructor(public child: Child) {
  }
}

/**ReflectiveInjector的第一个参数为父注入器，默认为null*/
const injector = new ReflectiveInjector(null, [Parent, Child])
const instance = injector.get(Parent);
instance为获取到的实例
```



