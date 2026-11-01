# FON 语法


## 基本规则

FON 源文本使用 UTF-8 编码。逗号 `,` 与换行符 `\n` 均为合法的通用元素分隔符；对象字段、数组元素以及其他可重复结构元素可以使用逗号、换行或两者混合进行分隔。缩进只服务于可读性，不能改变对象的层级或字段值。Parser 必须将这些排版形式解析为等价的元素序列，CST 必须保留原始物理排版，以支持无损还原。

```fon
name = @fer/std
version = 0.1.0
license = .mit
authors = [`Fuyeor`, `AI`]
description = `the standard library`
dependencies = {
  @fer/common = ^0.1.0
}
```

等价的一维形式如下：

```fon
name=@fer/std,version=0.1.0,license=.mit,authors=[`Fuyeor`,`AI`],dependencies={@fer/common=^0.1.0}
```

解析器必须允许等号两侧出现空白，也必须允许逗号两侧出现空白。逗号和换行可以单独使用或混合使用；格式化工具应输出带空格的等号和稳定的布局，除非处于明确要求最小体积的序列化场景。

Fer/FON 共用 Parser 的分隔规则可以用以下抽象示例表示；示例中的 `enum` 和 `all` 分别属于上层结构或 Fer 表达式，不改变 FON 基础值的类型定义：

```text
enum { en, es
  zh-hans, zh-hant }

all (a > 1, b > 2
  c < 3)
```

Parser 必须把上述逗号、换行和混合分隔视为等价的分隔序列；CST 必须保留其原始物理排版。

## 注释

FON 支持 Fer 的行注释和多行注释：

```fon
// 这是一个行注释
name = @fer/std /* 行内注释 */
/* 这是一个
   多行注释 */
```

注释不是值的一部分。字符串中的 `//`、`/*` 和 `*/` 只有在字符串结束后才具有注释含义。

## 对象

对象由字段名、等号和值组成。对象字段可以由逗号、换行或两者混合分隔；多行对象可以让每个字段独占一行，一维对象也可以使用逗号分隔：

```fon
readme = {
  en = ./docs/en.md
  fr = ./docs/fr.md
}
```

字段名使用 kebab-case，包依赖字段可以使用带 scope 的包名作为键：

```fon
dependencies = {
  @fer/common = ^0.1.0
  @fer/http = ~0.4.2
}
```

同一对象中不得出现重复字段名。基础解析器应保留源顺序，语义层可以根据 scheme 声明字段的规范顺序。将对象转换为哈希结构时，重复字段必须报告错误，不得以后出现的值静默覆盖前一个值。

## 数组

数组使用方括号包围，元素可以由逗号、换行或两者混合分隔：

```fon
authors = [`Fuyeor`, `AI`]
ports = [80, 443]
features = [.http2, .websocket]
mixed = [80, 443
  8080, 8443]
```

数组保留元素顺序。基础语法允许混合字面值，但 scheme 可以要求所有元素具有相同类型。空数组的元素类型只能由 scheme 或显式上下文确定。

## 字符串

字符串只使用反引号。反引号可以用反斜杠转义：

```fon
description = `a FON value`
markdown = `inline code: \`name\``
```

FON 基础语法不执行 Fer 字符串插值。若需要动态生成字符串，必须在 Fer 中生成后再把结果作为 FON 值传递。多行字符串可以保留物理换行；一维化工具必须按照字符串语法进行转义，而不是直接删除换行。

## 原子值

以下原子形式是基础语法的一部分：

```fon
stable = true
experimental = false
retry-count = 3
timeout = 2.5
license = .mit
package = @fer/std
version = 0.1.0
range = ^0.1.0
path = ./docs/index.md
```

原子值的业务类型由 scheme 或使用上下文确定。例如 `0.1.0` 在包清单中可以是版本值，在无 scheme 的对象中也可以作为未加引号的版本原子保存。实现不得仅凭数值形状把它强制转换成 `f64`。

## 空值与缺省值

空值的字面量、缺省字段的序列化行为和“字段存在但值为空”的区别尚未冻结。当前草案要求 scheme 显式声明默认值；基础语法不得擅自把缺失字段补成 `null`、空字符串或零。

## 语法错误

解析器必须拒绝未闭合字符串、未闭合注释、缺少等号、重复字段、数组或对象元素之间缺少逗号和换行以外的合法分隔符、对象中出现无法识别的字段键，以及不符合包引用或路径词法的值。错误消息应包含文件位置和建议修复方式。

## 规范化输出

FON 格式化工具应遵循以下顺序：先按 scheme 声明的字段顺序；没有 scheme 时按字段名的稳定字典序；依赖包按 scope 与包名排序；数组不排序。格式化不得改变对象字段的语义顺序，除非该对象已经声明为无序对象。

## 相关主题

- [FON 概览](../overview/zh-hans.md)
- [Scheme](../schemes/zh-hans.md)
- [序列化](../serialization/zh-hans.md)
