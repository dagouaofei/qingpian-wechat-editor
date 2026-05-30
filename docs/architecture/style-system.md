# 样式系统正式技术方案

> 轻篇公众号排版 · qingpian-wechat-editor
>
> 状态：正式技术方案 · Sprint 1-B 定稿
> 代码位置：`src/core/styles/`（后续 Sprint 实现，本轮不写代码）

---

## 1. 为什么样式系统属于 Release 1 核心范围

轻篇公众号排版的产品价值不仅是「生成文字」，而是「生成**排版美观、复制到公众号后基本一致**的文章」。

如果样式系统后置：

- Preview Renderer 会写死 Tailwind / 页面 CSS，Copy Renderer 另写一套 inline style
- 必然重现旧项目「网页好看、公众号变形」的问题
- 后续补样式系统需要重写 Renderer，成本翻倍

因此：**样式系统架构必须在 Release 1 前置建立**，与 Article Schema、Renderer 同步设计。

---

## 2. 为什么完整样式市场后置，但架构必须前置

| 维度 | Release 1 | 后续 Release |
|------|-----------|--------------|
| 样式市场 / 后台 | 不做 | Release 4 |
| 135 / 秀米导入 | 不做 | Release 4 |
| 用户自定义样式 | 不做 | Release 4 |
| theme / preset / variant / registry 架构 | **必须建立** | 扩展 |
| 第一批 preset + variant | **必须实现** | 持续增加 |
| Preview / Copy 共享 Style Definition | **必须实现** | 持续验证 |

Release 1 的目标是跑通「生成 → 排版 → 预览 → 复制」闭环，样式系统是这个闭环的**核心组件**，不是装饰。

---

## 3. 样式系统与 Article / Block 的关系

```
Article                          Style System
────────                         ────────────
blocks[] (语义)          ──→     读取 styleAssignment
styleAssignment (引用)   ──→     解析 theme + preset + overrides
                                 ↓
                           Style Definition (resolved)
                                 ↓
                    ┌────────────┴────────────┐
                    ▼                         ▼
             Preview Renderer           Copy Renderer
             (React / DOM)              (inline style HTML)
```

**分离原则：**

- **Block** = 内容语义（text、items、caption 等）
- **Style Assignment** = 本文用哪套样式（themeId、presetId、blockOverrides）
- **Style Definition** = 解析后的视觉 token（typography、spacing、decoration 等）
- **Renderer** = 将 Block + Style Definition 渲染为 DOM 或 HTML

Article 和 Block **永远不携带 CSS**。

---

## 3.1 StyleDefinition 最小模型（定稿）

> 与 [architecture-overview.md](architecture-overview.md) §7 一致。Preview 与 Copy 的**唯一**共享样式来源。

解析结果为 `ResolvedBlockStyle`，Release 1 最小字段：

| 字段 | 说明 |
|------|------|
| `styleId` | 解析结果唯一 ID |
| `blockType` | 对应 Block.type |
| `variant` | variantId |
| `slots` | 已解析 slot 装饰 |
| `tokens` | typography / spacing / decoration 数值 |
| `layout` | 排列 token |
| `copySafety` | `strict` \| `balanced` \| `preview_only`（Release 1 正式交付不得用 `preview_only`，见下） |
| `wechatCompatibility` | 微信安全子集与 fallback |
| `sourceType` | Release 1: `"systemPreset"`；预留 `importedTemplate` / `generatedStyle` / `userStyleLibrary` |
| `density` | `compact` \| `standard` \| `relaxed` |

未来扩展：`renderMode`、`compatibility`、`importMeta`（Release 4+ Style Import Adapter 使用）。

**`preview_only` 约束（Release 1）：** 正式交付的 block × variant 不允许 `copySafety: preview_only`。该值仅保留给未来实验样式、未发布样式或内部预览；使用 `preview_only` 的 variant 不得标记 Copy Fidelity Done。

---

## 4. 核心概念定义

### 4.1 theme（主题）

**定义：** 全局视觉基调，定义跨 preset 共享的设计 token。

**作用：**

- 提供色彩体系（primary、secondary、text、background、accent）
- 提供字体族基准（如 `-apple-system, BlinkMacSystemFont, "PingFang SC"`）
- 提供全局 spacing 基准单位

**示例：**

