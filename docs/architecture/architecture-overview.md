# Release 1 整体技术架构设计（定稿）

> 轻篇公众号排版 · qingpian-wechat-editor
>
> 状态：**Release 1 唯一整体架构主文档** · Sprint 1-B 定稿
> 定稿分支：`docs/s1b-architecture-finalize`
> 定稿依据：A 版（产品推导）+ B 版（历史经验补强）+ A/B audit
> 层级：统摄各专项方案文档

---

## 0. 文档地位（P0-1）

| 项 | 结论 |
|----|------|
| **唯一主文档** | 定稿后的 `docs/architecture/architecture-overview.md` 是 Release 1 **唯一**整体架构主文档 |
| **A/B/audit 定位** | A 版、B 版、`architecture-ab-audit.md` 为定稿依据与历史快照，**不再**作为并列主文档 |
| **Sprint 2 启动** | Sprint 2 及后续实现 **只能**基于本文档 + 已对齐的专项方案启动 |
| **参考保留** | [prototype-lessons.md](prototype-lessons.md)、[references/prototype-architecture-lessons.md](references/prototype-architecture-lessons.md) 为外部参考，不进入主链路叙述 |

---

## 1. 架构设计依据

### 1.1 轻篇产品依据

| # | 产品要求 | 架构含义 |
|---|----------|----------|
| 1 | 核心用户：高频公众号运营者等 | 优先「成稿 + 排版 + 复制发布」，非 CMS |
| 2 | 主题 / 资料 / 草稿 → 生成 → 排版 → 预览 → 复制 | 端到端主链路，禁止模块孤岛 |
| 3 | Release 1：生成、样式排版、流式预览与复制一致性闭环 | 所有模块围绕此闭环 |
| 4 | 样式系统属于 Release 1 核心 | Style System 架构前置 |
| 5 | 微信复制一致性是 Release 1 P0 | Copy + Paste QA 是一级质量闭环 |
| 6 | 多输入、基础流式、image_placeholder 属于 Release 1 | Input + Generation + Block 语义 |
| 7 | 完整样式市场、135/秀米导入、AI 生图等后置 | 预留扩展点，Release 1 不实现 |

### 1.2 定稿方式

- **骨架来源：** A 版 `architecture-overview.md`（模块、契约、Epic、Sprint 顺序）
- **风险层来源：** B 版 + A/B audit（校验清单、排除项、反面案例约束、Copy Fidelity DoD、fixture 三联）
- **原则：** 本文是轻篇架构文档，不是旧项目复盘；旧经验仅作风险校验输入

---

## 2. Release 1 整体主链路

```
User Input（主题 / 资料 / 草稿）
  → Input Normalization
  → Generation / Streaming
  → Article / Block Schema（唯一内容主模型）
  → Style Assignment
  → Style System → StyleDefinition
  → Preview Renderer
  → Copy Renderer
  → WeChat Paste QA
  → Fixture / Regression Check（三联）
```

### 2.1 主链路约束

- 所有输入、生成、流式中间态、fixture 终态 **归一到统一 Article**
- **禁止** `mockArticle` / `streamArticle` / `wechatArticle` / `aiArticle` 等平行主结构
- stream 过程中的 partial Article **仍是 Article Schema**（blocks 逐步增加），不是第二模型
- fixture 是合法 Article 测试输入，**不是** mock 主链路
- 底层 token/chunk 流 **不暴露给前端**；应用层 SSE 事件驱动 UI；终态 **`done.article`** 全量替换

### 2.2 模块级数据流

```
InputRequest → NormalizedInput
  → GenerationEvent* → Article
  → ArticleStylePlan → StyleDefinition (resolved)
  → PreviewRenderResult / CopyHtmlResult
  → PasteTestRecord
  ↑ Fixture / Regression Check
```

---

## 3. 核心模块划分

### 3.1 Input Module

| 维度 | 说明 |
|------|------|
| 职责 | 接收主题 / 资料 / 草稿，构造 InputRequest |
| 输出 | `InputRequest` → `NormalizedInput` |
| Release 1 | 三类输入统一入口；单一 `InputRequest.type` 命名 |
| 不负责 | 生成 Article、渲染、样式 |
| 文档 | [generation-pipeline.md](generation-pipeline.md) §1–2 |
| 代码 | `src/core/generation/input-normalizer.ts`（后续） |

**历史经验约束：** 禁止双命名 mode 体系；禁止测试开关绕过主链路。

### 3.2 Generation / Streaming Module

