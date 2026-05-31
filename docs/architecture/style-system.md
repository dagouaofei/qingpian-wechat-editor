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

## 3.2 样式命名边界（实现前契约）

> 避免 StyleDefinition、VariantDefinition、ResolvedBlockStyle 等概念混用。

| 概念 | 定义 | 持久化 / 注册 | 消费方 |
|------|------|---------------|--------|
| **StylePreset** | 整篇风格包：`themeId`、`defaultDensity`、`blockDefaults` 等 | registry / 配置文件 | Style Assignment |
| **StyleVariant** | preset 内对某 block type 的 variant 引用 ID | preset 配置 | Style Assignment |
| **VariantDefinition** | 某 `blockType` × `variantId` 的可注册样式定义（layout/spacing/typography/decoration/slots） | **registry** | StyleResolver（读取） |
| **StyleDefinition** | 可持久化或可注册的样式定义**集合**概念；Release 1 以 system preset + registry 形式存在 | registry + theme | 架构层术语 |
| **ArticleStylePlan** | 针对一篇 Article 的样式分配计划；来自 `Article.styleAssignment` + preset 解析 | 运行时中间结构 | StyleResolver 输入 |
| **ResolvedBlockStyle** | **单个 block 实例**解析后的最终样式；含 tokens、slots、copySafety 等 | 运行时，不持久化 | **Preview / Copy Renderer 直接输入** |
| **ResolvedArticleStyle** | 整篇 Article 的 resolved map：`Map<blockId, ResolvedBlockStyle>` | 运行时 | Preview / Copy 批量渲染 |

**关键边界：**

- Preview / Copy **不直接消费** VariantDefinition
- Preview / Copy **消费** ResolvedBlockStyle / ResolvedArticleStyle
- **StyleResolver** 负责：`ArticleStylePlan` + registry → ResolvedArticleStyle
- **不要把 StyleDefinition（集合/注册概念）与 ResolvedBlockStyle（实例结果）混用**

DECISION-025 中「StyleDefinition 为共享来源」在实现层指 **ResolvedBlockStyle** 的解析结果字段集合；注册层使用 **VariantDefinition**。

---

## 3.3 SlotRenderSpec 与 copy-safe 边界（实现前契约）

slot 是 variant 内部的可替换装饰区域；**Release 1 的 slot 必须 copy-safe**。

```text
SlotRenderSpec
├── slotName: string
├── kind: "line" | "dot" | "badge" | "iconText" | "label" | "divider"
├── tokens: typography / spacing / decoration
├── copySafety: "strict" | "balanced" | "preview_only"
└── fallback?: SlotRenderSpec
```

| 规则 | 说明 |
|------|------|
| 真实 DOM | slot 可表达 line、dot、badge、iconText、label、divider 等真实 DOM 装饰 |
| 禁止 pseudo | 不得依赖 `::before` / `::after` |
| 禁止复杂定位 | Release 1 copy 不得依赖 complex absolute 定位 |
| 禁止 preview-only 交互 | 不得依赖 hover / transition / animation |
| 必须有 fallback | 每个 slot 须有 Copy Renderer 可渲染的 fallback |
| copySafety | slot 必须带 copySafety；Release 1 默认 variant 的 slot **不得** preview_only |
| 解析路径 | preset 或 blockOverride → 最终解析到 `ResolvedBlockStyle.slots` |

Preview Renderer 可用更灵活 DOM 展示 slot；Copy Renderer 必须将 slot 渲染为微信兼容 inline HTML。**若 slot 无法 copy-safe，该 variant 不得进入 Release 1 正式交付。**

详见 [wechat-copy-style-rules.md](wechat-copy-style-rules.md) WeChatCompatibilityProfile。

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
| Component DSL 思路 | VariantDefinition + **ComponentProtocol**（§11）结构化描述 block 视觉 |
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

### 10.3 Release 1 Variant 范围（DECISION-039、DECISION-043）

**Release 1 Style Coverage（分阶段）：**

