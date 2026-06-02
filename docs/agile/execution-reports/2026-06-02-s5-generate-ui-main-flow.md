# Execution Report：S5-STORY-007 Release 1 `/generate` UI 主流程集成

## 1. 基本信息

- 日期：2026-06-02
- 当前分支：`feature/s5-generate-ui-main-flow`
- 来源分支：`sprint/s5-generation-ui-main-flow`
- 目标合并分支：`sprint/s5-generation-ui-main-flow`
- Sprint：Sprint 5 — Generation / Streaming 与真实 UI 主流程集成
- 关联 Story / Bug / Decision：S5-STORY-007
- 执行者：Cursor
- 状态：In Review

## 2. 本轮目标

实现 Release 1 真实业务页面 `/generate`，使用户可手动跑通：输入 → 生成（Generation runtime + provider）→ `done.article` finalization → 受控样式选择 → Preview Renderer → Copy Renderer / Clipboard payload；不执行微信公众号 Paste QA、不实现 Style Gallery / 复杂编辑器。

## 3. 执行范围

**已完成：**

- `/generate` 页面（输入区、生成按钮、阶段状态、预览区、复制按钮、错误展示、provider mode badge）
- `/api/generate` GET（provider 状态）+ POST（统一主链路）
- `runGenerateMainFlow` server orchestration（InputRequest → NormalizedInput → provider → finalization → style selection → StyleResolver → preview → clipboard）
- Release 1 preview registry（`first-wave-preview-registry.ts`）
- Vitest：`tests/server/generation/run-generate-main-flow.test.ts`（15 项要求中的 server 侧覆盖）
- Playwright：`tests/e2e/generate-page.spec.ts`（3 cases）
- 文档：`sprint-backlog.md`、`sprint-plan.md`、`changelog.md`、`src/core/generation/README.md`
- Vitest 排除 `tests/e2e/**`，避免与 Playwright 冲突
- Playwright `webServer` 改为 `corepack pnpm dev`

**未做：**

- 微信公众号 Paste QA
- Style Gallery / 复杂编辑器 / block 级编辑
- Sprint 5 关闭声明
- merge 至 sprint / release / main
- commit（待用户确认）

## 4. 修改文件

