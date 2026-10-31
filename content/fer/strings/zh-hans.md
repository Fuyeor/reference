# Fer 字符串


## 字符串字面量

```fer
name = `Fuyeor`
message = `Hello, {name}!`
calculate-message = `1 + 1 = {1 + 1}`
```

字符串插值大括号内部是普通 Fer 表达式，表达式结果按字符串格式化规则转换。插值不能执行隐式 I/O 或改变外部状态。

反引号使用反斜杠转义：

```fer
code = `here is a markdown inline code: \`code\``
```

## 多行字符串

Fer 支持保留换行的多行字符串，也支持使用反斜杠连接物理行：

```fer
multiple1 = `
  {message}
  This is a string that spans multiple
  lines easily.
`

multiple2 = `This is a string \
  that spans multiple lines easily.`
```

格式化工具可以裁剪多行字符串公共缩进，但必须明确记录该行为，并保证转义后的字符串值可预测。字符串内容中有意义的前导空格、尾随空格和换行不得被静默删除。

## 禁止直接索引

对 `string` 使用 `str[i]` 是编译期错误。原因是 `i` 可能被误解为字节偏移、Unicode 标量索引或用户可见字符索引。调用方必须根据意图选择迭代视图。

| API | 元素 | 用途 |
| --- | --- | --- |
| `str.bytes()` | `byte` | 原始二进制数据、协议解析、哈希；速度和可控性优先 |
| `str.chars()` | `char` | Unicode 标量值；需要处理字符编码而不是用户字形时使用 |
| `str.graphemes()` | `string` | 用户看到的字形簇；处理输入、光标和显示文本时使用 |

例如，组合字符 `e` 与重音符可能由多个 Unicode 标量组成，但用户可能把它们看作一个字形。需要按用户感知单位处理时，必须使用 `graphemes()`。

```fer
for-byte = (text: string) -> void {
  text.bytes().each(byte = process-byte(byte))
}

for-character = (text: string) -> void {
  text.chars().each(char = process-char(char))
}
```

迭代器语法和 `each` 的完整定义尚未冻结；上例只说明意图，不构成当前完整控制流规范。

## 长度与切片

`length` 的语义必须与使用的视图一致：字节长度、标量长度和字形长度不是同一个值。实现不得提供无单位的 `str.length` 并让调用方猜测其含义。

字符串切片必须在明确边界上执行。以字节切片时，结果必须是合法的字节视图；以字符或字形切片时，结果必须保持合法 UTF-8。非法边界必须报告错误，不得返回损坏字符串。

## 字符串与内存

字符串的逻辑表示是 UTF-8 的 `(ptr, len)` 视图。视图是否拥有内存、是否借用区域以及是否需要复制，由类型或函数契约明确说明。将短生命周期区域中的字符串返回到长生命周期区域时，编译器必须拒绝或要求显式复制。

## 相关主题

- [类型系统](../types/zh-hans.md)
- [内存与性能](../memory-and-performance/zh-hans.md)
- [表达式](../expressions/zh-hans.md)