| 维度 | 说明 |
|------|------|
| 职责 | NormalizedInput → 结构化 Article；支持 batch 与 stream |
| 输出 | `GenerationEvent*` → 终态 `Article` |
| Release 1 | 单一流式主路径；禁止 silent fallback |
| 文档 | [generation-pipeline.md](generation-pipeline.md) |
| 代码 | `src/core/generation/` |

### 3.3 Article / Block Module

| 维度 | 说明 |
|------|------|
| 职责 | 唯一文章主模型 Article 与 Block 语义 |
| 输出 | `Article`（含 `Block[]`） |
| Release 1 | 11 种 semantic block（见 §8）；`image_placeholder` 属于 Release 1 |
| 文档 | [article-schema.md](article-schema.md)、[block-schema.md](block-schema.md) |
| 代码 | `src/core/article/`、`src/core/blocks/` |

### 3.4 Style Assignment Module

| 维度 | 说明 |
|------|------|
| 职责 | theme / preset / block override → `ArticleStylePlan` |
| 文档 | [style-system.md](style-system.md) §4.5 |
| 代码 | `src/core/styles/resolver.ts`（后续） |

### 3.5 Style System Module

| 维度 | 说明 |
|------|------|
| 职责 | theme、preset、variant、registry；解析 `StyleDefinition` |
| 输出 | `StyleDefinition` / `ResolvedBlockStyle` |
| Release 1 | 系统预设样式；架构 + `classic-news` 第一批 variant |
| 文档 | [style-system.md](style-system.md) |
| 代码 | `src/core/styles/` |

**定位：** Style System **不是**页面 CSS 集合，而是 Article 与 Renderer 之间的**样式解析层**。

### 3.6 Preview Renderer Module

| 维度 | 说明 |
|------|------|
| 职责 | Article + StyleDefinition → 页面预览（React DOM） |
| 约束 | 消费 StyleDefinition 数值 token；禁止 Tailwind/class 作为唯一样式来源 |
| 文档 | [rendering-pipeline.md](rendering-pipeline.md) |
| 代码 | `src/core/renderer/` |

### 3.7 Copy Renderer / Copy-to-WeChat Module

| 维度 | 说明 |
|------|------|
| 职责 | Article + **同一 StyleDefinition** → 微信兼容 inline HTML |
| 约束 | 每个 semantic block × variant **必须有** Copy 对等实现；非 DOM 抓取 |
| 文档 | [copy-to-wechat-pipeline.md](copy-to-wechat-pipeline.md) |
| 代码 | `src/core/copy/` |

### 3.8 WeChat Paste QA Module

| 维度 | 说明 |
|------|------|
| 职责 | 粘贴测试、`PasteTestRecord`、驱动 Copy Fidelity DoD |
| Release 1 | **Sprint 4** Preview/Copy 闭环时启动**最小人工粘贴 QA**；**Sprint 6** 系统化 fixture 三联回归 |
| 文档 | [wechat-copy-style-rules.md](wechat-copy-style-rules.md) |

### 3.9 Fixture / Test Module

| 维度 | 说明 |
|------|------|
| 职责 | fixture 输入 + copy HTML snapshot + paste checklist **三联** |
| 约束 | fixture 是测试输入，不是 mock 主链路 |
| 代码 | `tests/fixtures/`（后续） |

### 3.10 Docs / Governance Module

| 维度 | 说明 |
|------|------|
| 职责 | docs、Cursor 规则、Git 工作流、execution report |
| 约束 | docs 为事实源；区分 Done(代码) vs Done(粘贴 QA) |

---

## 4. 关键数据契约

> 本轮定义语义；Sprint 2+ 用 Zod / TypeScript 实现。