- `docs/agile/changelog.md`
- `docs/agile/sprint-backlog.md`
- `docs/agile/sprint-plan.md`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/core/generation/README.md`
- `src/core/renderer/index.ts`
- `src/server/generation/classify-generate-error.ts`
- `src/server/generation/run-generate-main-flow.ts`
- `vitest.config.ts`
- `playwright.config.ts`

## 5. 新增文件

- `src/app/api/generate/route.ts`
- `src/app/generate/page.tsx`
- `src/app/generate/generate-page-client.tsx`
- `src/app/generate/preview-block-view.tsx`
- `src/app/generate/types.ts`
- `src/core/renderer/first-wave-preview-registry.ts`
- `src/server/generation/generate-flow-types.ts`
- `src/server/generation/classify-generate-error.ts`（若自本轮新建则与修改重叠）
- `src/server/generation/run-generate-main-flow.ts`
- `tests/server/generation/run-generate-main-flow.test.ts`
- `tests/e2e/generate-page.spec.ts`

## 6. 阅读但未修改的关键文件

- `docs/agile/git-workflow.md`
- `docs/architecture/generation-pipeline.md`
- `src/core/copy/first-wave-copy-registry.ts`
- `src/core/generation/style-selection.ts`
- `src/core/renderer/render-article-blocks.ts`

## 7. 关键变更说明

1. **Server 边界**：所有 provider / finalization / style selection 在 `runGenerateMainFlow` 内执行，API route 仅转发 JSON；不向 client 暴露 API key 或 Authorization header。
2. **Provider 解析**：`loadVolcengineProviderConfig(process.env)` 有效且 enabled 时用 Volcengine；否则 deterministic fallback，UI badge 显示 “dev fallback”。
3. **Preview**：`renderArticleBlocks` + `createRelease1FirstWavePreviewRendererRegistry` + `resolveArticleStyle`；client 仅渲染 `SerializedPreviewBlock`，不手写 block.content UI。
4. **Copy**：`buildClipboardPayload` + first-wave copy registry；client 使用 payload 的 `text/html` + `text/plain`，不从 DOM 抓取 innerHTML。
5. **错误分类**：`classify-generate-error.ts` 映射 input_validation / provider_* / article_schema / style_selection / renderer / clipboard 等 category。
6. **测试隔离**：Vitest `exclude: ["tests/e2e/**"]` 修复 Playwright spec 被 Vitest 误跑的问题。

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| AC-1 `/generate` 真实业务页面 | PASS | 非 Storybook / gallery |
| AC-2 topic / materials / draft / styleIntent 输入 | PASS | `generate-page-client.tsx` |
| AC-3 统一主链路 | PASS | `runGenerateMainFlow` + `/api/generate` |
| AC-4 InputRequest / NormalizedInput | PASS | `validateInputRequest` + `parseAndNormalizeInputRequest` |
| AC-5 不绕过 GenerationEvent / finalization / style / renderer | PASS | 单 orchestration 入口 |
| AC-6 Preview Renderer | PASS | first-wave preview registry |
| AC-7 Copy Renderer + clipboard payload | PASS | `buildClipboardPayload` |
| AC-8 阶段状态 idle→ready / error | PASS | phase stepper + error panel |
| AC-9 provider mode 展示 | PASS | badge + GET `/api/generate` |
| AC-10 测试覆盖（Vitest） | PASS | 729 tests；含 server flow 单测 |
| AC-11 Playwright smoke | PARTIAL | spec 已添加；本环境缺 browser binary（需 `pnpm exec playwright install`） |
| AC-12 lint / test / build | PASS | 见 §9 |
| AC-13 不泄露 API key | PASS | 单测断言 + sanitize |
| AC-14 不宣称 Paste QA / Sprint 5 关闭 | PASS | 文档与 UI 均未宣称 |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `corepack pnpm lint` | PASS | 0 errors |
| `corepack pnpm test` | PASS | 63 files, 729 tests |
| `corepack pnpm build` | PASS | `/generate` + `/api/generate` 路由产出 |
| `corepack pnpm test:e2e` | FAIL（环境） | Playwright browser 未安装；webServer 已可启动 |

## 10. 未完成事项

- 工作分支尚未 commit / merge 至 `sprint/s5-generation-ui-main-flow`
- Playwright e2e 需本地执行 `corepack pnpm exec playwright install` 后重跑
- 用户手动验收 `/generate`（含真实 Volcengine provider 模式，若 `.env.local` 已配置）

## 11. 风险与阻塞

- `.env.local` 存在 Volcengine 配置时默认走真实 provider；无配置时为 deterministic fallback——两种模式 UI 均有明确标识
- Next.js build 警告：`next.config.ts` → `smoke-env.ts` NFT trace（既有问题，非本轮引入）
- Playwright CI 需确保 browser install step

## 12. 需要用户 / ChatGPT 审查的问题

1. 是否 merge `feature/s5-generate-ui-main-flow` → `sprint/s5-generation-ui-main-flow`？
2. S5-STORY-006 是否已 merge 至 sprint？（本轮分支基于 sprint，含 style-selection 代码；backlog 标 Done）
3. Playwright e2e 是否纳入 CI（S5-STORY-008 范围）？
4. 手动 `/generate` 验收是否通过（尤其真实 provider 模式）？

## 13. 建议下一步

1. 用户审查后 commit + merge 至 sprint
2. 本地 `corepack pnpm exec playwright install && corepack pnpm test:e2e`
3. 手动打开 `/generate` 跑通一次完整流程
4. ChatGPT 审查 execution report → 决定是否将 S5-STORY-007 标 Done
5. 启动 S5-STORY-008（Sprint 5 E2E close readiness）

## 14. Commit

- Commit hash：未提交 / not committed
