# Execution Report：S6-STORY-002~004 首页 → 真实 AI → 预览

## 1. 基本信息

- 日期：2026-06-02
- 当前分支：`sprint/s6-visible-ai-main-flow`
- 来源分支：`feature/s6-home-ai-preview-flow`
- 目标合并分支：`sprint/s6-visible-ai-main-flow`（**已 merge · fast-forward**）
- Sprint：Sprint 6 — Release 1 Visible AI Main Flow
- 关联 Story / Bug / Decision：S6-STORY-002、S6-STORY-003、S6-STORY-004、DECISION-072
- 执行者：Cursor
- 状态：Done

## 2. 本轮目标

一次性打通：首页输入 → 触发真实 AI 生成 → 预览页带样式文章渲染。不做 S6-STORY-005/006。

## 3. 执行范围

**做了：** 首页 `/`、预览 `/preview`、`requireRealProvider`、prompt 增强、测试与文档更新。

**没做：** 打字机、风格/配色切换 UI、复制专项、merge release/1、关闭 Sprint 6。

## 4. 修改文件

- `src/lib/home-input.ts`（新增）
- `src/app/page.tsx`、`src/app/home-page-client.tsx`（新增）
- `src/app/preview/page.tsx`、`src/app/preview/preview-page-client.tsx`（新增）
- `src/server/generation/run-generate-main-flow.ts`
- `src/server/generation/generate-flow-types.ts`
- `src/app/api/generate/route.ts`
- `src/core/generation/model-prompt.ts`
- `tests/lib/home-input.test.ts`（新增）
- `tests/core/generation/model-prompt-wechat-quality.test.ts`（新增）
- `tests/server/generation/run-generate-main-flow.test.ts`
- `tests/e2e/home-preview-flow.spec.ts`（新增）
- `docs/agile/sprint-backlog.md`、`decisions.md`、`changelog.md`
- `docs/product/user-story-map.md`

## 5. 新增文件

见 §4 标注（新增）项。

## 6. 阅读但未修改的关键文件

- `src/app/generate/generate-page-client.tsx`
- `src/app/generate/preview-block-view.tsx`
- `src/core/generation/volcengine-provider.ts`

## 7. 关键变更说明

- 用户主流程与 `/generate` dev harness 分离；预览 POST 带 `requireRealProvider: true`
- 无 Volcengine 配置时返回 `provider_config`（503），前端展示明确错误
- 复用 `runGenerateMainFlow` 全链路（生成 → schema → style → Preview Renderer）

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| 首页输入 + 跳转预览 | PASS | `/` → `/preview?...` |
| 真实 AI 主路径 | PASS | requireRealProvider |
| 带样式预览 | PASS | ArticlePreviewPanel |
| 无 key 明确错误 | PASS | provider_config |
| 005/006 未启动 | PASS | To Do |
| lint/test/build | PASS | 749 tests |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `corepack pnpm lint` | PASS | |
| `corepack pnpm test` | PASS | 749 tests |
| `corepack pnpm build` | PASS | routes: `/`, `/preview`, `/generate`, `/api/generate` |
| `corepack pnpm test:e2e` | PASS | `home-preview-flow.spec.ts` 3 passed |

## 10. 未完成事项

- S6-STORY-005、S6-STORY-006
- 内容质量 DoD 依赖真实模型输出，需配置 API key 后手测
- 无（已 merge 至 sprint）

## 11. 风险与阻塞

- 未配置 `VOLCENGINE_*` 时预览页仅显示配置错误（符合 DECISION-072）
- prompt 质量约束不能保证模型 100% 满足 1200–1500 字与 block 齐全

## 12. 需要用户 / ChatGPT 审查的问题

- S6-STORY-002~004 是否标为 Done
## 13. 建议下一步

启动 S6-STORY-005（生成反馈 / 轻量打字机）或 S6-STORY-006（风格 / 复制）。

## 14. Commit

- Feature commit：`f38130a` — `feat(s6): home and preview real AI flow (S6-STORY-002~004)`
- Merge：`feature/s6-home-ai-preview-flow` → `sprint/s6-visible-ai-main-flow`（fast-forward @ `f38130a`）
- Sprint 分支：未 merge `release/1` / `main`
