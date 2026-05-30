# 一键成稿 Style System 技术经验提取

> **文档定位：** 旧项目「一键成稿 / miaopian-demo」中 Style System、Component DSL、Preview/Copy Renderer、微信公众号复制兼容等相关**技术经验提取**。  
> **不记录**历史演进、分支过程、Sprint/Day 叙事。  
> **用途：** 供轻篇项目审计 [`style-system.md`](../style-system.md) 时作技术参考；**不代表**轻篇最终方案。  
> **依据：** 以仓库内代码与架构/审计文档为准；标注「未找到明确依据」处为轻篇需自行验证。

---

## 1. 文档目的

本文只回答：**旧项目在样式与复制链路上，实际采用了哪些结构、机制、约束与反例，对未来 Style System 设计有何启示。**

不回答：某次迭代为何发生、某分支 merge 顺序、PO 当时如何决策。

---

## 2. 旧项目 Style System 的实际组成

旧项目**没有**名为 `StyleSystem` 的单一模块；样式能力分散在以下层次，且**并未完全统一**。

```text
Article / NormalizedBlock（内容与结构）
        │
        ├─► Stream 语义层（JSONL flat type + 结构化字段）
        │         heading / paragraph / list / steps / pros_cons …
        │
        ├─► normalizeBlocks（部分 block 升级为 Component DSL 形态）
        │         heading → titleBlock { component, variant, slots }
        │         cta stream → actionBlock
        │
        ├─► StylePreset + ThemePreset → displayPreset（mergeDisplayPreset）
        │         tokens（字号/颜色/间距）
        │         blockStyles（heading/quote/infoCard/action 等 DSL 块参数）
        │         variant pools + componentDefaults
        │         previewShell（页面 preview 壳层，非 block 语法）
        │
        ├─► Style Orchestrator（orchestrateBlocks）
        │         文章级 title/quote/infoCard/action variant 选择与节奏 dampen
        │         不覆盖 P0 语义新 block
        │
        ├─► StyleSettings（用户 UI）
        │         切换 stylePreset / theme / heading variant；不重生成正文
        │
        ├─► Preview Renderer（多条路径）
        │         titleBlockPreviewClean / componentPreview
        │         BlockRenderer 内联 paragraph
        │         P0BlockPreviewSections（cardShellStyle 默认）
        │         brandTheme（Generate 页面壳层，非文章 block 语法）
        │
        └─► Copy Renderer
                  buildWechatHtml → normalizedArticleBlockToHtml
                  componentHtml（DSL 块）
                  P0 新 block → p0BlockPlainText → 单段 <p>（结构降级）
                  copyWechatToClipboard（ClipboardItem html + plain）
```

### 2.1 各层真实关系

| 层次 | 职责 | 与其它层关系 |
|------|------|--------------|
| **Article / Block** | 成稿唯一数据模型；含 DSL 块（`component`+`variant`+`slots`）与 P0 扁平语义块 | 生成终态 `done.article` 为可信源 |
| **Stream 语义协议** | 主生成路径输出 JSONL flat type，非 Component DSL | `normalizeBlocks` 将 heading 等升为 DSL |
| **Component DSL** | 视觉组件抽象：titleBlock / quoteBlock / infoCardBlock / actionBlock / imageBlock | 仅部分 block 走 DSL；**非 stream 主路径**仍用 `generateSystemPrompt` + `mapArkJsonToArticle` 输出 DSL |
| **StylePreset** | 文章「风格」：字号密度、blockStyles、variant 池、默认 variant | 结构字段；切换不重生成正文 |
| **ThemePreset** | 主题色板 | 经 `mergeDisplayPreset` 写入 `tokens` 与部分 `blockStyles` |
| **displayPreset** | runtime 合并结果 | preview 与 copy **应**共用（设计上如此） |
| **orchestrateBlocks** | 文章级 variant 编排、quote 强度限制、infoCard ordinal 规则 | 输入 normalize 后 blocks；输出 orchById 供 render/copy |
| **StyleSettings** | 用户切换 preset/theme/title variant | 只重算 displayPreset + orchestration，不改 Article 文本 |
| **Preview Renderer** | React 组件渲染 | 多条路径并存（见 §5） |
| **Copy Renderer** | 从 Article 重新生成 inline HTML | **非 DOM 抓取**；`WECHAT_HTML_EXPORT_SAFE_RULES` |
| **P0BlockPreviewSections** | P0 语义块最小 preview | 统一 `cardShellStyle()`；与 copy 不同源 |
| **titleBlockStyleConfig** | titleBlock preview/copy 共用 token 与 HTML 序列化 | DSL 中最成熟的一对 renderer 配置 |
| **brandTheme** | Landing/Generate UI 壳 | **不**承担 block visual grammar |

