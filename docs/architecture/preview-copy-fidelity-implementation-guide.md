# Preview / Copy 一致性实现指导

> 轻篇公众号排版 · qingpian-wechat-editor  
> **文档类型：** 跨项目迁移实现指导（非 changelog · 非内部流水账）  
> **状态：** 基于 Sprint 4–8 已跑通实现与测试（2026-06-05 审计）  
> **目标读者：** 一键成稿等需要复用「预览即粘贴」经验的项目

---

## 文档说明

本文档总结轻篇 **已实现并测试通过** 的 Preview / Copy 一致性方案，提炼可迁移的架构经验、实现路径、关键代码与验收方法。

**实现状态标注约定：**

| 标注 | 含义 |
|------|------|
| ✅ 已实现并测试通过 | 代码 + 单测/快照 +（部分）实机粘贴 QA |
| ⚠️ 已实现但仍有风险 | 代码可用，但 Matrix/Drift 显示未全覆盖或 validator/实机分叉 |
| 📋 建议迁移 | 文档/流程/抽象，目标项目需自行实现 |
| 🚫 不建议直接迁移 | 与轻篇 Article Schema / 组件树强绑定 |

---

## 1. 背景与目标

### 1.1 为什么要做 Preview / Copy 一致性

轻篇的终态交付物不是网页预览，而是 **粘贴到微信公众号编辑器后样式基本一致的 HTML**（见 [`copy-to-wechat-pipeline.md`](copy-to-wechat-pipeline.md)）。用户心智是「预览即所得」；若 Preview 好看、粘贴后变形，则产品核心价值失效。

旧一键成稿项目的历史问题（见 [`wechat-copy-style-rules.md`](wechat-copy-style-rules.md) §4）在轻篇中被列为 **设计阶段硬约束**：

- Preview 与 Copy **各自维护样式** → 必然分叉
- 从 Preview DOM 抓取 HTML → 含 class、toolbar、非 export 节点
- Copy 依赖 wrapper 继承字号/颜色 → 微信粘贴后继承链断裂
- 复杂 layout（table 分栏、空壳 section、flex 左栏）→ 公众号后台改写 DOM

### 1.2 典型失真（轻篇实机与 Drift 记录）

| 失真类型 | 典型表现 | 轻篇案例 |
|----------|----------|----------|
| 字号 / 字重 | 粘贴后变小或回退默认字体 | 未 inline `font-size` / `font-family` 的文本节点 |
| 颜色 | 强调色、正文色丢失 | mark 未映射为 inline `color` |
| 间距 | margin/padding 塌缩 | 依赖父级 section 继承 |
| 卡片背景 / 边框 | 「没有显示卡片边框和背景色」 | 背景写在空 `section` 外壳而非 `p`（DRIFT-004~007） |
| 标题装饰 | 底部分割线变「高长方形」 | `border` 写在 table/分栏结构（DRIFT-002） |
| 左竖线 | 引言/引用左侧装饰消失 | 左栏 `span` + flex 分栏（DRIFT-009） |
| 列表 | 序号/圆点丢失或塌缩为单段 | list 在 Copy 中未保留 `ul/ol/li` 结构 |
| 强调 / 高亮 | `highlight` mark 背景消失 | 未 inline `background-color` |
| CTA | 按钮样式变纯文本 | 依赖 class 或 `display:flex` 居中 |

### 1.3 本方案目标

1. **单一样式来源：** Preview 与 Copy 共用 `resolveArticleStyle()` 产出的 `ResolvedArticleStyle` / token。
2. **成对 Renderer：** 每个 block × variant 同时具备 Preview 通道与 Copy 通道，禁止「只修 Preview」。
3. **微信安全 Copy Contract：** 所有 Clipboard HTML 遵守 `wechat-safe-contract-v1`；输出前可机检。
4. **分层验收：** snapshot → validator → Fidelity Matrix → **公众号实机粘贴** 四级，末级为裁判。
5. **失真闭环：** Drift 记录驱动 Contract / Renderer 修正，禁止静默扩权。

### 1.4 本方案不解决什么

- **不保证** 与 135 编辑器、浏览器打印、移动端系统 WebView 完全一致（仅以 **微信公众号后台编辑器** 为裁判）。
- **不覆盖** Release 1 外的能力：真实配图、小程序卡片、可点击外链 CTA、二维码实图等（仅有 placeholder 边界）。
- **不消除** 微信侧不可控过滤（字体回退、亚像素间距）——标为 WARNING，不冒充 PASS。
- **不替代** 用户粘贴后在公众号内二次手工编辑后的保真（需专项 QA）。
- **不让** Validator PASS 等同于粘贴 PASS。

---

## 2. 核心结论

