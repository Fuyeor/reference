# FON 对象表示规范概览

FON（Fer Object Notation）是 Fer 生态中的结构表示格式。它用于表达配置、对象树、scheme 可验证值和跨平台传输对象，也可以在不运行完整 Fer 程序的场景中独立存在。

FON 的核心目标是让同一结构既适合人类阅读，也适合编译器、解释器、Web 平台和序列化工具处理。FON 不复制 HTML、XML 或 JSON 的全部语义；它只规定对象、数组、值、路径和 scheme 所需的结构规则。

## 规范范围

| 主题 | 责任 | 入口 |
| --- | --- | --- |
| 概览 | 定义 FON 的用途、模式和兼容边界 | 当前页面 |
| 语法 | 定义逗号、换行和混合分隔，以及对象、数组、原子值和注释 | [FON 语法](../syntax/zh-hans.md) |
| Scheme | 定义如何由 Fer 类型声明验证 FON 值 | [Scheme](../schemes/zh-hans.md) |
| 序列化 | 定义对象到传输表示的边界与要求 | [序列化](../serialization/zh-hans.md) |
| FRL | 定义 Fer Resource Locator 的结构表示 | [FRL](../frl/zh-hans.md) |

## FON 与 Fer 的关系

Fer 是可执行的意图编程语言；FON 是表示结构的格式。Fer 可以构造、读取和验证 FON 对象，但 FON 文件不应隐式获得 Fer 函数调用、控制流或副作用。

在 Fer 中，FON 对象可以直接写成结构值：

```fer
config = {
  name = @fer/std
  version = 0.1.0
  license = .mit
  authors = [`Fuyeor`, `AI`]
}
```

在没有 scheme 的情况下，解析器识别结构和字面值，但不会凭字段名称猜测业务类型。在有 scheme 的情况下，字段的类型、默认值、枚举变体和约束由 scheme 决定；验证规则见 [Scheme](../schemes/zh-hans.md)。

## 通用元素分隔与排版表示

FON 中逗号 `,` 与换行 `\n` 均为合法的通用元素分隔符。对象字段、数组元素以及其他可重复结构元素可以使用单行纯逗号、多行纯换行，或逗号与换行混合的分组形式；缩进只用于人类阅读，不承载额外语义。Parser 必须将这些排版形式视为等价的分隔序列并构造等价结构，CST 必须保留原始物理排版，以支持无损还原。

```fon
name = @fer/std
version = 0.1.0
license = .mit
authors = [`Fuyeor`, `AI`]
dependencies = {
  @fer/common = ^0.1.0
}
```

等价的单行形式如下：

```fon
name=@fer/std,version=0.1.0,license=.mit,authors=[`Fuyeor`,`AI`],dependencies={@fer/common=^0.1.0}
```

排版转换不能改变结构语义或字段顺序。解析器不得把逗号、空白或换行误读为字符串内容；字符串内部的分隔符由字符串转义规则处理。

## 值的类别

FON 至少支持字符串、布尔值、整数、浮点数、数组、对象、路径、包引用、版本表达式、枚举简写和空值。具体实现可以提供扩展值，但扩展必须有明确的 scheme 或媒体类型，不能让同一字面量在不同实现中静默产生不同含义。

| 类别 | 示例 | 说明 |
| --- | --- | --- |
| 字符串 | `` `the standard library` `` | 使用反引号 |
| 布尔值 | `true`、`false` | 不加引号 |
| 数字 | `14`、`-100`、`2.4` | 由 scheme 或上下文确定精度 |
| 数组 | `` [`Fuyeor`, `AI`] `` | 元素按顺序排列 |
| 对象 | `{ mode = .dark }` | 字段由名称和值组成 |
| 路径 | `./docs/zh-hans.md` | 由所在文件解析 |
| 包引用 | `@fer/std` | 必须带 scope |
| 枚举简写 | `.mit`、`.dark` | 必须由 scheme 或已知类型解析 |

## 安全与可移植性

FON 解析器默认是纯解析器，不得执行字段值中的函数、网络请求、文件写入或动态代码。路径、包引用和资源定位符只在调用方显式请求解析时才解析为资源；解析器必须限制输入大小、嵌套深度、字段数量和字符串长度，以防止资源耗尽攻击。

FON 的对象语义不依赖具体 CPU、字节序或指针宽度。二进制传输时使用 [序列化规范](../serialization/zh-hans.md) 规定的类型标签和长度规则；未冻结的 wire format 不能被标记为稳定协议。

## 文档状态


## 相关文档

- [FON 语法](../syntax/zh-hans.md)
- [FON Scheme](../schemes/zh-hans.md)
- [FON 序列化](../serialization/zh-hans.md)
- [Fer 类型系统](../../fer/types/zh-hans.md)