```text
Release 1 target coverage：11 semantic block × up to 5 variants × VisualAssetRegistry assets

First Wave Required Variants（first wave）：
- 11 semantic block × 每个 block 3 个 release1RequiredVariants
- 共 33 个 required variants
- 必须 Preview / Copy 成对实现
- 必须进入 Paste QA
- Release 1 最小样式丰富度验收范围

Expansion Required Variants（expansion target）：
- 每个 block 的第 4 / 第 5 个 variant
- Release 1 后续迭代补齐至每 block 5 个
- 不阻塞 Sprint 3-A / Sprint 4-A 最小闭环
- 正式交付前同样须 Preview / Copy 成对 + Paste QA

Candidate Variants：
- 已纳入 catalog，未承诺 first wave
- 可在 Sprint 3-B / 3-C 或后续迭代实现
- 未完成不阻塞 Sprint 2 或 Sprint 3-A

Experimental Variants：
- 内部实验或后续 Release；可 preview_only
- 不得计入 Release 1 Copy Fidelity Done
```

**四层关系（含 legacy 三层 + expansion）：**

| 层级 | 定义 | Copy Fidelity |
|------|------|---------------|
| **first-wave release1RequiredVariants** | 11×3=33；Sprint 3-B registry、Sprint 4 renderer、Sprint 6-B QA | 计入 Done |
| **expansion release1RequiredVariants** | 每 block 第 4/5 个；分后续子 Sprint | 交付前须 Done |
| **release1CandidateVariants** | catalog 已登记；不阻塞 first wave | 未完成不得标记 R1 Done |
| **experimentalVariants** | preview_only 允许 | 不得正式交付 |

**规则：** first-wave / expansion required 须 `copySafety: strict | balanced`；须支持 Copy Renderer；first-wave 须进入 Sprint 6-B Paste QA。

### 10.4 Release 1 Variant Coverage Plan

| block type | first-wave required (3) | expansion (4th/5th) | candidate / experimental | notes |
|------------|-------------------------|---------------------|--------------------------|-------|
| `title` | `title-centered`, `title-left`, `titleBlock-line` | `titleBlock-card`, `titleBlock-badge` | — | titleBlock 优先 |
| `lead` | `lead-muted`, `lead-border`, `lead-card` | `lead-highlight`, `lead-quote` | — | |
| `heading` | `heading-underline`, `title_with_bottom_line`, `line_top_title_center` | `badge_left_title_inline`, `icon_inline_prefix_title` | **`magazine_left_bar_title`** (candidate) | DECISION-044 |
| `paragraph` | `paragraph-default`, `paragraph-relaxed`, `paragraph-compact` | `paragraph-indent`, `paragraph-highlight-inline` | — | |
| `list` | `list-bullet`, `list-numbered`, `list-check` | `list-card`, `list-step` | — | |
| `quote` | `quote-left-border`, `quote-card`, `quote-minimal` | `quote-bg`, `quote-large-mark` | — | |
| `highlight` | `highlight-bg`, `highlight-border`, `highlight-marker` | `highlight-card`, `highlight-inline` | — | |
| `info_card` | `card-bordered`, `card-filled`, `card-minimal` | `card-icon`, `card-key-takeaway` | — | |
| `cta` | `cta-button`, `cta-card`, `cta-inline` | `cta-follow`, `cta-summary` | — | |
| `divider` | `divider-line`, `divider-dot`, `divider-space` | `divider-label`, `divider-short-line` | — | |
| `image_placeholder` | `placeholder-dashed`, `placeholder-caption`, `placeholder-card` | `placeholder-full`, `placeholder-minimal` | — | |

**Sprint 映射：**

- **Sprint 3-B：** first-wave 33 variants registry（优先 title/heading titleBlock）
- **Sprint 4-A / 4-B：** first-wave Preview / Copy 成对 renderer
- **Sprint 6-B：** first-wave 33 variants 全量 Paste QA
- **expansion variants：** Sprint 3-C 规划 + 后续 expansion Sprint；不阻塞 3-A
- **candidate（含 `magazine_left_bar_title`）：** 不进入 first wave；实现须单独 Paste QA（DECISION-044）

**VisualAssetRegistry（Release 1）：** Sprint 3-C 目标 **15~30** 系统内置 icon / shape / mark assets。

### 10.5 Density

- Release 1 默认 `standard`，架构支持 compact / relaxed

---

## 11. Component DSL 能力对齐

> 吸收秒篇 [titleBlock Component DSL v1](references/miaopian-title-component-dsl-v1.md)（原始 [docx](./references/秒篇成稿-标题控件DSL与布局骨架规范-v1.docx)）中经过验证的 family、variant、slot、asset pool、编排与 AI 约束思想；**不改变** Article / Block 主模型，不迁移旧实现代码（DECISION-036~038）。

### 11.1 ComponentProtocol / BlockVisualProtocol