```text
不要让 Preview 和 Copy 各自维护一套样式逻辑。
Preview / Copy 必须共享同一套 Article、Variant 选择结果、ResolvedStyle / design token。
Copy HTML 必须使用微信安全 inline style；禁止 class、<style>、外链样式表进入 Clipboard。
Preview 可用 React + class；Copy 必须独立生成 HTML 字符串，写入剪贴板前剥离 class。
每个 block × variant 必须成对实现 Preview Renderer 与 Copy Renderer。
VariantDefinition 必须声明 copySafety；preview_only 不得进入 Release 1 默认可用集。
卡片/引用/标题装饰：背景、边框、padding 写在内容节点（p / h1 / h3），section 仅作 margin wrapper。
新增 variant 必须先过 Copy HTML validator，再进 Fidelity Matrix，最后公众号实机粘贴验收。
实机 FAIL 必须写 Drift，按 Contract 修正流程闭环，禁止在 Renderer 静默扩权。
```

**轻篇 Sprint 8 关键修复（006C）：** 将「空壳 section / table 分栏承载视觉」改为 **copy-safe-primitives** 模式——视觉样式下沉到 `p`/`h1`/`h3`，`section` 只包 `margin`。8/8 Drift 复测 PASS（006D）。

---

## 3. 总体架构

### 3.1 一致性链路

```text
Article（统一主模型）
  → Style Assignment / Orchestrator（preset · variant 池选择）
  → resolveArticleStyle() → ResolvedArticleStyle（per-block tokens · slots · compatibility）
  → enrichResolvedBlockStyleForRenderer()（slot 可见性 · copySafety 过滤）
       ├─ mode=preview → Preview Renderer Registry → React 组件树（页面预览）
       └─ mode=copy    → Copy Renderer Registry    → HTML 字符串片段
  → buildCopyHtmlSnapshot() / assertCopySafeHtmlSnapshot()（legacy 快检）
  → validateWechatCopyHtml()（Contract v1 机检）
  → buildClipboardPayload() → text/html + text/plain
  → Fidelity Matrix / 实机 Paste QA / Drift 诊断
```

### 3.2 各层职责

| 层 | 职责 | 轻篇路径 |
|----|------|----------|
| Article + Block | 内容语义，不含视觉 | `src/core/article/` · `src/core/blocks/` |
| Style Registry / Variant | 声明 variant、token、copySafety、slot | `src/core/styles/variants/` · `registry.ts` |
| Style Resolver | 解析 preset/theme/variant → ResolvedBlockStyle | `src/core/styles/resolver.ts` |
| Preview Renderer | 读 ResolvedStyle，输出 React/DOM；可用 class/Tailwind | `src/core/renderer/` |
| Copy Renderer | 读同一 ResolvedStyle，输出 inline HTML 字符串 | `src/core/copy/` |
| Compatibility Profile | Green/Yellow/Red CSS、fallback、waiver | `src/core/wechat-compat/` |
| Validator | 扫描 Clipboard HTML，Red→fail、Yellow→warning | `src/core/wechat-compat/copy-html-validator.ts` |
| Clipboard | 拼接 block HTML + plain text fallback | `src/core/copy/clipboard-payload.ts` |
| QA 体系 | Matrix、Paste Session、Drift | `docs/agile/paste-qa/` |

### 3.3 共享 vs 分离

| 共享（必须同源） | 分离（不可强行合并） |
|------------------|----------------------|
| `Article` 数据源 | 输出形态：React vs HTML string |
| `resolveArticleStyle()` 结果 | Preview 可用 CSS variables / Tailwind |
| `ResolvedBlockStyle.tokens`（色值、字号等） | Copy 必须 inline 化后的具体 px/hex |
| Typography/layout **解析函数**（如 `resolveInfoCardTypography`、`copySafeNumberedSectionBadgeStyle`） | DOM 组装：Preview 组件树 vs Copy `wrapInlineElement` |
| `variantId` · `copySafety` · slot 绑定规则 | 交互：Preview 可有 hover；Copy 静态 |
| Inline mark 语义（bold/highlight/color） | 剪贴板写入与 DOM 抓取路径 |

### 3.4 如何避免 Preview-only 样式进入 Copy

1. **Variant 级：** `compatibility.copySafety === "preview_only"` 时，`render-block.ts` 在 `mode=copy` 发出 `copy_safety_warning`；Release 1 正式 variant 禁止 `preview_only`。
2. **Slot 级：** `SlotCopySafety.allowedInCopy === false` 的 slot 在 Copy 路径不输出（`resolved-view.ts`）。
3. **Renderer 级：** Copy 模块独立实现，不读取 Preview DOM；`copy-safe-html.ts` / `validateWechatCopyHtml` 拦截 class、gradient、flex/grid。
4. **出口级：** `buildCopyHtmlSnapshot` 对每 block HTML 调用 `assertCopySafeHtmlSnapshot`；推荐叠加 `validateWechatCopyHtml`。
5. **审计级：** S8-STORY-007 对「Validator FAIL 但 Paste PASS」做三角审计，区分 renderer 分叉 vs validator 误报。