```text
themeId: "default"
  colors.primary: "#07C160"
  colors.text: "#333333"
  typography.fontFamily.base: "PingFang SC, sans-serif"
  spacing.unit: 4px
```

theme 不直接决定每个 block 长什么样，而是为 preset 提供 token 来源。

---

### 4.2 style preset（风格预设）

**定义：** 一套完整的文章排版风格包，包含所有 block 类型的默认 variant 和全局排版参数。

**作用：**

- 用户（或系统）选择「这篇文章用什么风格」
- 一键切换整篇风格（Release 2 用户可选，Release 1 系统默认分配）
- 聚合 theme token + block 默认 variant + 全局 density

**示例：**

```text
presetId: "classic-news"
  themeId: "default"
  defaultDensity: "standard"
  blockDefaults:
    title:     { variantId: "title-centered" }
    lead:      { variantId: "lead-muted" }
    heading:   { variantId: "heading-underline" }
    paragraph: { variantId: "paragraph-default" }
    list:      { variantId: "list-bullet" }
    quote:     { variantId: "quote-left-border" }
    highlight: { variantId: "highlight-bg" }
    info_card: { variantId: "card-bordered" }
    cta:       { variantId: "cta-button" }
    divider:   { variantId: "divider-line" }
    image_placeholder: { variantId: "placeholder-dashed" }
```

---

### 4.3 style variant（样式变体）

**定义：** 某一 block 类型的一种具体视觉呈现方式。

**作用：**

- 同一 `info_card` block 可以有 `card-bordered`、`card-filled`、`card-minimal` 等 variant
- variant 是样式系统的最小可测试单元（每个 variant 必须进入粘贴测试）
- variant 由 Style Definition 描述，不是 Block 字段

**variant 如何组合：**

```text
resolvedStyle(block) =
  theme.tokens
  + preset.globalParams (density, layout)
  + registry[block.type][variantId].definition
  + blockOverrides[slotOverrides] (如有)
```

variant 之间通过 registry 注册，不通过 if/else 硬编码在 Renderer 中。

---

### 4.4 block style registry（块样式注册表）

**定义：** 集中管理所有 block 类型 × variant 的 Style Definition 注册表。

**作用：**

- 注册：`registry.register("info_card", "card-bordered", definition)`
- 查询：`registry.get("info_card", "card-bordered")`
- 列出：`registry.listVariants("info_card")` → 所有可用 variant
- 解耦 Renderer 与具体样式实现

**registry 如何管理：**

```text
BlockStyleRegistry
├── themes: Map<themeId, ThemeTokens>
├── presets: Map<presetId, PresetConfig>
└── variants: Map<blockType, Map<variantId, VariantDefinition>>
```

- 新增 variant = 在 registry 注册新 definition + 加入 preset 的 blockDefaults
- 新增 preset = 组合已有 variant + 可选新 variant
- Renderer 只调用 registry，不硬编码样式

---

### 4.5 style assignment（样式分配）

**定义：** 将 theme、preset、block 级 override 应用到具体 Article 的过程。

**style assignment 如何作用到 block：**

```text
1. 读取 Article.styleAssignment.themeId → 加载 theme tokens
2. 读取 Article.styleAssignment.presetId → 加载 preset config
3. 遍历 Article.blocks[]:
   a. 查 blockOverrides[block.id] → 有则 override variantId / slotOverrides
   b. 无 override → 使用 preset.blockDefaults[block.type]
   c. 从 registry 获取 VariantDefinition
   d. 合并 theme + preset.globalParams + variant + slotOverrides
   e. 输出 ResolvedBlockStyle
4. 输出 ResolvedArticleStyle { blocks: Map<blockId, ResolvedBlockStyle> }
```

Article 只存 assignment 引用（IDs），不存 resolved 结果。resolved 在渲染时计算，保证 preset 更新后自动生效。

---

### 4.6 slot（样式插槽）

**定义：** variant 内部的可替换装饰区域，允许在不改变 block 语义和整体 variant 的前提下，局部替换视觉元素。

**slot 是什么：**

variant 的 Style Definition 中，某些视觉区域标记为 slot，而非写死：

```text
VariantDefinition: "heading-underline"
  typography: { fontSize: "18px", fontWeight: "bold", color: "{theme.colors.text}" }
  decoration:
    underline:
      slot: "heading-accent"        # 这是一个 slot
      default: { type: "line", color: "{theme.colors.primary}", width: "3px" }
  spacing: { marginTop: "24px", marginBottom: "12px" }
```

