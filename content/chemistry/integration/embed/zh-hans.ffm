# 直接嵌入

您可以直接使用 URL 将化学结构图嵌入到文档、论坛和网站中，无需编写任何代码。`/v1/depict` 端点会返回一张 SVG 图像，您可以将其插入到任何支持图片或自定义 Markdown 语法的地方。

## Fuyeor Flavored Markdown

如果平台支持 [Fuyeor Flavored Markdown](/ffm/overview)，则可以使用 `smiles` 代码块渲染结构式。逐行列出 SMILES 字符串即可生成多个图表：

````ffm
```smiles
CCO
CC(=O)OC1=CC=CC=C1C(=O)O
```
````

此外，还可以使用行内注解（`` #[smiles=`分子式`] ``）在段落中直接插入结构式：

```ffm
咖啡因（分子式：#[smiles = `CN1C=NC2=C1C(=O)N(C(=O)N2C)C`]）能通过阻断腺苷受体让人保持清醒。
```

**🌟 注意事项：**

- 行内注解中的所有符号（如 `#`、`[`、`]`、`=`）必须使用半角字符。
- SMILES 字符串必须用反引号（`` ` ``）包裹，与代码块语法一致。
- 你可以在 [FFM 试验场](https://flavored.fuyeor.com/) 测试渲染效果。

## Common Markdown

对于使用 Common Markdown 的平台（如 GitHub、Discourse 和静态站点生成器），请使用图片语法配合 depict 端点 URL：

```markdown
![阿司匹林](https://chemistry.fuyeor.net/v1/depict?smiles=CC(=O)OC1=CC=CC=C1C(=O)O)
```

渲染后的效果与标准图片一致：

![阿司匹林](https://chemistry.fuyeor.net/v1/depict?smiles=CC(=O)OC1=CC=CC=C1C(=O)O)

> SMILES 字符串通常包含 URL 保留字符，例如 `(`、`)` 和 `=`。建议对 `smiles` 参数值进行 URL 编码。例如，`CCO` 无需编码，但 `CC(=O)O` 需编码为 `CC%28%3DO%29O`。

## HTML

在 HTML 页面中使用 `<img>` 标签嵌入结构图。您可以设置 `width`、`height` 或其他标准属性来控制显示尺寸。

```html
<img
  width="300"
  alt="阿司匹林"
  src="https://chemistry.fuyeor.net/v1/depict?smiles=CC(=O)OC1=CC=CC=C1C(=O)O"
/>
```

`alt` 属性有助于提升无障碍访问性，并会在图像加载失败时显示。