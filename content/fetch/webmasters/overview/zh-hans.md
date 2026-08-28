# 站点接入

本指南说明如何为站点提供搜索模式协议（Search Patterns Protocol，SPP）所需的 FON 数据。接入工作的核心是定义 URL 模式、提供与模式匹配的站点地图项，并为每个页面提供对应的内容数据。

SPP 不要求站点使用特定的 ORM、后端语言或部署方式。只要生成的数据符合协议中声明的字段和类型，数据可以来自数据库、文件、接口或其他已有数据源。需要查看某一种技术栈的生成方式时，请参阅[接入示例](./examples/prisma)。

## 接入前准备

在开始接入前，请确认需要提供的页面具有确定的 URL 结构，并列出 URL 中会变化的片段。每个动态片段都需要在 `params` 中声明对应类型；站点地图项中的具体值必须满足这些类型约束。

同时准备内容层数据。站点地图项负责提供模式参数和可选的 `updated-at`，内容层负责提供页面的 `title`、`content` 和可选的 `graph`。

## 接入步骤

| 步骤 | 操作 | 完成标准 |
| :--- | :--- | :--- |
| 1 | 定义 URL 模式 | `pattern` 中的动态片段与 `params` 字段一一对应。 |
| 2 | 声明数据来源 | `datas` 指向提供该模式站点地图项的 FON 文件。 |
| 3 | 生成站点地图项 | 每项的 `params` 类型正确，`updated-at` 保持为时间原子。 |
| 4 | 提供内容层数据 | 页面内容字段与站点实际页面保持一致。 |
| 5 | 检查收录范围 | 只保留希望 Fetch 请求和收录的站点地图项。 |

### 1. 定义 URL 模式

下面的模式示例将 Thought 页面表示为 `/users/{user-id}/thoughts/{id}`。`user-id` 和 `id` 是动态片段，分别声明为 `string` 和 `int`。

```fon
[
  {
    pattern = `/users/{user-id}/thoughts/{id}`
    params = struct {
      user-id: string,
      id: int
    }
    datas = ./sitemaps/thoughts.fon
  }
]
```

索引层包含以下字段：

| 字段 | 类型 | 是否必须 | 规则 |
| :--- | :--- | :--- | :--- |
| `pattern` | `string` | 是 | 使用 `{variable}` 表示动态路径片段，其余片段按字面量处理。 |
| `params` | `struct` | 是 | 为 `pattern` 中的每个动态片段声明类型。 |
| `datas` | `string` | 是 | 指向该模式的站点地图层文件。 |

协议字段建议使用 **kebab-case**，但不作强制要求。例如，FON 模式使用 `user-id`，数据库字段仍可以使用现有的 `user_id`，在生成阶段完成映射。

### 2. 生成站点地图项

站点地图层使用数组列出模式参数。`updated-at` 是有类型的时间原子，应保持 ISO 8601 形态的原始值，不要将它降级为普通 `string`。

```fon
[
  {
    params = {
      user-id = `00000000-0000-0000-0000-000000000001`
      id = 42
    }
    updated-at = 2026-08-28T10:00:00.000Z
  }
]
```

`params` 中的字段名和类型必须与索引层声明一致。字符串使用反引号，枚举值使用点前缀，整数直接书写；`updated-at` 使用时间原子表示。

### 3. 提供内容层数据

内容层为站点地图项对应的页面提供内容。当前协议示例使用以下字段：

```fon
title = `Thought 42`
content = `# Thought 42\n\nPage content.`
graph = {
  type = .article
  headline = `Thought 42`
}
```

`title` 是页面标题，`content` 是页面正文，`graph` 是可选的结构化字段。内容层的字段应与页面实际内容保持一致。

## Fetch 的资源范围

Fetch 无视并不读取 `robots.txt`。Fetch 不会因为站点存在其他链接或路径，就主动请求未列在所提供 FON sitemap 中的资源；只有 sitemap 中明确列出的资源才会进入请求和收录范围。

如果不希望 Fetch 请求或收录某个资源，请从对应的 FON sitemap 中移除该项。不要把该 URL 留在 `params` 中，也不要把排除收录的责任交给 `robots.txt`。

## 发布前检查

提交 FON 数据前，请逐项检查模式变量、参数类型、数据来源路径和内容层映射。尤其要确认 `updated-at` 使用时间原子，且 sitemap 中没有不希望 Fetch 请求或收录的资源。

当页面内容或 URL 参数发生变化时，应同步更新相应的站点地图项和内容层数据。更新时只保留当前需要 Fetch 处理的资源。