### 2.2 双轨事实（对轻篇设计至关重要）

| 轨 | 生成 | 渲染/复制 |
|----|------|-----------|
| **DSL 轨** | 非 stream API、`generateSystemPrompt` 要求 model 输出 component | titleBlock/quote/infoCard/action 成对 preview+copy |
| **P0 语义轨** | stream JSONL 12 type 白名单 | preview 有 card UI；copy 降级 `<p>` |

**未找到统一 StyleDefinition 层**将两条轨合并；后续方案文档（P0VisualRecipe / Space Style）在部分代码线中尝试补齐，**本仓库主线文档分支未必含完整实现**。

---

## 3. 可复用的技术思想

### 3.1 Preset / Theme 分离

- **机制：** `StylePreset`（版式、密度、blockStyles、variant 池）与 `ThemePreset`（色板）独立；`mergeDisplayPreset(preset, themeId)` 生成 runtime `displayPreset`。
- **价值：** 用户可「换风格不换正文」「换配色不重生成」；轻篇可映射为 **StyleDefinition.basePreset + themeTokens** 两层。
- **依据：** `config/themePresets.ts`、`config/stylePresets.ts`、`components/StyleSettings.tsx`。

### 3.2 Slot / Variant / Family

- **机制：** DSL 块含 `variant`（布局皮肤）与 `slots`（badge、icon、decorationLine 等结构化子区域）；titleBlock 另有 `family`（simple / badgeTitle / magazine / cardTitle）。
- **价值：** 同一语义组件多种视觉皮肤；slot 驱动结构分支而非硬编码多个 block type。
- **轻篇用法：** StyleDefinition 或 Style AST 节点应支持 **variantId + slotBindings**；imported template 可映射到 variant+slot 填充规则。
- **依据：** `types/stylePreset.ts`、`types/article.ts` HeadingBlockNew 等。

### 3.3 Style Orchestrator / 文章级节奏

- **机制：** `orchestrateBlocks()` — 整篇统一 title variant；quote 强 variant 数量限制；infoCard 按 ordinal 降级；action 末块策略；hash seed 确定性选 variant。
- **价值：** 防止「每块随机 variant」导致 Demo 感；控制连续强 card/quote。
- **轻篇用法：** StyleDefinition 之上应有 **ArticleStylePlan** 或 orchestrator，输入 block 序列 + profile，输出每块 resolved variant。
- **缺口：** orchestrator **不覆盖** P0 list/steps/pros_cons 等（审计明确）。
- **依据：** `lib/orchestrateBlocks.ts`、`docs/agile/s2-d5-current-style-system-audit-composer.md` §6。

### 3.4 titleBlock 的 Preview / Copy 同源经验

- **机制：** `getTitleBlockStyleConfig()` 产出 `TitleBlockStyleBundle`；preview 用 `styleMapToCssProperties`；copy 用 `toHtmlStyle` + `renderTitleBlockToHtml`；共用 `WECHAT_HTML_EXPORT_SAFE_RULES`。
- **价值：** 标题是旧项目**相对最成熟**的 block；证明 **shared style config → dual renderer** 可行。
- **轻篇用法：** 每个 block type 的 Release 1 至少应有一个 **reference implementation** 遵循同一 StyleDefinition 片段。
- **依据：** `lib/titleBlockStyleConfig.ts`、`lib/componentHtml.ts`、`lib/titleBlockPreviewClean.tsx`。

### 3.5 Inline style copy

- **机制：** 公众号 HTML 全部 **inline style**；禁止 Tailwind class 进入 export HTML。
- **价值：** 微信编辑器剥离 class；可预测粘贴结果。
- **轻篇用法：** Copy Renderer 输出应为 **style 字符串或 StyleRecord**，不是 React className。
- **依据：** `WECHAT_HTML_EXPORT_SAFE_RULES` in `lib/titleBlockStyleConfig.ts`。