---

## 4. WeChat-safe HTML / CSS Contract

**权威文档：** [`wechat-safe-html-css-contract.md`](wechat-safe-html-css-contract.md)（`wechat-safe-contract-v1`）  
**代码化 Profile：** `src/core/wechat-compat/wechat-compat-profile.ts` → `WECHAT_SAFE_CONTRACT_V1_PROFILE`

### 4.1 允许使用（Green）

**HTML 标签：** `p` · `span` · `strong` · `em` · `br` · `ul`/`ol`/`li` · `h1`–`h4`

**inline CSS（节选）：**

| 类别 | 安全写法 |
|------|----------|
| 字号 | `font-size: 16px` / `em`（token 须先解析为具体值） |
| 行高 | `line-height: 1.75` 或 `px` |
| 颜色 | `#333333` · `rgb()` |
| 字重 | `font-weight: 600` / `bold` |
| 字体 | 系统栈：`PingFang SC, Microsoft YaHei, sans-serif` |
| 间距 | `margin` / `padding` 各边长度值 |
| 背景 | `background-color` 纯色 |
| 边框 | `border` / `border-left` / `border-bottom` 等标准简写 |
| 对齐 | `text-align: left|center|right` |
| 显示 | `display: block` · `inline` · `inline-block` |
| 宽度 | `width: 100%` 或明确 `px` |

**标签使用边界：**

- `p`：段落、卡片内容、单行标题+徽章组合（heading numbered section）。
- `span`：行内强调、颜色片段、按钮外观（CTA）。
- `strong`/`em`：语义粗体/斜体；轻篇 Copy 路径常用 `span` + `font-weight`/`font-style` 替代。
- `section`：**Yellow**——仅作 **margin-only wrapper**，不得单独承载背景/边框（006C 铁律）。
- `h1`/`h3`：title/heading 语义；装饰线优先写在 heading 元素自身（`border-bottom`）。

### 4.2 慎用（Yellow）

须 **waiver + evidence** 方可进入默认 preset；否则 Validator warning、实机可能 FAIL：

- `section` / `div` 作 wrapper（计嵌套深度，≤3）
- `border-radius` · `box-shadow` · `linear-gradient` · `opacity`
- `letter-spacing` · `min-width` · `max-width` · `height`
- `table` 结构（仅特定 variant + Matrix 证据）
- `img`（R1 仅 `image_placeholder`）
- `a`（Release 1 默认不输出外链 href）

**已知 waiver 种子（不可外推）：** `heading_highlight_marker` 的 `linear-gradient` + `box-decoration-break`（证据 `PASTE-HEADING-HIGHLIGHT-20260603`），仅 warm preset 相关场景。

### 4.3 禁止或高风险（Red）

**不得进入 Clipboard HTML：**

| 类别 | 项 |
|------|-----|
| 样式载体 | `class=` · `<style>` · `<link rel=stylesheet>` · 外链 CSS |
| 布局 | `display: grid` · complex flex（flex + justify/gap 等） |
| 定位 | `position: absolute|fixed` · `z-index` |
| 视觉效果 | `transform` · `filter` · `backdrop-filter` |
| 动效 | `animation` · `transition` |
| 其它 | `var(--*)` · `calc()` · `!important` · pseudo-element · JS · `svg`/`script`/`iframe` |

**Preview 可用但 Copy 不安全（轻篇实践）：**

- Tailwind utility class → Preview only
- CSS variables → Preview only；Copy 前必须解析为字面量
- `display:flex` 分栏（左条+正文）→ 粘贴后结构变形（006C 改为单 `p` + `border-left`）
- table 模拟标题装饰线 → 粘贴后 border 展成块（DRIFT-002，改为 `h1` + `border-bottom`）
- 空 `section` 承载 `background-color` → 微信剥离或不可见（DRIFT-004~007，改为 `p` 承载）

---

## 5. Variant 如何保证 Copy-safe

### 5.1 Registry 与 copySafety 声明

- **Registry：** `src/core/styles/registry.ts` + `src/core/styles/variants/`（`text-first.ts` · `structured.ts` · `title-heading.ts` · `heading-publish-pool.ts` 等）。
- **每个 VariantDefinition** 含 `compatibility.copySafety`：`strict` | `balanced` | `preview_only`（见 `src/core/styles/types.ts`）。
- **Slot 级：** 每个 `SlotDefinition.copySafety` 含 `allowedInCopy`；decoration slot 常为 `balanced`。
- **解析时：** `resolveArticleStyle()` 将 variant 解析为 `ResolvedBlockStyle`；Copy 路径读取同一对象。

**Preview variant 与 Copy variant 映射：** 轻篇 **不维护两套 variant ID**；同一 `variantId` 下 Preview/Copy renderer 分别实现，共享 token。layout 差异通过 `TitleBlockLayoutMode` 等于字段分支（如 `title-block-copy.ts` 中 `layoutMode === "numbered"`）。

