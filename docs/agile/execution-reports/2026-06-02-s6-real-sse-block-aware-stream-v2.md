# Execution Report：S6-STORY-005 真实 SSE block-aware stream 迭代

## 1. 基本信息

- 日期：2026-06-02
- 当前分支：`feature/s6-generation-feedback-typewriter`
- 来源分支：`feature/s6-ux-shell-miaopian-reference`
- 目标合并分支：`sprint/s6-visible-ai-main-flow`
- Sprint：Sprint 6 — Release 1 Visible AI Main Flow
- 关联 Story / Bug / Decision：S6-STORY-005；DECISION-077（取代 DECISION-076）；miaopian-demo 实现建议
- 执行者：Cursor
- 状态：In Review

## 2. 本轮目标

按 miaopian-demo 建议迭代：第一时间显示生成 UI、真实 SSE block-aware stream、phase 阶段提示、预览滚动跟随、统一 Preview Renderer；不破坏 Article Schema 与 Renderer 契约。

## 3. 执行范围

- 从 stash 恢复 SSE 服务端/解析/客户端基础设施
- 扩展 GenerationEvent：`phase`（planning/writing/styling/finalizing）
- 重写 `/preview` 为 stream 主路径（connecting → planning → streaming → finalizing → done）
- 即时预览壳 + 占位 + block 流式渲染 + caret
- 自动滚动跟随 + 「回到当前位置」
- 废弃客户端 batch 假打字机主路径（DECISION-076）
- 未改 Article Schema；未引入平行 streamArticle 模型

## 4. 修改文件

- `src/core/generation/events.ts`、`event-schemas.ts`、`stream.ts`、`index.ts`、`volcengine-provider.ts`
- `src/server/generation/run-generate-stream-flow.ts`
- `src/app/preview/preview-page-client.tsx`
- `src/components/preview/preview-generating-status.tsx`
- `tests/e2e/home-preview-flow.spec.ts`
- `docs/agile/decisions.md`、`docs/agile/sprint-backlog.md`

## 5. 新增文件

- `src/core/generation/jsonl-block-stream-parser.ts`
- `src/core/generation/model-prompt-streaming.ts`
- `src/core/generation/volcengine-stream-transport.ts`
- `src/core/generation/volcengine-streaming-provider.ts`
- `src/lib/generate-stream-client.ts`
- `src/lib/render-streaming-preview.ts`
- `src/lib/use-preview-stream-scroll.ts`
- `src/server/generation/stream-sse.ts`
- `src/app/preview/streaming-preview-panel.ts`（类型）
- 相关 tests + execution report

## 6. 架构对齐说明（相对 miaopian 建议）

| miaopian 建议 | 轻篇落地 |
|---------------|----------|
| `block_start` / `block_delta` | 沿用既有 `block.start` / `block.delta` / `block.complete`（GenerationEvent 契约） |
| `phase` 事件 | 新增 `phase` 事件（planning/writing/styling/finalizing） |
| `article_start` / `block_patch` | 未新增（block.start + delta 已覆盖；终态 `flow.complete` 含完整 Article） |
| 两套 preview | **单套** Preview Renderer（`renderStreamingPreviewBlocks` 构建临时 Article → renderArticleBlocks） |
| 假打字机 | 已废弃（DECISION-077） |

## 7. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| 第一时间显示生成 UI | PASS | connecting 即显示分析面板 + 预览占位 |
| 真实 SSE streaming | PASS | `/api/generate/stream` |
| block-aware 渲染 | PASS | JSONL parser → GenerationEvent → Preview Renderer |
| 滚动跟随 | PASS | autoFollow + resume 按钮 |
| 可复制终态 | PASS | flow.complete 后 done + copy |
| 不破坏架构 | PASS | 单一 Article 终态；无 mock 主链路 |

## 8. 运行检查

| 命令 | 结果 |
|------|------|
| corepack pnpm lint | PASS |
| corepack pnpm test | PASS（764） |
| corepack pnpm build | PASS |

## 9. 未完成事项

- `use-preview-typewriter-reveal.ts` 等 batch 假打字机文件仍保留但不再用于主路径（可后续清理）
- list/info_card 等 block 在 complete 前 defer 渲染（render-streaming-preview 既有策略）

## 10. 建议下一步

1. 手测：首页 → 预览；观察 connecting 即时 UI → SSE block 流式 → 滚动跟随 → 复制
2. 审查 merge 至 sprint 分支
3. S6-STORY-006 风格/配色切换

## 11. Commit

- Commit hash：未提交 / not committed
