# Next Web 规范（草案）


## 文档树

页面文档树使用 FON 对象表达：

```fer
header = {
  title = `Welcome`
  manifest = { url = ./manifest.json }
}

body = {
  content = `some text...`
  button = {
    style = {
      padding = 10
      background = { color = #AEA4E4 }
    }
    on-click = noop
  }
}

noop = (event: Event) -> Style {
  // 待定：事件到样式的完整语义
}
```

页面对象、样式对象、事件处理器和资源对象应当通过 scheme 定义，而不是依赖浏览器对任意字段名的动态猜测。`#AEA4E4` 等颜色值属于 Web 平台 scheme 的候选扩展。

## Webroamer

Webroamer 是该方向的浏览器或页面运行时名称。运行时需要完成以下工作：解析页面 FON、加载并验证 scheme、构造文档树、绑定事件、执行安全的 Fer 逻辑，并将结构映射到目标渲染后端。

运行时不得把不可信页面中的字段当作任意 Fer 代码执行。事件、样式、资源和网络访问都必须通过受限接口和权限模型进行。

## FRL

Next Web 使用 [Fer Resource Locator（FRL）](../../fon/frl/zh-hans.md) 表达资源位置：

```fer
locator: FRL = {
  protocol = Protocol.https
  identifier = `fuyeor.com`
  params = { q = `WebRoamer` }
}
```

FRL 也可以在地址栏或 Markdown 中以一维 FON 形式出现。URL 文本和结构化 FRL 之间的转换必须进行正确编码，并且不得因为解析地址就自动发起请求。

## 请求头与身份

Webroamer 方向把应用层请求头建模为 FON 对象，并可以在 HTTP/3 传输层外使用最小兼容头：

```fer
RequestHeader: struct {
  method: HttpMethod
  path: string
  version: string
  client-identity: ClientIdentity
}
```

```http
:method = POST
:scheme = https
:authority = fuyeor.com
:path = /search
content-type = application/fon
```

客户端身份声明可以包含浏览器、能力、操作系统和隐私等级：

```fer
client-identity = {
  browser = { name = `Webroamer`, version = 1.0.0 }
  capabilities = { gpu-acceleration = true, color-space = .p3 }
  os = { name = `WebroamerOS`, version = 2.4, arch = `arch64` }
  privacy-level = .strict
}
```

身份声明必须遵循最小披露原则。浏览器不得把未获授权的硬件、系统或用户信息自动加入声明；能力枚举、隐私等级和用户同意流程待定。

## 兼容边界

Next Web 可以使用传统 HTTP/3 作为外层传输兼容层，但不应把 HTTP/3 的头部语义与 FON 对象语义混为一谈。`application/fon`、请求方法、二进制编码和响应协商都需要单独的协议规范。

本页不规定 HTML、CSS 或 JavaScript 的兼容实现，也不宣称 Webroamer、FON 二进制格式或 WebGPU 渲染后端已经实现。

## 相关主题

- [FON 概览](../../fon/overview/zh-hans.md)
- [FON Scheme](../../fon/schemes/zh-hans.md)
- [FON 序列化](../../fon/serialization/zh-hans.md)
- [FRL](../../fon/frl/zh-hans.md)
- [Fer 实现后端](../../fer/backends/zh-hans.md)
