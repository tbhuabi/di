依赖注入库 - DI
==================================================================

IoC（Inversion of Control）控制反转，是面向对象编程中的一种设计原则，用来降低计算机代码之间的耦合度，而 DI 则是实现IOC的一种实现技术，简单来说就是我们将依赖注入给调用方，而不需要调用方来主动获取依赖。


## 安装
```
npm install @tanbo/di reflect-metadata
```

## 示例

要实现自动依赖注入，在 @tanbo/di 中，要用到 `ReflectiveInjector` 类作为容器来实现。同时还要把需要可注入的类标识为 `Injectable`。


```typescript
import 'reflect-metadata';
import { Injectable, ReflectiveInjector } from '@tanbo/di';

// 声明类是可注入的
@Injectable()
class Child {
  name = 'child'
  index: number
  constructor() {}
}

// 声明类是可注入的
@Injectable()
class Parent {
  name = 'parent'
  constructor(public child: Child) {
  }
}

// 创建容器
const injector = new ReflectiveInjector(null, [Parent, Child]);

// 获取实例
const instance = injector.get(Parent);
console.log(instance);
```

## 如何注入其它数据

在实际应用中，很多时候不仅仅只需要注入类的实例，可能还需要注入其它数据，但通过 Typescript 自动解析元数据，是无法获取到相关依赖信息的。这时，就需要通过指定 token 的方式实现。

```typescript
import { Injectable, InjectionToken, Inject } from '@tanbo/di';

interface UserInfo {
  name: string;
}

const USER_INFO_INJECTIOON_TOKEN = new InjectionToken<UserInfo>('USER_INFO_INJECTIOON_TOKEN');

@Injectable()
class User {
  constructor(@Inject(USER_INFO_INJECTIOON_TOKEN) public userInfo: UserInfo) {
  }
}

const injector = new ReflectiveInjector(null, [
  User, {
    provide: USER_INFO_INJECTIOON_TOKEN,
    useValue: {
      name: '张三'
    }
  }
]);

const instance = injector.get(User);
```