**降级规则：**

1. `copySafety: preview_only` → 不得进入 `release1_required`；Copy 路径 warning。
2. Style Resolver 可对不可用 variant 自动 fallback 到同 block 的 `release1_required` variant（`resolver.ts` `pickRegistryDefaultVariant`）。
3. Yellow CSS 在 Copy 输出前走 Profile `fallbackPolicy`（如 gradient → `background-color`）。
4. 实机 FAIL → Pattern 级修正（见 [`wechat-copy-safe-pattern-library.md`](wechat-copy-safe-pattern-library.md)），而非放宽 Contract。

### 5.2 典型 Block 示例

#### heading（`heading_short_line`）

| 项 | 内容 |
|----|------|
| Preview 表现 | `section` 包裹 `h3`，短横线装饰 + typography |
| Copy 策略 | `wrapCopySafeMarginSection` + `h3` inline 全量 typography；装饰 `border-bottom` 在 `h3` 上 |
| 易失真点 | 嵌套过深；装饰写在独立空节点 |
| 安全方案 | 006C `copy-safe-title-divider`；Matrix S8M-HEAD-001 Paste PASS |

#### paragraph（`paragraph_soft_card`）

| 项 | 内容 |
|----|------|
| Preview 表现 | 软底卡片段落 |
| Copy 策略 | `copySafeCardContentStyle` 将 `background-color`/`border`/`padding` 写在 **`p`** |
| 易失真点 | 背景在 `section` 外壳 |
| 安全方案 | `copy-safe-card` pattern；probe PARA-004 经 006C+006D PASS |

#### quote（`quote_left_bar`）

| 项 | 内容 |
|----|------|
| Preview 表现 | 左侧竖线引用 |
| Copy 策略 | 单 `p` + `copySafeLeftBorderContentStyle` |
| 易失真点 | 左栏 span 分栏 |
| 安全方案 | `copy-safe-left-border`；与 lead_quote_intro 同修法 |

#### list（`list_plain_bullets`）

| 项 | 内容 |
|----|------|
| Preview 表现 | `ul/ol` + `li` React 列表 |
| Copy 策略 | `list-copy.ts` 保留 `ul/ol/li`，每项 inline typography |
| 易失真点 | 塌缩为单个 `<p>` |
| 安全方案 | 结构保真 + inline `margin`/`padding`；S8M-LIST-001 Paste PASS |

#### info_card / key_takeaway（`info_card_key_takeaway`）

| 项 | 内容 |
|----|------|
| Preview 表现 | 要点卡片：标题 + 正文 |
| Copy 策略 | `info-card-copy.ts`：`p` 上 card 样式，标题用 `span display:block` |
| 易失真点 | 「没有显示卡片边框和背景色」（DRIFT-004） |
| 安全方案 | 006C 下沉至 `p`；006D PASS |

#### summary / highlight（`highlight_inline_emphasis`）

| 项 | 内容 |
|----|------|
| Preview 表现 | 段内强调 + 可选背景带 |
| Copy 策略 | `highlight-copy.ts` + `inline-content-html.ts` 映射 mark |
| 易失真点 | highlight mark 未 inline 背景色 |
| 安全方案 | `span` + `background-color:#fff3cd`；S8M-SUM-001 PASS |

#### cta（`cta_button_like`）

| 项 | 内容 |
|----|------|
| Preview 表现 | 按钮外观块 |
| Copy 策略 | `cta-copy.ts`：`span` + `display:inline-block` + 背景/圆角（Yellow，需 Matrix） |
| 易失真点 | 依赖 `button` 标签或 flex 居中 |
| 安全方案 | 视觉按钮样式，不依赖可点击链接；实机仍 UNTESTED（S8M-CTA-002） |

#### inline emphasis

| 项 | 内容 |
|----|------|
| Preview 表现 | `InlineContent` marks 渲染为 React span |
| Copy 策略 | `renderInlineContentToCopyHtml`：`bold`→`font-weight`；`highlight`→`background-color`；`color`→解析 theme token |
| 易失真点 | 颜色 token 未解析为 hex |
| 安全方案 | 与 `resolveInlineMarkColor` 共用 theme；禁止 `var(--*)` 进入 HTML |

---

## 6. Copy Renderer / Clipboard Pipeline

### 6.1 入口与数据流

```text
buildClipboardPayload({ article, resolvedArticleStyle, registry? })
  → buildCopyHtmlSnapshot()
       → for each block: renderBlock({ mode: "copy", target: "clipboard_html" })
       → assertCopySafeHtmlSnapshot(html)   // legacy 正则快检
  → buildArticlePlainText(article)           // text/plain 回退
  → { textHtml, textPlain, issues, warnings, metadata }
```

**主入口文件：**