### 3.6 Copy Renderer 非 DOM 抓取

- **机制：** `buildWechatHtml(article, preset, orchestratedBlocks, orchById)` 从数据模型重建 HTML。
- **价值：** preview DOM 含 toolbar、Tailwind、交互壳；抓取必然污染或丢结构。
- **轻篇用法：** Copy 路径必须是 **pure function(article, styleDefinition) → html**。
- **依据：** `lib/htmlExporter.ts`、`lib/wechatCopy/copyWechatToClipboard.ts`。

### 3.7 Copy-safe rules（显式常量）

- **机制：** `WECHAT_HTML_EXPORT_SAFE_RULES` 列出允许/禁止模式（无 flex gap 复杂布局、无 CSS 变量、无外部字体链接等）。
- **价值：** 可审计、可教给模型/开发者；轻篇可扩展为 **WeChatCompatibilityProfile**。
- **依据：** `lib/titleBlockStyleConfig.ts`。

### 3.8 Block-aware style assignment

- **机制：** 复制时使用 **orchestrated** blocks（非 raw ArticleBlock），保证与 preview 同一 variant 决策。
- **价值：** 样式分配是文章级函数，不是 per-request 随机。
- **轻篇用法：** Renderer 输入应为 **ResolvedBlock = content + resolvedStyle**。
- **依据：** `useWechatCopy` → `orchById`。

### 3.9 Density / layoutRhythm

- **机制：** `StylePreset.density` → `layoutRhythm(preset)` 推导 margin/padding 节奏。
- **价值：** 间距随风格变化，而非写死在组件。
- **轻篇用法：** StyleDefinition 应含 **density** 或 spacing scale token。
- **依据：** `lib/layoutRhythm.ts`。

### 3.10 Fixture / Paste QA 前置

- **机制：** 多份 `scripts/verify-*` 测 builder/SSE；**BL-091** 要求粘贴保真 PO 验收（仍为 Ready）。
- **价值：** 代码 Done ≠ 粘贴 Done。
- **轻篇用法：** 每 block × variant 应有 **copy HTML golden + paste checklist**。
- **依据：** `docs/agile/backlog.md` BL-091；审计 §8。

### 3.11 用户侧样式切换不重生成

- **机制：** StyleSettings 明确文案：「仅影响预览与复制，不重新生成正文」。
- **价值：** Style 层必须是 **pure overlay** on Article。
- **轻篇用法：** StyleDefinition 变更不得 mutate content blocks。
- **依据：** `components/StyleSettings.tsx`。

### 3.12 Visual Layer 思想（方案级，非必须迁移代码）

- **思想：** 语义 block 与 visual recipe 分离；recipe 同时驱动 preview 与 copy；`copySafety: strict | balanced | preview_only`。
- **价值：** 解决「语义 ≠ card」与「preview/copy 同源」的形式化表达。
- **轻篇用法：** 可吸收为 **StyleDefinition / StyleRecipe**，不必沿用 `P0VisualRecipe` 字段名。
- **依据：** `docs/agile/s2-d5-p0-block-visual-layer-plan.md`（方案文档）；**完整代码实现未找到明确依据于本仓库当前文档分支。**

---

## 4. 不应迁移的实现方式

