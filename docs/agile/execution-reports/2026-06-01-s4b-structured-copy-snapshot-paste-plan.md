# Execution Report：S4B-STORY-006 Structured blocks Copy HTML snapshot / 33 variants 最小 Paste QA plan

## 1. 基本信息

- 日期：2026-06-01
- 当前分支：`feature/s4b-structured-copy-snapshot-paste-plan`
- 来源分支：`sprint/s4b-structured-block-renderer`
- 目标合并分支：`sprint/s4b-structured-block-renderer`
- Sprint：Sprint 4-B
- 关联 Story / Decision：S4B-STORY-006、DECISION-062
- 执行者：Cursor
- 状态：In Review

## 2. 本轮目标

扩展 structured blocks Copy HTML snapshot seed，覆盖 Sprint 4-B 已实现的 18 个 structured variants；建立 Release 1 first-wave 33 variants 最小 Paste QA plan，并保持所有 Paste QA 状态为 Not Run。

## 3. 执行范围

**本轮做了：**

- 扩展 `buildCopyHtmlSnapshot`，允许传入 scoped `supportedBlockTypes`，默认仍保持 S4A text-first 行为。
- 新增 Sprint 4-B structured copy registry。
- 新增 Release 1 first-wave copy registry。
- 新增 first-wave 33 variants Paste QA plan 纯函数。
- 新增 structured blocks 18 variants snapshot fixture 与测试。
- 新增 33 variants Paste QA plan 测试。
- 新增 Sprint 4-B structured seed 文档与 Release 1 33 variants plan 文档。
- 同步 `sprint-backlog.md`、`changelog.md`、`product-backlog.md`。

**本轮未做：**

- 真实微信公众号 Paste QA。
- 浏览器 Clipboard API。
- 业务页面 / Copy 按钮。
- 真实二维码、真实链接跳转、小程序卡片。
- 图片上传、图片托管、AI 生图或图库搜索。
- Style Gallery / AI Style Selection / Generation / Streaming。
- Article / Block Schema 主模型修改。
- merge 至 `release/1` / `main`。
- 关闭 Sprint 4-B 或启动 S4B-STORY-007。

## 4. 修改文件

- `src/core/copy/copy-html-snapshot.ts`
- `src/core/copy/copy-safe-html.ts`
- `src/core/copy/index.ts`
- `docs/agile/sprint-backlog.md`
- `docs/agile/changelog.md`
- `docs/agile/product-backlog.md`

## 5. 新增文件

- `src/core/copy/structured-copy-registry.ts`
- `src/core/copy/first-wave-copy-registry.ts`
- `src/core/copy/first-wave-paste-qa-plan.ts`
- `tests/fixtures/copy/structured-copy-fixtures.ts`
- `tests/core/copy/structured-copy-html-snapshot.test.ts`
- `tests/core/copy/first-wave-paste-qa-plan.test.ts`
- `docs/agile/paste-qa/sprint4b-structured-seed.md`
- `docs/agile/paste-qa/release1-first-wave-33-plan.md`
- `docs/agile/execution-reports/2026-06-01-s4b-structured-copy-snapshot-paste-plan.md`

## 6. 阅读但未修改的关键文件

- `src/core/copy/text-first-copy-registry.ts`
- `src/core/copy/clipboard-payload.ts`
- `src/core/copy/paste-qa-seed.ts`
- `tests/fixtures/copy/text-first-copy-fixtures.ts`
- `tests/core/copy/copy-html-snapshot.test.ts`
- `docs/agile/paste-qa/sprint4a-text-first-seed.md`
- `src/core/styles/variants/title-heading.ts`
- `src/core/styles/variants/text-first.ts`
- `src/core/styles/variants/structured.ts`

## 7. 关键变更说明

