# Execution Report：S5-STORY-004 done.article 归一

## 1. 基本信息

- 日期：2026-06-02
- 当前分支：`feature/s5-done-article-normalize`
- 来源分支：`sprint/s5-generation-ui-main-flow`
- 目标合并分支：`sprint/s5-generation-ui-main-flow`
- Sprint：Sprint 5
- 关联 Story / Bug / Decision：S5-STORY-004
- 执行者：Cursor
- 状态：In Review

## 2. 本轮目标

实现 `done.article` candidate 到唯一 Article Schema 的 parse / normalize / validate 链路，为后续真实 model provider 与 UI 提供统一终态入口。

## 3. 执行范围

**做了：**

- 新增 `done-article.ts`：事件序列校验、`extractDoneArticleEvent`、`parseDoneArticleCandidate`
- 新增 `article-finalize.ts`：`finalizeDoneArticleEvent`、`finalizeGenerationEvents`、`assertFinalizedArticle`
- 更新 `index.ts`、generation README、fixtures、26 单元测试
- 更新 sprint-backlog / sprint-plan / changelog

**没做：**

- 未实现 Volcengine / Doubao provider（S5-STORY-005）
- 未实现 AI Style Selection（S5-STORY-006）
- 未实现 `/generate` UI（S5-STORY-007）
- 未修改 Article / Block Schema 主契约
- 未 commit / merge

## 4. 修改文件

- `src/core/generation/index.ts`
- `src/core/generation/README.md`
- `docs/agile/sprint-backlog.md`
- `docs/agile/sprint-plan.md`
- `docs/agile/changelog.md`

## 5. 新增文件

- `src/core/generation/done-article.ts`
- `src/core/generation/article-finalize.ts`
- `tests/core/generation/done-article.test.ts`
- `tests/core/generation/article-finalize.test.ts`
- `docs/agile/execution-reports/2026-06-02-s5-done-article-normalize.md`

## 6. 阅读但未修改的关键文件

- `src/core/generation/stream.ts`
- `src/core/generation/test-provider.ts`
- `src/core/article/article.parse.ts`
- `src/core/article/article.normalize.ts`

## 7. 关键变更说明

1. **`validateDoneArticleEventSequence`**：在 `validateGenerationEventSequence` 基础上补充 empty / missing / multiple done / error+done coexist / invalid candidate 校验；issue `source: "event_sequence"`。
2. **`finalizeGenerationEvents`**：统一终态入口；先校验事件序列，再 `validateArticle` + `normalizeArticle`；schema issue `source: "article_schema"`。
3. **`FinalizedGeneratedArticle`**：包含正式 `Article` 与源 `doneEvent`；无 parallel article 模型。
4. deterministic provider 事件序列已通过 `finalizeGenerationEvents` 验证可产出正式 Article。

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| AC-1 parse / normalize / validate Article | PASS | 复用 Sprint 2 helpers |
| AC-2 无 parallel article model | PASS | 仅 `FinalizedGeneratedArticle.article: Article` |
| AC-3 Preview / Copy 可消费 | PASS | 输出正式 `Article` 类型 |
| AC-4 单元测试 | PASS | 26 cases 新增 |
| AC-5 lint / test / build | PASS | 651 tests |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `corepack pnpm lint` | PASS | eslint 无报错 |
| `corepack pnpm test` | PASS | 56 files / 651 tests |
| `corepack pnpm build` | PASS | Next.js build 成功 |

## 10. 未完成事项

- 用户 / ChatGPT 审查
- merge 至 sprint 分支（待用户确认）
- S5-STORY-005~008 实现

## 11. 风险与阻塞

- 无

## 12. 需要用户 / ChatGPT 审查的问题

1. S5-STORY-004 是否标记 **Done** 或 **In Review**（当前 backlog 为 Done，execution report 为 In Review 待用户确认）。
2. 是否批准 merge `feature/s5-done-article-normalize` → `sprint/s5-generation-ui-main-flow`。

## 13. 建议下一步

1. 审查 diff 与测试覆盖
2. commit 并 merge 至 sprint 分支
3. 启动 S5-STORY-005（`feature/s5-volcengine-model-provider`）

## 14. Commit

- Commit hash：未提交 / not committed（待用户审查）
