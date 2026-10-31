# Fer 模块系统


## 目录与入口

一个目录可以作为模块，其入口文件按以下优先级确定：

| 文件 | 用途 |
| --- | --- |
| `main.fer` | 可执行应用或命令入口 |
| `lib.fer` | 库的公开入口 |
| `mod.fer` | 普通目录模块的入口 |

同一目录不得同时以多个入口文件表达不同公共模块。工具链发现多个候选入口时必须报告错误，而不能按实现顺序猜测。

示例目录：

```text
modules/
  app/
    main.fer
    auth/
      mod.fer
      repository.fer
  utils/
    username.fer
```

## 包名与 scope

包名必须包含 `@scope`，scope 和包名都遵循 kebab-case：

```text
@fer/std
@fer/http
@my-app/web-server
```

包名是依赖解析和迁移的稳定标识。目录重命名不得在没有迁移文件的情况下改变包的公共标识。

## 导入

导入使用解构形式，并且必须声明需要的名称：

```fer
{ get, post } = @fer/http
{ check-username-availability } = @/utils/username
{ create-user } = ./repository
```

导入路径分为三类：

| 形式 | 含义 |
| --- | --- |
| `@scope/package` | 外部包或标准库 |
| `@/path` | 当前应用根目录下的模块 |
| `./path` | 当前目录下的模块 |

禁止使用 `../`。禁止通过父目录相对路径绕过应用根目录或包的显式边界；需要访问上层公共模块时，应通过根路径别名或包导出实现。

## 重命名

导入项可以使用 `->` 重命名：

```fer
{ get, post, Http -> HttpClient } = @fer/http
```

重命名只影响当前文件中的名称，不改变源模块的导出名。导入解构中的名称必须存在于源模块的 `exports` 列表；否则必须在编译期报错。

## 导出

模块必须在显式 `exports {}` 块中声明公共名称：

```fer
{ io } = ./io
{ fs } = ./fs

exports { io, fs }
```

未导出的名称默认为私有。`exports` 应放在模块文件的最上方公共接口区域；导出项按格式化规范排序。循环导出必须在编译期检测，并给出完整模块路径链。

## 模块对象

将子模块作为名称导出后，调用方可以先访问模块对象，再访问其导出成员：

```fer
{ io } = @fer/std

writer = io.stdout.writer()
writer.write(bytes = `Hello, Fer!`)
```

模块对象不是可变哈希表。它只包含源模块声明的导出项，并且不能在运行时动态增加字段。

## 可见性与重构

公共接口由导出名、类型、参数名、返回类型和相关 scheme 共同组成。内部文件可以自由重构，但改变公共接口必须提供 `.migrate.fer` 迁移规则。编译器应当在迁移前后检查名称、类型和参数映射，不能把无法证明安全的改动自动应用。

## 解析错误

实现必须拒绝以下情况：入口文件不明确、导入使用 `../`、导入名称未导出、同名导入冲突、导出名称不存在、包缺少 scope、模块循环无法解析，以及私有成员从外部模块访问。

## 相关主题

- [语法基础](../syntax/zh-hans.md)
- [函数与调用](../functions/zh-hans.md)
- [迁移机制](../migration/zh-hans.md)
- [格式化规范](../formatting/zh-hans.md)