| 实现 | 技术风险 | 依据 |
|------|----------|------|
| **旧 Component DSL 实现代码整体搬迁** | 与 P0 语义 block 混用；stream 不产出 DSL；prompt 双轨 | 审计 §9 |
| **P0 preview / copy 分裂** | preview 有 card/list 结构，copy 变 `<p>`，用户粘贴体验崩塌 | `htmlExporter.ts` `p0BlockPlainText` |
| **preview-only 样式** | 功能看似完成，发布链路不可用 | 审计 §8.4 |
| **cardShellStyle 统一卡片壳** | 所有 P0 非段落块视觉同质，像组件 Demo | `P0BlockPreviewSections.tsx` |
| **多套 renderer 无共享定义** | BlockRenderer / P0Sections / componentPreview / htmlExporter 分叉维护 | 审计 §4.2 |
| **多套 block 结构并行** | P0 扁平字段 + DSL slots + legacy heading 形态并存 | `types/article.ts` |
| **normalize 胶水升级** | stream heading 静默升为 titleBlock，语义与生成协议隐式耦合 | `lib/normalizeBlocks.ts` |
| **prompt 同时承担语义与视觉** | `generateSystemPrompt` 要求 model 选 variant/slots；不可控、难测试 | `lib/generateSystemPrompt.ts` |
| **silent fallback / plain text 降级** | P0 copy 静默丢结构，无 copySafety 标记 | `normalizedArticleBlockToHtml` switch |
| **God Component 承载样式状态** | `HomePageClient` 同时持有 preset/theme/orchestration/copy；难测难拆 | 架构审计 |
| **无 variant registry** | variant 列表硬编码在多个文件，扩展需改多处 | 审计 §6.5 |
| **brandTheme 承担 block 样式** | 页面 UI token 与文章 block grammar 混淆 | 审计 §5 |
| **DOM 抓取复制** | 未采用；若引入则高风险 | 审计 §8.2 明确非 DOM |
| **135 编辑器作为唯一验收** | **未找到明确依据**；backlog 仅提微信后台 | BL-091 |

---

## 5. Preview / Copy 一致性的技术经验

### 5.1 为什么必须共享 StyleDefinition / StyleRecipe

- Preview 与 Copy 是同一 Article 的两种**输出通道**；若 Style 决策只存在于 React 组件内联 style，Copy 路径无法复现。
- 旧项目反例：P0 块 preview 用 `cardShellStyle` + 结构化 JSX，copy 用 `p0BlockPlainText` → **不同源**。

### 5.2 为什么不能 preview 一套、copy 另一套

- 用户心智：「预览即所得」；公众号粘贴是最终交付。
- 维护成本：每次 preview 改动需手工同步 HTML 字符串，必然遗漏（旧项目 P0 块已发生）。

### 5.3 为什么 Copy HTML 不能从 DOM 抓取

- Preview DOM 含编辑 toolbar、Tailwind class、sticky 布局、非 export 节点。
- 微信 Clipboard 需要**干净、完整、inline** 的 HTML 文档片段。

### 5.4 Inline style 作为 Copy Renderer 输出

- 每条可见文本节点应携带必要 typography（轻篇 W1 经验：**card 内文字不能依赖 wrapper 继承** — 该 contract 代码在扩展迭代线，**本分支未找到 `wechatCardTypographyContract.ts`**，原则仍应纳入轻篇规范）。
- 使用 `section` / `p` / `span`；复杂 layout 用 block 堆叠而非 flex/grid（titleBlock 编号同行等需专门 phrase 规则 — **扩展线有 heading contract，本分支仅有 titleBlockStyleConfig 通用规则**）。

### 5.5 每个 block × variant 的交付标准

| 标准 | 说明 |
|------|------|
| **成对 renderer** | PreviewRenderer + CopyRenderer 同签 StyleDefinition |
| **结构保真** | list/steps/pros_cons 在 copy 中不得塌缩为单段 `<p>` |
| **copySafety** | `preview_only` variant 不得进入 Release 1 默认可用集 |
| **verify 脚本** | HTML 结构断言（非粘贴替代） |
| **paste QA** | 微信公众号编辑器直粘（人工或 fixture 驱动） |

### 5.6 Done（代码）vs Done（粘贴 QA）

- **BL-090**（复制按钮）Done ≠ **BL-091**（粘贴样式稳定）Done。
- 轻篇应分开：**Renderer merged** vs **Paste fidelity signed off**。

---

## 6. Component DSL 的经验提取

### 6.1 核心价值

- 用 **component + variant + slots** 表达**视觉组件**，与「文章语义 type」解耦。
- 成对 **componentPreview ↔ componentHtml** + **orchestrateBlocks** 实现文章级节奏。
- **StylePreset** 提供 variant 池与 token，而非在 prompt 里写 CSS。

### 6.2 component / family / variant / slots / tokens 关系