| 契约 | 作用 | 产生方 | 消费方 | Sprint |
|------|------|--------|--------|--------|
| InputRequest | 原始输入请求 | Input / UI | Generation | 5+ |
| NormalizedInput | 标准化输入 | Input | Generation | 5+ |
| GenerationEvent | SSE 流式事件 | Generation | UI / Preview | 5+ |
| Article | 唯一文章主模型 | Generation、Fixture | Style、Renderer、Copy | 2+ |
| Block | 内容语义单元 | Generation、Fixture | Article、Renderer | 2+ |
| ArticleStylePlan | 样式分配计划 | Style Assignment | Style System | 3+ |
| StylePreset | 整篇风格包 | Style System | Assignment | 3+ |
| StyleVariant | block 视觉变体 | Style System | Registry | 3+ |
| **StyleDefinition** | 可注册样式定义集合（架构术语）；Release 1 以 registry + preset 存在 | Style System | StyleResolver | 3+ |
| **VariantDefinition** | blockType × variantId 注册定义 | Style System / registry | StyleResolver | 3+ |
| **ArticleStylePlan** | 单篇样式分配计划 | Style Assignment | StyleResolver | 3+ |
| **ResolvedBlockStyle** | 单 block 实例解析结果 | StyleResolver | Preview、Copy | 3+ |
| **ResolvedArticleStyle** | 整篇 Map\<blockId, ResolvedBlockStyle\> | StyleResolver | Preview、Copy | 3+ |
| **InlineContent** | 段内富文本语义节点 | Block content | Renderer、Copy | 2+ |
| PreviewRenderResult | 页面预览输出 | Preview | UI | 4+ |
| CopyHtmlResult | 微信兼容 HTML | Copy | Clipboard、Paste QA | 4+ |
| PasteTestRecord | 粘贴测试记录 | Paste QA | bugs.md | 4+（最小）/ 6（系统） |
| ExecutionReport | 执行交接 | Governance | ChatGPT、用户 | 已建立 |
| **ComponentProtocol** | 视觉控件 family/variant/slot/asset 白名单协议 | Style System registry | StyleValidator、StyleResolver | 3+ · **R1** |
| **BlockVisualProtocol** | semantic block → visual component 映射协议 | Style System | StyleResolver、Orchestrator | 3+ · **R1** |
| **VisualAssetRegistry** | 系统内置 icon/shape/mark 资产池 | Style System | StyleResolver、AI validation | 3+ · **R1** |
| **VisualAsset** | 单个注册资产定义 | Style System | Registry、Renderer slot | 3+ · **R1** |
| **StyleOrchestrator** | 文章级样式编排（去重/节奏） | Style System | StyleResolver 前 | 3+ · **R1**（最小规则） |
| **ArticleRhythmPolicy** | 长文/短文节奏策略 | Style System | StyleOrchestrator | 3+ · 部分 R1 |
| **VariantDedupPolicy** | 相邻 variant 去重 | Style System | StyleOrchestrator | 3+ · **R1** |
| **AssetReusePolicy** | assetId 复用上限 | Style System | StyleOrchestrator | 3+ · **R1** |
| **StyleSelectionRequest** | AI 样式建议请求 | **Generation** | Style validation pipeline | 5+ · **R1** |
| **StyleAssignmentPatch** | 校验通过的样式分配补丁 | Generation → Style validation | ArticleStylePlan | 5+ · **R1** |
| **StyleValidationResult** | 样式建议校验结果 | Style validation | Generation、StyleResolver | 3+ · **R1** |
| **FallbackVariantPolicy** | 校验失败回退策略 | Style System | StyleResolver | 3+ · **R1** |
| **StyleDefinitionVersioning** | raw/validated/final 分层 | Style System | 持久化（R4+） | 3+ schema · 持久化 R4+ |
| **TitleBlockSlotDefinition** | titleBlock slot 结构定义 | Style System / registry | VariantDefinition | 3+ · **R1** |
| **TitleBlockLayoutCompatibility** | layoutMode 微信 copy 可执行约束 | Style System / WeChat profile | Copy Renderer | 3+ · **R1** |
| **SlotContentBinding** | slot 内容来源绑定规则 | Style System | StyleResolver、Renderer | 3+ · **R1** |

> **边界：** 上表扩展契约属于 Style System / AI Style Selection / Governance **扩展层**；**不改变** Article / Block Schema；**不引入** visualArticle / componentArticle。**Sprint 2 不实现**；**Sprint 3 起**实现 Style System 相关契约；Generation 侧 StyleSelectionRequest 在 **Sprint 5** 与 Generation 闭环一并实现，但 **Release 1 架构边界本轮已定**。

## 5. 模块依赖与边界规则

| 规则 | 说明 |
|------|------|
| Input **不直接调用** Renderer | 输入只进入 Generation |
| Generation **不直接输出** HTML / CSS / inline style | 只产出 Article / GenerationEvent / StyleSelectionRequest |
| Generation **不直接调用** Preview / Copy Renderer | 样式须经 Style System 校验链 |
| Article / Block **不包含** CSS | 内容与样式分离 |
| Style System **不修改** Article 内容语义 | 只读 Article + styleAssignment |
| Preview **不生成** Copy HTML | 输出 DOM |
| Copy **不另建**样式来源 | 共享 StyleDefinition |
| Fixture **不是** mock 主链路 | 合法 Article 实例 |
| 导入样式 **不得绕过** StyleDefinition 和 Copy Renderer | 见 §15 |

---

## 6. Article Schema 与 meta / blocks[] 分工（P0-3）

