# Fer 注解


## 语法

使用 `#[...]` 定义注解：

```fer
#[test]
check-username = () -> bool {
  true
}
```

注解必须位于被注解项之前，并且每个注解占一行。注解参数使用 Fer/FON 的值语法：

```fer
#[workgroup-size = [8, 8, 1]]
compute-main = (global-id: Vec3<u32>) -> void {
  // GPU compute body
}
```

注解内容必须在编译期可解析。未知注解必须被报告为错误，除非模块通过显式扩展注册表声明它是可忽略的文档注解。

## 字段注解

注解可以附着到结构体字段：

```fer
VertexInput: struct {
  #[location = 0, interpolate = flat]
  position: Vec3<f32>

  #[location = 1]
  color: Vec3<f32>
}
```

字段注解的键和值必须由所属后端或类型 scheme 定义。GPU location、插值模式和布局规则不能通过字符串拼接或运行时反射替代。

## 测试注解

`#[test]` 标记测试函数：

```fer
#[test]
check-username = () -> bool {
  true
}
```

测试函数必须是无参数、可重复执行且具有明确结果的函数；测试失败时，工具应提供源文件、测试名和断言上下文。测试是否允许返回 `void`、如何隔离区域内存和如何表达参数化测试，仍待定。

## 后端注解

后端注解可以描述调用约定、GPU 工作组、外部接口或布局。后端注解必须只在目标后端启用时生效，并且在不支持该后端时给出明确诊断：

```fer
#[workgroup-size = [8, 8, 1]]
compute-main = (global-id: Vec3<u32>) -> void {
  // 待定：WebGPU 后端的主体语义
}
```

实现不得把后端注解当作普通运行时数据；注解不应引入隐式全局状态。

## 注解参数

注解参数必须是布尔值、数值、字符串、数组、对象或已注册枚举值。动态表达式、函数调用、文件读取和网络请求不得出现在注解参数中。

注解键采用 kebab-case。相同注解是否可以重复、重复注解如何合并，以及未知参数是否允许，必须由注解定义明确声明；默认情况下重复注解和未知参数都是错误。

## 相关主题

- [类型系统](../types/zh-hans.md)
- [实现后端](../backends/zh-hans.md)
- [格式化规范](../formatting/zh-hans.md)