```text
StylePreset.tokens + blockStyles
        │
        ▼
componentDefaults + variantPools
        │
        ▼
orchestrateBlocks → 每块 { component, variant, slots }
        │
        ├─► family（titleBlock 分组，影响 slot 默认）
        ├─► variant（皮肤/布局枚举）
        └─► slots（badge, icon, decorationLine, items… 结构化内容区）
        │
        ▼
Renderer 读取 variant 分支 + slot 启用状态 + preset tokens → 具体 CSS
```

### 6.3 旧 DSL 最大问题

1. **Stream 主路径不输出 DSL**（除 heading/cta normalize 升级），导致 DSL 与 P0 语义**双轨**。
2. **无统一 registry**；variant 枚举分散。
3. **P0 新 block 未接入** DSL 或 visual variant 层。
4. **非 stream prompt** 仍要求 model 选 variant — 视觉决策在 LLM，难回归测试。

### 6.4 轻篇是否应继承 DSL 思想

**建议继承思想，不继承旧实现。**

- 继承：component 抽象、variant 池、slot、orchestrator、成对 renderer、copy-safe rules。
- 不继承：让 LLM 直接输出完整 DSL JSON；normalize 静默升级；P0/DSL 双轨无 StyleDefinition。

### 6.5 若继承，建议升级形式

| 旧 | 建议升级 |
|----|----------|
| model 输出 variant | **前端 StyleResolver** 根据 semantic block + StyleDefinition 解析 variant |
| 硬编码 variant 文件 | **VariantRegistry**（componentId → variants[]） |
| componentPreview/componentHtml 手写 | **StyleDefinition 驱动** 或 codegen 成对 renderer |
| slots 随 DSL 下发 | slots 保留为**内容结构**；视觉 slot 样式来自 StyleDefinition |

### 6.6 与 StyleDefinition / Style AST / Imported Template

- **Imported template** 应映射为：preset 默认值 + 每 component 的 variant 绑定 + slot 样式覆盖。
- **Style AST** 可表达：nested layout nodes + token refs + copySafety 标记。
- **systemPreset** = 内置 registry 条目；**userStyleLibrary** = 用户保存的 StyleDefinition 快照。

---

## 7. StyleDefinition / Style AST 设计启发

### 7.1 为什么需要 StyleDefinition

- 旧项目 Style 散落在 `BlockRenderer`、`P0BlockPreviewSections`、`htmlExporter`、`componentHtml` — 无法回答「这篇文章用了什么视觉规则」。
- Preview/Copy 分裂的根因是**缺少中间层**。

### 7.2 位置：Article 与 Renderer 之间

```text
Article (content, semantic types)
        │
        ▼
StyleResolver(Article, StyleDefinition, UserOverrides) → ResolvedArticleStyle
        │
        ├─► PreviewRenderer(ResolvedArticleStyle)
        └─► CopyRenderer(ResolvedArticleStyle)
```

### 7.3 StyleDefinition 最小字段建议

| 字段 | 说明 |
|------|------|
| `id` / `version` | 稳定标识 |
| `sourceType` | `systemPreset` \| `generatedStyle` \| `importedTemplate` \| `userStyleLibrary` |
| `basePresetId` | 版式引用 |
| `themeTokens` | 色板 |
| `density` | 间距尺度 |
| `componentRules` | componentId → { defaultVariant, allowedVariants, tokenOverrides } |
| `semanticRules` | semanticBlockType → component mapping 或 layout recipe |
| `copySafety` | 默认 strict |
| `wechatProfile` | 兼容规则引用 |

### 7.4 sourceType 扩展

| sourceType | 含义 |
|------------|------|
| `systemPreset` | 内置，Release 1 必做 |
| `generatedStyle` | AI 推荐 StyleDefinition（仅建议，需 resolver 校验） |
| `importedTemplate` | 从参考文章提取的特征 → 归一化 recipe（旧项目**未实现**，方案预留） |
| `userStyleLibrary` | 用户保存/分享 |

### 7.5 Release 1 范围建议

- **必须实现：** `systemPreset` + StyleResolver + 成对 Preview/Copy + WeChat profile + paste QA 最小集。
- **必须预留：** `sourceType` 字段、registry 扩展点、importedTemplate adapter 接口（可 stub）。
- **不应：** 把 `preview_only` variant 标为默认可用。

---

## 8. 微信公众号 HTML / CSS 兼容经验