**ComponentProtocol / BlockVisualProtocol** 是 Style System 中位于 **semantic block** 与 **VariantDefinition** 之间的**控件协议层**。

```text
BlockVisualProtocol
├── blockType: BlockType
├── componentId: string
├── allowedFamilies: string[]
├── allowedVariants: string[]
├── allowedSlots: string[]
├── requiredSlots: string[]
├── allowedAssetKinds: ("icon" | "shape" | "mark" | "divider")[]
├── copySafetyRules: CopySafetyRule[]
├── fallbackVariant: string
└── version: string
```

**层级关系：**

| 层 | 职责 |
|----|------|
| **Block** | 内容语义；不承载 CSS |
| **ComponentProtocol** | 定义视觉控件可用的 family / variant / slot / asset 白名单 |
| **VariantDefinition** | 合法 variant 的具体样式定义（registry 注册） |
| **ResolvedBlockStyle** | StyleResolver 输出的运行时解析结果 |
| **Renderer** | 消费 ResolvedBlockStyle；须先经 ComponentProtocol + Registry 校验 |

### 11.2 title / heading → titleBlock visual component

`title` 与 `heading` **共享** `titleBlock` visual component 的 family / variant / slot 能力，保持不同 semantic block 类型。

| 语义 block | 角色 | 映射 |
|------------|------|------|
| `title` | 文章主标题，通常 `blocks[0]` | `componentId: titleBlock` |
| `heading` | 章节标题，可多次出现 | `componentId: titleBlock` |

**规则：** 映射由 `styleAssignment` + StyleResolver（及可选 StyleOrchestrator）完成；二者默认 variant / family 可不同；Block Schema 不新增 visual 字段。

```text
title block   → componentId: titleBlock → family: simple|cardTitle → variant: title-centered
heading block → componentId: titleBlock → family: simple|iconDecor|badgeTitle|magazine → variant: heading-underline|title_with_bottom_line
```

### 11.3 titleBlock family 体系（v1）

| familyId | 说明 | 适用场景 | copy-safe 风险 | Sprint 3 |
|----------|------|----------|----------------|----------|
| `simple` | 纯文字 + 线条 | 章节标题 | **低** | **必做** |
| `badgeTitle` | 徽章 + 标题 | 强调小节 | 中 | **建议做** |
| `iconDecor` | 图标 + 标题 | 带图标 section | 中 | 最小 1~2 variant |
| `cardTitle` | 卡片背景 + 标题 | 区块感标题 | 中高 | 登记，可后置 |
| `magazine` | 杂志风左栏/偏移 | 长文节奏 | **高** | 登记 catalog |

### 11.4 titleBlock variant catalog（15 候选）

> 不要求 Release 1 全部实现；纳入 catalog 避免重新发明。

| variantId | family | layoutMode | 核心 slots | copy-safe | Sprint 3 |
|-----------|--------|------------|------------|-----------|----------|
| `icon_top_title_bottom` | iconDecor | vertical-stack | icon, title | 中 | 后置 |
| `icon_left_top_title_center` | iconDecor | icon-left | icon, title | 中 | 后置 |
| `title_left_icon_right` | iconDecor | icon-right | title, icon | 中 | 后置 |
| `double_icon_symmetric` | iconDecor | symmetric | icon, title, icon | 高 | 后置 |
| `badge_top_title_bottom` | badgeTitle | vertical-stack | badge, title | 中 | 可选 |
| `badge_left_title_inline` | badgeTitle | inline-badge | badge, title | 低~中 | **建议做** |
| `line_top_title_center` | simple | line-top | decorationLine, title | **低** | **建议做** |
| `title_with_bottom_line` | simple | line-bottom | title, decorationLine | **低** | **必做** |
| `card_bg_icon_corner` | cardTitle | card-corner | bgShape, icon, title | 高 | 后置 |
| `card_center_title_badge_top` | cardTitle | card-center | badge, title, bgShape | 高 | 后置 |
| `magazine_left_bar_title` | magazine | left-bar | decorationLine, title | 中 | **candidate**（DECISION-044；非 first wave） |
| `magazine_offset_icon_bg` | magazine | offset-bg | bgShape, icon, title | 高 | 后置 |
| `icon_inline_prefix_title` | iconDecor | inline-prefix | icon, title | 低~中 | **建议做** |
| `title_top_subtitle_bottom_line` | simple | title-subtitle-line | title, subtitle, decorationLine | 中 | 可选 |
| `badge_icon_title_stack` | badgeTitle | stack | badge, icon, title | 中 | 可选 |