### 6.1 唯一主模型

**Article 是全项目唯一文章主模型。** Generation、Fixture、Preview、Copy 均消费同一个 Article。

### 6.2 顶层分工

```text
Article
├── id, version
├── metadata          # 文章级元信息（列表、SEO、复制 HTML title）
├── input             # 输入来源快照（只读，不参与渲染）
├── styleAssignment   # 样式引用（不含 CSS）
├── blocks[]          # 有序内容语义块（核心正文结构）
└── generation?       # 生成过程元信息
```

### 6.3 metadata 与 blocks[] 边界

| 字段 / 块 | 层级 | 职责 | 关系 |
|-----------|------|------|------|
| `metadata.title` | 文章级 | 列表展示、`<title>`、复制外层标题 | 与 `title` block 内容**保持一致**，生成链路负责同步 |
| `metadata.subtitle` | 文章级 | 可选副标题 | 可不重复为 block |
| `metadata.summary` | 文章级 | 可选摘要（列表/SEO） | 可与 `lead` block 镜像，但不替代 blocks 内结构 |
| `title` block | 内容级 | 正文区主标题渲染 | blocks[0] 通常为 title |
| `lead` block | 内容级 | 开篇导语语义 | 区别于普通 paragraph 的角色 |
| `heading` / `paragraph` / … | 内容级 | 正文结构 | 仅存在于 blocks[] |
| `metadata` | — | **不重复** blocks 全部内容 | 只承载文章级元信息 |

### 6.4 禁止平行结构

禁止 `mockArticle` / `streamArticle` / `wechatArticle` / `aiArticle`。流式 partial Article 仍是 Article Schema。

详见 [article-schema.md](article-schema.md)、[block-schema.md](block-schema.md)。

---

## 7. StyleDefinition 最小模型（P0-4）

### 7.1 核心原则

**ResolvedBlockStyle** 是 Preview Renderer 与 Copy Renderer 的**直接共享输入**（StyleResolver 输出）。

- Preview 与 Copy 读取**同一份** ResolvedBlockStyle / ResolvedArticleStyle
- **VariantDefinition** 存在于 registry；Renderer **不直接消费**
- 差异仅在**输出适配层**（DOM vs inline HTML）
- Release 1 只实现**系统预设样式**，不实现完整样式市场

命名边界详见 [style-system.md](style-system.md) §3.2。

### 7.2 Release 1 最小字段（ResolvedBlockStyle）

每个 block 实例解析后的 `ResolvedBlockStyle` / `StyleDefinition` 至少包含：

| 字段 | 说明 |
|------|------|
| `styleId` | 解析结果唯一 ID（blockId + variant 组合键） |
| `blockType` | 对应 Block.type |
| `variant` | 应用的 variantId |
| `slots` | 已解析的 slot 装饰（Map\<slotName, SlotRenderSpec\>） |
| `tokens` | typography / color / spacing 数值 token |
| `layout` | 排列方式 token（align、display 语义） |
| `copySafety` | `"strict"` \| `"balanced"` \| `"preview_only"`（见下） |
| `wechatCompatibility` | 微信安全子集标记与 fallback 提示 |
| `sourceType` | Release 1 固定 `"systemPreset"`；预留扩展（见 §7.3） |
| `density` | `compact` \| `standard` \| `relaxed`（Release 1 默认 standard） |

`tokens` 内部结构：`typography`、`spacing`、`decoration`（与 [style-system.md](style-system.md) §4.8 一致）。

**`copySafety` 与 Release 1：** Release 1 正式交付的 block × variant **不得**使用 `preview_only`。`preview_only` 仅用于未来实验样式、未发布样式或内部预览状态，**不能**计入 Release 1 Copy Fidelity Done（代码或粘贴 QA）。

### 7.3 未来扩展字段（Release 1 不实现，架构预留）

| 字段 | 用途 |
|------|------|
| `sourceType` | `"systemPreset"` \| `"importedTemplate"` \| `"generatedStyle"` \| `"userStyleLibrary"` |
| `renderMode` | 渲染适配提示（preview/copy 共用 recipe） |
| `compatibility` | 135 / 微信 / 通用 HTML 兼容级别 |
| `importMeta?` | 外部导入溯源（135/秀米/企业模板 ID） |

**约束：** 未来导入样式必须经 Style Import Adapter（§15）归一为 StyleDefinition，不得绕过 Copy Renderer。

**WeChatCompatibilityProfile：** Copy 输出须符合可执行兼容 profile，见 [wechat-copy-style-rules.md](wechat-copy-style-rules.md) §1.3。

