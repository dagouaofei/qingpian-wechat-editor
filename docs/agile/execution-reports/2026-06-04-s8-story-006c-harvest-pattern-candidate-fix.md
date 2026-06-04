# Execution Report：S8-STORY-006C Harvest-driven Copy-safe Pattern & Candidate Fix

## 1. 基本信息

- 日期：2026-06-04
- 当前分支：`feature/s8-story-006c-harvest-pattern-candidate-fix`
- 来源分支：`sprint/s8-wechat-safe-css-contract`
- 目标合并分支：`sprint/s8-wechat-safe-css-contract`
- Sprint：Sprint 8
- 关联 Story：S8-STORY-006C · DECISION-091 · WX-HARVEST-EVIDENCE-001
- 执行者：Cursor
- 状态：In Review

## 2. 本轮目标

落地 copy-safe Pattern（A/B/C 类 Drift）、建立 harvest → candidate variant 闭环，产生可验证的 Copy HTML 变更（非仅文档）。

## 3. 执行范围

- 新增 `copy-safe-primitives.ts` · `harvest-candidate-copy.ts` · `harvest-candidate-variants.ts`
- 重构 `info-card` / `text-block` / `highlight` / `quote` / `title-block` / `heading-publish` Copy 输出
- Matrix +2 行（S8M-HARVEST-001/002）· Paste overlay 006C 备注 · Drift 001–009 implementation notes
- Paste QA pack HTML snapshots 再生成
- **未做：** 006D re-paste · 007 · Contract/Validator 分级变更 · merge sprint

## 4. 修改文件（代码）

- `src/core/copy/copy-safe-primitives.ts`（新）
- `src/core/copy/harvest-candidate-copy.ts`（新）
- `src/core/copy/info-card-copy.ts` · `text-block-copy.ts` · `highlight-copy.ts` · `quote-copy.ts` · `title-block-copy.ts`
- `src/core/copy/inline-style.ts`
- `src/core/renderer/heading-publish-copy-html.ts` · `heading-publish-decoration.ts`
- `src/core/renderer/title-block-renderer.ts` · `info-card-renderer.ts`
- `src/core/renderer/expansion-layout-maps.ts`
- `src/core/styles/variants/harvest-candidate-variants.ts`（新）
- `tests/fixtures/fidelity/*` · `tests/support/wechat-fidelity-matrix-*`
- `tests/core/copy/copy-safe-patterns-006c.test.ts`（新）
- `tests/core/copy/*-copy-renderer.test.ts`（断言对齐 006C DOM）
- `tests/snapshots/wechat-paste-qa/*.html`

## 5. 新增文件

- 见上「新」标记
- `docs/agile/execution-reports/2026-06-04-s8-story-006c-harvest-pattern-candidate-fix.md`

## 6. 应用的 Pattern

| Pattern | 落地 |
|---------|------|
| `copy-safe-card` | 背景/边框/padding 下沉至 `p` |
| `copy-safe-left-border` | `border-left` 与文字同 `p` |
| `copy-safe-title-divider` | 标题装饰在 `h1`/`h3`（去 table 分栏） |
| Harvest → candidate | `heading_purple_chapter_label_candidate` · `info_card_reading_path_candidate` |

## 7. 涉及 Matrix 行

| matrixRowId | 006C 动作 |
|-------------|-----------|
| S8M-CARD-001 · PARA-004 · SUM-004 · CARD-004 | Copy 结构修复 · needs 006D re-paste |
| S8M-LEAD-003 | 左线下沉 `p` |
| S8M-TITLE-002 · TITLE-003 · HEAD-004 | 标题 DOM 简化 |
| S8M-HARVEST-001 · S8M-HARVEST-002 | 新增 candidate · UNTESTED |

## 8. Validator 变化（修复前 → 后 · 来自 Matrix 再生）

| matrixRowId | Before（006 会话后） | After（006C） |
|-------------|---------------------|---------------|
| S8M-TITLE-002 | FAIL | FAIL |
| S8M-TITLE-003 | FAIL | **WARNING** |
| S8M-HEAD-002 | FAIL | FAIL（deferred 007） |
| S8M-HEAD-004 | FAIL | FAIL |
| S8M-LEAD-003 | FAIL | FAIL |
| S8M-PARA-004 | WARNING | WARNING |
| S8M-SUM-004 | WARNING | WARNING |
| S8M-CARD-001 | WARNING | WARNING |
| S8M-CARD-004 | WARNING | WARNING |
| S8M-HARVEST-001 | — | PASS（新行） |
| S8M-HARVEST-002 | — | PASS（新行） |

