# 原生 JavaScript 集成

您可以直接从浏览器使用 Fetch API 调用 depict 端点。端点返回 SVG 字符串，您可以将其注入到页面的 DOM 中。

本指南介绍如何使用原生 JavaScript 进行集成。官方 `@fuyeor/chemistry` 包将于未来发布，届时将进一步简化颜色自定义和渲染流程。

## 基本用法

使用 `fetch` 向 depict 端点请求 SVG，然后将目标元素的 `innerHTML` 设置为返回的 SVG 内容。

```javascript
// 需要渲染的 SMILES 字符串
const smiles = 'CCO';

// 构建请求 URL，对 SMILES 参数进行编码
const url = `https://chemistry.fuyeor.net/v1/depict?smiles=${encodeURIComponent(smiles)}`;

fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`获取 SVG 失败：${response.status}`);
    }
    return response.text();
  })
  .then((svg) => {
    document.getElementById('molecule-container').innerHTML = svg;
  })
  .catch((error) => {
    console.error('渲染分子时出错：', error);
  });
```

## 渲染多个分子

若要在同一页面中渲染多个结构，可遍历 SMILES 字符串列表，并为每个分子创建一个容器。

```javascript
const molecules = [
  { id: 'mol-ethanol', smiles: 'CCO' },
  { id: 'mol-aspirin', smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O' },
  { id: 'mol-caffeine', smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C' }
];

molecules.forEach(({ id, smiles }) => {
  const container = document.getElementById(id);
  if (!container) return;

  const url = `https://chemistry.fuyeor.net/v1/depict?smiles=${encodeURIComponent(smiles)}`;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`错误 ${res.status}`);
      return res.text();
    })
    .then((svg) => {
      container.innerHTML = svg;
    })
    .catch((err) => {
      container.innerHTML = `<span class="error">无法渲染 ${smiles}</span>`;
      console.error(err);
    });
});
```

## 错误处理

当请求失败时，端点会返回 `4xx` 或 `5xx` 状态码。处理响应前请务必检查 `response.ok` 或状态码。

| 状态码 | 含义 |
| :--- | :--- |
| `400` | SMILES 无效、缺少必要参数或 `config` JSON 格式错误。 |
| `404` | 提供的化合物名称在 PubChem 中未找到。 |
| `502` | PubChem 上游服务不可用。 |

详细的错误响应体请参阅 [API 参考](/chemistry/apis/depict)。

## 自定义颜色

您可以通过 `config` 参数传递一个 JSON 对象来覆盖默认的 CPK 配色。该 JSON 必须经过 URL 编码。

```javascript
const smiles = 'CCO';
const config = JSON.stringify({
  color: {
    bg: '111827',
    c: 'FFFFFF'
  }
});
const url = `https://chemistry.fuyeor.net/v1/depict?smiles=${encodeURIComponent(smiles)}&config=${encodeURIComponent(config)}`;

fetch(url)
  .then((res) => res.text())
  .then((svg) => {
    document.getElementById('dark-molecule').innerHTML = svg;
  });
```

受支持的颜色键和值格式的完整参考，请参见 [API 参考](/chemistry/apis/depict)。