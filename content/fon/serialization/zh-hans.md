# FON 序列化与传输


## 文本与二进制的边界

文本 FON 适合配置、源代码、调试和版本控制。二进制 FON 适合已验证对象的传输，但二进制编码不得绕过 scheme 验证、大小限制和权限检查。

序列化流程应当是：

1. 解析文本或构造 Fer 对象。
2. 根据 scheme 验证字段、类型、范围和默认值。
3. 将值转换为规范对象树。
4. 编码类型标签、长度、字段和值。
5. 在接收端验证媒体类型、协议版本、长度和对象限制。

## 稳定编码要求

二进制编码必须明确规定：

| 项目 | 当前要求 |
| --- | --- |
| 类型标签 | 每个值类别必须有可扩展且不会冲突的标签 |
| 长度 | 长度编码必须有上限，并防止整数溢出 |
| 字节序 | 多字节数值必须规定字节序，不得使用主机默认值 |
| 字段 | 字段名和字段顺序的编码规则必须稳定 |
| 版本 | 编码必须携带格式版本或由外层协议明确协商 |
| 扩展 | 未知扩展必须有拒绝或安全跳过规则 |
| 校验 | 解码后的对象仍必须通过 scheme 和资源限制检查 |

具体标签、字节序、哈希和压缩方式尚未冻结，因此当前草案的二进制结果不得被视为跨版本兼容协议。

## 对象顺序

基础对象语义按字段名寻址；序列化器必须选择稳定顺序，以便缓存、签名和调试输出可复现。默认顺序为 scheme 声明顺序；没有 scheme 时按稳定字典序。数组顺序始终保留。

如果应用依赖用户输入顺序、签名顺序或展示顺序，必须把对象声明为有序对象，并在 scheme 中明确该属性。序列化器不得自行排序有序对象。

## 安全边界

解码器必须限制输入总大小、对象深度、字段数量、数组长度、字符串长度和递归时间。长度字段必须在分配之前验证，不能把外部长度直接转换成内存分配请求。

解码器不得执行对象中的函数、路径访问、包安装、网络请求或动态加载。资源定位值只有在调用方显式请求解析时才能进入资源层，并且必须使用权限和沙箱策略。

## 请求头对象

Webroamer 方向把请求头建模为二进制 FON 对象：

```fer
RequestHeader: struct {
  method: HttpMethod
  path: string
  version: string
  client-identity: ClientIdentity
}
```

客户端身份声明同样是结构化对象：

```fer
client-identity = {
  browser = { name = `Webroamer`, version = 1.0.0 }
  capabilities = { gpu-acceleration = true, color-space = .p3 }
  os = { name = `WebroamerOS`, version = 2.4, arch = `arch64` }
  privacy-level = .strict
}
```

这些类型、字段和枚举只属于 Webroamer 草案，不是所有 FON 传输都必须携带的字段。

## HTTP/3 外层兼容

Webroamer 方向可以在 FON payload 外套用最小 HTTP/3 请求头：

```http
:method = POST
:scheme = https
:authority = fuyeor.com
:path = /search
content-type = application/fon
```

HTTP/3 头部和 FON payload 是两个层次。外层协议负责路由、连接和传输协商；FON 负责结构化 payload。当前草案不规定必须使用 POST，也不规定所有 HTTP/3 实现都支持 `application/fon`。

## 相关主题

- [FON 概览](../overview/zh-hans.md)
- [FON Scheme](../schemes/zh-hans.md)
- [FRL](../frl/zh-hans.md)
- [Next Web 规范](../../next-web/overview/zh-hans.md)
