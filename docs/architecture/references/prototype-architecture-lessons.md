# 一键成稿 · 架构经验审计（Prototype Architecture Lessons）

> **文档性质：** 旧项目（秒篇成稿 / miaopian-demo）架构经验审计，供新项目「轻篇公众号排版」做 B 版架构校验与风险补强。  
> **版本基准：** 仓库当前状态（Sprint 2 主链路，`sprint/2026-05-25-s2-text-main-flow` 工作线）  
> **最后更新：** 2026-05-30

---

## 1. 文档目的

本文**不是**新项目架构方案，也**不是**旧项目功能清单。

本文是旧「一键成稿」项目在整体技术架构上的**经验、风险、踩坑与可复用设计点**审计，供轻篇公众号排版项目在做 B 版架构设计时使用：

```text
A 版：只基于轻篇产品文档推导架构
B 版：A 版 + 一键成稿历史经验校验与补强
```

**原则：参考经验，不复制旧代码。**

轻篇应吸收的是**问题定义、边界划分、治理机制与已验证的模式**；不应迁移旧仓库的实现细节、实验分支与兼容胶水。

---

## 2. 旧项目整体架构简述

旧项目是一个 **Next.js 16 + TypeScript** 的公众号图文成稿工具：从主题/资料输入，经 Grounding（可选）、大模型生成、块级流式预览、可选配图，到复制富文本 HTML 到微信公众号编辑器。

### 2.1 主要模块（客观描述）

| 模块 | 现状摘要 | 主要问题 |
|------|----------|----------|
| **输入 / 生成** | Landing `/` → `/generate?auto=1`；4 种 GenerateMode；`generationOptions`（含 `text_only` 测试模式） | `InputMode` 与 `GenerateModeId` 双命名；手动非流式路径仍保留 |
| **SSE / streaming** | `POST /api/generate?stream=1`；**Block-aware token stream**（`block_start` / `block_delta` / `block_done` → `done.article`） | 曾有多套 SSE 协议并存；历史 compat fallback 已删除 |
| **Article / Block / JSONL** | 流式 JSONL → P0 语义 block（12 类型）；`Article` 为唯一成稿结构；`done.article` 为最终可信源 | 生成协议（P0 JSONL）与渲染协议（Component DSL 残留）**未完全统一** |
| **预览渲染** | `BlockRenderer` + `P0BlockPreviewSections` + 旧 `componentPreview` 混合 | P0 preview 过度 card 化；与 copy 不同源 |
| **样式系统** | `StylePreset` / `ThemePreset` / `orchestrateBlocks` / Component Style DSL（variant + slot） | 无统一 registry；P0 block 无 visual variant 层（D5-B 方案中，**代码未完全落地**） |
| **复制到微信公众号** | `buildWechatHtml` + inline style + Clipboard API；**非 DOM 抓取** | P0 block 在 copy 路径降级为 `<p>` 纯文本；完整粘贴 QA 未完成（BL-091 Ready） |
| **fixture / 测试** | `config/testSamples.ts`；多份 `scripts/verify-*`（SSE 时序、P0 builder、text_only 等） | **无**独立 style gallery / 微信粘贴 fixture 体系；粘贴测试依赖人工 |
| **敏捷 / 协作** | `docs/` 为唯一事实源；Sprint / backlog / decision-log / execution report / changelog | 文档体系成熟；部分历史实验仅留分支名与 report |

### 2.2 架构债务总览

- **God Component：** `HomePageClient.tsx` ~2772 行，生成双轨、编辑、配图、复制仍高度耦合。
- **双轨生成：** 流式 JSONL（主路径）vs 非流式整篇 JSON（手动/API fallback），prompt 与 citations 解析仍分叉。
- **双轨渲染：** P0 语义 block preview vs Component DSL preview/copy vs P0 copy 降级。
- **未完成收口：** S2-D5-B（P0 Visual Layer）、S2-D8（公众号粘贴保真）在 Sprint 2 结束时**仍为进行中/待执行**，非已交付能力。

---

## 3. 可继承经验清单

### 3.1 Article / Block / 结构化内容经验

