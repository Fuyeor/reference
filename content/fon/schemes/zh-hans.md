# FON Scheme


## Scheme 的作用

没有 scheme 时，FON 解析器只验证基础结构：对象、数组、字符串、数字、布尔值和已定义的原子词法。导入 scheme 后，验证器可以确定字段类型、枚举变体、默认值、范围和精炼条件。

```fer
{ Hex } = @fer/web

Appearance: struct {
  mode: enum { dark, light, contrast, auto }
  color: struct {
    primary: Hex = #AEA4E4
    secondary: Hex = #ffe710
  }
  font-size: u8 = 14
  enable-animations: bool = true
}

exports { Appearance }
```

`Hex` 和 `#RRGGBB` 的完整语法由 `@fer/web` 的 scheme 定义；它们不是所有 FON 实现都必须支持的基础字面量。

## Scheme 的来源

Scheme 有三种来源：

| 来源 | 说明 |
| --- | --- |
| Fer 具名类型 | 由 `struct`、`enum`、精炼类型和泛型组合定义 |
| 库导出 | 通过模块的 `exports {}` 公开给调用方 |
| 平台 prelude | Web、编译器或特定后端预加载的标准 scheme |

平台 prelude 必须可查询、可锁定版本并可在不支持时给出诊断。实现不得把某个平台的 prelude 当作所有 Fer 后端都存在的全局类型。

## 使用 Scheme

配置文件通过类型标注绑定到 scheme：

```fer
{ Appearance } = @/config/app-appearance

appconf: Appearance = {
  mode = .dark
  color = { primary = #2701ff }
  font-size = 100
}
```

如果字段不满足声明类型，验证必须失败。例如将负数赋给无符号类型必须在编译期或配置加载期被拒绝：

```fer
appconf: Appearance = {
  mode = .dark
  font-size = -100
}
// Error: -100 不满足 u8 的范围
```

配置加载期失败必须包含 scheme 名称、字段路径、实际值类别、期望类型和修复建议。不得把非法配置静默替换为默认值。

## 默认值

具有默认值的字段可以在 FON 对象中省略；没有默认值的字段必须出现。显式提供的值必须经过验证，即使它与默认值相同。默认值必须是纯常量表达式，不能依赖当前时间、环境变量、网络或随机数。

## 枚举与简写

枚举变体可以使用 `.dark` 这样的简写。验证器必须从字段类型确定候选枚举；当多个枚举具有同名变体而上下文无法区分时，必须要求显式类型或报告歧义。

```fer
mode = .dark
```

枚举不应把任意字符串自动转换为变体。需要兼容外部字符串时，应定义显式解析函数或迁移规则。

## 精炼类型

精炼类型必须在构造点验证：

```fer
Uuid4: string {
  (it matches `^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$`)
}
```

验证器必须限制正则和输入长度，避免恶意配置触发超时或内存耗尽。精炼条件失败时，错误必须指向字段路径而不是只报告整个文件无效。

## 兼容性

向 scheme 中添加带默认值的字段通常是向后兼容的；添加必填字段、删除字段、改变字段类型、缩小数值范围或改变枚举变体都可能是破坏性变更。每次 scheme 变更都应提供版本号和 FON 迁移规则。

## 相关主题

- [FON 概览](../overview/zh-hans.md)
- [FON 语法](../syntax/zh-hans.md)
- [Fer 类型系统](../../fer/types/zh-hans.md)
- [Fer 迁移机制](../../fer/migration/zh-hans.md)