- `src/core/copy/clipboard-payload.ts` — Clipboard 聚合
- `src/core/copy/copy-html-snapshot.ts` — 逐 block 快照
- `src/core/copy/index.ts` — 公开 API
- 应用层：`src/lib/copy-clipboard-payload.ts`（UI 复制按钮接线）

### 6.2 Block → HTML 映射

**Registry 分层（按 Sprint 演进，Release 1 用 first-wave 合集）：**

| Registry | 覆盖 block |
|----------|------------|
| `text-first-copy-registry.ts` | title · heading · lead · paragraph · divider |
| `structured-copy-registry.ts` | list · quote · highlight · info_card · cta · image_placeholder |
| `first-wave-copy-registry.ts` | 上述合并，Release 1 默认 |

每 block 对应 `src/core/copy/<block>-copy.ts`，内部调用共享 typography 解析器（多在 `src/core/renderer/` 同名的 `*-layout.ts` / `text-block-typography.ts`）。

### 6.3 inline style 生成

- `src/core/copy/inline-style.ts`：`buildInlineStyle()` · `wrapInlineElement(tag, styles, innerHtml)`
- `src/core/copy/copy-safe-primitives.ts`（006C）：`copySafeCardContentStyle` · `copySafeLeftBorderContentStyle` · `wrapCopySafeMarginSection`
- Token 在进入 HTML 前必须为字面量（`#576b95`、`17px`），禁止 `var(--*)`

### 6.4 Sanitizer / Validator 分工

| 工具 | 文件 | 作用 |
|------|------|------|
| Legacy 快检 | `copy-safe-html.ts` | 正则拦截 class、style 标签、gradient、flex/grid 等 |
| HTML 转义 | `html-escape.ts` | `escapeHtml` · `assertCopySafeHtml` |
| Contract Validator | `copy-html-validator.ts` | 完整 Green/Yellow/Red 分级 + waiver + 嵌套深度 |

**注意：** Validator **不是**通用 HTML sanitizer；它验证轻篇 Copy 片段是否符合 Contract。实机粘贴仍可能剥离 Validator 认为「有 waiver」的 Yellow 属性。

### 6.5 Clipboard 双 MIME

`ClipboardPayload` 同时提供：

- `text/html`：各 block HTML 用 `\n` 拼接
- `text/plain`：`plain-text.ts` 从 Article 结构抽取纯文本

避免 JSON、markdown、debug 字段进入 plain text；HTML 中禁止 `data-*` 调试属性（Contract §6）。

### 6.6 图片 / 占位

`image-placeholder-copy.ts`：R1 仅占位策略；`img` 为 Yellow 标签，须 Matrix + 实机。真实配图不在 Release 1 Contract 范围。

---

## 7. Preview / Copy 一致性测试体系

### 7.1 测试分层

| 层级 | 工具/路径 | 解决什么 | 不能解决什么 |
|------|-----------|----------|--------------|
| Token parity | `tests/core/styles/preview-copy-token-parity.test.ts` | 同一 `resolveArticleStyle` 下 preview/copy 色值字号一致 | 不证明 DOM 结构一致 |
| Block copy 单测 | `tests/core/copy/*-copy-renderer.test.ts` | 各 block HTML 结构、inline 属性 | 不证明公众号粘贴 |
| Snapshot | `tests/core/copy/copy-html-snapshot.test.ts` · `structured-copy-html-snapshot.test.ts` · `tests/snapshots/wechat-paste-qa/*.html` | 输出稳定、可 diff | 不证明微信不改写 |
| Legacy 快检 | `copy-safe-html.ts` 断言 | 拦截明显 Red 模式 | 无分级/waiver |
| Validator | `tests/core/wechat-compat/copy-html-validator.test.ts` | Contract Red/Yellow/Green | _catalog 缺口可误报_（HEAD-002） |
| Slot copy safety | `tests/core/styles/slot-copy-safety.test.ts` | slot 允许性 | 不覆盖实机 |
| Fidelity Matrix | `tests/support/wechat-fidelity-matrix-builder.ts` → `docs/agile/paste-qa/wechat-fidelity-matrix.md` | 37 行 block×variant 追溯 | 16 行仍 UNTESTED（截至 006D） |
| Paste QA Session | `docs/agile/paste-qa/wechat-paste-qa-workflow.md` · Session 2026-06-04/05 | **终态裁判** | 人工成本高 |
| Drift | `docs/agile/paste-qa/drift/DRIFT-S8-*.md` | 失真闭环 | 不自动修复 |

### 7.2 Fixture 结构

- Article fixtures：`tests/fixtures/articles/`（如 `r1-golden`）
- Copy fixtures：`tests/fixtures/copy/text-first-copy-fixtures.ts` · `structured-copy-fixtures.ts`
- Fidelity fixtures：`tests/fixtures/fidelity/`（S8 Matrix 专用 preset `s8_fidelity_matrix_test`）
- Paste QA HTML：`tests/snapshots/wechat-paste-qa/`（含 `006d/` 复测子目录）