#### 旧项目如何组织文章结构

- **唯一成稿模型：** `Article`（`types/article.ts`）— title、intro、blocks[]、grounding、cta 等。
- **Block 两层形态并存：**
  - **P0 语义 block**（S2-D4）：`heading`、`paragraph`、`highlight`、`list`、`summary`、`cta`、`lead`、`key_takeaway`、`steps`、`selling_point`、`pros_cons`、`buying_advice` 等扁平字段。
  - **Component Style DSL block**（历史）：`titleBlock`、`quoteBlock`、`infoCardBlock`、`actionBlock` — 含 `component` + `variant` + `slots` + `family`。
- **生成协议：** 流式 JSONL，一行一 block；`StreamArticleBuilder` + `jsonlToP0ArticleBlock` 解析。
- **最终可信成稿：** SSE `done.article`；流式 `block_*` 事件仅用于预览增量。

#### 哪些设计有价值

| 经验 | 说明 |
|------|------|
| **语义 block 与视觉解耦** | decision-log 决策 8：block type 表达「是什么」，不应等于 card UI |
| **单一 Article 终态** | 无论 streaming 如何增量，最终必须归一到完整 `Article` |
| **JSONL 一行一块** | 便于 SSE 增量、parser 与 block 级 citations |
| **P0 最小 block 集** | 12 个语义类型覆盖公众号结构（导语、列表、步骤、卖点、优缺点等），而非无限扩张 |
| **meta 块与 blocks[] 分离** | `title`/`subtitle`/`lead` 写入文章级字段，避免与 heading 重复渲染 |

#### 多套结构并存的问题

| 并存项 | 风险 |
|--------|------|
| P0 JSONL 生成 vs Component DSL 渲染 | stream 产出 P0，normalize 把 heading/cta 升级为 DSL |
| 流式 vs 非流式生成 | 同主题两路径成稿风格、citations 可能不一致 |
| `quote` JSONL → `highlight` 映射 | 语义丢失；DSL quote renderer 与 stream 产出脱节 |
| list/summary 曾在 builder 层降级为 paragraph | D4 已修复方向，说明「parser 与 renderer 不同步」代价极高 |

#### 轻篇建议

| 类别 | 建议 |
|------|------|
| **可吸收经验** | 单一 `Article` 主模型；语义 block 协议先行；JSONL/SSE 仅作传输层；`done.article`（或等价 finalize）为唯一终态 |
| **风险** | 若允许 mockArticle / streamArticle / wechatArticle 平行结构，preview/copy/generation 必然分叉 |
| **给轻篇的建议** | Release 1 先冻结语义 block schema；Preview/Copy/Generation 共用同一 Article；视觉层单独 adapter，不反向污染语义 |

---

### 3.2 Component DSL / 样式系统经验

#### 旧项目现状

- **无**名为 `ComponentDSL` 的单一模块；约定分散在 `types/article.ts`、`normalizeBlocks.ts`、`generateSystemPrompt.ts`、`componentPreview.tsx`、`componentHtml.ts`。
- **存在的能力：** variant 池（title 12 种、quote 7 种、infoCard 8 种、action 4 种）、slots（DSL 块）、`orchestrateBlocks()` 文章级编排、`StylePreset` + `ThemePreset` + `mergeDisplayPreset`。
- **不存在的能力：** `styleRegistry` / `variantRegistry` / 统一 layoutRenderer；P0 block **无** visual variant 矩阵。

#### 哪些设计值得吸收

| 思想 | 价值 |
|------|------|
| **Preset + Theme 分离** | 文章风格（字号/密度/blockStyles）与主题色可独立切换，不重生成正文 |
| **orchestrate 文章级节奏** | 防止连续强 card、末块 CTA 策略、quote 强度 dampen |
| **preview/copy 成对 renderer** | `componentPreview.tsx` ↔ `componentHtml.ts`；`titleBlockStyleConfig` 共用 token |
| **WECHAT_HTML_EXPORT_SAFE_RULES** | 复制约束写进代码常量，可审计 |

#### 哪些设计不完整

