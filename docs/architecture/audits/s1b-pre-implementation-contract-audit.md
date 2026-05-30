# S1-B 实现前契约缺口二次审计

> 审计日期：2026-05-30  
> 审计分支：`docs/s1b-pre-implementation-contract-audit`  
> 审计对象：S1-STORY-021 修正后的轻篇技术方案  
> 对照材料：[references/prototype-style-system-technical-lessons.md](../references/prototype-style-system-technical-lessons.md)  
> 方法：只读文档审计，不修改方案正文

---

## 1. 审计结论摘要

**总体结论：**

- **是否可以进入 Sprint 2：** **有条件可以**
- **主要原因：** S1-STORY-021 四项缺口在文档层已基本补齐，旧项目核心反模式（双轨 Style、P0 preview/copy 分裂、无 ResolvedStyle 层）在轻篇方案中有明确约束；但仍有若干 **P1** 契约细节未写清，宜在 Sprint 2 启动时或 Sprint 3 前补齐，避免 Style/Copy 阶段返工。
- **必须修复的问题（P0）：** **0 项**（针对 Sprint 2「Article / Block + InlineContent 代码契约」范围）
- **可进入后续 Sprint 处理的问题：** orchestrator 文章级节奏、InlineMark→CSS 映射表、WeChat profile 机器可读 fixture、list/info_card copy 结构规则、Clipboard 双格式细节等（P1/P2）

**审计最终分级：C — 可以 merge S1-STORY-021 至 sprint 分支，但 Sprint 2 启动前建议关闭或登记 P1 契约项；暂不建议在无审查情况下直接进入 Sprint 2 代码实现。**

---

## 2. 四个缺口逐项审计

### A. InlineContent / InlineMark / 段内高亮协议

| 项 | 内容 |
|----|------|
| **当前文档位置** | `block-schema.md` §3.1、§5.2/5.4；`article-schema.md`；`architecture-overview.md` 契约表；`rendering-pipeline.md`；`copy-to-wechat-pipeline.md` §1.3 |
| **当前方案摘要** | InlineContent = InlineTextNode[]；InlineMark 含 bold/italic/highlight/color/link；paragraph/lead 支持 `string \| InlineContent`；禁止 HTML 富文本；Release 1 normalize 为 InlineContent |
| **对照 prototype 结论** | 旧项目 **无 inline emphasis 协议**（prototype §9 #14 FAIL）；轻篇已补协议，吸收 §5.4「card 内文字须 inline typography」原则的前置语义层 |
| **是否解决原问题** | **基本解决**（相对 S1-STORY-021 前） |
| **仍存在的问题** | ① `title`/`heading`/`quote`/`highlight`/`cta` 仍用 `text: string`，与 paragraph/lead 的 `body` 命名不一致；② list item 仍为 `text: string`，未预留 InlineContent；③ **无 InlineMark type → copy-safe CSS 映射表**（仅原则）；④ `color` mark 与 Style System token 关系未定义 |
| **风险等级** | **P1**（不阻塞 Sprint 2 Zod 起步；Sprint 4 Copy 前须补映射表） |
| **建议动作** | Sprint 2 启动时新增 DECISION：block 文本字段统一命名（`body` vs `text`）；Sprint 3/4 前补 InlineMark 映射附录 |

### B. StyleDefinition / VariantDefinition / ResolvedBlockStyle / ResolvedArticleStyle 命名边界