- Structured snapshot seed 通过真实 Copy Renderer 生成 HTML，使用 `buildCopyHtmlSnapshot` + `createSprint4BStructuredCopyRendererRegistry`，覆盖 list / quote / highlight / info_card / cta / image_placeholder 共 18 variants。
- Snapshot copy-safe assertion 扩展到 `display:flex` / `display:grid` 检查；structured tests 额外检查 cta 不输出真实 `<button>` / `<a href>` / QR image，image_placeholder 不输出真实 `<img>`。
- First-wave Paste QA plan 由 11 组 first-wave variant definitions 派生，保证总数 33、每 block 3 variants，并同步 copySafety。
- Paste QA plan 中所有 `pasteQaStatus` 固定为 `not_run`；不记录人工粘贴通过状态。
- cta / image_placeholder 记录为 Release 1 placeholder scope，不测试真实 QR / link / image 能力。

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| AC-1 feature 分支 | PASS | `feature/s4b-structured-copy-snapshot-paste-plan` |
| AC-2 structured snapshot seed | PASS | list / quote / highlight / info_card / cta / image_placeholder |
| AC-3 structured 18 variants | PASS | 18 entries |
| AC-4 真实 Copy Renderer 输出 | PASS | snapshot 与 direct renderer output 对比 |
| AC-5 copy-safe assertion | PASS | tests + assertion |
| AC-6 33 variants plan | PASS | `buildRelease1FirstWavePasteQaPlan` |
| AC-7 11 block × 3 | PASS | tests |
| AC-8 plan entry 字段 | PASS | blockType / variantId / copySafety / rendererCoverage / pasteQaStatus |
| AC-9 Not Run | PASS | 全部 `not_run` |
| AC-10 balanced 标记 | PASS | notes 标记真实 WeChat Paste QA |
| AC-11 placeholder scope | PASS | cta / image_placeholder notes |
| AC-12 Paste QA markdown | PASS | 2 份文档 |
| AC-13 未调用 Clipboard API | PASS | 纯函数 / 单测层 |
| AC-14 未新增业务页面 / Copy 按钮 | PASS | — |
| AC-15 未修改 Schema | PASS | — |
| AC-16 单元测试覆盖 | PASS | structured snapshot + plan |
| AC-17 lint | PASS | — |
| AC-18 test | PASS | 491 tests |
| AC-19 build | PASS | Next.js build PASS；TypeScript 5.0.2 minimum-version warning 为既有环境提示 |
| AC-20 sprint-backlog | PASS | S4B-STORY-006 In Review |
| AC-21 changelog | PASS | 已记录 |
| AC-22 未执行真实 Paste QA | PASS | 全部 Not Run |
| AC-23 未 merge release/1 | PASS | — |
| AC-24 未 merge main | PASS | — |
| AC-25 未关闭 Sprint 4-B | PASS | — |
| AC-26 未启动 S4B-STORY-007 | PASS | — |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `git status --short && git branch --show-current` | PASS | 启动前在 clean `sprint/s4b-structured-block-renderer` |
| `git branch --contains a4689e2 --list 'sprint/s4b-structured-block-renderer'` | PASS | S4B-STORY-005 已在 sprint |
| `git branch --contains a4689e2 --list 'release/1'` | PASS | 空输出，未 merge 至 `release/1` |
| `git branch --contains a4689e2 --list 'main'` | PASS | 空输出，未 merge 至 `main` |
| `git pull` | FAIL（非阻塞） | sprint 分支无 upstream；未修改 git tracking config |
| `git checkout -b feature/s4b-structured-copy-snapshot-paste-plan` | PASS | 已从本地 clean sprint 分支创建 |
| `corepack pnpm test tests/core/copy/structured-copy-html-snapshot.test.ts tests/core/copy/first-wave-paste-qa-plan.test.ts tests/core/copy/copy-html-snapshot.test.ts` | PASS | 23 tests |
| `corepack pnpm lint && corepack pnpm test && corepack pnpm build` | PASS | 491 tests；build PASS |

## 10. 未完成事项

- 工作分支尚未 merge 至 sprint，待用户 / ChatGPT 审查。
- 真实微信公众号 Paste QA 未执行，符合本轮边界，后续归 Sprint 6-B。
- S4B-STORY-007 尚未启动。

## 11. 风险与阻塞

- 无 P0 阻塞项。
- balanced variants 仍需真实微信公众号 Paste QA 验证，当前仅为 snapshot / plan coverage。
- text-first snapshot 仍沿用 S4A 最小代表 seed；first-wave 33 plan 已覆盖全量 variants，但真实 Paste QA 仍 Not Run。

## 12. 需要用户 / ChatGPT 审查的问题

- 是否接受 first-wave 33 variants Paste QA plan 全部保持 Not Run，并将真实 QA 归入 Sprint 6-B？
- 是否 merge `feature/s4b-structured-copy-snapshot-paste-plan` → `sprint/s4b-structured-block-renderer`？

## 13. 建议下一步

1. ChatGPT 审查 structured snapshot seed 与 first-wave 33 variants plan。
2. 用户确认后 merge 工作分支至 sprint。
3. 再启动 S4B-STORY-007（Sprint 4-B Renderer Contract Audit 与关闭准备）。

## 14. Commit Hash

- 实现 commit：未提交 / not committed（本报告随本轮提交）

## 15. 分支状态

| 项 | 值 |
|----|-----|
| 当前分支 | `feature/s4b-structured-copy-snapshot-paste-plan` |
| 来源分支 | `sprint/s4b-structured-block-renderer` |
| 建议合并目标 | `sprint/s4b-structured-block-renderer` |
| 是否已 merge 至 release/main | 否 |
