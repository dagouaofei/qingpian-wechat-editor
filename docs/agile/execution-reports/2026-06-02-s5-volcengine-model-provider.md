# Execution Report：S5-STORY-005 Volcengine Model Provider

## 1. 基本信息

- 日期：2026-06-02
- 当前分支：`feature/s5-volcengine-model-provider`
- 来源分支：`sprint/s5-generation-ui-main-flow`
- 目标合并分支：`sprint/s5-generation-ui-main-flow`
- Sprint：Sprint 5
- 关联 Story / Bug / Decision：S5-STORY-005；TECH-ARCH-025；DECISION-068
- 执行者：Cursor
- 状态：In Review

## 2. 本轮目标

实现 Volcengine / Doubao 真实模型 Provider，使 `NormalizedInput` 可通过 mock/real transport 生成 `GenerationEvent` stream，并经 `finalizeGenerationEvents` 归一为正式 `Article`。

## 3. 执行范围

**做了：**

- 新增 provider 契约、config、errors、prompt、transport、volcengine provider
- 新增 `.env.example`（`VOLCENGINE_*`）
- 新增 29 单元测试（config / provider / volcengine）
- 更新 generation README、sprint-backlog、sprint-plan、changelog

**没做：**

- 未实现 AI Style Selection（S5-STORY-006）
- 未实现 `/generate` UI（S5-STORY-007）
- 未执行真实网络 API 集成测试（单测全部 mock transport）
- 未宣称 Sprint 5 主流程已跑通
- 未 commit / merge

## 4. 旧项目经验检索

在当前仓库可访问范围内检索 `volcengine` / `doubao` / `ark` / `火山` / `豆包` / `mapArkJsonToArticle`：

- **无旧项目 Volcengine 调用源码**
- 可参考文档：
  - `docs/agile/migration-reference.md` — SSE + `done.article` 归一经验
  - `docs/architecture/references/prototype-style-system-technical-lessons.md` — 提及旧项目 `mapArkJsonToArticle` / 非 stream API 路径
- 本轮按轻篇 Article Schema + Ark chat completions 约定实现，未复制旧 parallel 模型

## 5. 修改文件

- `src/core/generation/index.ts`
- `src/core/generation/README.md`
- `docs/agile/sprint-backlog.md`
- `docs/agile/sprint-plan.md`
- `docs/agile/changelog.md`

## 6. 新增文件

- `src/core/generation/model-provider.ts`
- `src/core/generation/model-provider-config.ts`
- `src/core/generation/model-provider-errors.ts`
- `src/core/generation/model-prompt.ts`
- `src/core/generation/volcengine-transport.ts`
- `src/core/generation/volcengine-provider.ts`
- `.env.example`
- `tests/fixtures/generation/model-provider.ts`
- `tests/core/generation/model-provider-config.test.ts`
- `tests/core/generation/model-provider.test.ts`
- `tests/core/generation/volcengine-provider.test.ts`
- `docs/agile/execution-reports/2026-06-02-s5-volcengine-model-provider.md`

## 7. 关键变更说明

1. **`GenerationModelProvider`**：扩展 `GenerationStreamProvider`；输入 `NormalizedInput`，输出 `AsyncIterable<GenerationEvent>`。
2. **`loadVolcengineProviderConfig`**：读取 `VOLCENGINE_*`；缺 key / model / disabled 时返回稳定 config issue，不 throw。
3. **`createVolcengineTransport`**：Ark `POST /chat/completions`，`response_format: json_object`；HTTP / timeout / network 映射为 `GenerationModelProviderError`。
4. **`createVolcengineModelProvider`**：prompt → transport → Article JSON → block events + `done.article`；禁止 html/css/className/style 字段。
5. **终态链路**：mock provider 输出已通过 `collectGenerationStream` + `finalizeGenerationEvents` 验证。
6. **deterministic provider** 仍可作为 test / dev fallback。

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| AC-1~AC-14 | PASS | 见 sprint-backlog S5-STORY-005 |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `corepack pnpm lint` | PASS | 无 error |
| `corepack pnpm test` | PASS | 59 files / 680 tests（+29） |
| `corepack pnpm build` | PASS | Next.js build 成功 |

## 10. 未完成事项

- 用户 / ChatGPT 审查
- merge 至 sprint 分支（待用户确认）
- 真实 API key 手动验收（建议在 S5-STORY-007 `/generate` 或 dev script 中进行）
- S5-STORY-006~008

## 11. 风险与阻塞

- 旧项目 Ark 调用细节（endpoint 形态、response 字段）未在本仓库验证；若生产 endpoint 与默认 `VOLCENGINE_BASE_URL` 不一致，需通过 env 调整
- 真实模型 JSON 质量依赖 prompt；S5-STORY-006 前 `styleAssignment` 使用安全默认值

## 12. 需要用户 / ChatGPT 审查的问题

1. S5-STORY-005 是否标记 **Done** 或 **In Review**（backlog 为 Done，execution report 为 In Review 待确认）。
2. 是否批准 merge `feature/s5-volcengine-model-provider` → `sprint/s5-generation-ui-main-flow`。
3. 是否需要在 S5-STORY-007 前增加 dev-only 真实 API smoke script（本轮未做）。

## 13. 建议下一步

1. 审查 diff 与 `.env.example`
2. commit 并 merge 至 sprint 分支
3. 启动 S5-STORY-006 或 S5-STORY-007（按 sprint 计划顺序）

## 14. Commit

- Commit hash：未提交 / not committed（待用户审查）

## 15. 本地真实 API 验收路径（手动）

```bash
export VOLCENGINE_ENABLE_REAL_PROVIDER=true
export VOLCENGINE_API_KEY=your-key
export VOLCENGINE_MODEL=your-model-or-endpoint-id
# 可选：VOLCENGINE_BASE_URL=...
# 在后续 /generate UI 或临时 script 中调用 createVolcengineModelProvider()
```

无 API key 时 CI 仍使用 deterministic provider / mock transport。