- P0 block preview 用统一 `cardShellStyle()`，**无 variant**；copy 降级 `<p>`，**断链**。
- 流式主路径**不经过** `generateSystemPrompt` / `mapArkJsonToArticle`（DSL prompt），但渲染仍部分走 DSL。
- `StyleSettings` 可切换 preset/theme/title variant，**不能**切换 P0 block visual variant（因未实现）。

#### Component DSL 是否适合轻篇

| 结论 | 说明 |
|------|------|
| **思想可参考** | variant + slot + preset + orchestrator + copy-safe inline HTML |
| **旧实现不能直接照搬** | 与 P0 语义 block 混用导致双轨；无 registry；card 默认化 |
| **轻篇需重新设计 Style System** | 在 Article 与 Renderer 之间插入正式 Style Definition 层 |

#### 轻篇 Style System 应重点避免

- 让模型同时输出语义 + 视觉 + CSS（旧 DSL prompt 方向）。
- preview 用 Tailwind/card，copy 另写一套 plain text。
- 每个新 block 类型复制粘贴一套 preview 组件而无 copy 对等实现。
- 样式写死在页面组件里（P0 `cardShellStyle` 即反例）。

**必须明确：Component DSL 的思想可以参考；旧实现不能直接照搬；轻篇需要重新设计正式 Style System。**

---

### 3.3 Visual Layer / Space Style 经验

#### 审计范围说明

| 术语 | 旧项目情况 |
|------|------------|
| **P0 Visual Layer / P0VisualRecipe** | **有完整技术方案文档**（`s2-d5-p0-block-visual-layer-plan.md`）；决策 9 确认方向；**B3–B7 实现未在代码中完成** |
| **Space Style / Space Style System** | **未找到**同名模块、文档或代码。**未找到明确文档依据**（可能为轻篇或规划侧术语，旧项目以 P0 Visual Layer 表述） |
| **P0 Component Html** | 方案中指 copy-safe HTML renderer，拟与 preview 共用 recipe；当前 `htmlExporter.ts` 对 P0 仍为 plain `<p>` |

#### 这些方案解决了什么问题

- preview 过度 card 化（像组件 Demo 而非公众号正文）。
- preview 有结构、copy 变单段 `<p>`（pros_cons、steps 等）。
- 语义 block 与视觉 card 混淆（D4 PO 反馈）。

#### 带来的复杂度

- 新增 `P0VisualRecipe`、`adaptP0VisualRecipe`、`orchestrateP0VisualVariants`、copySafety 降级链。
- 需同时维护 Preview Renderer + Copy Renderer + StyleSettings 联动。
- 旧 Component DSL 作为 renderer backend 纳入，边界需严格定义。

#### 为什么新项目不应直接迁移

- 旧项目 Visual Layer **停留在方案与部分决策**，与当前运行代码不一致。
- 直接迁移会把**未验证的复杂度**和**旧 DSL 残留**一并带入轻篇。

#### 可吸收的思想

- **ArticleBlock → VisualRecipe → Preview/Copy 双 renderer**，共享 recipe、不共享 DOM。
- **copySafety: strict | balanced | preview_only**，设计阶段即约束 preview-only 实验。
- heading 继续复用成熟 titleBlock 链路，新 block 不强行 normalize 成 infoCard。

**必须明确：不得建议轻篇直接迁移 Visual Layer 或 Space Style（旧实现或旧方案代码）。**

---

### 3.4 Preview / Copy Renderer 经验

#### 旧项目 preview/copy 不一致问题

| 问题 | 证据 |
|------|------|
| **P0 preview 有 card，copy 变 `<p>`** | `htmlExporter.ts` 中 list/summary/steps/pros_cons 等走 `p0BlockPlainText` 降级 |
| **preview 像 Demo，粘贴后像 plain text** | `s2-d5-current-style-system-audit-composer.md` §8.3 |
| **intro/cta 双路径** | preview intro 卡片 vs copy 固定「导语」section；cta 存在 `article.cta` 与 action block 双路径 |
| **inline emphasis 缺失** | paragraph 无 `**bold**`；preview/copy 均无局部样式 |
| **BL-091 未完成** | 「粘贴微信后台层级保留」仍为 Ready，非 Done |

