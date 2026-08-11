# Chemistry API 概述

`chemistry` 是 [Ф](https://www.fuyeor.com/en/) 生态系统中的高性能化学结构渲染服务。它基于 RDKit，可根据 SMILES 字符串按需生成 SVG 图表。这些图表经过优化，可嵌入 Markdown、HTML 以及社交媒体、论坛和学术网站等在线平台。

## 示例渲染

| 分子 | SMILES | 结构 |
| :--- | :--- | :--- |
| 乙醇 | CCO | ![](https://chemistry.fuyeor.net/v1/depict?smiles=CCO) |
| 阿司匹林 | CC(=O)OC1=CC=CC=C1C(=O)O | ![](https://chemistry.fuyeor.net/v1/depict?smiles=CC%28%3DO%29OC1%3DCC%3DCC%3DC1C%28%3DO%29O) |
| 咖啡因 | CN1C=NC2=C1C(=O)N(C(=O)N2C)C | ![](https://chemistry.fuyeor.net/v1/depict?smiles=CN1C%3DNC2%3DC1C%28%3DO%29N%28C%28%3DO%29N2C%29C) |

## 后续步骤

- 配置[本地开发环境](./development)，以构建和调试 `chemistry` 服务。
- 查看 [API 端点](./apis/depict)、参数和响应格式。
- 查看[如何在 Markdown、HTML 中嵌入](./integration/embed)，或在 [JavaScript 中调用](./integration/javascript/native)。