| 项 | 内容 |
|----|------|
| **当前文档位置** | `style-system.md` §3.1–3.2；`rendering-pipeline.md` §5–6；`architecture-overview.md` §7、§4 契约表 |
| **当前方案摘要** | 八概念边界表；Renderer 消费 ResolvedBlockStyle/ResolvedArticleStyle；VariantDefinition 在 registry；StyleResolver 中间层；DECISION-025 歧义已在 §3.2 澄清 |
| **对照 prototype 结论** | 旧项目 **无统一 StyleDefinition 层**（prototype §2.2、§7.1）；轻篇已明确 Resolved 层，PASS 对照清单 #1 |
| **是否解决原问题** | **是**（文档层） |
| **仍存在的问题** | ① **ArticleStylePlan / orchestrator** 文章级 variant 节奏（旧项目 orchestrateBlocks）仅 architecture-overview 一笔带过，无 assignment 策略说明；② prototype 建议的 `semanticRules` / component 映射表未写；③ DECISION-025 历史表述「StyleDefinition 为共享来源」与 §3.2 澄清并存，新人仍可能误读 |
| **风险等级** | **P1**（Sprint 3 Style 代码前须补 orchestrator 或明确 Release 1 不做） |
| **建议动作** | Sprint 3 方案中补「ArticleStylePlan / 可选 Orchestrator」小节；或 DECISION 明确 Release 1 仅用 preset blockDefaults、不做文章级 dampen |

### C. slot 的 copy-safe 实现边界

| 项 | 内容 |
|----|------|
| **当前文档位置** | `style-system.md` §3.3、§4.6；`wechat-copy-style-rules.md`；`copy-to-wechat-pipeline.md` §1.3 |
| **当前方案摘要** | SlotRenderSpec 结构；禁止 pseudo/absolute/hover；须 fallback + copySafety；Release 1 默认 slot 不得 preview_only |
| **对照 prototype 结论** | 吸收 slot/variant 思想（prototype §3.2）；避免 cardShell 默认壳（prototype §4）；copySafety 治理 PASS |
| **是否解决原问题** | **基本解决** |
| **仍存在的问题** | ① **无 classic-news 各 variant 的 slot 实例**（如 heading-underline 的 line slot）；② fallback 链无示例；③ slot `kind` 与 Copy HTML 标签映射未定义 |
| **风险等级** | **P2**（Sprint 3 定义 variant 时补实例即可） |
| **建议动作** | Sprint 3 每个 Release 1 variant 交付时附带 SlotRenderSpec 示例 |

### D. WeChatCompatibilityProfile / 微信兼容规则可执行化

| 项 | 内容 |
|----|------|
| **当前文档位置** | `wechat-copy-style-rules.md` §1.3；`copy-to-wechat-pipeline.md` §1.3；`style-system.md` wechatCompatibility 字段 |
| **当前方案摘要** | profile 结构；Allowed/Risky/Forbidden；FallbackPolicy；requireInlineStyle + requireTextNodeTypography；Copy Renderer 必须使用 profile |
| **对照 prototype 结论** | 由 WECHAT_HTML_EXPORT_SAFE_RULES 扩展（prototype §3.7、§10.3 #4）；旧项目仅 titleBlock 较完整 → 轻篇升级为全局 profile，**优于旧项目** |
| **是否解决原问题** | **基本解决** |
| **仍存在的问题** | ① **无可执行 JSON/YAML fixture**（仅 Markdown 列表）；② prototype §8.3「card 内文字勿依赖 wrapper 继承」未单独成章；③ Clipboard `text/html` + `text/plain` 双格式（prototype §8.6）在 copy-to-wechat 未展开 |
| **风险等级** | **P1**（Sprint 3 宜有 profile fixture；Sprint 4 Copy 前须可编码） |
| **建议动作** | Sprint 3 增加 `tests/fixtures/wechat-mp-editor-v1.profile.json`（文档级路径预留）；Sprint 4 补 Clipboard 双格式规范 |

---

## 3. 对照一键成稿经验的审计表