#### 根因

1. **不同源 renderer：** P0 用 `P0BlockPreviewSections`；DSL 用 `componentPreview`/`componentHtml`；P0 copy 无对等 HTML renderer。
2. **D4 故意「最小 preview」** 先用 cardShell 快速接通，**未同步建设 copy**。
3. **复制非 DOM 抓取**（正确方向），但 HTML 生成路径未覆盖全部 block 类型。
4. **样式系统未在 Article 与 Renderer 之间 formalize**，导致 preview 迭代快于 copy。

#### 必须覆盖的问题类型（旧项目部分命中）

| 类型 | 旧项目情况 |
|------|------------|
| 字体字号丢失 | P0 copy 保留 bodyFontSize 等 token，但**结构**丢失 |
| 颜色丢失 | highlight 等有 section 样式；P0 结构化 block 丢失 |
| 标题样式丢失 | titleBlock 路径**大致同源**（相对成熟） |
| 卡片样式变化 | preview card → copy plain `<p>`，**严重不一致** |
| 网页 vs 公众号粘贴 | 有 WECHAT 规则；**完整人工粘贴 QA 未完成** |
| 135 编辑器 vs 微信公众号 | **未找到明确文档依据**；代码与 backlog 仅提及微信公众号后台 |

#### 修复经验 worth 吸收

- 复制必须 **inline style**，禁止依赖 Tailwind class（`WECHAT_HTML_EXPORT_SAFE_RULES`）。
- 用 **Article + preset + orchestratedBlocks 重新生成 HTML**，不抓 DOM。
- titleBlock 的 **preview/copy 共用 style config** 是可复用模式。
- 新 block 上线前：**preview renderer 与 copy renderer 必须成对交付**。

#### 轻篇前置规避

- Release 1 定义 **Copy Fidelity DoD**：每个 semantic block 有 copy HTML 验收用例。
- 建立 **paste QA checklist**（微信后台；若支持 135 则单独列项，旧项目无依据）。
- 禁止「先 preview 后 copy」的 block 类型发布节奏。

---

### 3.5 Copy-to-WeChat / 微信兼容经验

#### 微信公众号粘贴经验

| 实践 | 旧项目做法 |
|------|------------|
| **inline style** | `buildWechatHtml` / `componentHtml` 全部 inline |
| **标签选择** | 优先 `section` / `p` / `span` |
| **避免** | 复杂 flex/grid、absolute、CSS 变量、动画、hover、外部字体 |
| **Clipboard** | `ClipboardItem` 同时写 `text/html` + `text/plain` |
| **图片** | OSS 稳定 URL；AI 生图需用户手动上传（有 banner 提示） |
| **人工粘贴测试** | backlog BL-091 要求产品负责人验收；**尚未闭环** |

#### 轻篇结论

```text
复制一致性必须是 Release 1 P0；
不能等后期补 bug。
```

旧项目教训：功能上已有「复制到公众号」按钮（BL-090 Done），但**样式保真**（BL-091）被推迟，导致 P0 block 复制债务累积到 D5/D8。

---

### 3.6 SSE / Streaming / 打字机效果经验

#### 旧项目真实情况（以代码与 execution report 为准）

| 层级 | 实际情况 |
|------|----------|
| **底层模型** | Ark `chat.completions.create({ stream: true })` — **token/chunk streaming** |
| **应用层 SSE** | `POST /api/generate?stream=1` — Server-Sent Events |
| **结构化事件** | 当前主链路：**非** legacy 整 block `event: block`；而是 `block_start` → `block_delta` → `block_done` |
| **传输格式** | 模型输出 JSONL（一行一 block）；`BlockAwareJsonlStreamParser` 在 partial line 上解析 |
| **最终可信成稿** | `done.article` — **是** |
| **前端体验** | `block_delta` 实时更新 content → **打字机式逐步展示**（服务端真实 delta，非前端模拟） |

#### 历史尝试与淘汰方案