**slot 可替换内容示例：**

| slot 名 | 默认 | 可替换为 |
|---------|------|----------|
| `heading-accent` | 下划线 | 左侧色条、圆点、无装饰 |
| `title-decoration` | 无 | 底部渐变线、居中分隔符 |
| `card-icon-area` | 无图标 | emoji、色块、序号 |

**作用：**

- 支持「样式千变万化」而不爆炸 variant 数量
- preset 可通过 slot override 实现风格差异
- Copy Renderer 必须为每个 slot 输出微信兼容 inline style

---

### 4.7 density（密度）

**定义：** 控制同一 variant 下 spacing 紧凑程度的参数。

**density 控制什么：**

| density | 段落间距 | 卡片内边距 | 标题上下间距 | 适用场景 |
|---------|----------|------------|--------------|----------|
| `compact` | 8px | 12px | 16px / 8px | 信息密集型 |
| `standard` | 16px | 16px | 24px / 12px | 默认 |
| `relaxed` | 24px | 24px | 32px / 16px | 阅读型长文 |

density 是 preset 级参数，作用于所有 block 的 spacing token：

```text
resolvedSpacing = baseSpacing * densityMultiplier[density]
```

Preview 和 Copy 必须使用同一 density 计算逻辑。

---

### 4.8 layout / spacing / typography / decoration

| 维度 | 控制什么 | 示例 |
|------|----------|------|
| **layout** | 元素排列方式 | 左对齐、居中、卡片内 flex 布局 |
| **spacing** | 内外边距 | marginTop、padding、lineHeight |
| **typography** | 字体视觉 | fontSize、fontWeight、color、letterSpacing |
| **decoration** | 装饰元素 | 边框、背景、圆角、阴影、slot 内容 |

这些维度组成 `VariantDefinition` 的结构：

```text
VariantDefinition
├── layout: LayoutTokens
├── spacing: SpacingTokens
├── typography: TypographyTokens
├── decoration: DecorationTokens
└── slots: Map<slotName, SlotDefinition>
```

---

## 5. 样式如何支持「千变万化」

1. **theme** 换色彩/字体基调
2. **preset** 换整篇风格组合
3. **variant** 换单 block 视觉
4. **slot** 换局部装饰而不增 variant
5. **density** 换紧凑度
6. **blockOverrides** 换单 block 的 variant / slot

组合公式：

```text
最终视觉 = theme × preset × variant × density × slotOverrides
```

新增一种风格 ≠ 改 Renderer 代码，而是注册新 preset / variant。

---

## 6. 样式如何服务 Preview Renderer

Preview Renderer 消费 `ResolvedBlockStyle`，输出 React 组件或 DOM：

```text
PreviewRenderer.render(block, resolvedStyle):
  1. 根据 block.type 选择 Preview 组件（如 InfoCardPreview）
  2. 将 resolvedStyle 的 typography/spacing/decoration 映射为：
     - Tailwind class（开发便利）或
     - CSS variables（与 Copy 共享 token 源）
  3. 渲染 slot 装饰元素
```

**关键：** Preview 使用的 typography/spacing/decoration **数值**来自 Style Definition，不是 Renderer 内硬编码。

---

## 7. 样式如何服务 Copy Renderer

Copy Renderer 消费**同一 ResolvedBlockStyle**，输出微信兼容 HTML：

```text
CopyRenderer.render(block, resolvedStyle):
  1. 根据 block.type 选择 Copy 模板（如 infoCardCopyTemplate）
  2. 将 resolvedStyle 全部转为 inline style 字符串
  3. 不使用 class、不使用 <style> 标签、不使用微信不支持的 CSS
  4. 渲染 slot 装饰为 inline style 元素
  5. 输出 <section style="...">...</section> 片段
```

**Preview / Copy 共享 style definition 的方式：**

```
Style Definition (VariantDefinition)
        │
        ├── resolveStyle(article, block) → ResolvedBlockStyle
        │
        ├── PreviewRenderer: ResolvedBlockStyle → DOM (class / CSS vars)
        └── CopyRenderer:    ResolvedBlockStyle → inline style HTML
```

两者读同一份 `ResolvedBlockStyle`，只是**输出适配层**不同。

---

## 8. 样式如何考虑微信复制兼容

样式系统设计时必须内置 Copy 约束：

