# Execution Report：S10-STORY-011 Promote Gate + DSL Runtime Readiness

## 1. 基本信息

- 日期：2026-06-07
- 当前分支：`feature/s10-story-011-promote-user-selectable-final`
- 来源分支：`sprint/s10-db-backed-style-admin-v1`
- 目标合并分支：`sprint/s10-db-backed-style-admin-v1`（**未 merge · 待用户确认**）
- Sprint：Sprint 10
- 关联 Story：S10-STORY-011 · S10-STORY-011A（Done）
- 执行者：Cursor
- 状态：**In Review**（代码与自动化检查完成 · 本地 Promote E2E 待用户验收）

## 2. 本轮目标

在 011A DSL Runtime 之上恢复 S10-STORY-011：Promote to user-selectable 闭环，接入 `validateVariantDslRuntimeReadiness`，修复 Candidate detail Preview inspection 裸文本问题。

## 3. 执行范围

**做了：**

- 从 `stash@{0} wip-s10-story-011-promote` 恢复并 rebase 到 011A sprint
- Promote server action + distribution / lifecycle / audit / cache invalidate
- `buildCandidatePromoteRuntimeReadiness` + promote gate（paste_qa_pass + DSL readiness）
- Candidate Promote 面板（readiness · runtimeSource · decoderPath · blocked reasons）
- Preview inspection：DSL decode trace · meta slots 优先 · 复杂 heading 样式化 layout
- `decode-tree` heading preview：`layoutIntent` → `magazine_left_bar` 等
- Promote form reset bug 修复（保存 form 引用）
- 定向 + 全量测试 · build

**未做：**

- 未 commit（用户未要求）
- 未 merge sprint
- 本地 Promote → `/preview` 全链路 E2E（须用户带 DB 验收）
- 未恢复 stash 到已删除原分支

## 4. 修改文件

- `src/server/style-admin/promote/*`
- `src/server/style-admin/actions/promote-candidate.ts`
- `src/core/dsl/decoder/decode-tree.ts`
- `src/core/dsl/decoder/resolve-dsl-slots.ts`
- `src/server/style-admin/inspection/candidate-dsl-render.ts`
- `src/app/admin/(protected)/style-library/candidate-*`
- `src/app/admin/(protected)/style-library/style-library-admin-*`
- `docs/architecture/article-variant-dsl-runtime.md`
- `docs/agile/sprint-backlog.md` · `sprint10-*` · `changelog.md`

## 5. 新增文件

- `src/server/style-admin/promote/candidate-promote-runtime-readiness.ts`
- `src/app/admin/(protected)/style-library/candidate-promote-panel.tsx`
- `src/app/admin/(protected)/style-library/candidate-promote-view-model.ts`
- `src/app/admin/(protected)/style-library/[runtimeVariantId]/promote-actions.ts`
- `tests/fixtures/dsl/promote-heading-variant-dsl.ts`
- `tests/server/style-admin/promote/candidate-promote-runtime-readiness.test.ts`
- `tests/server/style-admin/inspection/candidate-inspection-dsl-preview.test.ts`

## 6. 关键变更说明

1. **Promote gate**：`paste_qa_pass` + `validateVariantDslRuntimeReadiness`（`database_dsl` · preview/copy/compatibility）才允许 promote。
2. **Preview inspection**：`resolveSlotsForDslDecode` 中 `meta.extractedSlots` 覆盖 fixture 样本文本；复杂 heading 显示 `magazine_left_bar` 结构而非裸 `pill` 文本。
3. **Promote 写入**：`userSelectable=true` · `defaultEligible=false` · `release1Required=false` · audit 含 readinessSummary。

## 7. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| Preview inspection 样式化 DSL decode | PASS（代码+单测） | 待用户 E2E |
| Promote readiness gate | PASS | promote + eligibility 测试 |
| paste_qa_pass + readiness OK 才能 promote | PASS | |
| promote 后 distribution 字段 | PASS | 单测 |
| user pool / preview E2E | **待用户** | 需本地 DB |
| lint / test / build | PASS | 1211 tests |

## 8. 运行检查

| 命令 | 结果 |
|------|------|
| `pnpm lint` | PASS（0 errors） |
| `pnpm test` | PASS（1211） |
| `pnpm build` | PASS |

## 9. 本地 E2E 路径（用户验收）

见任务书第八节：Harvest → candidate detail → Run Preview/Copy/Validator → Paste QA pass → Promote → dev API pool → `/preview` 选择 promoted variant → Hide/Restore/Rollback。

## 10. Commit

- **未提交 / not committed**

## 11. 建议下一步

1. 用户本地 E2E 验收 S10-STORY-011
2. 通过后 commit + merge `feature/s10-story-011-promote-user-selectable-final` → sprint
3. S10-STORY-012 Closeout