| 方案 | 结果 |
|------|------|
| Legacy `event: block` 整 block SSE | 块间等待感强，块内无打字感 → **已删除** |
| 前端假 reveal（pendingArticleBlocks 等） | **已废弃** |
| Loading-card（等下一块时显示 loading UI） | PO 认为尚可但非结构性 → **被 block-aware 替代** |
| 前端 typewriter-preview 分支 | PO：**未出现预期打字机** → **不合并** |
| Hybrid stream | PO 拒绝 → **不合并** |
| 服务端 fake block / 假进度 | 时序报告**明确不建议** |
| `emitCompatStreamFallback` | silent fallback → **已删除** |
| LandingAnalysisOverlay / 手动 tick 假进度 | **已删除** |

#### 更准确的经验结论

```text
旧项目更准确的经验是：
- 底层是 token/chunk streaming（火山 Ark stream: true）；
- 应用层需要结构化 SSE 事件（block_start / block_delta / block_done），
  不能只在整 block 或整篇 JSON 层面做 UX；
- 前端需要逐步展示（block_delta 驱动），
  但最终结果必须归一为 Article / done.article；
- 不能让 stream 中间态（partial blocks、typingContentByBlockId）
  成为与 Article 平行的「第二主结构」——它们只是 preview 状态机。
```

#### 附加经验

- 左侧 analysis 进度与右侧 block 流**不同步**会造成「卡住」错觉（~40s 模型生成耗时是主因之一）。
- 滚动策略：每个 delta 都 smooth scroll 会导致抖动；需 block_start 一次居中 + delta 节流跟滚。

---

### 3.7 Fixture / 手动测试经验

#### 旧项目 fixture 与脚本

| 类型 | 位置 / 用途 |
|------|-------------|
| **测试样例文章** | `config/testSamples.ts` — 4 篇预制长文（旅游/产品/健康等） |
| **P0 builder fixture** | `scripts/verify-s2-d4-p0-block-foundation.ts` |
| **SSE 时序** | `scripts/verify-s2-d3-stream-timing.ts` — 逐 block 时间戳 |
| **text_only 模块关闭** | `scripts/verify-sprint1-text-only-options.ts` |
| **模拟 JSONL E2E** | `scripts/verify-s2-d4-e2e-block-smoke.ts` + `s2-d4-e2e-smoke-results.json` |
| **Landing auto claim** | `scripts/verify-sprint1-landing-auto-fix.ts` |
| **产品/KB/context** | 多个 `verify-sprint1-*` 脚本 |

#### 缺失

- **无**独立 style gallery / block × variant 视觉回归 fixture。
- **无** copy HTML golden file 对比。
- **无** 微信粘贴自动化；BL-091 依赖人工。
- **135 编辑器测试**：未找到明确文档依据。

#### 轻篇建议

```text
fixture 是测试输入，不是 mock 主链路。
```

- 语义 block JSON / Article JSON 作 golden input。
- 每个 block：preview snapshot + copy HTML snapshot + paste QA 用例三联。
- SSE 脚本可保留用于性能回归，但不替代 paste QA。

---

### 3.8 敏捷管理与 ChatGPT + Cursor + docs 协作经验

#### 有效机制

| 机制 | 价值 |
|------|------|
| **docs 为唯一事实源** | decision-log / current-sprint / changelog 避免聊天上下文漂移 |
| **execution report 作交接凭证** | S2-D3-fix 等多轮实验靠 report 记录「合并/不合并」原因 |
| **ChatGPT 规划 + Cursor 执行** | 任务拆解、PO 范围确认（如 D4 P0 从 15→12 block） |
| **纯文档 sprint 切片** | D4 PO feedback、D5-B2 docs sync 可独立交付 |
| **废弃分支显式登记** | current-sprint 列出 typewriter/hybrid **不合并** |

#### 曾导致上下文丢失的问题

- 实验代码误提交到 hybrid 分支，需 extract-clean 拆包。
- 架构快照（0R-14）与 Sprint 2 代码演进不同步，需 style audit **以代码为准**。
- 「已完成」与「PO 未验收」混淆：block-aware 开发完成 ≠ merge，需 report 明确。