### 7.3 真实公众号粘贴流程（✅ 已执行）

见 [`wechat-paste-qa-workflow.md`](../agile/paste-qa/wechat-paste-qa-workflow.md)：

1. 从 Paste QA pack 或 snapshot 复制 HTML
2. 粘贴到 **微信公众号后台**（非 135 作为主结论）
3. 对照 Preview / Clipboard / 粘贴后效果
4. 回填 Matrix `pasteStatus` / `pasteEvidence`
5. FAIL → `DRIFT-S8-YYYYMMDD-###`

**006D 成果（2026-06-05）：** 15 行复测 **15/15 PASS**（8 re-test + 2 harvest candidate + 5 control）。

### 7.4 推荐 CI 命令

```bash
# Copy / fidelity 相关（成本低）
pnpm exec vitest run tests/core/copy tests/core/wechat-compat tests/core/styles/preview-copy-token-parity.test.ts

# Matrix 再生（文档+数据）
pnpm exec vitest run tests/support/wechat-fidelity-matrix-builder.ts
```

---

## 8. Drift 诊断方法

**流程文档：** [`copy-drift-diagnostics.md`](copy-drift-diagnostics.md)

### 8.1 三份材料对比

固定 `fixtureId` + `variantId`，收集：

1. Preview HTML（或视觉截图）
2. Clipboard HTML（`tests/snapshots/wechat-paste-qa/<fixtureId>.html`）
3. WeChat pasted HTML（公众号「查看源码」）

标注 **首次出现差异的层级**（属性 / 节点 / 上下文）。

### 8.2 常见失真 → 归因

| 现象 | 优先怀疑 | 验证动作 |
|------|----------|----------|
| 字号变大/变小 | Copy 未 inline typography；微信规范化 | 查 Clipboard 是否含 `font-size`/`font-family` |
| 行高变化 | 父级继承断裂 | 对比 token parity 测试；查 `line-height` 是否在文本节点 |
| 颜色丢失 | token 未解析；mark 未映射 | 查 `inline-content-html.ts` 输出 |
| 背景/边框丢失 | 样式在 section 外壳 | 查是否违反 copy-safe-card |
| padding/margin 丢失 | 依赖相邻选择器或 collapse | 改为显式 inline margin |
| border/radius 变形 | table/分栏或 `border` 简写被展开 | 参考 DRIFT-002；改 title-divider pattern |
| 卡片变形 | flex/grid 或深层嵌套 | Validator + 查 `display` 声明 |
| 标题样式丢失 | `h1` chrome 被微信剥离 | DRIFT-003：产品接受 typography-first；或换 variant |
| 列表样式丢失 | Copy 塌缩为 `<p>` | 查 `list-copy.ts` 结构 |
| inline emphasis 丢失 | mark 未渲染 | 查 `renderInlineContentToCopyHtml` |
| CTA 失真 | 用了 `button`/flex | 查 `cta-copy.ts` |

### 8.3 归因决策树

```text
Clipboard HTML 已含正确 inline 样式？
  ├─ 否 → Copy Renderer / token 解析问题 → 修 src/core/copy 或共享 typography
  └─ 是 → 粘贴后样式仍不对？
        ├─ 是 → WeChat 兼容问题 → Contract 降级 / Pattern fallback / waiver+evidence
        └─ 否 → Preview 与 Clipboard 不一致？
              ├─ 是 → Preview/Copy 分叉（S8-STORY-007 类审计）→ 统一 token/结构
              └─ 否 → 测试方式问题（135/浏览器误判）→ 重跑公众号实机
```

**Validator FAIL + Paste PASS：** 先查是否 **validator catalog 缺口**（如 `font-variant-numeric` HEAD-002），非盲目改 Renderer。

---

## 9. 关键代码路径