**First-wave titleBlock copy-safe 四件套（Sprint 3-B）：** `title_with_bottom_line`、`line_top_title_center`、`badge_left_title_inline`、`icon_inline_prefix_title`（均须为 first-wave required 子集）。

> **`magazine_left_bar_title` 为 release1CandidateVariants** — 不在 first wave；若未来实现须：真实 DOM left bar + text；禁止 absolute / pseudo / complex flex-grid；Copy 嵌套 ≤3；WeChatCompatibilityProfile + 单独 Paste QA。

### 11.5 titleBlock 专用 slot 规范

```text
TitleBlockSlotDefinition
├── slotName: "icon"|"badge"|"title"|"subtitle"|"decorationLine"|"bgShape"|"extraMark"
├── slotType: "text"|"shape"|"icon"|"image"|"line"|"bgShape"|"mark"
├── required: boolean
├── enabledDefault: boolean
├── allowedPositionModes: string[]
├── allowedColorModes: string[]
├── assetBinding?: { assetKind: string; assetId?: string }
├── copySafety: "strict"|"balanced"|"preview_only"
└── fallback?: TitleBlockSlotDefinition | SlotRenderSpec
```

| slotName | 必选 | copy-safe 约束 |
|----------|------|----------------|
| `title` | **是** | requireTextNodeTypography |
| `icon` | 否 | 绑定 VisualAsset；禁止外链图 |
| `badge` | 否 | inline 背景色；避免 complex shape |
| `subtitle` | 否 | heading 默认不启用 |
| `decorationLine` | 否 | 真实 DOM，禁止 pseudo |
| `bgShape` | 否 | 高风险；须纯色 border fallback |
| `extraMark` | 否 | 简单 inline 元素 |

**组合约束：** 建议启用 2~4 slot；超过 5 个风险高；icon 与 bgShape 不宜同为主角。

### 11.5.1 titleBlock slot 内容来源绑定（SlotContentBinding · DECISION-041）

> Style System **不得**生成、改写或补写 Article.blocks 中的正文语义内容。

```text
SlotContentBinding
├── slotName: string
├── sourceType: "blockContent" | "articleMetadata" | "orchestratorGenerated" | "assetRegistry" | "variantDefinition"
├── sourcePath?: string
├── editable: boolean
├── affectsArticleContent: false          # 恒为 false
└── fallback: SlotRenderSpec | disabled
```

| 规则 | 说明 |
|------|------|
| **title slot** | **必须**绑定当前 block 的 `content.text`（title → `title.content.text`；heading → `heading.content.text`） |
| **subtitle slot** | 不得默认生成正文语义；可绑定 `metadata.subtitle`、未来 `block.content.subtitle`，或 **disabled** |
| **badge slot** | 可由 StyleOrchestrator 根据 section/heading index 生成展示型编号（如 `01` / `STEP 1`）；属 presentation metadata，**不改变** Article 内容 |
| **icon / bgShape / extraMark** | **只能**来自 VisualAssetRegistry 已注册 assetId |
| **decorationLine** | 只能来自 VariantDefinition / SlotDefinition；不得承载正文 |
| **Style System** | 不得生成、改写、补写正文内容 |
| **AI Style Selection** | 不得生成正文语义；只能建议 family / variant / slots / assetId / density / token override |

### 11.6 VisualAssetRegistry

```text
VisualAsset
├── assetId, kind, category, style, density
├── suitableFor, aspectRatio, defaultColors
├── copySafe: boolean
└── fallbackAssetId?
```

| 规则 | 说明 |
|------|------|
| 白名单 | 不得引用未注册 assetId |
| 复用 | 同一 assetId 一篇文章默认最多 2 次 |
| 密度 | strong density 不得连续高频 |
| Sprint 3 | **15~30** 系统内置 icon/shape/mark（Release 1 required assets） |

AssetRegistry 属于 Style System，**不属于** Article 内容。

### 11.7 StyleOrchestrator / 文章级节奏

StyleOrchestrator 位于 StyleResolver **之前**，不修改 Article，只输出 ArticleStylePlan / blockOverrides。