#### 轻篇改进建议

- B 版架构文档引用旧 lessons 时**标注旧项目版本/日期**。
- 强制：**每个架构决策进 decision-log**；每个迭代进 execution report。
- 区分 **Done（代码）** vs **Done（PO/粘贴 QA）**。

---

## 4. 不应迁移到轻篇的内容

| 排除项 | 为什么不迁移 | 可吸收的思想 | 轻篇应如何重新设计 |
|--------|--------------|--------------|-------------------|
| **旧项目整体代码** | 债务与双轨太多 | 模块边界参考 | 新仓库、新 schema、新 renderer |
| **Component DSL 实现代码** | 与 P0 混用、prompt 分叉 | variant/slot/orchestrate | 新 Style Definition 层 |
| **Visual Layer 方案代码** | 未完整实现 | Recipe 双 renderer | 轻篇自研 Style System |
| **Space Style** | 旧项目无此实现 | 未找到明确依据 | 若轻篇需要，从 A 版重新定义 |
| **多套 JSONL 协议** | legacy block SSE 已删，但历史存在过 | 单一 JSONL 白名单 | 一套 schema + 版本字段 |
| **多套 renderer** | P0 + DSL + 降级 copy | 成对 preview/copy | 代码生成或共享 recipe 驱动 |
| **多套 Article/Block 结构** | P0 + DSL + legacy heading | 单一 Article | 一种 NormalizedBlock |
| **旁路兼容逻辑** | emitCompatStreamFallback、双 generate 路径 | fail-fast + 明示降级 | 单一主路径 + 可选非流式 API |
| **历史实验代码** | typewriter/hybrid 分支 | block-aware 思路 | 在新项目验证后再合 |
| **废弃测试开关** | text_only 绕过 context_required | 隔离测试模式 | 独立 staging + 明确 banner |
| **临时 mock generate 链路** | TestSamplesPanel 无 import | fixture 输入 | 测试数据与 API 分离 |
| **胶水代码** | normalize 把 P0 升 DSL；quote→highlight | adapter 模式 | 明确 adapter 层而非散落 normalize |
| **HomePageClient 上帝组件** | ~2772 行 | hooks 外置模式 | GeneratePageShell 薄壳 |
| **手动 progress tick** | 已删 | status 驱动 UI | 真实 phase 枚举 |
| **LandingAnalysisOverlay 假进度** | 已删 | analysis 与 block 同步 | 进度绑定真实事件 |

---

## 5. 轻篇 B 版架构设计的校验清单

| # | 校验项 | 旧项目教训 |
|---|--------|------------|
| 1 | **是否只有一个 Article 主模型？** | 旧项目基本做到，但 stream 中间态易膨胀 |
| 2 | **是否避免 mockArticle / streamArticle / wechatArticle 平行结构？** | P0 preview state 应视为 Article 预览，非第二模型 |
| 3 | **是否把 Style System 放在 Article 与 Renderer 之间？** | 旧项目 Style 散落在 BlockRenderer/P0Sections/htmlExporter |
| 4 | **Preview Renderer 和 Copy Renderer 是否共享 Style Definition？** | P0 块**未共享**，是最大教训 |
| 5 | **Copy-to-WeChat 是否 Release 1 P0？** | 旧项目按钮 P0，保真被推迟 |
| 6 | **WeChat Paste QA 是否质量闭环？** | BL-091 未 Done |
| 7 | **是否支持主题 / 资料 / 草稿多输入？** | 旧项目有 mode 设计；Landing 主路径仅 topic |
| 8 | **是否允许底层 token streaming，应用层归一为 Article？** | block-aware + done.article 已验证 |
| 9 | **是否有 fixture / regression / paste test 体系？** | 旧项目有 scripts，缺 paste golden |
| 10 | **是否避免 Visual Layer / Space Style 历史包袱？** | 方案级复杂度未验证，勿照搬 |
| 11 | **是否避免样式写死在页面组件？** | cardShellStyle 反例 |
| 12 | **是否为 slot / density / variant / registry 预留正式模型？** | 旧项目 variant 硬编码、无 registry |
| 13 | **是否区分样式系统和完整样式市场？** | 旧项目 StyleSettings 是 preset 切换，非市场 |
| 14 | **是否明确 Release 1 范围？** | 旧项目 Sprint 2 仍并行 D5/D8 |
| 15 | **是否纳入 ChatGPT + Cursor + docs + execution report 治理？** | 旧项目已验证有效 |

