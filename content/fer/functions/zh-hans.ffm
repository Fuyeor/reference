# Fer 函数与调用


## 定义

函数使用名称绑定、参数列表和返回类型定义：

```fer
is-valid-user = (user: User) -> bool {
  user.status equals .active
}

get-location = () -> { lat: i64, lng: i64 } {
  { lat = 120, lng = 30 }
}
```

参数类型和返回类型是接口的一部分，不得省略。编译器可以推断函数体内部表达式的中间类型，但不能把推断结果作为公共签名的替代品。

返回结构体的函数应当返回满足声明结构的对象：

```fer
location = get-location()
```

函数体最后一个表达式是返回值。显式的 `return` 关键字不属于当前核心语法；需要提前分支时，使用 match 表达式返回不同结果。

## 参数调用

零个或一个参数可以使用直接形式：

```fer
health-check()
print(`Hello, Fer!`)
```

两个或更多参数必须使用具名参数：

```fer
function-name(arg1 = `字符串`, arg2 = 10)
```

以下形式非法，因为它依赖参数位置：

```fer
function-name(`字符串`, 10)
```

具名参数名称必须与函数签名匹配。参数顺序由函数定义决定；调用方书写顺序可以由格式化工具归一化，但不得用重复名称覆盖参数。

## 默认值

函数参数默认值的语法和求值时机尚未冻结。当前草案不允许通过省略参数来触发未声明的默认行为；如果一个函数需要可选输入，应使用 `Option<T>`、带默认值的结构体或显式重载设计。

## 返回类型与错误

函数的错误是返回类型的一部分。当前草案允许使用枚举或 `Option<T>` 表达可预期的失败：

```fer
find-user = (id: Uuid4) -> Option<User> {
  // 返回 .some 或 .none 的规则待定
}
```

实现不得把未声明的异常、隐式空值或后端特有的错误对象当作稳定函数接口。错误传播操作符尚未进入冻结规范。

## UFCS

UFCS（Uniform Function Call Syntax）允许把 `a.func(args)` 解释为 `func(a, args)`。它不是动态方法分派，而是受限的静态查找：

1. 编译器先在当前文件和显式导入的上下文中查找 `func(a, args)`。
2. 如果没有找到，编译器只在常量 `a` 的类型最初定义模块的 `exports` 列表中查找 `func`。
3. 找到后，调用被视为合法的普通函数调用；找不到时必须产生编译期错误。

```fer
writer = io.stdout.writer()
writer.write(bytes = `Hello, Fer!`)
```

上例等价于：

```fer
writer = writer(io.stdout)
write(writer, bytes = `Hello, Fer!`)
```

UFCS 查找不得扫描全局注册表、所有依赖包或运行时对象属性。这样可以保证名称解析可重复，并防止依赖包新增函数后意外改变已有程序的含义。

## 函数作为值

函数值、闭包、异步函数和高阶函数的完整语义尚未冻结。当前实现可以提供受限能力，但公共规范不得假设函数值具有隐式捕获、可变闭包或任意动态分派能力。

## 调用链

调用链必须保持每一步的类型可验证：

```fer
io.stdout.writer().write(bytes = `Zero cost abstraction`)
```

如果中间结果为 `Option`、`never` 或其他不能直接访问成员的类型，编译器必须拒绝调用链，除非显式的解构或匹配规则已经规定了转换。

## 相关主题

- [表达式](../expressions/zh-hans.md)
- [模块系统](../modules/zh-hans.md)
- [类型系统](../types/zh-hans.md)
- [迁移机制](../migration/zh-hans.md)
