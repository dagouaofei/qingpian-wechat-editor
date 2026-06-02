# Execution Report：Generate 主链路 Clipboard cta scope 修复

## 1. 基本信息

- 日期：2026-06-02
- 当前分支：`feature/s5-generate-ui-main-flow`
- 来源分支：`sprint/s5-generation-ui-main-flow`
- 目标合并分支：`sprint/s5-generation-ui-main-flow`
- 关联 Story：S5-STORY-007（bugfix）
- 状态：In Review

## 2. 问题

真实 provider 生成含 `cta` block 的 Article 时，`/generate` 在 Clipboard 阶段报错：

`block type "cta" is outside renderer supported scope`

## 3. 根因

`runGenerateMainFlow` 使用 `createRelease1FirstWaveCopyRendererRegistry()`，但 `buildClipboardPayload` 未传入 `supportedBlockTypes`，默认回落到 Sprint 4-A 的 `SPRINT4A_TEXT_FIRST_COPY_BLOCK_TYPES`（仅 title/heading/lead/paragraph/divider），导致 structured block（cta / list / quote 等）被拒绝。

Preview 路径已正确传入 `RELEASE1_FIRST_WAVE_PREVIEW_BLOCK_TYPES`；Copy 路径遗漏。

## 4. 修复

- `run-generate-main-flow.ts`：传入 `supportedBlockTypes: RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES`
- `clipboard-payload.ts`：`BuildClipboardPayloadOptions` 增加 `supportedBlockTypes` 并透传至 `buildCopyHtmlSnapshot`
- `clipboard-payload.test.ts`：新增 structured blocks（含 cta）回归测试

## 5. 验证

| 命令 | 结果 |
|------|------|
| lint | PASS |
| test | PASS（733） |
| build | PASS |

## 6. Commit

- 未提交 / not committed
