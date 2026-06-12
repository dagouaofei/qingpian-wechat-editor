# Execution Report：S11-STORY-003A Staging Volcengine + streaming + numbering

## 1. 基本信息

- 日期：2026-06-10
- 当前分支：`feature/s11-story-003a-staging-volcengine-streaming-numbering`
- 来源分支：`sprint/s11-production-ops-go-live`
- 目标合并分支：`sprint/s11-production-ops-go-live`
- Sprint：Sprint 11
- 关联 Story / Bug / Decision：S11-STORY-003A · BUG-S11-STAGING-001 · BUG-S11-STAGING-002 · DECISION-111
- 执行者：Cursor
- 状态：**In Review**（代码/文档完成 · staging 人工验收待用户）

## 2. 本轮目标

启动 S11-STORY-003A：补齐 staging Volcengine 文档与 env 指引；修复 staging SSE 打字机回归；修复 HTML variant 章节编号回归；增加 regression tests。

## 3. 执行范围

**做了：**

- 新增 S11-STORY-003A 至 sprint backlog / plan / changelog / bugs
- SSE 响应头 `X-Accel-Buffering: no` + Nginx `/api/generate/stream` `proxy_buffering off` 示例
- DSL numbering：`semanticBindings.number` stale path 校验 + infer fallback
- user preview 传递 `variantSourceMeta` 至 `renderDslBlock`
- Volcengine env 变量名文档（无 secret）
- targeted tests + lint + build

**没做：**

- ECS 上实际配置 Volcengine env（需用户/运维）
- ECS Nginx reload（需用户/运维）
- staging 首页生成 E2E 人工验收
- production 部署 · merge main · Release 1 关闭
- `wechat-paste-qa-pack` 既有 2 failures

## 4. 修改文件

- `src/app/api/generate/stream/route.ts`
- `src/server/generation/stream-sse.ts`
- `src/core/dsl/decoder/fidelity-tree-substitution.ts`
- `src/lib/user-preview-render.ts`
- `deploy/nginx/staging.conf.example`
- `deploy/nginx/production.conf.example`
- `docs/agile/sprint11-production-ops-go-live.md`
- `docs/agile/sprint-backlog.md`
- `docs/agile/sprint-plan.md`
- `docs/agile/changelog.md`
- `docs/agile/bugs.md`
- `docs/ops/environment-variables.md`
- `docs/ops/environments/staging.md`
- `tests/lib/dsl-runtime-fidelity-heading-substitution.test.ts`

## 5. 新增文件

- `tests/server/generation/generate-stream-sse-headers.test.ts`
- `docs/agile/execution-reports/2026-06-10-s11-story-003a-staging-volcengine-streaming-numbering.md`

## 6. 阅读但未修改的关键文件

- `src/server/generation/run-generate-stream-flow.ts`
- `src/lib/generate-stream-client.ts`
- `src/server/style-admin/runtime/runtime-variant-dsl-pool.ts`
- `src/core/generation/model-provider-config.ts`

## 7. 关键变更说明

### 7.1 打字机回归根因

- **dev**：直连 Next.js dev server，SSE chunk 即时到达客户端 → 打字机效果正常。
- **staging**：Nginx 反代默认 `proxy_buffering on`，且 SSE 响应缺少 `X-Accel-Buffering: no` → 事件被缓冲后批量下发 →「一块一块显示」。

**修复：** `buildGenerateStreamSseResponseHeaders()` + staging Nginx 专用 `location /api/generate/stream { proxy_buffering off; ... }`。

### 7.2 章节编号回归根因

- S10-STORY-011 已在 decode 阶段用 `resolveHeadingIndexLabel` 替换 number slot。
- DB-backed HTML variant 经 harvest / pool refresh 后，`meta.semanticBindings.number.path` 可能与当前 tree 不一致。
- `resolveEffectiveSemanticBindings` 曾**无条件**用 stored binding 覆盖 infer → stale path 导致替换失败 → 所有 heading 保留 source HTML 静态 `01`。

**修复：** 仅当 stored path 在 tree 上可解析时才采用；number 替换失败时 fallback 到 infer 的 number path。

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| AC-1 Volcengine staging 配置 | **Pending** | 文档/命令已列出 · ECS env 待用户配置 |
| AC-2 首页生成主链路 | **Pending** | 依赖 AC-1 + deploy |
| AC-3 打字机/streaming | **In Review** | 代码修复完成 · Nginx reload 待 ECS |
| AC-4 HTML variant 编号递增 | **In Review** | 代码 + test PASS · staging 人工待验 |
| AC-5 Preview/Copy 一致 | **In Review** | regression test 覆盖 copy HTML |
| AC-6 health ok | **N/A** | 未改 health 路径 · 预期不回归 |
| AC-7 admin/pool 不回归 | **In Review** | admin tests PASS · 未改 admin 主链 |
| AC-8 无 secret 入库 | **PASS** | 仅变量名 |
| AC-9 production 未启动 / main 未 merge | **PASS** | 明确未做 |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `corepack pnpm lint` | **PASS** | 0 errors · 30 pre-existing warnings |
| `corepack pnpm build` | **PASS** | Next.js 16.2.6 |
| targeted tests (32) | **PASS** | streaming headers · numbering · admin auth |
| full `pnpm test` | **未运行** | 已知 `wechat-paste-qa-pack` 2 failures 不在本轮范围 |

## 10. 未完成事项

- ECS 配置 `VOLCENGINE_*` 并 restart staging systemd
- ECS Nginx 应用 SSE location 并 reload
- staging 首页生成 + 打字机 + numbering 人工验收
- merge feature → sprint（待用户确认）
- S11-STORY-003A 关闭（待用户确认）

## 11. 风险与阻塞

- Volcengine API Key / model endpoint 仅用户持有，Cursor 无法代配。
- Nginx 配置需运维在 ECS 手动 apply（示例已更新，非自动 deploy）。

## 12. 需要用户 / ChatGPT 审查的问题

- staging Nginx 是否已按 `deploy/nginx/staging.conf.example` 增加 `/api/generate/stream` location？
- Volcengine env 配置后首页生成是否 PASS？
- 003A 是否可 merge 回 sprint？

## 13. 建议下一步

1. ECS 配置 Volcengine env + restart + Nginx reload（见 staging.md §9）
2. staging 人工验收：首页生成 · 打字机 · 多 heading 编号 · 复制
3. 通过后 merge `feature/s11-story-003a-...` → `sprint/s11-production-ops-go-live`
4. S11-STORY-004 production 仍保持 Pending

## 14. ECS 操作清单（无 secret）

```bash
# 1. Volcengine env（编辑 systemd unit Environment= 段）
sudo systemctl edit qingpian-wechat-editor-staging --full
sudo systemctl daemon-reload
sudo systemctl restart qingpian-wechat-editor-staging

# 2. Nginx SSE location（合并 staging.conf.example 后）
sudo nginx -t && sudo systemctl reload nginx

# 3. 验证
curl -I https://staging.qingpianai.cn/api/health
# 首页生成人工验收
```

## 15. Commit

- Commit hash：`7f3afb3`
