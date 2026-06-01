# Execution Report：S4A-STORY-006 Copy HTML snapshot / Clipboard 双格式 / 最小 Paste QA seed

## 1. 基本信息

- 日期：2026-06-01
- 当前分支：`feature/s4a-copy-html-clipboard-paste-seed`
- 来源分支：`sprint/s4a-text-first-renderer`
- 目标合并分支：`sprint/s4a-text-first-renderer`
- Sprint：Sprint 4-A
- 关联 Story / Bug / Decision：S4A-STORY-006；P1-S3B-002（balanced copySafety paste 验证）；P1-S3B-004（gallery 登记，不在本轮实现）
- 执行者：Cursor
- 状态：In Review

## 2. 本轮目标

为 Sprint 4-A 已完成的 text-first blocks 建立复制输出质量基础：Copy HTML snapshot seed、Clipboard 双格式 payload、text/plain fallback 和最小 Paste QA seed。

## 3. 执行范围

**已完成：**

- 基于现有 Copy Renderer 生成 Copy HTML snapshot seed
- `text/html` + `text/plain` Clipboard payload builder（纯函数）
- text/plain fallback builder（InlineContent marks 降级为纯文本）
- copy-safe HTML snapshot assertion
- Sprint 4-A text-first Paste QA seed（TypeScript seed + markdown）
- 单元测试覆盖 snapshot / clipboard payload / plain text / paste QA seed

**明确未做：**

- 未调用 `navigator.clipboard`
- 未实现业务页面 / Copy 按钮 / Clipboard 权限逻辑
- 未执行真实微信公众号粘贴测试
- 未实现 structured blocks（list / quote / highlight / info_card / cta / image_placeholder）
- 未 merge 至 sprint / release / main

## 4. 修改文件

- `src/core/copy/index.ts`
- `src/core/copy/README.md`
- `docs/agile/sprint-backlog.md`

## 5. 新增文件

- `src/core/copy/copy-safe-html.ts`
- `src/core/copy/text-first-copy-registry.ts`
- `src/core/copy/copy-html-snapshot.ts`
- `src/core/copy/clipboard-payload.ts`
- `src/core/copy/plain-text.ts`
- `src/core/copy/paste-qa-seed.ts`
- `tests/fixtures/copy/text-first-copy-fixtures.ts`
- `tests/core/copy/copy-html-snapshot.test.ts`
- `tests/core/copy/clipboard-payload.test.ts`
- `tests/core/copy/plain-text.test.ts`
- `tests/core/copy/paste-qa-seed.test.ts`
- `docs/agile/paste-qa/sprint4a-text-first-seed.md`

## 6. 阅读但未修改的关键文件

- `docs/agile/sprint-backlog.md`
- `docs/architecture/rendering-pipeline.md`
- `docs/architecture/copy-to-wechat-pipeline.md`
- `docs/architecture/wechat-copy-style-rules.md`
- `docs/architecture/style-system.md`
- `src/core/renderer/render-block.ts`
- `src/core/renderer/registry.ts`
- `src/core/renderer/context.ts`
- `src/core/copy/title-block-copy.ts`
- `src/core/copy/text-block-copy.ts`
- `src/core/copy/divider-copy.ts`
- `tests/fixtures/renderer/title-heading-articles.ts`
- `tests/fixtures/renderer/lead-paragraph-articles.ts`
- `tests/fixtures/renderer/divider-articles.ts`

## 7. 关键变更说明

- `buildCopyHtmlSnapshot()` 逐 block 调用现有 Copy Renderer，snapshot HTML 不手写、不绕过主链路。
- `buildClipboardPayload()` 返回 `textHtml` / `textPlain` / `issues` / `warnings` / `metadata`，不触碰浏览器 Clipboard API。
- `buildArticlePlainText()` 将 title / heading / lead / paragraph 降级为纯文本，divider 不污染正文；InlineContent mark 仅保留文本。
- `assertCopySafeHtmlSnapshot()` 扩展检查 class/className、`<style>`、`<script>`、事件属性、external stylesheet、absolute、transform、pseudo element。
- Paste QA seed 覆盖 6 个代表 variants，全部状态为 `Not Run`。

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| AC-1 Copy HTML snapshot seed | PASS | `copy-html-snapshot.ts` + fixture |
| AC-2 snapshot 来源 Copy Renderer | PASS | 测试直接比对 `renderBlock()` 输出 |
| AC-3 Clipboard 双格式 payload | PASS | `clipboard-payload.ts` |
| AC-4 text/plain fallback | PASS | `plain-text.ts` |
| AC-5 Paste QA seed Not Run | PASS | `paste-qa-seed.ts` + markdown |
| AC-6 覆盖 text-first blocks | PASS | title / heading / lead / paragraph / divider |
| AC-7 至少 6 代表 variants | PASS | 6 variants |
| AC-8 copy-safe assertion | PASS | class / style tag / script / event / absolute 等测试 |
| AC-9 missing renderer/style | PASS | structured issue 测试 |
| AC-10 balanced warning | PASS | `divider_dotted_line` warning 保留 |
| AC-11 未越界 | PASS | 无 structured renderer / UI / Clipboard API |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `corepack pnpm lint` | PASS | 无 lint error |
| `corepack pnpm test` | PASS | 32 files / 378 tests |
| `corepack pnpm build` | PASS | Next.js build 成功；保留既有 TypeScript 版本提示 |

## 10. 未完成事项

- 真实微信公众号 Paste QA：Not Run，待后续执行。
- merge 至 `sprint/s4a-text-first-renderer`：待用户审查确认。

## 11. 风险与阻塞

- `balanced` variants 仍需人工粘贴验证；本轮只保留 warning metadata 与 seed，不声明 Paste QA 通过。

## 12. 需要用户 / ChatGPT 审查的问题

- 6 个代表 variants 是否足以作为 Sprint 4-A 最小 Paste QA seed，或是否需要后续扩展到全部 15 个已实现 text-first variants。

## 13. 建议下一步

- 审查通过后 merge `feature/s4a-copy-html-clipboard-paste-seed` → `sprint/s4a-text-first-renderer`。
- 启动 S4A-STORY-007（Sprint 4-A Renderer Contract Audit 与关闭准备）。

## 14. Commit

- Commit hash：`0f4e6bc`
