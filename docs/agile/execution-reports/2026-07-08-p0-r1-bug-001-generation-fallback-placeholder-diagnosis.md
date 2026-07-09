# Execution Report：P0-R1-BUG-001 生成 fallback 占位文案泄漏诊断

## 1. 基本信息

- **日期：** 2026-07-08
- **Bug ID：** P0-R1-BUG-001
- **执行分支：** `diagnosis/p0-r1-bug-001-generation-fallback-placeholder`
- **来源分支：** `sprint/s12-product-governance-r2-planning`
- **工作分支：** `diagnosis/p0-r1-bug-001-generation-fallback-placeholder`
- **目标合并分支：** `sprint/s12-product-governance-r2-planning`
- **基线 HEAD：** `6d7d8a2`
- **HEAD at review time 所在分支：** `diagnosis/p0-r1-bug-001-generation-fallback-placeholder`
- **merge 后所在分支：** N/A（未 merge）
- **Sprint：** Sprint 12（Closed · DECISION-124）— 本轮为 Release 1 Closeout Blocker 诊断
- **关联 Story / Bug / Decision：** P0-R1-BUG-001 · P0-R1-BUG-001-DIAG
- **执行者：** Cursor
- **状态：** In Review

## 2. 本轮目标

定位 Production 主链路偶发混入 “Release 1 生成正文” 内部占位文案及重复拼接问题的根因；**仅产出诊断报告，不修改产品代码**。

## 3. 执行范围

**已完成：**

- Git 执行前检查；从 `sprint/s12-product-governance-r2-planning` @ `6d7d8a2` 创建诊断分支
- 全库关键词搜索（Release 1 生成正文、fallback、mock、provider、stream、SSE 等）
- 生成主链路调用路径分析（用户输入 → API → provider → enrichment → preview → copy）
- `origin/release/1` 与 sprint 分支产品代码 diff 对照
- 定向测试：`pnpm test generate` · `model-article-enrichment` · `volcengine-streaming`
- 新增诊断报告 `docs/agile/bugs/p0-r1-bug-001-generation-fallback-placeholder.md`
- 更新 `product-backlog.md` · `changelog.md` · `readiness-review.md`（一句阻塞说明）

**明确未做：**

- 未修改 `src/`、`app/`、`lib/`、`components/` 等产品代码
- 未修复 fallback / enrichment / provider / renderer
- 未改环境变量、部署、生产配置
- 未查生产服务器日志
- 未 merge · 未 push
- 未关闭 Release 1
- 未启动 Release 2 / R2 Sprint / 修复分支

## 4. 修改文件

- `docs/agile/product-backlog.md`
- `docs/agile/changelog.md`
- `docs/agile/releases/release-1/readiness-review.md`

## 5. 新增文件

- `docs/agile/bugs/p0-r1-bug-001-generation-fallback-placeholder.md`
- `docs/agile/execution-reports/2026-07-08-p0-r1-bug-001-generation-fallback-placeholder-diagnosis.md`

## 6. 阅读但未修改的关键文件

- `src/core/generation/model-article-enrichment.ts`
- `src/core/generation/volcengine-streaming-provider.ts`
- `src/core/generation/test-provider.ts`
- `src/core/generation/jsonl-block-stream-parser.ts`
- `src/server/generation/run-generate-stream-flow.ts`
- `src/app/api/generate/stream/route.ts`
- `src/app/preview/preview-page-client.tsx`
- `tests/core/generation/model-article-enrichment.test.ts`

## 7. 关键变更说明

- 确认用户可见文案 **唯一产品代码来源** 为 `model-article-enrichment.ts` 的 `resolveFallbackParagraph()`
- 确认 production 主链路走 Volcengine + enrichment，非 mock provider 误用
- 确认 enrichment warnings 不阻断成功态，解释间歇性与重复拼接机制
- 登记 P0 Closeout Blocker，暂停 Release 1 Closeout readiness 无条件结论

## 8. 验收标准完成情况