**InlineContent：** 段内富文本协议见 [block-schema.md](block-schema.md) §3.1；Release 1 `paragraph` / `lead` 使用 `content.text: string | InlineContent`，实现阶段 normalize 为 InlineContent（DECISION-034）。

---

## 8. Release 1 第一批 semantic block 清单（P0-5）

以轻篇 Release 1 产品目标为准，**不照搬**旧项目 12 P0 block。

| # | type | Release 1 | 说明 |
|---|------|-----------|------|
| 1 | `title` | ✅ | 文章主标题 |
| 2 | `lead` | ✅ | 开篇导语 |
| 3 | `heading` | ✅ | 章节小标题 |
| 4 | `paragraph` | ✅ | 正文段落 |
| 5 | `list` | ✅ | 有序/无序列表 |
| 6 | `quote` | ✅ | 引用 |
| 7 | `highlight` | ✅ | 重点提示 |
| 8 | `info_card` | ✅ | 结构化信息卡片 |
| 9 | `cta` | ✅ | 行动号召 |
| 10 | `divider` | ✅ | 章节分隔 |
| 11 | `image_placeholder` | ✅ | 配图占位（Release 1 不含真实图片上传） |

**相对旧项目 12 P0 的处理：**

| 旧 P0 block | 轻篇 Release 1 | 理由 |
|-------------|----------------|------|
| `steps` | 不单独设 type | 用 `list` + `info_card` 表达 |
| `pros_cons` | 不单独设 type | 用 `info_card` 或 `list` 表达 |
| `selling_point` / `key_takeaway` / `buying_advice` | 不单独设 type | 语义并入 `highlight` / `info_card` / `paragraph` |

**原则：** Release 1 冻结 11 种语义 block；新增 type 需 decision-log 决策，禁止 parser 降级（如 list→paragraph）。

---

## 9. Style System 在整体架构中的位置

```
Article (语义)  →  Style Assignment  →  Style System  →  StyleDefinition
                                              │
                              ┌───────────────┴───────────────┐
                              ▼                               ▼
                      Preview Renderer                 Copy Renderer
```

- slot / density / variant / registry 是 Release 1 **样式模型组成部分**（非仅未来方向）
- Release 1 实现：`default` theme + `classic-news` preset + **first-wave 11×3 release1RequiredVariants（33）** + VisualAssetRegistry assets + registry 架构；expansion 目标每 block 5 个（DECISION-043）
- 完整样式市场后置；**样式系统架构前置**

### 9.1 Component DSL 扩展层（S1-STORY-024）

秒篇 Component DSL 有效能力作为 Style System **扩展层**吸收，**不改变** Article 主模型：

| 能力 | 位置 | 说明 |
|------|------|------|
| ComponentProtocol / BlockVisualProtocol | Style System | semantic block 与 VariantDefinition 之间 |
| titleBlock visual component | Style System + Renderer | title / heading 均可映射 |
| StyleOrchestrator | StyleResolver 前 | 去重/节奏；不 mutate Article |
| VisualAssetRegistry | Style System | icon/shape pool |
| AI Style Selection Guardrails | Generation → Style | 不得输出 HTML/CSS |

**禁止：** visualArticle / componentArticle；旧 DSL 代码；Visual Layer / Space Style 作为主方案。

详见 [style-system.md](style-system.md) §11、[references/miaopian-title-component-dsl-v1.md](references/miaopian-title-component-dsl-v1.md)。

### 9.2 Release 1 受控 AI 样式选择主链路（S1-STORY-025）

**Release 1 启用受控 AI 样式选择**（DECISION-040）。Generation 可产出 `StyleSelectionRequest` / `StyleAssignmentPatch`，但**不得绕过 Style System**：

```text
Generation Module
  → Article（blocks 内容）+ StyleSelectionRequest / StyleAssignmentPatch（样式建议）
  → ComponentProtocol / BlockVisualProtocol validation
  → Style Registry + VisualAssetRegistry validation
  → WeChatCompatibilityProfile + TitleBlockLayoutCompatibility validation
  → StyleOrchestrator rhythm validation
  → StyleValidationResult（含 fallbackApplied）
  → ArticleStylePlan / 合并至 styleAssignment
  → StyleResolver → ResolvedArticleStyle
  → Preview Renderer / Copy Renderer（只消费 ResolvedArticleStyle）
```

**禁止：** Generation 直接输出 HTML/CSS/inline style；未校验样式建议写入 styleAssignment；Renderer 接收 Generation 原始样式输出。

详见 [generation-pipeline.md](generation-pipeline.md) §8.1、[style-system.md](style-system.md) §11.8。