| # | 检查项 | 旧项目经验 / 风险 | 当前轻篇是否覆盖 | 覆盖位置 | 结论 | 风险 | 建议 |
|---|--------|-------------------|------------------|----------|------|------|------|
| 1 | 单一 StyleDefinition / ResolvedStyle 中间层 | 样式散落各 renderer | 是 | style-system §3.2；rendering-pipeline §5 | PASS | 无 | — |
| 2 | 避免 Preview / Copy 两套样式来源 | 双轨 renderer | 是 | architecture-overview §10；DECISION-025 | PASS | 无 | — |
| 3 | 避免 P0 preview card + copy plain `<p>` | htmlExporter 降级 | 是（约束） | copy Fidelity DoD；成对交付规则 | PASS | P2 | Sprint 4 用 paste QA 验证 |
| 4 | 避免旧 Component DSL 代码迁移 | 双轨债务 | 是 | architecture-overview §16；prototype-lessons | PASS | 无 | — |
| 5 | 吸收 component/variant/slot/orchestrator 思想 | DSL 有效部分 | 部分 | variant/slot/registry 有；**orchestrator 弱** | PARTIAL | P1 | Sprint 3 补 assignment 策略 |
| 6 | registry 非硬编码 variant | 枚举分散 | 是（设计） | style-system §4.4 | PASS | P2 | Sprint 3 实现 registry |
| 7 | copySafety / preview_only 治理 | preview 长期无 copy | 是 | style-system §3.1/3.3；copy DoD | PASS | 无 | — |
| 8 | WeChatCompatibilityProfile | WECHAT rules 片段 | 是 | wechat-copy-style-rules §1.3 | PARTIAL | P1 | 补 machine-readable fixture |
| 9 | 明确 inline style copy | 必须 inline | 是 | wechat-copy-style-rules §2.2 | PASS | 无 | — |
| 10 | 禁止 DOM 抓取复制 | buildWechatHtml 数据重建 | 是 | copy-to-wechat §7 | PASS | 无 | — |
| 11 | block × variant × paste QA | BL-091 未 Done | 是（规划） | Sprint 4/6；Copy Fidelity DoD | PARTIAL | P1 | Sprint 4 启动 QA |
| 12 | Done（代码）vs Done（粘贴 QA） | 按钮≠保真 | 是 | copy-to-wechat §1.1 | PASS | 无 | — |
| 13 | 避免 LLM 输出 visual/CSS | prompt 选 variant | 是 | block 语义分离；generation 只产出 Article | PASS | 无 | — |
| 14 | Style 切换不 mutate content | StyleSettings 设计 | 是 | styleAssignment 只读引用 | PASS | 无 | — |
| 15 | 避免 fixture mock 主链路 | TestSamples | 是 | architecture-overview §13 | PASS | 无 | — |
| 16 | copy HTML golden / paste checklist / 三联 | 旧项目缺失 | 是（规划） | Sprint 6；architecture-overview §13 | PARTIAL | P1 | Sprint 6 落地 |
| 17 | 避免多套 Article/Block/JSONL/renderer | 双轨 | 是 | 禁止项；GenerationEvent 统一 | PASS | 无 | — |
| 18 | importedTemplate / userStyleLibrary 仅预留 | 未实现 | 是 | DECISION-028；architecture-overview §15 | PASS | 无 | — |

**PASS：13 · PARTIAL：5 · FAIL：0**

---

## 4. Sprint 2 进入条件审计

| # | 审计项 | 结论 |
|---|--------|------|
| 1 | Article 顶层结构足够 Zod/TS | **是** — article-schema 字段完整 |
| 2 | Block 11 种类型足够明确 | **是** — block-schema §4 |
| 3 | InlineContent / InlineMark 足够实现 | **基本是** — §3.1 足够起步；映射表可 Sprint 3/4 补 |
| 4 | paragraph/lead/quote 等与 InlineContent 一致 | **部分** — paragraph/lead 已统一；quote/highlight/cta 仍为 plain string（**不阻塞 Sprint 2**） |
| 5 | metadata.title 与 title block | **是** — article-schema + block-schema §5.1 |
| 6 | styleAssignment 不携带 CSS | **是** |
| 7 | fixture 规则 | **是** — article-schema §9 |
| 8 | GenerationEvent 影响 Sprint 2 schema | **低影响** — generation 字段在 Article.generation?；Sprint 2 可先实现静态 fixture 路径 |