### 8.1 推荐标签

- `section`（块容器）、`p`（段落）、`span`（行内强调）
- 标题：`h1` 用于文章 title；块内小标题多用 `section` + styled `div`/`span`（titleBlock 路径）

### 8.2 推荐 CSS 属性（inline）

- `font-family`, `font-size`, `line-height`, `font-weight`, `color`
- `margin`, `padding`, `border`, `border-radius`, `background`
- `text-align`, `letter-spacing`
- `white-space`, `word-break`（同行 phrase 场景 — heading 扩展线经验，本分支 titleBlock 有专门 config）

### 8.3 风险 CSS / 布局

- 复杂 **flex / grid**（公众号易降级或拆行）
- **absolute** 定位
- **CSS 变量**、**动画**、**hover**、**transition**
- **外部字体链接**
- 依赖 **wrapper 继承** 的 typography（card 内文字 — 扩展线经验，**本分支 htmlExporter 部分仍写在 wrapper div 上**）

### 8.4 禁止或谨慎

- Tailwind class 进入 copy HTML（**明确禁止** — WECHAT rules）
- 空 span 撑布局、table/table-cell 维持标题同行（扩展线 heading contract 结论 — **本分支未完整实现**）
- preview 用 grid，copy 无对等（pros_cons preview 曾用 grid — 审计提示 copy 风险）

### 8.5 图片 / 外链

- 复制使用 OSS 稳定 URL；本地 blob 需用户上传（`describeWechatImageCopyBanner`）
- **未找到**公众号对外链按钮/小程序卡的完整兼容矩阵 — 轻篇需重新验证

### 8.6 Clipboard 双格式

- 优先 `ClipboardItem`：`text/html` + `text/plain`
- fallback `writeText(html)` — 体验降级，需提示（`shouldWarnTextOnlyClipboard`）

### 8.7 粘贴 QA 规则

- 结构：列表/步骤/对比分组不消失
- Typography：字号颜色在**文本承载节点**上可见
- 标题：编号与标题同行（若 variant 需要）
- **Done（代码）** + **Done（粘贴 QA）** 分离

### 8.8 依据不足项

| 项 | 说明 |
|----|------|
| 135 编辑器兼容性 | **未找到明确依据** |
| 完整 CSS 支持矩阵 A/B/C | 方案提及，**未找到正式矩阵文档于本分支** |
| 全控件 paste 自动化 | **未找到** |

---

## 9. 对轻篇 style-system.md 审计的建议清单

| # | 检查项 | 旧项目对照结论 |
|---|--------|----------------|
| 1 | 是否有 **StyleDefinition**（或等价中间层） | **无** — 样式散落各 renderer |
| 2 | 是否区分 **preset / theme / variant / token** | **部分** — preset/theme 清晰；P0 无 variant |
| 3 | 是否有 **registry**（component/variant） | **无** — 硬编码枚举 |
| 4 | Preview / Copy **共享机制**是否定义 | **仅 DSL 块大致同源**；P0 **不同源** |
| 5 | 是否定义 **Copy Safety** | **部分** — WECHAT rules；无 preview_only 治理 |
| 6 | 是否定义 **WeChat compatibility** | **部分** — titleBlock rules；不全 |
| 7 | **importedTemplate** 扩展点 | **未实现** |
| 8 | 是否避免 **preview_only** 进入 R1 交付 | **未治理** — P0 preview 曾长期无 copy |
| 9 | **block × variant × paste QA** 验收 | **BL-091 未 Done** |
| 10 | 语义 block 与 visual 是否解耦 | **设计意图是**；实现**未完成** |
| 11 | LLM 是否输出 visual/CSS | Stream **不应**；旧 prompt **仍要求** DSL variant |
| 12 | Style 切换是否 mutate content | **否** — StyleSettings 设计正确 |
| 13 | orchestrator 是否覆盖所有 block types | **否** — 仅 DSL 子集 |
| 14 | inline emphasis 协议 | **无** |
| 15 | fixture：copy HTML golden | **无** |
| 16 | density / spacing scale | **有** — layoutRhythm |
| 17 | 双轨 renderer 是否显式标注 deprecated 路径 | **无** — 技术债 |

---

## 10. 最终建议摘要

### 10.1 应继承的思想