---

## 10. Preview / Copy 双 Renderer 共享机制

```
StyleDefinition (ResolvedBlockStyle)
        │
        ├── PreviewRenderer: tokens → DOM（class / CSS vars 仅作适配，数值源自 StyleDefinition）
        └── CopyRenderer:    tokens → inline style HTML（微信安全子集）
```

**成对交付规则：**

- 新 block type 或 variant 上线：**Preview + Copy 必须同时交付**
- Release 1 正式 block × variant 的 `copySafety` 必须为 `strict` 或 `balanced`，**不得**为 `preview_only`
- 禁止「先 card preview、后补 copy」
- 禁止 Preview 用 Tailwind 硬编码而 Copy 另写 plain text

详见 [rendering-pipeline.md](rendering-pipeline.md)。

---

## 11. Generation / Streaming 三层模型（P0-2）

### 11.1 三层架构

| 层级 | 职责 | 技术 |
|------|------|------|
| **Layer 1 模型层** | token/chunk streaming | LLM API `stream: true` |
| **Layer 2 应用层** | 结构化 SSE 事件、block 生命周期、Article 组装 | SSE + GenerationEvent |
| **Layer 3 体验层** | 打字机 / 逐 block 展示 | 由 `block.delta` 驱动 UI |

**终态：** `done.article` 携带完整 Article，**全量替换** partial Article。

### 11.2 GenerationEvent 最终命名（P0-2 定稿）

**Release 1 唯一事件模型（dot 命名）：**

```text
SSE: POST /api/generate/stream

GenerationEvent:
├── { type: "status",    phase: "started" | "generating" | "structuring" | "failed" }
├── { type: "metadata",  patch: Partial<ArticleMetadata> }
├── { type: "block.start",    blockId, blockType, index, initialContent? }
├── { type: "block.delta",    blockId, field, delta }      // 字段级增量，驱动打字机 UX
├── { type: "block.complete", block: Block }                // 该 block 已符合 Block Schema
├── { type: "error",     code, message }
└── { type: "done.article", article: Article }              // 唯一可信终态
```

**语义说明：**

- `block.start` → 新 block 开始（UI 可创建占位）
- `block.delta` → block 内字段增量（打字机）
- `block.complete` → 该 block 解析完成，可参与 Preview
- 模型一次输出整 block（JSONL 一行）时：可 emit `block.start` + `block.complete`（无 delta）
- **`done.article` 与增量 blocks 冲突时，以 `done.article` 为准**

### 11.3 废弃命名与映射

| 废弃 | 映射 / 说明 |
|------|-------------|
| `block.append` | → `block.start` + `block.complete`（complete 携带完整 Block） |
| `block.update` | → `block.delta`（增量）或 `block.complete`（全量替换该 block） |
| `block_start` / `block_delta` / `block_done` | 旧项目 underscore 命名；轻篇统一为 dot 命名，语义等价 |
| 前端 token 缓冲区作为文章结构 | **禁止** |

batch 与 stream **共用同一 Article Schema**；`GenerationMeta.mode` 区分 `"batch"` | `"stream"`。

详见 [generation-pipeline.md](generation-pipeline.md)。

---

## 12. Copy-to-WeChat 与 WeChat Paste QA 闭环（P0-6）

```
Article + StyleDefinition
  → Copy Renderer → CopyHtmlResult
  → Clipboard → 微信公众号编辑器
  → WeChat Paste QA → PasteTestRecord
```

### 12.1 Copy Fidelity DoD

| 状态 | 含义 |
|------|------|
| **Done（代码）** | Preview + Copy 成对实现已合并；CopyHtmlResult 可生成 |
| **Done（粘贴 QA）** | 该 block × variant 已通过微信公众号人工粘贴验收 |

**规则：** 不得将 Done（代码）等同于 Done（粘贴 QA）。

### 12.2 Release 1 第一批样式 / variant / 粘贴 QA 范围

| 项 | Release 1 范围 |
|----|----------------|
| Theme | `default` |
| Preset | `classic-news`（系统默认） |
| Variant | **First wave：** 11×3=33 release1RequiredVariants + VisualAssetRegistry assets（§10.4）；**Expansion target：** up to 11×5 |
| 粘贴 QA | **First wave 33 variants** 须 Paste QA；Sprint 4-A/B 启动最小 QA；Sprint 6-B 全量 first-wave 回归；expansion 分批 QA |

Release 1 **不是**完整样式市场，但 Style System 架构必须前置。

详见 [copy-to-wechat-pipeline.md](copy-to-wechat-pipeline.md)、[wechat-copy-style-rules.md](wechat-copy-style-rules.md)。

