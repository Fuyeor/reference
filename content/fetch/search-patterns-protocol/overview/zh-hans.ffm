# 搜索模式协议规范

搜索模式协议（Search Patterns Protocol，SPP）是一种基于模式匹配的实验性索引标准。SPP 使用 FON 文件描述 URL 模式、模式参数、站点地图项和页面内容，使站点可以为 Fetch 提供结构化的可索引资源。

## 协议结构

SPP 的数据由三个层级组成。索引层声明 URL 模式和数据来源；站点地图层列出模式参数的具体值及更新时间；内容层提供与站点地图项对应的页面内容。

| 层级 | 必须提供的内容 | 文件示例 |
| :--- | :--- | :--- |
| **索引层** | `pattern`、`params` 和 `datas` | `/sitemap.fon` |
| **站点地图层** | `params` 和可选的 `updated-at` | `/sitemaps/*.fon` |
| **内容层** | `title`，以及可选的 `content` 和 `graph` | `/content/**/*.fon` |

每个层级都使用 FON 表示。索引层的 `datas` 指向站点地图层；站点地图项的参数用于实例化索引层模式；内容层数据则对应实例化后的页面。

## 索引层

索引层文件定义 URL 模式与站点地图层文件之间的关系。URL 中会变化的片段使用 `{variable}` 表示，并必须在 `params` 中声明。

### 文件格式

```fon
[
  {
    pattern = `/@{username}/{tab}`
    params = struct {
      username: string,
      tab: Option<Vec<enum { thoughts, comments }>>
    }
    datas = ./sitemaps/users.fon
  }
  {
    pattern = `/{locale}/thought/{id}`
    params = struct {
      locale: enum { en, fr, es, zh-hans },
      id: int
    }
    datas = ./sitemaps/thoughts.fon
  }
]
```

### 字段规则

| 字段 | 类型 | 是否必须 | 规则 |
| :--- | :--- | :--- | :--- |
| `pattern` | `string` | 是 | 使用 `{variable}` 标记动态路径片段；其他路径片段按字面量处理。 |
| `params` | `struct` | 是 | 为 `pattern` 中出现的每个动态片段声明类型。 |
| `datas` | 路径原子 | 是 | 指向该模式的站点地图层文件。 |

`pattern` 中的变量名必须与 `params` 中的字段名对应。`params` 中不得遗漏模式变量，也不得使用模式中没有出现的变量。

### 参数类型

索引层参数应使用协议中已有示例的类型表达：

| 类型 | 示例 | 用途 |
| :--- | :--- | :--- |
| `string` | `username: string` | 表示字符串参数。 |
| `int` | `id: int` | 表示整数参数。 |
| `enum` | `locale: enum { en, fr }` | 限定参数只能使用声明的枚举值。 |
| `Option<T>` | `tab: Option<string>` | 表示可选参数。 |
| `Vec<T>` | `tabs: Vec<string>` | 表示多个同类参数值。 |

协议字段建议使用 **kebab-case**，但不作强制要求。例如，协议可以使用 `user-id` 和 `updated-at`；站点内部的数据库字段可以继续使用 `user_id` 和 `updated_at`，并在生成阶段完成映射。

## 站点地图层

站点地图层使用数组列出一个模式的具体参数。每个对象的 `params` 必须与索引层的 `pattern` 和 `params` 匹配；`updated-at` 用于提供该站点地图项的有类型更新时间。

### 文件格式

```fon
[
  {
    params = { username = `Fuyeor` }
    updated-at = 2026-08-30T08:30:00.000Z
  }
  {
    params = { username = `Fuyeor`, tab = .thoughts }
    updated-at = 2026-08-30T08:30:00.000Z
  }
  {
    params = { username = `Fuyeor`, tab = .comments }
    updated-at = 2026-08-30T08:30:00.000Z
  }
]
```

### 字段规则

| 字段 | 类型 | 是否必须 | 规则 |
| :--- | :--- | :--- | :--- |
| `params` | `struct` | 是 | 提供模式变量的具体值，并遵守索引层声明的类型。 |
| `updated-at` | `timestamp` | 否 | 使用时间原子表示该站点地图项的更新时间。 |

### 参数值规则

字符串使用反引号，例如 `` `Fuyeor` ``；枚举值使用点前缀，例如 `.thoughts`；整数直接书写，例如 `123`。生成站点地图时，站点应确保每个参数值都能实例化对应的 `pattern`。

## 内容层

内容层文件提供站点地图项对应页面的内容。内容层字段应与实际页面保持一致。

### 文件格式

```fon
title = `Fuyeor (@Fuyeor) « Profile « Ф`
content = `# About me\n...`
graph = {
  type = .person
  name = `Fuyeor`
  description = `@Fuyeor on Ф social`
}
```

### 字段规则

| 字段 | 类型 | 是否必须 | 规则 |
| :--- | :--- | :--- | :--- |
| `title` | `string` | 是 | 提供页面标题。 |
| `content` | `string` | 否 | 提供页面正文；当前示例使用 Markdown 文本。 |
| `graph` | `struct` | 否 | 提供页面实体的结构化字段。 |

当前已有示例包含 `.person` 和 `.article` 两种 `graph.type` 值。使用 `graph` 时，字段内容应与页面实体一致。

人物示例：

```fon
graph = {
  type = .person
  name = `Fuyeor`
  description = `@Fuyeor on Ф social`
  url = `https://fuyeor.com/@Fuyeor`
}
```

文章示例：

```fon
graph = {
  type = .article
  headline = `搜索模式协议简介`
  author = `Fuyeor`
  datePublished = `2026-08-28`
  description = `介绍 SPP 协议的基本概念与设计目标`
}
```

## Fetch 的资源范围

Fetch 无视并不读取 `robots.txt`。Fetch 不会因为站点存在其他链接或路径而主动请求未列在所提供 FON sitemap 中的资源；只有 sitemap 中明确列出的资源才会进入请求和收录范围。

如果不希望某个资源被 Fetch 请求或收录，请从对应的 FON sitemap 中移除该项。不要把该 URL 留在站点地图项的 `params` 中，也不要依赖 `robots.txt` 排除资源。

## 接入步骤

按以下顺序发布 SPP 数据：

1. **定义模式。** 为需要提供的页面确定 URL 结构，并在索引层为所有动态片段声明 `params` 类型。
2. **指定数据来源。** 使用 `datas` 将每个模式连接到对应的站点地图层文件。
3. **生成站点地图。** 从站点已有数据源生成参数项，为 `updated-at` 保留时间原子，并只列出希望 Fetch 处理的资源。
4. **提供内容数据。** 为站点地图项对应的页面提供内容层文件，并保持 `title`、`content` 和 `graph` 与页面一致。
5. **检查发布范围。** 发布前检查模式变量、参数类型、数据来源路径和 sitemap 项，确认不希望处理的资源没有被列出。