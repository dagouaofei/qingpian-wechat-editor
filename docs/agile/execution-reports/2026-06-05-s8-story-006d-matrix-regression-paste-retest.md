# Execution Report：S8-STORY-006D Matrix Regression + Paste Re-test

## 1. 基本信息

- 日期：2026-06-05
- 当前分支：`docs/s8-story-006d-matrix-regression-paste-retest`
- 来源分支：`sprint/s8-wechat-safe-css-contract`
- 目标合并分支：`sprint/s8-wechat-safe-css-contract`（Mode A — **待 PO 实测后再 merge**）
- Sprint：Sprint 8 — WeChat-safe CSS Contract
- 关联 Story / Bug / Decision：S8-STORY-006D · S8-STORY-006C（Done · `db185bf`）· DECISION-088/089/090/091
- 执行者：Cursor
- 状态：**Ready for PO Paste QA**（Mode A）

## 2. 本轮目标

006C 后 Matrix 回归基础设施：生成 006D QA Pack + Session 模板 + 006D overlay 队列标记；不虚构 paste PASS。

## 3. 执行范围

**做了：**

- 006D Re-test / Harvest / Control 三集合 QA Pack（15 行）
- 006D Session 模板（PO 回填字段 · 默认 `UNTESTED` / `pending`）
- `S8_FIDELITY_PASTE_QA_OVERLAY_20260605_006D`（空 overlay · Mode B 入口）
- Matrix 重生成：006 paste 列保留 · `contractAction` / `notes` 标 queued for 006D
- 15 个 006D HTML snapshots（`tests/snapshots/wechat-paste-qa/006d/`）
- 测试：006D pack + Matrix 006D queue 断言
- Drift 001/002/004–009 追加 006D Re-test 节（状态不变）

**未做：**

- PO 实机粘贴与回填（Mode B）
- merge sprint / release / main
- renderer / Contract / Validator 变更
- S8-STORY-007 / S9

## 4. 修改文件

- `tests/support/wechat-fidelity-matrix-builder.ts`
- `tests/core/wechat-compat/wechat-fidelity-matrix.test.ts`
- `docs/agile/paste-qa/wechat-fidelity-matrix.md`
- `docs/agile/paste-qa/drift/DRIFT-S8-20260604-001.md` ~ `009.md`（001–002、004–009）
- `docs/agile/paste-qa/drift/s8-drift-triage-2026-06-04.md`
- `docs/architecture/wechat-copy-safe-pattern-library.md`
- `docs/research/wechat-published-article-evidence/WX-HARVEST-EVIDENCE-001.md`
- `docs/agile/sprint-backlog.md`
- `docs/agile/changelog.md`
- `docs/agile/decisions.md`

## 5. 新增文件

- `tests/support/wechat-fidelity-matrix-006d-retest.ts`
- `tests/support/wechat-fidelity-matrix-paste-overlay-006d.ts`
- `tests/support/wechat-paste-qa-pack-builder-006d.ts`
- `tests/core/wechat-compat/wechat-paste-qa-pack-006d.test.ts`
- `docs/agile/paste-qa/wechat-paste-qa-pack-2026-06-05-s8-story-006d.md`
- `docs/agile/paste-qa/wechat-paste-qa-session-2026-06-05-s8-story-006d.md`
- `tests/snapshots/wechat-paste-qa/006d/*.html`（15 个）

## 6. 阅读但未修改的关键文件

- `docs/agile/execution-reports/2026-06-04-s8-story-006c-harvest-pattern-candidate-fix.md`
- `docs/agile/paste-qa/wechat-paste-qa-session-2026-06-04-s8-story-006.md`
- `tests/support/wechat-fidelity-matrix-paste-overlay.ts`
- `tests/support/wechat-paste-qa-pack-builder.ts`

## 7. 关键变更说明

- **采用模式：Mode A** — QA Pack + Session 模板就绪；Matrix 仍展示 Session 2026-06-04 的 `pasteStatus`，通过 `contractAction` / `notes` 标 006D 队列，并在 `notes` 中追溯 `prev=` 上一轮结果。
- **006D overlay 为空**：PO 回填后写入 `wechat-fidelity-matrix-paste-overlay-006d.ts` 再跑 Mode B。
- **Harvest candidates**：Validator PASS · `pasteStatus=UNTESTED` · 不进 default preset。

## 8. 验收标准完成情况（Mode A）

