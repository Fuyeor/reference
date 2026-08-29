# Fer Resource Locator（FRL）


## 结构

FRL 的基本字段如下：

| 字段 | 类型方向 | 用途 |
| --- | --- | --- |
| `protocol` | `Protocol`，可选 | 传输协议，例如 `https` |
| `identifier` | `string` | 主资源标识，例如域名或服务名 |
| `path` | `Array<string>`，可选 | 静态资源或层级路径 |
| `params` | object，可选 | 查询参数 |
| `fragment` | `string`，可选 | 文档或资源内的片段标识 |

基础定位值：

```fer
{
  identifier = `fuyeor.com`
  params = {
    q = `WebRoamer`
    pagination = { page = 1, limit = 10 }
  }
  fragment = `search-results`
}
```

字段不是 URL 文本的任意字符串拼接。每个字段都必须经过适合其类型的编码，避免查询值、路径段或片段中的分隔符改变结构含义。

## 路径

静态文件或目录使用 `path`：

```fer
{
  identifier = `fuyeor.com`
  path = [`documents`, `introductions`, `file.pdf`]
}
```

上例表达的 URL 方向是 `fuyeor.com/documents/introductions/file.pdf`。路径数组中的每一项是一个独立段；`/`、`?` 和 `#` 不得在序列化时未经编码地改变层级。

## 具名 FRL 类型

在 Webroamer 或其他平台中，FRL 可以由 scheme 定义为具名结构：

```fer
locator: FRL = {
  protocol = Protocol.https
  identifier = `fuyeor.com`
  params = {
    q = `WebRoamer`
    pagination = { page = 1, limit = 10 }
  }
}
```

`Protocol.https`、参数对象和路径规范由平台 scheme 定义。基础 FON 不应自动接受未知协议或把任意字符串转换为安全协议。

## 一维化

FRL 在地址栏、Markdown 或日志中以单行出现时，使用 FON 一维语法：

```fer
{ identifier = `fuyeor.com`, params = { os = `WebRoamer`, type = `video` } }
```

一维化只改变表示，不改变字段结构。显示层可以进一步把 FRL 渲染为传统 URL，但渲染和解析必须是可逆的；无法无损表达的字段必须拒绝转换或保留原始 FON 形式。

## 安全规则

FRL 解析器必须限制标识长度、路径段数量、参数深度和整体大小。解析外部 FRL 时，必须拒绝控制字符、非法 Unicode、未编码分隔符和不允许的协议。解析器不得因为 `identifier` 看起来像域名就自动发起网络请求。

路径遍历、主机混淆、Unicode 同形异义字符和查询参数重复都必须有明确处理规则。当前草案要求默认拒绝不明确的重复参数和危险路径段；兼容策略待定。

## 相关主题

- [FON 概览](../overview/zh-hans.md)
- [FON 语法](../syntax/zh-hans.md)
- [FON 序列化](../serialization/zh-hans.md)
- [Next Web 规范](../../next-web/overview/zh-hans.md)