---

## 6. 给轻篇的最终建议

### 6.1 Article / Block

| 类别 | 建议 |
|------|------|
| **必须做** | 单一 Article schema；语义 block 白名单；finalize 事件（等价 done.article）；meta 字段与 blocks[] 规则写进协议 |
| **应该避免** | 模型输出 Component DSL；block type 默认等于 card；parser 降级语义（list→paragraph） |
| **待重新决策** | block 数量（旧 12 P0）；是否支持 article_polish / material 等多 mode 于 Release 1 |

### 6.2 Style System

| 类别 | 建议 |
|------|------|
| **必须做** | Article → StyleRecipe/Definition → Preview+Copy；WECHAT safe rules 首版写入；preset/theme 与用户切换策略 |
| **应该避免** | 迁移旧 Component DSL / P0VisualRecipe 代码；preview-only variant；Tailwind 进 copy HTML |
| **待重新决策** | slot/density 是否 Release 1；参考文章样式入库（旧项目无） |

### 6.3 Renderer

| 类别 | 建议 |
|------|------|
| **必须做** | Preview/Copy 成对；共享 recipe；inline style copy；非 DOM 抓取 |
| **应该避免** | P0BlockPreviewSections 式「先 card preview 后 plain copy」 |
| **待重新决策** | 是否复用 React 同组件双模式输出 HTML（旧项目分离 tsx vs html string） |

### 6.4 Copy-to-WeChat

| 类别 | 建议 |
|------|------|
| **必须做** | Release 1 P0；每 block copy 验收；人工粘贴 QA；plain text fallback |
| **应该避免** | 复制功能先上、保真后补 |
| **待重新决策** | 135 编辑器支持范围（旧项目无依据） |

### 6.5 Generation / Streaming

| 类别 | 建议 |
|------|------|
| **必须做** | 应用层 block_start/delta/done；done.article finalize；失败 explicit error |
| **应该避免** | legacy 整 block SSE；前端假 typewriter；compat silent fallback；fake progress |
| **待重新决策** | 是否保留非流式 API；Grounding/KB/web search 是否 Release 1 |

### 6.6 Fixture / QA

| 类别 | 建议 |
|------|------|
| **必须做** | Article JSON fixture；copy HTML golden；paste checklist；block 合规脚本 |
| **应该避免** | fixture 替代真实 generate API 作为主链路 |
| **待重新决策** | E2E 是否依赖真实 LLM（旧项目 live smoke 1/4 pass 过） |

### 6.7 Docs / Governance

| 类别 | 建议 |
|------|------|
| **必须做** | decision-log；execution report；废弃方案登记；B 版引用本 lessons 文档 |
| **应该避免** | 聊天记录当事实源；未 PO 验收标 Done |
| **待重新决策** | 轻篇是否沿用相同 docs 目录结构 |

---

## 7. 参考依据

### 7.1 架构与生成主线

| 路径 | 用途 / 发现 |
|------|-------------|
| `docs/architecture/current-architecture-audit.md` | Sprint 0R 架构快照；双轨 generate；HomePageClient 债务 |
| `docs/generate-block-stream-architecture.md` | SSE 主线；已废弃实验清单；generationOptions |
| `docs/architecture/target-architecture-draft.md` | 目标薄壳、Mode Registry；compat fallback 治理建议 |
| `lib/generateStreamServer.ts` | 当前 block-aware SSE 编排 |
| `lib/generateStreamBlockArk.ts` | Ark token stream + JSONL parser |
| `lib/blockAwareJsonlStreamParser.ts` | block_start/delta/done 解析 |
| `lib/blockAwareStreamPreview.ts` | 前端 preview 状态机 |
| `lib/landingGenerateStreamClient.ts` | SSE 消费与 callback |
| `docs/agile/execution-reports/s2-d3-fix-cleanup-block-aware-main-path.md` | 删除 legacy block SSE；统一 block-aware |
| `docs/agile/reports/s2-d3-fix-block-aware-token-stream-report.md` | typewriter/hybrid 不合并；滚动抖动修复 |
| `docs/agile/reports/s2-d3-stream-timing-baseline-report.md` | 等待感根因；禁止 fake block |