**Sprint 2 是否可启动：有条件是**

**条件：**

1. S1-STORY-021 已 merge 至 `sprint/s1b-core-tech-governance` 且 ChatGPT/用户审查通过  
2. Sprint 2 启动 commit 前登记 **P1-001**：block 文本字段 `body` vs `text` 统一命名（待确认 Decision）  
3. Sprint 2 范围严格限定为 Article/Block/InlineContent/**不含** Style Resolver / Renderer / Generation API

**若条件不满足：** 不应启动 Sprint 2 代码分支。

---

## 5. 是否需要新增修复 Story

**本轮不建议新增 S1-STORY-023 修复 P0**（无 P0）。

**建议：**

- **S1-STORY-021** 可进入用户 / ChatGPT **最终审查**，审查通过后 merge sprint 分支  
- **S1-STORY-022**（本轮 audit）完成后进入 In Review  
- 跟踪 **P1 清单**（见 execution report），可在 Sprint 2 并行由文档小修或 Sprint 3 前集中补契约，**不必**单独开 Story 除非用户要求

---

## 6. P0 / P1 / P2 问题清单

### P0（0）

无。当前无「不解决则 Sprint 2 必返工或架构分裂」项。

### P1（7）

| ID | 问题 | 建议 Sprint |
|----|------|-------------|
| P1-001 | block 文本字段 `body` vs `text` 命名不一致 | Sprint 2 启动前 Decision |
| P1-002 | InlineMark → copy-safe CSS 映射表缺失 | Sprint 3/4 |
| P1-003 | ArticleStylePlan / orchestrator 文章级节奏未定义 | Sprint 3 |
| P1-004 | WeChatCompatibilityProfile 无 machine-readable fixture | Sprint 3 |
| P1-005 | list / info_card copy 结构保真规则未细化（旧项目 list→`<p>` 风险） | Sprint 4 |
| P1-006 | Clipboard text/html + text/plain 双格式未写清 | Sprint 4 |
| P1-007 | card 内文字 requireTextNodeTypography 细则未展开 | Sprint 4 |

### P2（4）

| ID | 问题 | 建议 Sprint |
|----|------|-------------|
| P2-001 | quote/highlight/cta 未升级 InlineContent | Release 2 或 Sprint 5+ |
| P2-002 | classic-news slot 无具体 SlotRenderSpec 示例 | Sprint 3 |
| P2-003 | semantic block → visual 映射表未写 | Sprint 3 |
| P2-004 | article-schema InlineContent 说明行重复 | 文档小修 |

---

## 7. 审计最终结论（分级）

| 选项 | 判定 |
|------|------|
| **A.** 可以 merge S1-STORY-021 到 sprint | **是**（审查通过后） |
| **B.** 必须先修复 P0 再 merge | **否**（无 P0） |
| **C.** 可以 merge，但 Sprint 2 启动前需补 P1 | **是** — **主结论** |
| **D.** 暂不建议进入 Sprint 2 | **部分** — 无审查时不建议；有条件审查通过后可启动 |

---

## 8. 概念混用检查（附加）

| 区域 | 是否仍有混用风险 | 说明 |
|------|------------------|------|
| StyleDefinition vs ResolvedBlockStyle | **低** | §3.2 已澄清；实现时 TypeScript 命名须严格 |
| Article vs stream 中间态 | **低** | generation-pipeline 明确 partial Article |
| Block 语义 vs CSS | **低** | 禁止项明确 |
| InlineMark vs CSS color | **中** | color mark 语义与 token 映射待 P1-002 |
| Style vs Content mutation | **低** | styleAssignment 引用模式 |

---

## 9. 相关文档

- [S1-STORY-021 execution report](../../agile/execution-reports/2026-05-30-s1b-pre-implementation-contract-gaps.md)
- [prototype-style-system-technical-lessons.md](../references/prototype-style-system-technical-lessons.md)