| 文件 | 职责 | 迁移价值 |
|------|------|----------|
| `docs/architecture/wechat-safe-html-css-contract.md` | Contract v1 权威分级 | 📋 **可直接参考** contract 结构与修正流程 |
| `docs/architecture/wechat-copy-safe-pattern-library.md` | DOM/CSS pattern 规范（006C） | 📋 **可直接参考** pattern 定义方式 |
| `docs/architecture/copy-drift-diagnostics.md` | Drift 流程 | 📋 **可直接参考** |
| `docs/agile/paste-qa/wechat-fidelity-matrix.md` | 37 行验收矩阵 | 📋 **可参考** 行列设计 |
| `docs/agile/paste-qa/wechat-paste-qa-workflow.md` | 实机 QA SOP | 📋 **可直接参考** |
| `src/core/styles/resolver.ts` | 共享样式解析 | 🚫 依赖轻篇 StyleRegistry；**只参考思路** |
| `src/core/styles/variants/*.ts` | Variant + copySafety 声明 | 🚫 依赖轻篇 block 类型；**参考声明字段** |
| `src/core/styles/compatibility.ts` | CSS 属性分级逻辑 | 📋 **可参考** Profile 校验抽象 |
| `src/core/wechat-compat/` | Profile + Validator + waiver | 📋 **可参考** 分级机检实现 |
| `src/core/wechat-compat/copy-html-validator.ts` | Clipboard HTML 机检 | 📋 **可参考** 规则引擎结构 |
| `src/core/renderer/render-block.ts` | 统一 renderBlock(mode) | 📋 **可参考** preview/copy 分叉入口 |
| `src/core/renderer/context.ts` | 构建 BlockRenderContext | 🚫 与轻篇 ResolvedStyle 绑定 |
| `src/core/renderer/*-layout.ts` · `text-block-typography.ts` | 共享 typography 解析 | 🚫 直接复制需适配 schema |
| `src/core/renderer/heading-publish-decoration.ts` | Preview/Copy 共享 badge 样式 token | 🚫 heading 专用 |
| `src/core/copy/copy-safe-primitives.ts` | 006C DOM 原语 | 📋 **强烈建议参考** card/left-border/divider 模式 |
| `src/core/copy/inline-style.ts` | inline style 字符串构建 | 📋 **可参考** |
| `src/core/copy/inline-content-html.ts` | Inline mark → HTML | 📋 **可参考** mark 映射策略 |
| `src/core/copy/clipboard-payload.ts` | 双 MIME 输出 | 📋 **可参考** |
| `src/core/copy/copy-safe-html.ts` | Legacy 正则快检 | 📋 可作第二层快检；**不能替代** Contract Validator |
| `src/core/copy/*-copy.ts` | 各 block Copy 模板 | 🚫 与轻篇 Article/block content 强绑定 |
| `src/core/copy/first-wave-copy-registry.ts` | Copy registry 组装 | 📋 **参考** registry 模式 |
| `tests/support/wechat-fidelity-matrix-builder.ts` | Matrix 文档生成 | 📋 **可参考** fixture→validator→markdown |
| `tests/snapshots/wechat-paste-qa/` | Paste QA 样本 HTML | 📋 **可参考** 目录与命名 |
| `src/lib/render-article-preview-client.ts` | UI Preview 管线 | 🚫 轻篇页面专用 |
| `src/components/gallery/gallery-copy-preview-panel.tsx` | Gallery 预览+复制面板 | 🚫 UI 专用 |

---

## 10. 迁移到一键成稿的建议

### 10.1 建议迁移的内容

| 项 | 说明 |
|----|------|
| **Contract 思路** | Green/Yellow/Red 分级 + 禁止 silent 扩权 + 修正流程（§9） |
| **copy-safe DOM pattern** | card / left-border / title-divider：视觉在内容节点，section 只包 margin |
| **copy-safe token 原则** | 同一解析函数服务 Preview 与 Copy；token 进 HTML 前字面量化 |
| **variant copySafety 声明** | `strict` / `balanced` / `preview_only` + slot `allowedInCopy` |
| **Copy HTML Validator** | 机检 Red；Yellow 无 waiver → warning；**不**把 validator 当终态 |
| **Fidelity Matrix** | block × variant × fixture × validatorStatus × pasteStatus × contractAction |
| **Drift diagnostics** | 三份材料对比 + `DRIFT-*` 闭环 |
| **snapshot / fixture 结构** | Article JSON + Copy HTML snapshot + paste checklist 三联 |
| **实机 Paste QA SOP** | 公众号后台为唯一裁判；Session 表回填 Matrix |
| **成对 Renderer 纪律** | 新 variant 必须 Preview+Copy 同时交付 |
| **Plain text fallback** | `text/html` + `text/plain` 双写 |

### 10.2 不建议直接复制的内容

| 项 | 原因 |
|----|------|
| `src/core/article/` · Block Schema | 轻篇唯一主模型，与一键成稿结构可能不同 |
| `src/core/styles/variants/*` 具体 variant 定义 | 与轻篇 preset/池绑定 |
| `src/core/copy/*-copy.ts` 整文件 | 强绑定 block content 字段与 variantId |
| `src/core/renderer/*-preview.ts` React 组件 | 组件树/UI 栈不同 |
| `heading-publish-*` 发布池专用逻辑 | 轻篇 S7/S8 特有 |
| `harvest-candidate-*` | 轻篇 S8 候选池种子，非通用库 |
| Sprint 临时兼容、已废弃路径 | 见 `docs/architecture/references/prototype-*` 仅作教训 |
| Matrix 中 **probe** variant | 测试专用，非产品默认 |

### 10.3 一键成稿迁移顺序建议

