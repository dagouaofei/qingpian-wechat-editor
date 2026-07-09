# Execution Report：P0-R1-BUG-001 生成 fallback 占位文案泄漏修复

## 1. 基本信息

- **日期：** 2026-07-08
- **Bug ID：** P0-R1-BUG-001 · P0-R1-BUG-001-FIX
- **执行分支：** `bugfix/p0-r1-bug-001-generation-fallback-placeholder`
- **来源分支：** `sprint/s12-product-governance-r2-planning`
- **工作分支：** `bugfix/p0-r1-bug-001-generation-fallback-placeholder`
- **目标合并分支：** `sprint/s12-product-governance-r2-planning`
- **基线 HEAD：** `9920c8a`
- **Sprint：** Sprint 12（Closed）— Release 1 Closeout Blocker 修复
- **状态：** **Accepted with follow-ups**（PO 验收 2026-07-08）

## 2. 本轮目标

修复真实 provider 路径下空 `content.text` 静默补齐 “Release 1 生成正文” 内部占位文案的问题；增加 regression test；**不部署、不 merge、不 push**。

## 3. 实际完成范围

- 新增 `ModelArticleEnrichmentInput.strictContent` 选项
- Volcengine provider / streaming provider 启用 `strictContent: true`
- `strictContent` 下缺失用户可见 block text → blocking error（`missing_required_block_text` / `missing_blocks`）
- 移除 `resolveFallbackParagraph` 中 “Release 1 生成正文” 文案
- dev `test-provider` 示例段落改为中性文案
- 新增/更新 enrichment 与 volcengine-streaming regression tests
- 同步 bug / backlog / changelog / readiness-review 文档

## 4. 明确未做事项

- 未 merge 至 sprint 分支
- 未 push
- 未部署 production / staging
- 未关闭 Release 1
- 未 merge `release/1` / `main`
- 未启动 Release 2 / R2 Sprint

## 5. 根因摘要

`enrichModelArticleCandidate` 在 real provider 输出 block 结构合法但 `content.text` 为空时，通过 `resolveFallbackParagraph()` 静默补齐含 “Release 1 生成正文” 的内部占位句，并仍返回 `ok: true`。

## 6. 修复策略

**方案 A（最小改动）：** 将 `strictContent: true` 传入 enrichment；real provider 路径启用 strict mode；blocking block text 缺失时 push error 并 fail enrichment；permissive mode（默认）保留 dev/test fallback 但移除内部 Release 文案。

## 7. 修改文件

- `src/core/generation/model-article-candidate.ts`
- `src/core/generation/model-article-enrichment.ts`
- `src/core/generation/volcengine-streaming-provider.ts`
- `src/core/generation/volcengine-provider.ts`
- `src/core/generation/test-provider.ts`
- `tests/core/generation/model-article-enrichment.test.ts`
- `tests/core/generation/volcengine-streaming-provider.test.ts`
- `docs/agile/bugs/p0-r1-bug-001-generation-fallback-placeholder.md`
- `docs/agile/product-backlog.md`
- `docs/agile/changelog.md`
- `docs/agile/releases/release-1/readiness-review.md`

## 8. 新增文件

- `docs/agile/execution-reports/2026-07-08-p0-r1-bug-001-generation-fallback-placeholder-fix.md`

## 9. blocking issue 处理方式

| 模式                                                 | 行为                                                                                                                                                                                                                |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `strictContent: true`（Volcengine real provider）    | 空 title/heading/paragraph/lead/quote/list/cta/info_card/highlight text → `missing_required_block_text` error；空 blocks → `missing_blocks`；enrichment `ok: false` → provider 发出 `error` 事件，无 `done.article` |
| `strictContent: false`（默认 · dev/test enrichment） | 允许 fallback 补齐，但不得含 “Release 1 生成正文”                                                                                                                                                                   |

## 10. 验收标准完成情况