| AC | 结果 | 说明 |
|----|------|------|
| AC-1 QA Pack 完成 | PASS | 15 行 · 三集合 |
| AC-2 Session 模板 | PASS | 默认 UNTESTED · 不虚构 |
| AC-3 Re-test 8 行 | PASS | Drift 001/002/004–009 |
| AC-4 Harvest 2 行 | PASS | HARVEST-001/002 |
| AC-5 Control 5 行 | PASS | PARA/LEAD/LIST/CTA/DIV-001 |
| AC-6 Matrix needs re-paste | PASS | queued 标记 · 保留 006 paste |
| AC-7 不虚构 PASS | PASS | overlay 006D 空 |
| AC-8 Story 非 Done | PASS | Ready for PO |
| AC-9 npm test | PASS | 860 tests |
| AC-10 npm lint | PASS | 0 errors（18 既有 warnings） |
| AC-11 npm build | PASS | |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| npm run test | PASS | 96 files · 860 tests |
| npm run lint | PASS | 0 errors |
| npm run build | PASS | |

## 10. 集合摘要

### Re-test Set（8）

| matrixRowId | relatedDrift | pattern | previousPaste（006） |
|-------------|--------------|---------|----------------------|
| S8M-TITLE-002 | DRIFT-001 | copy-safe-title-divider | FAIL |
| S8M-TITLE-003 | DRIFT-002 | copy-safe-title-divider | FAIL |
| S8M-HEAD-004 | DRIFT-008 | copy-safe-title-divider | WARNING |
| S8M-CARD-001 | DRIFT-004 | copy-safe-card | WARNING |
| S8M-PARA-004 | DRIFT-005 | copy-safe-card | FAIL |
| S8M-SUM-004 | DRIFT-006 | copy-safe-card | FAIL |
| S8M-CARD-004 | DRIFT-007 | copy-safe-card + left-border | FAIL |
| S8M-LEAD-003 | DRIFT-009 | copy-safe-left-border | WARNING |

### Harvest Candidate Set（2）

| matrixRowId | variantId | validator | paste |
|-------------|-----------|-----------|-------|
| S8M-HARVEST-001 | heading_purple_chapter_label_candidate | PASS | UNTESTED |
| S8M-HARVEST-002 | info_card_reading_path_candidate | PASS | UNTESTED |

### Control Set（5）

PARA-001 · LEAD-001 · LIST-001 · CTA-001 · DIV-001 — 006 均为 PASS · 006D 待回归确认无倒退。

## 11. Matrix / Drift / Candidate 状态

| 类别 | 数量 | 说明 |
|------|------|------|
| Resolved | 0 | 无 PO 复测 |
| Warning（新） | 0 | — |
| Still Fail（新） | 0 | — |
| Untested（006D） | 15 | 待 PO |
| Drift pending | 8 | `IMPLEMENTED_PENDING_006D_REPASTE` |
| Drift-003 | — | observation · 不纳入修复统计 |
| HEAD-002 | — | 留给 007 |

## 12. 是否建议 merge story → sprint

**Mode A：暂不 merge。** PO 完成实机粘贴并 Mode B 回填后，经用户审查再 merge。

## 13. 未完成事项

- PO 微信公众号实机粘贴 15 行
- Mode B：回填 overlay · Session · Matrix paste 列 · Drift 终态 · Harvest candidate 判定
- S8-STORY-006D 用户确认 Done

## 14. 风险与阻塞

- 006C 代码级修复是否转化为 paste 改善 **完全依赖 PO 实机**；本轮无证据不得标 PASS。
- Validator 仍 FAIL 的行（TITLE-002 · HEAD-004 · LEAD-003）即使 paste 改善也可能仍报 Red。

## 15. 需要用户 / ChatGPT 审查的问题

1. Mode A 交付是否满足启动 PO 粘贴？
2. Session 模板中 `currentPasteStatus=UNTESTED` vs Matrix 仍保留 006 值 — 是否符合团队口径？

## 16. 建议下一步

1. PO 按 [`wechat-paste-qa-pack-2026-06-05-s8-story-006d.md`](../paste-qa/wechat-paste-qa-pack-2026-06-05-s8-story-006d.md) 实机粘贴
2. 回填 [`wechat-paste-qa-session-2026-06-05-s8-story-006d.md`](../paste-qa/wechat-paste-qa-session-2026-06-05-s8-story-006d.md)
3. Cursor Mode B：写 overlay · 更新 Drift · 再提 merge sprint

## 17. Commit

- Commit hash：待 commit