## 9. 006C 对已有 Drift 的真实作用

| Drift | Matrix row | Pattern applied | Code changed? | Validator before | Validator after | Paste status | Actual effect |
| ----- | ---------- | --------------- | ------------- | ---------------- | --------------- | ------------ | ------------- |
| 001 | S8M-TITLE-002 | copy-safe-title-divider | yes | FAIL | FAIL | FAIL（未改） | copy html structure changed; needs re-paste |
| 002 | S8M-TITLE-003 | copy-safe-title-divider | yes | FAIL | WARNING | FAIL（未改） | validator improved · copy html structure changed; needs re-paste |
| 003 | S8M-TITLE-001 | — | no | WARNING | WARNING | WARNING | no effect |
| 004 | S8M-CARD-001 | copy-safe-card | yes | WARNING | WARNING | WARNING（未改） | copy html structure changed; needs re-paste |
| 005 | S8M-PARA-004 | copy-safe-card | yes | WARNING | WARNING | FAIL（未改） | copy html structure changed; needs re-paste |
| 006 | S8M-SUM-004 | copy-safe-card | yes | WARNING | WARNING | FAIL（未改） | copy html structure changed; needs re-paste |
| 007 | S8M-CARD-004 | copy-safe-card + left-border | yes | WARNING | WARNING | FAIL（未改） | copy html structure changed; needs re-paste |
| 008 | S8M-HEAD-004 | copy-safe-title-divider | yes | FAIL | FAIL | WARNING（未改） | copy html structure changed; needs re-paste |
| 009 | S8M-LEAD-003 | copy-safe-left-border | yes | FAIL | FAIL | WARNING（未改） | copy html structure changed; needs re-paste |
| HEAD-002 | S8M-HEAD-002 | — | no | FAIL | FAIL | PASS | deferred to 007 |

## 10. harvest → candidate variant 最小闭环

```text
WX-HARVEST-EVIDENCE-001（L2 视觉意图）
  → heading_purple_chapter_label_candidate / info_card_reading_path_candidate（experimental）
  → Copy Renderer（harvest-candidate-copy.ts）
  → validateWechatCopyHtml PASS
  → Matrix S8M-HARVEST-001/002（pasteStatus UNTESTED）
  → 006D 实机粘贴（未启动）
```

## 11. Candidate variant 信息

| variantId | matrixRowId | sourceEvidenceId | release1Eligible |
|-----------|-------------|------------------|------------------|
| `heading_purple_chapter_label_candidate` | S8M-HARVEST-001 | WX-HARVEST-EVIDENCE-001 | false |
| `info_card_reading_path_candidate` | S8M-HARVEST-002 | WX-HARVEST-EVIDENCE-001 | false |

## 12. Pending 006D re-paste

Drift 001、002、004、005、006、007、008、009（状态 `IMPLEMENTED_PENDING_006D_REPASTE`）。

## 13. 未处理

- S8M-HEAD-002 / DRIFT 未单列（validator false positive · 007）
- DRIFT-003 observation
- 006B-FIX-B 批量 evidence
- 006D · 007

## 14. 风险

- Validator FAIL 行（TITLE-002、HEAD-004、LEAD-003）可能仍含 Red 声明，Paste 改善须 006D 验证
- `section` margin-only wrapper 仍为 Yellow，微信可能继续剥外层

## 15. 运行检查

| 命令 | 结果 |
|------|------|
| `npm run test` | PASS（851 tests） |
| `npm run lint` | PASS |
| `npm run build` | PASS |

## 16. 是否建议 merge → sprint

**建议 merge**（代码 + Matrix + 测试 PASS · paste 未宣称修复）— **待用户审查**。

## 17. Commit

- Message：`fix: apply harvest-driven copy-safe patterns`
- Hash：`3a6750a`
- **未 merge** sprint / release / main
