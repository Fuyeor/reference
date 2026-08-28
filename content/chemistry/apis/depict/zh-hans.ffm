# Depict 端点

`/v1/depict` 端点根据 SMILES 字符串或通用名称，借助 RDKit 生成化学结构的 SVG 图像。

## 请求

`GET https://chemistry.fuyeor.net/v1/depict`

### 参数

| 参数 | 类型 | 是否必需 | 说明 |
| :--- | :--- | :--- | :--- |
| `smiles` | string | 条件必需 | 有效的 SMILES 或反应 SMILES 字符串。 |
| `name` | string | 条件必需 | 不区分大小写的通用名称（例如 `aspirin`、`ethanol`）。该名称会通过 PubChem 的 "Names and Identifiers" 数据库进行解析。 |
| `config` | JSON | 可选 | 用于自定义原子颜色和背景颜色的 JSON 对象。 |

必须且只能提供 `smiles` 与 `name` 中的一个。如果同时提供或均未提供，端点将返回 `400 Bad Request` 错误。

#### `smiles` 参数

`smiles` 参数接受有效的 SMILES 字符串。服务遵循以下规范：

- [Daylight SMILES 理论手册](https://www.daylight.com/dayhtml/doc/theory/theory.smiles.html)
- [OpenSMILES 规范](http://opensmiles.org/opensmiles.html)

#### `name` 参数

当提供 `name` 参数时，服务会查询 PubChem 获取对应化合物，并使用其规范 SMILES 进行渲染。名称查找不区分大小写。

> 建议在生产场景中直接使用 SMILES 字符串。`name` 参数需要额外调用 PubChem API，可能增加延迟，并依赖 PubChem 服务的可用性。

#### `config` 参数

`config` 参数为一个 JSON 对象，用于自定义特定原子及背景的颜色。JSON 结构如下：

```json
{
  "color": {
    "bg": "111827",
    "c": "FFFFFF",
    "o": "FF0000"
  }
}
```

**颜色键**

- 键 `"bg"` 用于设置背景颜色。
- 原子颜色键为不区分大小写的化学元素符号（例如 `"c"`、`"C"`、`"o"`、`"O"`、`"n"`、`"s"`、`"p"`、`"cl"`、`"br"`、`"f"`、`"i"`）。解析时服务会自动将键转换为小写，因此 `"C"` 与 `"c"` 等效。
- **不支持**通配符键（例如 `"*"`）。如需覆盖默认的 CPK 原子颜色，请显式指定每个元素。

**颜色值**

- 颜色值必须为不带 `#` 前缀的十六进制 RGB 或 RGBA 字符串。例如红色 `"FF0000"`，带透明度的绿色 `"00FF0080"`。
- 若未提供任何自定义颜色，服务将应用标准的 CPK 配色方案。

### 请求示例

**渲染 SMILES 字符串**

```http
GET /v1/depict?smiles=CCO HTTP/1.1
Host: chemistry.fuyeor.net
```

**渲染通用名称**

```http
GET /v1/depict?name=aspirin HTTP/1.1
Host: chemistry.fuyeor.net
```

**应用自定义颜色**

```http
GET /v1/depict?smiles=CC(=O)OC1=CC=CC=C1C(=O)O&config=%7B%22color%22%3A%7B%22bg%22%3A%22111827%22%2C%22c%22%3A%22FFFFFF%22%7D%7D HTTP/1.1
Host: chemistry.fuyeor.net
```

最后一个示例中经过 URL 编码的 `config` 参数解码后为：

```json
{"color":{"bg":"111827","c":"FFFFFF"}}
```

## 响应

### 成功响应

请求成功时返回一张 SVG 图像。

- **状态码**：`200 OK`
- **Content-Type**：`image/svg+xml`
- **Cache-Control**：`public, max-age=31536000, immutable`

响应体为矢量图形，可直接嵌入 HTML、Markdown 或在浏览器中查看。

### 错误响应

请求失败时，端点会返回包含错误码和可读消息的 JSON 对象。

下表汇总了可能出现的错误：

| 场景 | HTTP 状态码 | 响应体 |
| :--- | :--- | :--- |
| 同时提供 `smiles` 和 `name` | `400 Bad Request` | `{"error": "InvalidInput", "message": "Cannot provide both 'smiles' and 'name'"}` |
| 既未提供 `smiles` 也未提供 `name` | `400 Bad Request` | `{"error": "InvalidInput", "message": "Must provide either 'smiles' or 'name'"}` |
| SMILES 语法无效 | `400 Bad Request` | `{"error": "SmilesParsingError", "message": "Failed to parse SMILES string"}` |
| `config` 中的 JSON 格式错误 | `400 Bad Request` | `{"error": "InvalidInput", "message": "Invalid JSON config format"}` |
| PubChem 中未找到该化合物名称 | `404 Not Found` | `{"error": "NameNotFound", "message": "Compound name not found in PubChem"}` |
| PubChem 上游故障 | `502 Bad Gateway` | `{"error": "PubChemError", "message": "Failed to fetch from PubChem API"}` |

所有错误响应均包含 `Content-Type: application/json`。