| 规则 | 内容 |
|------|------|
| R1 | 相邻 heading 不允许同一 variant |
| R2 | 同一 assetId 默认最多 2 次 |
| R3 | 连续 3 heading 不能同对齐方式 |
| R4 | iconDecor/cardTitle 连续不超过 2 次 |
| R5 | 主色系最多 2 套 |
| R6 | badge 强调型不应每 section 都出现 |
| R7 | 长文变体稳定；短文可提高变化 |
| R8 | title 与首个 heading 避免同 family+variant |

Sprint 3 最小实现 R1、R2、R8。

### 11.8 Release 1 受控 AI Style Selection（DECISION-040）

**Release 1 启用受控 AI 样式选择。** Generation 可产生样式建议，但须完整走校验链（§11.8.1~11.8.3）。

1. AI 只输出 `StyleSelectionRequest` / `StyleAssignmentPatch`
2. **不得**输出 HTML / CSS / inline style
3. **不得**引用未注册 family / variant / slot / assetId
4. **不得**生成或修改 Article.blocks 正文语义
5. **不得**直接调用 Preview / Copy Renderer
6. **不得**绕过 Style System
7. 须经 §11.8.3 校验链；失败 fallback 到 copy-safe simple variant
8. 校验通过后只影响 `styleAssignment` / ArticleStylePlan，**不 mutate** blocks 内容

#### 11.8.1 StyleSelectionRequest

```text
StyleSelectionRequest
├── articleId: string
├── articleContext?: { blockCount, headingCount, densityHint? }
├── preferredPresetId?: string
├── blockStyleHints[]
│   ├── blockId: string
│   ├── blockType: BlockType
│   ├── suggestedFamilyId?: string
│   ├── suggestedVariantId?: string
│   ├── suggestedSlotOverrides?: Record<string, unknown>
│   ├── suggestedAssetIds?: string[]
│   └── reason?: string
└── constraints
    ├── mustUseRegisteredVariants: true
    ├── mustUseRegisteredAssets: true
    ├── mustPassWeChatCompatibility: true
    └── maxDecorationDensity?: "light" | "medium" | "strong"
```

#### 11.8.2 StyleAssignmentPatch

```text
StyleAssignmentPatch
├── presetId?: string
├── blockOverrides[]
│   ├── blockId: string
│   ├── variantId?: string
│   ├── familyId?: string
│   ├── slotOverrides?: Record<string, unknown>
│   ├── assetBindings?: Record<string, string>
│   └── density?: Density
└── meta
    ├── source: "ai_style_selection"
    ├── modelId?: string
    ├── generatedAt: string
    └── validationStatus?: "pending" | "valid" | "fallback_applied"
```

#### 11.8.3 校验路径（StyleSelection Validation Pipeline）

```text
StyleSelectionRequest / StyleAssignmentPatch
  → ComponentProtocol validation
  → BlockVisualProtocol validation
  → Style Registry validation
  → VisualAssetRegistry validation
  → WeChatCompatibilityProfile validation
  → TitleBlockLayoutCompatibility validation（titleBlock variant）
  → StyleOrchestrator rhythm validation
  → StyleValidationResult
  → merge to ArticleStylePlan / styleAssignment（仅 valid 或 fallback_applied）
  → StyleResolver → ResolvedArticleStyle
```

**未经校验的建议不得写入 `Article.styleAssignment`。**

### 11.9 fallback / validation / versioning

```text
StyleValidationResult { valid, errors, warnings, fallbackApplied? }
FallbackVariantPolicy { blockType, componentId, preferredFallbackVariant, copySafetyRequired }
StyleDefinitionVersioning { schemaVersion, rawInput?, validatedOutput, finalResolvedOutput, validationMeta }
```

family / variant / slot / assetId / themeTokens 须白名单校验；失败回退 simple copy-safe variant。

**Sprint 3 必须实现：** `schemaVersion`、`StyleValidationResult`、`FallbackVariantPolicy`、errors/warnings、`fallbackApplied` 标记、validation 入口（含 AI Style Selection）。

**Release 4+ 再实现：** raw AI style output 持久化、validated output 持久化、final persisted style library、用户样式库版本管理。

**Release 1：** 需要 validation 与 fallback **能力**；**不需要**完整样式库持久化系统。

### 11.10 TitleBlockLayoutCompatibility（DECISION-042）

```text
TitleBlockLayoutCompatibility
├── layoutMode: string
├── allowedInCopy: boolean
├── maxNestingDepth: number
├── allowAbsolute: false              # Release 1 copy 禁止
├── allowOverlay: boolean
├── allowFlex: boolean
├── fallbackLayoutMode: string
├── requiredFallbackSlots: string[]
├── requiredPasteQA: boolean
└── riskLevel: "low" | "medium" | "high"
```

