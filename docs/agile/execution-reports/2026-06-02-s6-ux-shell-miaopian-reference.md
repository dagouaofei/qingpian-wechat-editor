# Execution Report：S6-STORY-006A UX Shell 对齐 miaopian-demo

## 1. 基本信息

- 日期：2026-06-02
- 当前分支：`feature/s6-ux-shell-miaopian-reference`
- 来源分支：`sprint/s6-visible-ai-main-flow`
- 目标合并分支：`sprint/s6-visible-ai-main-flow`
- Sprint：Sprint 6 — Release 1 Visible AI Main Flow
- 关联 Story / Bug / Decision：S6-STORY-006A；DECISION-075；PB-R1-01 / PB-R1-04 / PB-R1-07（复制提前）
- 执行者：Cursor
- 状态：In Review

## 2. 本轮目标

确认 `miaopian-demo` 为 UX 参考标准；在不动 Article Schema 前提下，将 `/` 与 `/preview` UI Shell 对齐秒篇 Landing 的信息架构与视觉密度；主路径使用 batch generate；预览页跑通复制。

## 3. 执行范围

- 新增共享 UI Shell 组件（backdrop / nav / 输入卡片 / 渐变 CTA）
- 重写首页与预览页客户端组件
- 预览页 batch `POST /api/generate` + Copy 按钮
- 抽取 `copyClipboardPayload` 供 preview / generate 复用
- 登记 DECISION-075 与 S6-STORY-006A
- **未做：** SSE 流式主路径、风格/配色切换（S6-STORY-006 剩余）、Style Gallery（Sprint 7）、merge sprint

## 4. 修改文件

- `src/app/home-page-client.tsx`
- `src/app/preview/preview-page-client.tsx`
- `src/app/generate/generate-page-client.tsx`（复用 copy 工具）
- `tests/e2e/home-preview-flow.spec.ts`
- `docs/agile/decisions.md`
- `docs/agile/sprint-backlog.md`

## 5. 新增文件

- `src/components/ui-shell/primitives.tsx`
- `src/components/ui-shell/icons.tsx`
- `src/components/ui-shell/page-shell.tsx`
- `src/lib/copy-clipboard-payload.ts`
- `docs/agile/execution-reports/2026-06-02-s6-ux-shell-miaopian-reference.md`

## 6. 阅读但未修改的关键文件

- `/Users/victor/Documents/mypros/miaopian-demo/components/landing/LandingB.tsx`（UX 参考）
- `src/server/generation/run-generate-main-flow.ts`
- `src/app/generate/preview-block-view.tsx`

## 7. 关键变更说明

1. **DECISION-075**：正式确认 miaopian-demo Landing 为 Sprint 6 UX 参考；batch 为主路径；不复制旧代码。
2. **首页**：hero + 渐变背景 + 输入卡片 + 示例选题 + 可折叠高级选项；保留原有 testid 与表单字段。
3. **预览页**：双栏工作台（侧栏：选题 / 状态 / 重新生成 / 复制；主区：loading / 错误 / Preview Renderer）。
4. **复制**：预览页与 `/generate` 共用 `copyClipboardPayload`，payload 仍来自 server Copy Renderer。

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| AC-1 Landing 信息架构 | PASS | hero + 卡片 + 示例 + 高级选项 |
| AC-2 预览双栏布局 | PASS | 侧栏操作 + 主预览 |
| AC-3 batch 主路径 | PASS | `POST /api/generate` |
| AC-4 复制可用 | PASS | `preview-copy-button` + Clipboard payload |
| AC-5 Schema / 代码边界 | PASS | 无 Schema 变更；无 miaopian 代码复制 |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| corepack pnpm lint | PASS | |
| corepack pnpm test | PASS | 749 tests |
| corepack pnpm build | PASS | |

## 10. 未完成事项

- S6-STORY-006 风格 / 配色切换
- S6-STORY-005 流式体验（独立分支 `feature/s6-real-sse-block-aware-stream` 有 WIP，未纳入本轮）
- 最小粘贴 QA 记录

## 11. 风险与阻塞

- 真实 AI 生成仍依赖 Volcengine 配置；未配置时 batch 路径返回 `provider_config` 错误（符合 DECISION-072）
- 文章 block 样式丰富度仍受 Sprint 7 约束；本轮仅抛光页面壳

## 12. 需要用户 / ChatGPT 审查的问题

- 是否 merge `feature/s6-ux-shell-miaopian-reference` → `sprint/s6-visible-ai-main-flow`
- S6-STORY-006 复制 AC 部分提前完成，是否调整 006 范围
- SSE 流式分支（stash）与 batch 主路径的优先级

## 13. 建议下一步

1. 用户手测：`/` 输入 → `/preview` 生成 → 复制粘贴公众号编辑器
2. 审查通过后 merge 至 sprint 分支
3. 继续 S6-STORY-006 风格 / 配色切换

## 14. Commit

- Commit hash：未提交 / not committed