---

## 13. Fixture 三联体系

| 联 | 内容 | 用途 |
|----|------|------|
| **输入联** | Article JSON fixture | Preview / Copy / Generation 回归输入 |
| **输出联** | copy HTML snapshot（golden） | Copy Renderer 结构/样式回归 |
| **验收联** | paste checklist + PasteTestRecord | 微信公众号粘贴 QA |

- fixture **不是** mock 主链路
- SSE 性能脚本可辅助，**不替代** paste QA

---

## 14. Release 1 内外边界

### 14.1 Release 1 做

多输入 · 统一 Article/Block · Generation/Streaming · Style System 架构 + 第一批 preset/variant · Preview + Copy 成对 Renderer · Copy Fidelity DoD · image_placeholder · fixture 三联 · execution report / Git 治理

### 14.2 Release 1 不做

完整样式市场 · 135/秀米完整导入 · AI 生图 · 图库 · 上传 · 联网 · 自动发布 · 团队协作 · CMS · 会员支付

---

## 15. 后续扩展点

### 15.1 Style Import Adapter（Release 4+，架构预留）

```
外部 HTML/CSS（135 / 秀米 / 企业模板）
  → Sanitizer
  → Parser
  → Template AST
  → Style Validator
  → Asset Ingestor
  → User Style Library
  → StyleDefinition（sourceType: importedTemplate）
  → Preview / Copy Renderer
```

Release 1 **不实现**完整导入；StyleDefinition 已通过 `sourceType` / `compatibility` / `importMeta` 预留。

### 15.2 用户样式库 / 用户模板库

- 不是 Release 1 核心交付
- 系统预设、AI 生成样式、用户导入样式，未来均归一到 StyleDefinition 或其扩展类型
- Style System 设计不得阻断用户样式库

---

## 16. 旧项目经验吸收与明确排除

### 16.1 应吸收的思想

| 思想 | 轻篇落地 |
|------|----------|
| 单一 Article 终态 | `done.article` 全量替换 |
| block-aware streaming | `block.start/delta/complete` + 终态归一 |
| Component DSL 中的 slot / variant / orchestrate | StyleDefinition + registry + assignment |
| Preview / Copy 成对 renderer | 共享 StyleDefinition |
| inline style copy | Copy Renderer 微信安全子集 |
| fixture / paste QA 前置 | 三联体系；Sprint 4 起最小 QA |
| docs / execution report 治理 | Docs / Governance 模块 |

### 16.2 明确不迁移

| 排除项 | 原因 |
|--------|------|
| 旧项目整体代码 | 双轨债务、God Component |
| 旧 Component DSL 实现 | 与 P0 混用 |
| Visual Layer / Space Style 旧方案代码 | 未验证复杂度 |
| 多套 JSONL 协议 | 历史 compat 已删，轻篇仅一套 |
| 多套 Article / Block 结构 | 单一 Article |
| 多套 renderer + 降级 copy | P0 preview → plain `<p>` copy |
| 旁路 fallback / silent fallback | 单一主路径 |
| 历史实验代码（typewriter/hybrid 未合并分支） | 新项目验证后再合 |
| HomePageClient 式上帝组件 | 薄壳 + 模块边界 |

详细审计见 [references/prototype-architecture-lessons.md](references/prototype-architecture-lessons.md)。

---

## 17. Epic 与模块映射

| Epic | 主要模块 |
|------|----------|
| EPIC-001 多输入 | Input |
| EPIC-002 文章生成 | Generation / Streaming |
| EPIC-003 Article / Block | Article / Block |
| EPIC-004 样式系统 | Style Assignment + Style System |
| EPIC-005 预览渲染 | Preview Renderer |
| EPIC-006 复制一致性 | Copy Renderer + WeChat Paste QA |
| EPIC-007 流式展示 | Generation + Preview |
| EPIC-008 配图占位 | Article / Block（image_placeholder） |
| EPIC-009 重生成 | Generation（后续） |
| EPIC-010 测试保障 | Fixture 三联 + Paste QA |

---

## 18. 后续 Sprint 建议

> 与 [sprint-plan.md](../agile/sprint-plan.md) 对齐。Sprint 2 启动前须完成 **S1-STORY-021** 审查。