```text
1. 审计一键成稿 Preview / Copy 现状
   - 是否两套样式来源？是否 DOM 抓取 Copy？
   - 列出 block 类型与现有失真（对照 §1.2）

2. 建立一键成稿 WeChat-safe Copy Contract
   - 从轻篇 Contract v1 摘录 Green/Yellow/Red（按己方实机微调）
   - 禁止 class / <style> / complex flex/grid 进入 Clipboard

3. 建立 copy-safe variant registry / 映射规则
   - 每 variant 声明 copySafety
   - 设计阶段回答：能否完整 inline 化？嵌套 ≤3？

4. 改造 Copy HTML 输出
   - 独立 Copy Renderer（不从 Preview DOM 抓取）
   - 引入 copy-safe-primitives 等价物：视觉下沉到 p/h1/h3
   - 与 Preview 共享 typography/token 解析函数

5. 增加 validator / fixture / snapshot
   - validateCopyHtml(contractProfile, html)
   - 每 block × variant 固定 fixture + HTML snapshot 测试

6. 做真实公众号粘贴验收
   - Fidelity Matrix 回填 pasteStatus
   - FAIL 写 Drift，按 contract 修正

7. 根据 drift 逐项修复
   - 优先结构问题（空壳 section、table 分栏）
   - 再处理 Yellow waiver（gradient、radius 等）
   - Validator/catalog 缺口单独登记，勿为讨好 validator 删实机可用样式
```

### 10.4 一键成稿应对轻篇已验证的「坑」

| 轻篇 Drift/案例 | 一键成稿应避免 |
|-----------------|----------------|
| DRIFT-002 title_bottom_line | 不用 table/多列模拟装饰线；用 `h1`+`border-bottom` |
| DRIFT-004~007 卡片背景丢失 | 背景/边框写在 `p`，不写空 `section` |
| DRIFT-009 lead 左线 | 单 `p`+`border-left`，不分栏 |
| DRIFT-003 title_plain | 接受 `h1` chrome 被剥离或换 `title_left_bar` 类 variant |
| HEAD-002 validator 误报 | 建立「Validator FAIL + Paste PASS」审计分类 |
| 006C 经验 | 先修 DOM 结构，再争论 Contract 是否放宽 |

---

## 11. 已知限制与后续建议

### 11.1 当前限制（轻篇如实状态）

| 限制 | 说明 |
|------|------|
| 微信后台不可控 | 过滤规则无完整公开规范；WARNING 级差异仍存在 |
| Matrix 覆盖不全 | 37 行中 16 行 `pasteStatus=UNTESTED`（截至 006D 文档） |
| Validator catalog 缺口 | 未编目属性（如 `font-variant-numeric`）fail-safe 标 Red |
| Yellow 属性 | `border-radius`·`box-shadow` 等需 per-variant evidence，非全局 Green |
| `heading_highlight_marker` gradient | 仅有 per-variant waiver，**禁止**外推到其他 block |
| 图片 | R1 仅 placeholder；真实配图需专项 Contract |
| CTA 链接 | 默认不输出可点击 `href` |
| mobile preview | 页面预览与微信粘贴环境不完全等价 |
| 手工编辑后 Copy | 用户在公众号内改样式后的保真未系统化测试 |

### 11.2 后续建议（轻篇路线，供参考）

- **S9 Style Management：** variant 生命周期、compatibility metadata、QA evidence 挂在样式资产上（DECISION-092）。
- **Validator catalog 补全：** 区分 unknown vs forbidden；减少 HEAD-002 类误报。
- **补完 Matrix UNTESTED 行：** 按 Paste QA pack 分批实机。
- **一键成稿：** 优先落地 Contract + copy-safe pattern + 成对 renderer，再追求 variant 数量。

---

## 12. 参考文档索引

| 文档 | 路径 |
|------|------|
| 渲染链路 | `docs/architecture/rendering-pipeline.md` |
| Copy 管线 | `docs/architecture/copy-to-wechat-pipeline.md` |
| 微信复制规则 | `docs/architecture/wechat-copy-style-rules.md` |
| Contract v1 | `docs/architecture/wechat-safe-html-css-contract.md` |
| Pattern 库 | `docs/architecture/wechat-copy-safe-pattern-library.md` |
| Drift 诊断 | `docs/architecture/copy-drift-diagnostics.md` |
| Fidelity Matrix | `docs/agile/paste-qa/wechat-fidelity-matrix.md` |
| Paste QA 流程 | `docs/agile/paste-qa/wechat-paste-qa-workflow.md` |
| HEAD-002 审计 | `docs/architecture/audits/s8-story-007-head-002-preview-copy-validator-audit.md` |
| 旧项目教训 | `docs/architecture/references/prototype-style-system-technical-lessons.md` |

---

## 变更记录

| 日期 | 变更 | 分支 |
|------|------|------|
| 2026-06-05 | 初版：跨项目 Preview/Copy 一致性实现指导 | `docs/preview-copy-fidelity-implementation-guide` |
