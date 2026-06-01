# Execution Report：S5-STORY-002 InputRequest / NormalizedInput 代码契约

## 1. 基本信息

- 日期：2026-06-02
- 当前分支：`feature/s5-input-request-contract`
- 来源分支：`sprint/s5-generation-ui-main-flow`
- 目标合并分支：`sprint/s5-generation-ui-main-flow`（待用户审查后 merge）
- Sprint：Sprint 5（In Progress）
- 关联 Story / Bug / Decision：S5-STORY-002；DECISION-067
- 执行者：Cursor
- 状态：In Review

## 2. 本轮目标

实现 Release 1 三类输入（主题 / 资料 / 草稿）的 InputRequest / NormalizedInput 代码契约，含 TypeScript 类型、Zod schema、parse / validate / normalize helper、fixture 与单元测试。

## 3. 执行范围

**做了：**

- 从 `sprint/s5-generation-ui-main-flow` 创建 `feature/s5-input-request-contract`
- 实现 `src/core/generation/` 输入契约模块
- 新增 fixtures 与 13 个单元测试用例
- 同步 sprint-backlog / sprint-plan / changelog
- 运行 `corepack pnpm lint` / `test` / `build`

**未做：**

- 未实现 GenerationEvent / SSE / done.article / AI 样式选择 / UI 页面
- 未修改 Article / Block Schema 主契约
- 未启动 S5-STORY-003
- 未 merge 至 sprint / release / main
- 未 commit（待用户审查）

## 4. 修改文件

- `docs/agile/sprint-backlog.md`
- `docs/agile/sprint-plan.md`
- `docs/agile/changelog.md`
- `src/core/generation/README.md`

## 5. 新增文件

- `src/core/generation/input.ts`
- `src/core/generation/schemas.ts`
- `src/core/generation/input.parse.ts`
- `src/core/generation/input.normalize.ts`
- `src/core/generation/index.ts`
- `tests/fixtures/generation/input-requests.ts`
- `tests/fixtures/generation/index.ts`
- `tests/core/generation/input-request.test.ts`
- `docs/agile/execution-reports/2026-06-02-s5-input-request-contract.md`

## 6. 阅读但未修改的关键文件

- `docs/architecture/generation-pipeline.md`
- `src/core/article/article.types.ts`（Article InputSource 为快照模型，与 generation InputSource 区分）
- `src/core/styles/style-assignment-schemas.ts`（styleIntent 安全字符串模式参考）

## 7. 关键变更说明

1. **InputRequest** 统一 UI / API / GenerationService 入口：`mode` + `topic` / `materials` / `draft` + `styleIntent`。
2. **NormalizedInput** 由 `normalizeInputRequest` 生成，含 `inputSummary`、`sourceCount`、`primaryIntent` 等稳定字段。
3. **校验** 覆盖 mode 匹配、空输入、长度上限、styleIntent 禁止 html/css/className/style/variantId；空 material 丢弃并 warning。
4. **命名** generation 模块内 `InputSource` / `InputSourceType` 指 material entry 类型，与 Article `InputSource`（topic/material/draft 快照）语义不同，分模块导出避免混用。

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| AC-1 类型与 Zod Schema | PASS | `input.ts` + `schemas.ts` |
| AC-2 三类输入 normalize | PASS | topic_only / topic_with_materials / draft_rewrite |
| AC-3 单元测试 | PASS | 13 cases |
| AC-4 lint / test / build | PASS | 605 tests |
| AC-5 helpers | PASS | parse / validate / normalize / parseAndNormalize / isInputRequest |
| AC-6 无 parallel Article 模型 | PASS | 未修改 Article schema |
| AC-7 未启动 S5-STORY-003 | PASS | |
| AC-8 未 merge | PASS | |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `corepack pnpm lint` | PASS | |
| `corepack pnpm test` | PASS | 605 tests（+13） |
| `corepack pnpm build` | PASS | |

## 10. 未完成事项

- 用户审查
- merge `feature/s5-input-request-contract` → `sprint/s5-generation-ui-main-flow`
- S5-STORY-003 待启动

## 11. 风险与阻塞

- sprint 分支当前可能尚未包含 S5-STORY-001 docs commit（`docs/s5-start-backlog-split`）；本轮 sprint-backlog 已同步 In Progress / S5-STORY-001 Done 状态，merge 时注意与 S5-STORY-001 分支/docs 对齐

## 12. 需要用户 / ChatGPT 审查的问题

1. generation 模块 `InputSource` 与 Article `InputSource` 命名并存是否可接受（分模块 import）？
2. `INPUT_LIMITS` 数值是否需要产品确认？

## 13. 建议下一步

1. 用户审查后 merge feature → sprint
2. 启动 S5-STORY-003：GenerationEvent / SSE Streaming Runtime

## 14. Commit

- Commit hash：未提交 / not committed
