# Execution Report：S8-STORY-006 公众号实机粘贴 QA 流程

## 1. 基本信息

- 日期：2026-06-04
- 当前分支：`docs/s8-story-006-paste-qa-workflow`
- 来源分支：`sprint/s8-wechat-safe-css-contract`
- 目标合并分支：`sprint/s8-wechat-safe-css-contract`
- Sprint：S8
- 关联：S8-STORY-006 · DECISION-090 · S8-STORY-005 Matrix
- 状态：**In Review**（未 merge sprint）

## 2. 本轮目标

定稿公众号实机 Paste QA 流程、Session 模板、Copy HTML QA pack、Drift 闭环规则；**不**代 PO 粘贴、**不**虚构 paste PASS。

## 3. 执行范围

**做了：**

- `wechat-paste-qa-workflow.md`
- `wechat-paste-qa-session-2026-06-04-s8-story-006.md`（19 行待填 · paste UNTESTED）
- `wechat-paste-qa-pack-2026-06-04.md` + `tests/snapshots/wechat-paste-qa/*.html`（19）
- `tests/support/wechat-paste-qa-pack-builder.ts`（复用 fidelity matrix builder）
- `tests/core/wechat-compat/wechat-paste-qa-pack.test.ts`
- `copy-drift-diagnostics.md` 升级为可执行流程（`DRIFT-S8-*`）
- `wechat-fidelity-matrix.md` §7 Paste QA 入口 + Risk Set 说明

**没做：**

- PO 公众号实机粘贴（pasteStatus 保持 UNTESTED）
- renderer / Contract v1 分级 / preset / variant 变更
- S8-STORY-007

## 4. 新增文件

- `docs/agile/paste-qa/wechat-paste-qa-workflow.md`
- `docs/agile/paste-qa/wechat-paste-qa-session-2026-06-04-s8-story-006.md`
- `docs/agile/paste-qa/wechat-paste-qa-pack-2026-06-04.md`
- `tests/support/wechat-paste-qa-pack-builder.ts`
- `tests/core/wechat-compat/wechat-paste-qa-pack.test.ts`
- `tests/snapshots/wechat-paste-qa/*.html`（19）
- 本 execution report

## 5. 修改文件

- `docs/architecture/copy-drift-diagnostics.md`
- `docs/architecture/wechat-safe-html-css-contract.md`（STORY-006 状态）
- `docs/agile/paste-qa/wechat-fidelity-matrix.md`（§7 仅文档，validator 表未改）
- `docs/agile/sprint-backlog.md`、`changelog.md`、`decisions.md`、`sprint-plan.md`、`sprint8-wechat-safe-css-contract.md`

## 6. Paste QA 摘要

| 集合 | 条数 | matrixRowIds |
|------|------|----------------|
| Smoke | 10 | TITLE-001, HEAD-001, PARA-001, LEAD-001, LIST-001, QUOTE-001, SUM-001, CARD-001, CTA-001, DIV-001 |
| Risk | 5 | TITLE-002/003, HEAD-002/004, LEAD-003（validator FAIL） |
| Probe | 4 | PARA-004, SUM-004, CARD-004, DIV-004 |

可选 waiver 复测：`S8M-HEAD-003`

## 7. QA pack

- 已生成：`wechat-paste-qa-pack-2026-06-04.md`
- 快照：`tests/snapshots/wechat-paste-qa/<fixtureId>.html`
- 更新命令：`UPDATE_PASTE_QA_PACK=1 npx vitest run tests/core/wechat-compat/wechat-paste-qa-pack.test.ts`

## 8. Matrix 回填

- **未回填** `pasteStatus` / `pasteEvidence`（无 PO 实机结果）
- 35 行 Matrix validator 表**未修改**
- 新增 §7 文档入口与 Risk Set 跟踪说明

## 9. PO 实机结果

- **无** — 本轮不可宣称 Paste QA PASS 或 Story Done（流程层面）

## 10. 验收标准

| AC | 结果 |
|----|------|
| workflow / session / pack / drift | PASS |
| Smoke 10 + Risk 5 + Probe 4 | PASS |
| 不虚构 paste PASS | PASS |
| lint / test / build | 见 §11 |

## 11. 运行检查

| 命令 | 结果 |
|------|------|
| npm run test | PASS · 846 tests |
| npm run lint | PASS · 0 errors |
| npm run build | PASS |

## 12. 未完成

- PO 执行 Session 粘贴并回填 Matrix
- merge → sprint（待用户）
- S8-STORY-007

## 13. 风险

- PO 未测前 Matrix 全 UNTESTED 可能被误读为「已验收」
- Risk Set 实机可能与 validator FAIL 不一致，须 Drift 记录

## 14. 建议 merge

审查通过后：`docs/s8-story-006-paste-qa-workflow` → `sprint/s8-wechat-safe-css-contract`

## 15. Commit

- 未提交 / not committed（`docs: add wechat paste qa workflow`）