| 约束 | 设计影响 |
|------|----------|
| 微信只可靠保留 inline style | VariantDefinition 必须可完整转为 inline style |
| 微信可能 strip `<style>` 和 class | Copy Renderer 不依赖 class |
| 微信可能重置 font-family | typography.fontFamily 必须 inline 且用安全字体栈 |
| 微信可能丢失 border-radius / box-shadow | decoration 需提供 fallback（如用 border 代替 shadow） |
| 嵌套 `<div>` 过深可能被 flatten | Copy 模板控制嵌套层级 ≤ 3 |
| 135 编辑器 ≠ 微信公众号编辑器 | 以微信公众号粘贴为验收标准 |

**每个 variant 设计时同步考虑 Copy 输出**，不是 Preview 做完再补 Copy。

---

## 9. 旧项目 Component DSL 有效经验

旧一键成稿项目中以下经验**可继承**：

| 经验 | 新项目落地 |
|------|------------|
| Component DSL 思路 | VariantDefinition 结构化描述 block 视觉 |
| slot 概念 | variant 内 slot 可替换装饰 |
| density 参数 | preset 级 spacing 缩放 |
| variant 注册 | block style registry 集中管理 |
| preset 组合 | 一套 preset = 一组 blockDefaults |

**明确不采用：**

| 废弃方案 | 原因 |
|----------|------|
| Visual Layer | 与 Block 语义混杂，导致 preview/copy 分裂 |
| Space Style | 非标准样式抽象，难以 Copy 兼容 |
| 多套混杂方案并存 | 维护成本高，行为不可预测 |
| Renderer 内 if/else 样式 | 不可扩展，不可测试 |

---

## 10. Release 1 第一批样式最小范围

### 10.1 Theme

- `default` — 默认主题（绿色 accent + 深灰文字）

### 10.2 Preset

- `classic-news` — 经典资讯风格（Release 1 默认 preset）

### 10.3 每个 Block 至少 1 个 Variant

| block type | Release 1 variant | 说明 |
|------------|-------------------|------|
| title | `title-centered` | 居中标题 |
| lead | `lead-muted` | 灰色导语 |
| heading | `heading-underline` | 带下划线小标题 |
| paragraph | `paragraph-default` | 标准正文 |
| list | `list-bullet` | 圆点列表 |
| quote | `quote-left-border` | 左边框引用 |
| highlight | `highlight-bg` | 背景高亮 |
| info_card | `card-bordered` | 边框卡片 |
| cta | `cta-button` | 按钮式 CTA |
| divider | `divider-line` | 实线分隔 |
| image_placeholder | `placeholder-dashed` | 虚线占位框 |

### 10.4 Density

- Release 1 默认 `standard`，架构支持 compact / relaxed

---

## 11. 后续扩展接入方式

| 能力 | 接入方式 |
|------|----------|
| 样式市场 | 新增 preset / variant 注册到 registry |
| 135 / 秀米导入 | Style Import Adapter：外部 HTML/CSS → Sanitizer → Parser → Template AST → Style Validator → StyleDefinition → registry（见 architecture-overview §15） |
| 用户自定义 / 样式库 | 用户 StyleDefinition → 存为用户 preset → styleAssignment 引用 |
| 整篇风格切换 | 修改 presetId → 重新 resolve → 重渲染 |
| 品牌样式库 | 品牌 theme + preset 集合 |

**约束：** 导入样式不得绕过 StyleDefinition 和 Copy Renderer。

---

## 12. 后续实现边界

| 模块 | 路径 | 说明 |
|------|------|------|
| Theme tokens | `src/core/styles/theme/` | theme 定义 |
| Preset config | `src/core/styles/preset/` | preset 定义 |
| Variant definitions | `src/core/styles/variant/` | 各 block variant |
| Registry | `src/core/styles/registry.ts` | 注册与查询 |
| Style resolver | `src/core/styles/resolver.ts` | assignment → ResolvedBlockStyle |
| Copy adapter | `src/core/styles/copy-adapter.ts` | ResolvedBlockStyle → inline style |

**前置条件：** 本方案定稿 + Article/Block Schema 定稿后方可实现。

## 相关文档

- [Article Schema](article-schema.md)
- [Block Schema](block-schema.md)
- [渲染链路](rendering-pipeline.md)
- [公众号复制样式规则](wechat-copy-style-rules.md)
- [旧项目经验](prototype-lessons.md)