| AC                             | 结果 | 说明                                              |
| ------------------------------ | ---- | ------------------------------------------------- |
| 定位 “Release 1 生成正文” 来源 | PASS | `model-article-enrichment.ts:136`                 |
| 定位进入结果的层级             | PASS | generation enrichment，非 renderer/mock route     |
| 解释真实模型正常时仍可能混入   | PASS | 部分 block 空 text + 静默 fallback                |
| 解释重复标题/段落              | PASS | 共享 context.title / context.paragraph            |
| 判断环境影响范围               | PASS | 代码路径通用；release/1 与 sprint 无产品代码 diff |
| 产出修复建议与验收标准         | PASS | 见 bug 诊断文档 §11–12                            |
| 不修改产品代码                 | PASS | 仅 docs                                           |

## 9. 搜索命中摘要

- **精确匹配：** `model-article-enrichment.ts:136`（泄漏路径）· `test-provider.ts:32`（dev 示例，非 PO 文案）
- **Provider：** `run-generate-stream-flow.ts` `resolveStreamingProvider`；production `requireRealProvider: true`
- **测试缺口：** `model-article-enrichment.test.ts` 允许 fallback 占位为 truthy

## 10. 相关代码路径

用户输入 → `POST /api/generate/stream` → `iterateGenerateStreamSse` → Volcengine streaming → JSONL parser → `enrichModelArticleCandidate` → styling → preview → clipboard。

## 11. 初步根因判断

真实 Volcengine 间歇性返回空 `content.text` block，`enrichModelArticleCandidate` 静默补齐含 “Release 1 生成正文” 的内部占位句，`done.article` 仍成功；warnings 未 surfaced 至用户。

## 12. 是否阻塞 Release 1 Closeout

**是** — P0 Closeout Blocker。

## 13. 运行检查

| 命令                                 | 结果   | 说明               |
| ------------------------------------ | ------ | ------------------ |
| `git diff --check`                   | PASS   | 诊断提交前执行     |
| `pnpm prettier --check`（docs）      | PASS   | 诊断提交前执行     |
| `pnpm test generate`                 | PASS   | 2 tests            |
| `pnpm test model-article-enrichment` | PASS   | 18 tests           |
| `pnpm test volcengine-streaming`     | PASS   | 1 test             |
| `pnpm lint`                          | 未运行 | 本轮无产品代码变更 |
| `pnpm build`                         | 未运行 | 本轮不要求         |

## 14. 未完成事项

- 生产 requestId 级日志 / 原始模型输出抓包（需运维权限）
- 修复实施与 regression test（待后续 bugfix 分支）

## 15. 风险与阻塞

- Release 1 Closeout **不得**在本 Bug 修复并验收前无条件进行
- 间歇性导致 PO 难以稳定复现；需依赖 enrichment strict mode + 测试防回归

## 16. 需要用户 / ChatGPT 审查的问题

1. 是否批准启动 `bugfix/p0-r1-bug-001-*` 修复分支？
2. 真实 provider 下 enrichment fallback 策略：一律 fail vs 仅禁止内部占位文案？
3. `enrichmentWarningCount > 0` 是否应在 UI 层阻断 copy？
4. 是否需要在 Closeout 前补一次 staging 强制复现（注入空 text block fixture）？

## 17. 建议下一步

1. ChatGPT 审查本诊断报告
2. PO 决策是否立即修复及验收标准
3. 从 sprint 分支切 `bugfix/p0-r1-bug-001-generation-fallback-placeholder` 实施修复 + regression test
4. 修复验收通过后再恢复 Release 1 Closeout 流程

## 18. Commit

### 主要 commit

- （提交后回填 hash）— `docs(release1): diagnose generation fallback placeholder leak`

### merge / push / working tree

| 项                             | 状态             |
| ------------------------------ | ---------------- |
| merge 至 sprint                | **未执行**       |
| merge 至 release/main          | **未执行**       |
| push                           | **未 push**      |
| working tree                   | 提交后应为 clean |
| 是否修改产品代码               | **否**           |
| 是否关闭 Release 1             | **否**           |
| 是否启动 Release 2 / R2 Sprint | **否**           |
| 是否启动修复                   | **否**           |

## 19. Release 状态

| Release   | 状态                                                             |
| --------- | ---------------------------------------------------------------- |
| Release 1 | In Progress / Not Closed — Closeout **blocked** by P0-R1-BUG-001 |
| Release 2 | Planned / Candidate / Not Started                                |