- **StyleDefinition 位于 Article 与 Renderer 之间**，Preview/Copy 同源。
- **Preset / Theme 分离**；用户切换不重生成正文。
- **Component 抽象 + variant + slot + orchestrator**（由前端解析，非 LLM 选 CSS）。
- **titleBlock 模式**：shared config + dual renderer + WECHAT safe rules。
- **Inline style copy**；**禁止 DOM 抓取**。
- **Copy fidelity 为 Release 1 P0**；区分代码 Done 与粘贴 QA Done。
- **copySafety** 与 **preview_only 隔离**。
- **Fixture + verify + paste checklist** 三联验收。

### 10.2 必须避免的实现

- P0 preview card + copy plain `<p>` 分裂。
- 无 registry 的硬编码 variant。
- 多套 renderer 无共享 StyleDefinition。
- cardShellStyle 作为默认唯一视觉。
- LLM 输出 variant/CSS 作为主路径。
- 复制功能先上、保真后补。
- 迁移旧仓库 DSL/P0VisualRecipe/Space Style **代码**而不重构。

### 10.3 轻篇 Style System 建议方向

1. 定义 **单一 StyleDefinition schema** + **VariantRegistry**。
2. 定义 **StyleResolver**：`Article + StyleDefinition → ResolvedStyle per block`。
3. 实现 **PreviewRenderer** 与 **CopyRenderer** 接口，共享 ResolvedStyle。
4. 内置 **WeChatCompatibilityProfile**（从 WECHAT_HTML_EXPORT_SAFE_RULES 扩展）。
5. Release 1 仅 **systemPreset**；预留 importedTemplate / userLibrary。
6. 每个 semantic block type 上线门槛：**成对 renderer + copy HTML test + paste QA case**。

### 10.4 轻篇落地前需补齐的技术决策

| 决策 | 说明 |
|------|------|
| Semantic block 与 visual component 映射表 | 避免 selling_point ≡ infoCard 语义混淆 |
| LLM 输出边界 | 仅 semantic fields，visual 全在前端 |
| CopySafety 枚举与降级策略 | strict / balanced / preview_only 治理 |
| WeChat 直粘 vs 第三方编辑器验收范围 | 旧项目仅明确微信后台 |
| Inline emphasis 是否 R1 | 旧项目无 |
| Imported template 提取边界 | 只提取 visual features → StyleDefinition，非原文 HTML |
| Style AST 是否必要 | 若 variant 复杂度高则建议有；R1 可用简化 StyleDefinition |

---

## 11. 关键文件依据索引

| 主题 | 路径 |
|------|------|
| StylePreset 类型 | `types/stylePreset.ts` |
| Preset / Theme 配置 | `config/stylePresets.ts`, `config/themePresets.ts` |
| mergeDisplayPreset | `config/themePresets.ts` |
| StyleSettings UI | `components/StyleSettings.tsx` |
| Orchestrator | `lib/orchestrateBlocks.ts` |
| normalize → DSL | `lib/normalizeBlocks.ts` |
| DSL prompt（非 stream） | `lib/generateSystemPrompt.ts` |
| titleBlock 同源 config | `lib/titleBlockStyleConfig.ts` |
| DSL copy | `lib/componentHtml.ts` |
| DSL preview | `lib/componentPreview.tsx`, `lib/titleBlockPreviewClean.tsx` |
| Copy 总装 | `lib/htmlExporter.ts` |
| Clipboard | `lib/wechatCopy/copyWechatToClipboard.ts` |
| P0 preview | `components/P0BlockPreviewSections.tsx` |
| 分发 | `components/BlockRenderer.tsx` |
| 双轨审计 | `docs/agile/s2-d5-current-style-system-audit-composer.md` |
| Visual Layer 方案（非完整代码） | `docs/agile/s2-d5-p0-block-visual-layer-plan.md` |
| P0 协议 | `docs/agile/s2-d4-p0-block-protocol.md` |
| 粘贴 backlog | `docs/agile/backlog.md` BL-091 |
| 架构经验（更广） | `docs/architecture/prototype-architecture-lessons.md` |

---

*本文档供轻篇审计 `style-system.md` 使用；结论为技术经验提取，不构成轻篇架构定稿。*
