# Execution Report：S6 流式预览样式 + 自动滚动修复

## 1. 基本信息

- 日期：2026-06-02
- 当前分支：`feature/s6-generation-feedback-typewriter`
- 来源分支：`sprint/s6-visible-ai-main-flow`
- 目标合并分支：`sprint/s6-visible-ai-main-flow`
- Sprint：Sprint 6 — Release 1 Visible AI Main Flow
- 关联 Story / Bug / Decision：S6-STORY-005；DECISION-077
- 执行者：Cursor
- 状态：In Review

## 2. 本轮目标

修复用户反馈的两项流式预览问题：
1. 打字机/流式显示文字时未带上 Preview Renderer 样式
2. 首次生成时页面不自动跟随滚动，需手动滑到底部后才开始跟随

## 3. 执行范围

- 修复流式预览渲染与滚动跟随逻辑
- 参考 `miaopian-demo/lib/landingStreamPreviewScroll.ts` 的 block start / typing 滚动策略（未复制代码）
- 未做：SSE 协议变更、Story 006 风格切换、commit / merge

## 4. 修改文件

- `src/lib/use-preview-stream-scroll.ts`
- `src/lib/render-streaming-preview.ts`
- `src/app/preview/preview-page-client.tsx`
- `src/app/generate/preview-block-view.tsx`
- `tests/lib/render-streaming-preview.test.ts`

## 5. 新增文件

- `docs/agile/execution-reports/2026-06-02-s6-stream-preview-style-scroll-fix.md`

## 6. 阅读但未修改的关键文件

- `miaopian-demo/lib/landingStreamPreviewScroll.ts`
- `src/core/renderer/preview-visual-styles.ts`
- `src/app/generate/preview-block-view.tsx`（StreamingCaret / PreviewBlockOutput）

## 7. 关键变更说明

### 样式问题

- **关闭流式阶段的 block reveal 动画**（`disableBlockRevealAnimation`）：避免每个 delta 重渲染时 opacity 从 0 渐入，造成「像纯文本、无样式」的观感与抖动
- **移除 `renderStreamingPreviewBlocks` 静默 `catch → []`**：避免渲染异常时回退到无样式 placeholder
- **流式 Article 使用首页选择的 `basicStyle` preset**（不再硬编码 `classic-news`）
- **改进 delta 追加**：支持 `info_card.body` 与 inline `text` 数组，减少 block 完成前无法渲染的情况
- **有 streaming block 即显示 Preview 容器**（即使个别 structured block 仍 deferred）

### 滚动问题

- 重写 `usePreviewStreamScroll`，参考 miaopian：
  - 新 block：双 RAF 后滚到 block 锚点（35% 视口）
  - 同一 block typing：监听 `contentRevision` + `ResizeObserver`，接近下沿或内容超出时 `auto` 跟随
  - 程序化滚动打标，避免误判为用户上滑
  - 导出 `resetAutoFollow()`，重新生成时重置跟随状态

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| 流式文字带 Preview 样式（标题/导语/段落 typography + layout） | In Review | 需 PO 手测 `/` → `/preview` 真实 SSE |
| 首次生成时内容超出视口自动跟随，无需手动滑到底 | In Review | 需 PO 手测长文主题 |
| 不破坏单一 Article Schema / Preview Renderer 主链路 | PASS | 仍走 `renderStreamingPreviewBlocks` → `renderArticleBlocks` |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| npm run lint | PASS | |
| npm test tests/lib/render-streaming-preview.test.ts | PASS | 5 tests |
| npm run build | 未运行 | 本轮未执行 |

## 10. 未完成事项

- 全量 `npm test` / `npm run build` 未跑
- list / divider / image_placeholder 仍在 `block.complete` 前 deferred（by design）
- 行内 marks（bold/color）仍主要在 `block.complete` 后才有完整结构

## 11. 风险与阻塞

- 长文高频 delta 下滚动节流（280ms）可能仍略滞后，需 PO 体感确认
- 若 Volcengine 未配置，无法手测真实流式路径

## 12. 需要用户 / ChatGPT 审查的问题

- 流式阶段关闭 reveal 动画是否符合预期（换取稳定样式展示）
- 自动跟随灵敏度（BOTTOM_EDGE_RATIO 0.78）是否需微调

## 13. 建议下一步

1. 重启 `pnpm dev`，手测 `/` → 填写主题 → 生成，观察首段起是否带标题/导语样式且自动滚动
2. 通过后考虑 merge `feature/s6-generation-feedback-typewriter` → sprint 分支
3. 可选：清理未再使用的 `use-preview-typewriter-reveal.ts`（batch 假打字机）

## 14. Commit

- 未提交 / not committed