| AC       | 结果    | 说明                                                                                                  |
| -------- | ------- | ----------------------------------------------------------------------------------------------------- |
| AC-1     | PASS    | `src/` 无 “Release 1 生成正文” 命中                                                                   |
| AC-2     | PASS    | strict mode 空 paragraph → blocking failure                                                           |
| AC-3     | PASS    | volcengine-streaming 测试：空 paragraph 无 `done.article`                                             |
| AC-4     | PASS    | strict mode 空 metadata 仍成功                                                                        |
| AC-5     | PASS    | strict mode divider 无 text 仍成功                                                                    |
| AC-6     | PASS    | regression test 断言不含占位文案                                                                      |
| AC-7     | PASS    | targeted tests 全通过                                                                                 |
| AC-8     | PARTIAL | lint PASS（warnings only）；build PASS（TS fix 后）；全量 test 5 failures 为既有 style-admin 无关用例 |
| AC-9     | PASS    | 文档已同步                                                                                            |
| AC-10    | PASS    | Closeout 仍 blocked pending review                                                                    |
| AC-11~16 | PASS    | 未关闭 R1 · 未 merge · 未 push · 未部署                                                               |

## 11. 运行检查

| 命令                                 | 结果                                                                          |
| ------------------------------------ | ----------------------------------------------------------------------------- |
| `pnpm test model-article-enrichment` | 23 passed                                                                     |
| `pnpm test generate`                 | 2 passed                                                                      |
| `pnpm test volcengine-streaming`     | 2 passed                                                                      |
| `pnpm lint`                          | PASS（0 errors · 34 pre-existing warnings）                                   |
| `pnpm test`                          | 1390 passed · **5 failed**（style-library-admin-page 等 · **与本 bug 无关**） |
| `pnpm build`                         | PASS（TS fix 后）                                                             |
| `rg "Release 1 生成正文" src`        | 无命中                                                                        |
| `rg "Release 1 生成正文" tests`      | 仅 regression `not.toContain` 断言                                            |

## 12. 是否仍阻塞 Release 1 Closeout

**是** — 代码已修复但未部署；须 PO 审查、merge sprint、staging/production 人工验证后方可解除。

## 13. 需要 PO 手动验证项

1. staging/production 主题生成：真实 provider 正常输出仍成功
2. 模拟/复现空 text block 场景（如模型异常输出）应显示明确失败而非占位正文
3. 复制/预览路径不得出现 “Release 1 生成正文”

## 14. Commit

### 主要修复 commit

- `22c7c48` — `fix(generation): block real provider placeholder fallback leakage`

### 验收状态同步 commit

- （提交后回填）— `docs(release1): accept p0 fallback placeholder fix`

## 15. PO 验收结论

**P0-R1-BUG-001-FIX Accepted with follow-ups**（2026-07-08）

PO accepted the code fix as **Fixed Pending Verification**. Release 1 Closeout **remains blocked** pending staging and production manual verification. Not deployed. Not pushed.

## 16. Follow-ups（全量 test 无关失败 · 本轮未修复）

| ID           | 摘要                                                      | 状态 |
| ------------ | --------------------------------------------------------- | ---- |
| P2-R1-FU-001 | pnpm-workspace `allowBuilds`：sharp / unrs-resolver       | Open |
| P2-R1-FU-002 | DSL title slot：`slotSubstitutionPath` 仍为 `slots.title` | Open |
| P2-R1-FU-003 | 006D Paste QA pack markdown snapshot diff                 | Open |
| P2-R1-FU-004 | Paste QA pack markdown snapshot diff                      | Open |
| P2-R1-FU-005 | Style Library admin detail shell 与测试断言不同步         | Open |

## 17. merge / push / Release 状态

| 项              | 状态                                      |
| --------------- | ----------------------------------------- |
| merge 至 sprint | **已执行**（`--no-ff` · 提交后回填 hash） |
| push            | **未 push**                               |
| 部署 production | **未部署**                                |
| Release 1       | In Progress / Not Closed                  |
| Release 2       | Planned / Candidate / Not Started         |
| 修改产品代码    | **是**（`22c7c48`）                       |