| layoutMode | allowedInCopy | riskLevel | Release 1 说明 |
|------------|---------------|-----------|----------------|
| `vertical-stack` | ✅ | low | required 可用 |
| `line-top` / `line-bottom` | ✅ | low | required 可用 |
| `inline-prefix` / `inline-badge` | ✅ | low~medium | required 可用 |
| `left-bar` | ✅ | medium | 须真实 DOM line，禁止 pseudo |
| `icon-right` | ✅ | medium | 禁止 flex；inline-block fallback |
| `card-corner` / `card-center` | ⚠️ | medium~high | 限制嵌套；bgShape fallback；candidate |
| `symmetric` | ⚠️ | high | 除非 copy template 明确，否则 **experimental** |
| `offset-bg` / `overlay` | ❌ | high | **不得**进入 release1RequiredVariants；experimental 须 preview_only |

**规则：** layoutMode 不满足 WeChatCompatibilityProfile → 不得进入 release1RequiredVariants；Copy 不得因 layout 复杂降级为 paragraph；overlay 类须有 `fallbackLayoutMode`（如 `vertical-stack`）。

### 11.11 ResolvedBlockStyle 扩展（titleBlock）

| 字段 | 说明 |
|------|------|
| `componentId` | 如 `titleBlock` |
| `familyId` | 如 `simple` |
| `enabledSlots` | 已启用 slot 列表 |
| `assetBindings` | slot → assetId |

Preview / Copy 按 `componentId` 分发成对 renderer；**不得**因复杂 variant 降级为 paragraph。

---

## 12. 后续扩展接入方式

| 能力 | 接入方式 |
|------|----------|
| 样式市场 | 新增 preset / variant 注册到 registry |
| 135 / 秀米导入 | Style Import Adapter：外部 HTML/CSS → Sanitizer → Parser → Template AST → Style Validator → StyleDefinition → registry（见 architecture-overview §15） |
| 用户自定义 / 样式库 | 用户 StyleDefinition → 存为用户 preset → styleAssignment 引用 |
| 整篇风格切换 | 修改 presetId → 重新 resolve → 重渲染 |
| 品牌样式库 | 品牌 theme + preset 集合 |

**约束：** 导入样式不得绕过 StyleDefinition 和 Copy Renderer。

---

## 13. 后续实现边界

| 模块 | 路径 | Sprint | 说明 |
|------|------|--------|------|
| Theme tokens | `src/core/styles/theme/` | 3 | theme 定义 |
| Preset config | `src/core/styles/preset/` | 3 | preset 定义 |
| Variant definitions | `src/core/styles/variant/` | 3 | release1RequiredVariants |
| Registry | `src/core/styles/registry.ts` | 3-B | **first-wave 11×3=33** required variants |
| Style resolver | `src/core/styles/resolver.ts` | 3 | assignment → ResolvedBlockStyle |
| **Protocol** | `src/core/styles/protocol/` | 3 | ComponentProtocol / BlockVisualProtocol |
| **Assets** | `src/core/styles/assets/` | 3 | VisualAssetRegistry |
| **Orchestrator** | `src/core/styles/orchestrator/` | 3 | StyleOrchestrator / rhythm policies |
| **Validation** | `src/core/styles/validation/` | 3 | StyleValidationResult / FallbackVariantPolicy |
| **AI selection** | `src/core/styles/ai-selection/` | 3 validation · 5 generation | StyleSelectionRequest / Patch 校验 |
| **Compatibility** | `src/core/styles/compatibility/` | 3 | WeChatCompatibilityProfile / TitleBlockLayoutCompatibility |
| Copy adapter | `src/core/styles/copy-adapter.ts` | 4 | ResolvedBlockStyle → inline style |

**Sprint 3 Style System 最小范围：** 3-A 基础设施；3-B first-wave registry（33）；3-C VisualAssetRegistry + AI validation + Orchestrator。expansion / candidate 不阻塞 3-A。

## 相关文档

- [Article Schema](article-schema.md)
- [Block Schema](block-schema.md)
- [渲染链路](rendering-pipeline.md)
- [公众号复制样式规则](wechat-copy-style-rules.md)
- [旧项目经验](prototype-lessons.md)
- [秒篇 titleBlock DSL 参考](references/miaopian-title-component-dsl-v1.md)