### 7.2 Article / Block / D4

| 路径 | 用途 / 发现 |
|------|-------------|
| `types/article.ts` | Article + DSL/P0 block 类型 |
| `lib/streamBlockTypes.ts` | P0 JSONL 白名单 |
| `lib/streamP0BlockParse.ts` | JSONL → ArticleBlock |
| `lib/streamArticleBuilder.ts` | 增量合并 |
| `docs/agile/s2-d4-p0-block-protocol.md` | 12 P0 block 协议 |
| `docs/agile/decision-log.md` 决策 7–8 | P0 集合；语义≠视觉 |
| `docs/agile/execution-reports/2026-05-26-s2-d4-manual-qa-feedback.md` | card 化 Demo 问题 |

### 7.3 样式 / Preview / Copy

| 路径 | 用途 / 发现 |
|------|-------------|
| `docs/agile/s2-d5-current-style-system-audit-composer.md` | 双轨渲染；P0 copy 降级；无 registry |
| `docs/agile/s2-d5-p0-block-visual-layer-plan.md` | P0VisualRecipe 目标架构（方案，未完全实现） |
| `docs/agile/decision-log.md` 决策 9 | 统一 Visual Layer 方向 |
| `components/BlockRenderer.tsx` | preview 分发 |
| `components/P0BlockPreviewSections.tsx` | P0 cardShell preview |
| `lib/componentPreview.tsx` / `lib/componentHtml.ts` | DSL 成对 renderer |
| `lib/htmlExporter.ts` | P0 → plain `<p>` 降级 |
| `lib/titleBlockStyleConfig.ts` | WECHAT_HTML_EXPORT_SAFE_RULES；title 同源模式 |
| `lib/wechatCopy/copyWechatToClipboard.ts` | Clipboard 双格式 |
| `lib/orchestrateBlocks.ts` | Style Orchestrator（不覆盖 P0） |

### 7.4 测试 / Backlog / 协作

| 路径 | 用途 / 发现 |
|------|-------------|
| `config/testSamples.ts` | 预制测试文章 |
| `scripts/verify-s2-d3-stream-timing.ts` | SSE 时序 fixture |
| `scripts/verify-s2-d4-p0-block-foundation.ts` | P0 builder 验证 |
| `docs/agile/backlog.md` BL-091 | 粘贴保真未 Done |
| `docs/agile/current-sprint.md` | S2-D3-fix / D5 / D8 状态 |
| `docs/agile/execution-reports/s2-execution-log.md` | 多轮 handoff 记录 |
| `docs/README.md` | 文档地图与阅读路径 |
| `AGENTS.md` | AI 协作规则 |

### 7.5 无法确认或缺少依据

| 项 | 说明 |
|----|------|
| **Space Style / Space Style System** | 未找到旧项目文档或代码。**未找到明确文件依据，需要用户确认**是否为轻篇侧术语或其它仓库内容。 |
| **135 编辑器粘贴** | 代码与 backlog 无专项记录；仅微信公众号后台。**未找到明确文件依据**。 |
| **P0 Visual Layer 代码落地程度** | 方案与决策存在；B3–B7 实现状态以 Sprint 2 current-sprint 为准（进行中/待执行），**不应视为已交付能力**。 |
| **typewriter-preview 分支具体实现** | 仅 execution report 记录 PO 未通过，**分支代码未合并**，未审计具体文件。 |

---

*本文档由旧项目 `docs/prototype-architecture-lessons` 分支审计产出，供轻篇 B 版架构设计引用。*