| Sprint | 焦点 |
|--------|------|
| **Sprint 2** | Article / Block Schema + **InlineContent** 代码契约（Zod/TS/fixture/单测；不含 Renderer/Style/Generation） |
| **Sprint 3-A** | Style System contract & registry infrastructure |
| **Sprint 3-B** | First-wave 11×3 variant registry + titleBlock ComponentProtocol |
| **Sprint 3-C** | VisualAssetRegistry + AI Style Selection validation + Orchestrator |
| **Sprint 4-A** | Preview/Copy text-first blocks（first-wave） |
| **Sprint 4-B** | Preview/Copy structured blocks + first-wave 最小 Paste QA |
| **Sprint 5** | Generation/Streaming + StyleSelectionRequest 生成（须 validation） |
| **Sprint 6-A** | Fixture 三联基础设施 |
| **Sprint 6-B** | First-wave 33 variants Paste QA 全量回归 |

---

## 19. 进入 Sprint 2 前置条件

| # | 条件 | 本轮状态 |
|---|------|----------|
| 1 | 唯一 `architecture-overview.md` 定稿 | ✅ 本文档 |
| 2 | GenerationEvent 命名统一 | ✅ §11.2；`generation-pipeline.md` 已对齐 |
| 3 | Article meta/blocks 分工明确 | ✅ §6 |
| 4 | StyleDefinition 最小结构明确 | ✅ §7 |
| 5 | Release 1 block 清单明确 | ✅ §8 |
| 6 | 第一批 variant + Paste QA 范围明确 | ✅ §12.2 |
| 7 | 实现前契约缺口（S1-STORY-021）已补齐 | ⏳ 本轮 In Review |
| 8 | 定稿 merge 至 sprint 分支 | ✅ |
| 9 | 用户确认 Sprint 1-B 收口 | ⏳ 待用户确认 |

**Sprint 2 代码实现须在 S1-STORY-021 审查通过、用户确认 Sprint 1-B 收口后启动。**

---

## 20. 架构校验清单

| # | 校验项 | 定稿结论 |
|---|--------|----------|
| 1 | 只有一个 Article 主模型？ | **必须** |
| 2 | 避免 mockArticle / streamArticle / wechatArticle？ | **必须** |
| 3 | Style System 在 Article 与 Renderer 之间？ | **必须** |
| 4 | Preview / Copy 共享 StyleDefinition？ | **必须** |
| 5 | Copy-to-WeChat 是 Release 1 P0？ | **必须** |
| 6 | WeChat Paste QA 是质量闭环？ | **必须**（Sprint 4 起） |
| 7 | 支持主题/资料/草稿多输入？ | **必须** |
| 8 | token streaming + 应用层归一 Article？ | **必须** |
| 9 | fixture 三联体系？ | **必须** |
| 10 | 避免 Visual Layer / Space Style 包袱？ | **必须** |
| 11 | 避免样式写死在页面组件？ | **必须** |
| 12 | slot/density/variant/registry 正式模型？ | **必须**（Release 1 架构 + 最小实现） |
| 13 | 区分样式系统 vs 完整样式市场？ | **必须** |
| 14 | Release 1 边界明确？ | **必须** |
| 15 | docs + execution report 治理？ | **必须** |

---

## 21. 禁止项（架构级）

- 多套 Article Schema 或平行主结构
- Preview 与 Copy 分裂的样式来源
- fixture 作为 mock 主链路
- 两套 GenerationEvent 模型并存
- 从旧项目整包复制代码
- 导入样式绕过 StyleDefinition / Copy Renderer

---

## 22. 专项文档索引

| 文档 | 层级 |
|------|------|
| **本文档** | Release 1 唯一整体架构 |
| [article-schema.md](article-schema.md) | Article 字段 |
| [block-schema.md](block-schema.md) | Block 语义 |
| [style-system.md](style-system.md) | theme/preset/variant/registry |
| [rendering-pipeline.md](rendering-pipeline.md) | Preview / Copy |
| [copy-to-wechat-pipeline.md](copy-to-wechat-pipeline.md) | Copy 链路 |
| [generation-pipeline.md](generation-pipeline.md) | 多输入、SSE |
| [wechat-copy-style-rules.md](wechat-copy-style-rules.md) | 复制 P0 规则 |
| [prototype-lessons.md](prototype-lessons.md) | 旧项目简版经验 |

**阅读顺序：** 本文档 → 专项文档 → 产品文档。

---

## 23. 相关决策

- DECISION-004 ~ 006：Release 1 范围、样式核心、复制 P0
- DECISION-015：业务实现须在方案完成之后
- DECISION-021：A 版整体架构（产品推导）
- DECISION-022：A/B 比较方式
- DECISION-023 ~ 028：定稿决策（见 [decisions.md](../agile/decisions.md)）
- DECISION-029 ~ 033：实现前契约与 Sprint 2~6 计划
