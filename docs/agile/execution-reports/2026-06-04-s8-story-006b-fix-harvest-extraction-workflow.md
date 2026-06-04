# Execution Report：S8-STORY-006B-FIX-A Harvest Evidence 提取工作流

## 1. 基本信息

- 日期：2026-06-04
- 当前分支：`docs/s8-story-006b-fix-harvest-extraction-workflow`
- 来源分支：`docs/s8-story-006b-style-research-drift-triage`（006B 同链 · 未 merge sprint）
- 目标合并分支：`sprint/s8-wechat-safe-css-contract`（待 006B/FIX-A 审查后）
- Sprint：Sprint 8
- 关联 Story / Decision：S8-STORY-006B-FIX-A · DECISION-091（implementation note §7）
- 执行者：Cursor
- 状态：**Done**（用户确认 2026-06-04 · merge sprint）

## 2. 本轮目标

建立 **article harvest evidence extraction** 最小流程：用户仅提供 URL 或 URL+HTML，由 AI 提取样式/DOM/CSS/pattern；将 HARVEST-001~015 降为 **L0**；为 FIX-B（5–10 篇真实 evidence）铺路。

## 3. 执行范围

**做了：** L0–L4 定义 · 输入模板 · 提取规范 · harvest/Pattern/triage/research 表述修正 · 两阶段策略

**未做：** 补真实 URL · FIX-B · 006C · `src/**` · 虚构链接 · 保存大段 HTML/正文

## 4. 修改文件

- `docs/research/wechat-published-article-style-harvest.md`
- `docs/research/wechat-style-structured-research.md`
- `docs/research/wechat-editor-compatibility-reference.md`
- `docs/architecture/wechat-copy-safe-pattern-library.md`
- `docs/agile/paste-qa/drift/s8-drift-triage-2026-06-04.md`
- `docs/agile/sprint-backlog.md`
- `docs/agile/sprint-plan.md`
- `docs/agile/sprint8-wechat-safe-css-contract.md`
- `docs/agile/changelog.md`
- `docs/agile/decisions.md`

## 5. 新增文件

- `docs/research/wechat-published-article-harvest-input-template.md`
- `docs/research/wechat-published-article-style-extraction-guide.md`
- `docs/agile/execution-reports/2026-06-04-s8-story-006b-fix-harvest-extraction-workflow.md`

## 6. evidenceLevel 更新摘要

| 级别 | 用途 |
|------|------|
| L0 | HARVEST-001~015（无 URL） |
| L1 | 仅登记 URL，不指导结构 |
| L2/L3/L4 | 指导 006C 的弱/强证据（AI 阅读 / HTML / Paste） |

## 7. 输入模板摘要

- **格式 A：** URL-only → 默认 L1，可读则 L2
- **格式 B：** URL + htmlSnippet → L3
- 用户 **不** 手填 domSummary/cssSummary/patternMapping

## 8. AI extraction guide 摘要

输出 `WX-HARVEST-EVIDENCE-###`：`observedStyleTypes` · `domSummary` · `cssSummary` · `patternMapping` · `riskFlags` · `recommendedUseIn006C` 等；无法访问且无 HTML 时禁止编造。

## 9. HARVEST-001~015 修正

- 每条增加 `evidenceLevel: L0 pattern-hypothesis` · `articleUrl: —`
- 文档标题改为「模式归纳与证据采集」
- 新增 §2 L0–L4 · §3 Evidence Backfill Workflow · §6 格式示例（非真实 evidence）

## 10. Pattern Library 影响

- §1 Evidence 层级表
- 各 pattern 增加 `currentEvidenceLevel` · `needsArticleEvidence`
- 逻辑未改；L0 不写成的实采证据

## 11. 对 006C 的影响

- **不阻塞** 006C：主依据仍为 PO Paste QA + Drift + Matrix
- L0 harvest 仅辅助；L2/L3 可增强
- **006D** 必须 Paste Re-test（triage §1.1）

## 12. 未完成事项

- 用户确认 FIX-A Done · merge
- FIX-B 5–10 篇真实 evidence
- 006B 原分支是否先 merge sprint（用户定）

## 13. 风险

- URL-only 依赖 AI 能否访问微信链接（常受限）→ 应优先 URL+HTML
- 用户误以为 HARVEST 已是实采 → 已通过 L0 标注缓解

## 14. 是否建议 merge → sprint

**已 merge** → `sprint/s8-wechat-safe-css-contract`（用户确认 2026-06-04 · 与 006B 同链）。

## 15. 运行检查

| 命令 | 结果 |
|------|------|
| `npm run test` | PASS · 845 tests |
| `npm run lint` | PASS · 0 errors |
| `npm run build` | PASS |

## 16. Commit

- Message：`docs: add harvest evidence extraction workflow`
- Hash：`197350b`
- **未 merge**
