# Execution Report：S10-STORY-005 用户侧 Variant Pool DB 接入

## 1. 基本信息

- 日期：2026-06-07
- 当前分支：`feature/s10-story-005-user-variant-pool-db`
- 来源分支：`sprint/s10-db-backed-style-admin-v1`
- 目标合并分支：`sprint/s10-db-backed-style-admin-v1`
- Sprint：Sprint 10 — Database-backed Style Management Admin v1
- 关联 Story / Bug / Decision：S10-STORY-005 · DECISION-108
- 执行者：Cursor
- 状态：**Done**（merge @ `6de237d` · 本地验收 PASS）

## 2. 本轮目标

用户侧 `/preview` 小标题 style picker 优先从 PostgreSQL user-selectable pool 读取 variants，支持 1–5 分钟缓存，用户选择后 Preview / Copy 生效。

## 3. 执行范围

**已完成：**

- `getUserSelectableVariantPool` runtime 服务 + cache + mapper
- `/preview` server page 加载 pool 并传入 `PreviewPageClient`
- `renderArticlePreviewClient` / `createUserPreviewStyleRegistry` DB pool 接入
- `user-preview-render` poolContext 支持 DB variant html-paste adapter
- dev-only API `GET /api/dev/style-admin/user-selectable-pool`（FIX-A：development/test only · 响应脱敏 · 非正式用户侧接口）
- 测试 15+ 项 + FIX-A 安全边界测试 · 文档同步

**未做：**

- 后台上下架写操作（S10-STORY-006）
- Gallery / AI 生成路径切换
- commit · merge sprint

## 4. 修改文件

- `src/app/preview/page.tsx`
- `src/app/preview/preview-page-client.tsx`
- `src/components/preview/preview-style-controls.tsx`
- `src/lib/render-article-preview-client.ts`
- `src/lib/user-preview-style-registry.ts`
- `src/lib/user-preview-render.ts`
- `src/server/style-admin/index.ts`
- docs（sprint-backlog · sprint-plan · sprint10 · changelog · architecture）

## 5. 新增文件

- `src/server/style-admin/runtime/user-selectable-variant-pool.ts`
- `src/server/style-admin/runtime/user-selectable-variant-pool-cache.ts`
- `src/server/style-admin/runtime/user-selectable-variant-pool-mapper.ts`
- `src/server/style-admin/runtime/user-selectable-variant-pool-types.ts`
- `src/server/style-admin/runtime/index.ts`
- `src/lib/user-selectable-variant-pool-types.ts`
- `src/lib/preview-user-selectable-pool.ts`
- `src/app/api/dev/style-admin/user-selectable-pool/route.ts`
- `src/app/api/dev/style-admin/user-selectable-pool/sanitize-dev-pool-response.ts`
- `src/lib/dev-api-env.ts`
- `tests/server/style-admin/runtime/*.test.ts`（3 files）
- `tests/app/api/dev/style-admin/user-selectable-pool-route.test.ts`
- `tests/lib/dev-api-env.test.ts`
- `tests/lib/preview-user-selectable-pool.test.tsx`
- `tests/lib/user-selectable-variant-pool-db.test.ts`

## 6. 阅读但未修改的关键文件

- `src/core/style-library/user-selectable-preview-pool.ts`
- `src/lib/preview-heading-style.ts`
- `docs/architecture/style-management-admin-v1.md`

## 7. 关键变更说明

1. **池规则** 与 admin mappers 一致：仅 `userSelectable` + 非 hidden/deprecated + current version。
2. **`/preview`** 为实际用户侧 style picker 路径（S9-STORY-007C）；Gallery 仍 `includeUserSelectableHeadingOptions={false}`。
3. **缓存** 内存 TTL 默认 120s，env 可配置至 300s；`forceRefresh` 可绕过。
4. **Fallback** `DATABASE_URL` 缺失或 DB 错误 → `code_fallback`（S9 code pool），页面不崩溃。
5. **Preview/Copy** 同一 `userSelectablePool` snapshot 驱动 registry 与 html-paste adapter。
6. **FIX-A Dev API 安全边界：** `isDevApiEnabled()` 限制 development/test；production/staging 返回 404 disabled；`notice`/`issues` 脱敏；异常不泄漏 stack/连接串。

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| AC-1 DB pool picker | PASS | `/preview` server 加载 pool |
| AC-2 缓存 TTL | PASS | 120s 默认 · env 配置 |
| AC-3 下架后消失 | N/A | 需 S10-STORY-006 写操作 |
| AC-4 恢复后可见 | N/A | 需 S10-STORY-006 |
| AC-5 Preview/Copy | PASS | 测试 + 用户本地验收路径 |
| AC-6 未污染 preset | PASS | Gallery/生成路径未改 |
| AC-7 lint/test/build | PASS | 本轮 FIX-A 后重跑 |
| FIX-A Dev API 安全 | PASS | dev enabled · production disabled · 无 secret 泄漏 |

## 9. 运行检查

| 命令 | 结果 |
|------|------|
| `corepack pnpm lint` | PASS（0 errors · 27 warnings 既有） |
| `corepack pnpm test` | PASS（136 files · 1083 tests，含 FIX-A 11 项） |
| `corepack pnpm build` | PASS |

## 10. 本地手动验收路径（代码事实）

**主路径：**

```text
http://localhost:3000/preview?topic=<主题>&basicStyle=business&...
```

生成完成后，左侧「小标题样式」picker 应显示 DB `userSelectable` variants（预期含 `heading_teal_section_label_html_paste_candidate`）。

**辅助：**

```text
http://localhost:3000/admin/style-library?userSelectable=true
GET http://localhost:3000/api/dev/style-admin/user-selectable-pool?blockType=heading
```

> **注意：** 上述 dev API 仅供本地/测试调试 pool 快照，**不属于正式用户侧接口**；production 部署返回 404 disabled。

**前置（用户已验收）：**

```bash
DATABASE_URL=... corepack pnpm prisma migrate deploy
DATABASE_URL=... corepack pnpm style-admin:import-existing-variants
corepack pnpm dev
```

## 11. 未完成事项

- FIX-A/B 已 merge sprint @ `6de237d`
- AC-3/AC-4 完整闭环待 S10-STORY-006

## 12. 风险与阻塞

- 无

## 13. 建议下一步

1. 审查 execution report
2. commit + merge → sprint
3. S10-STORY-006 上下架写操作 + cache 刷新闭环

## 14. Commit

- Commit hash：`0273e39`
