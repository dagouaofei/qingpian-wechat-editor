# Execution Report：S10-STORY-009 HTML Harvest → Candidate Variant v1

## 1. 基本信息

- 日期：2026-06-07
- 当前分支：`sprint/s10-db-backed-style-admin-v1`（merge 后）
- 来源分支：`feature/s10-story-009-html-harvest-candidate`
- 目标合并分支：`sprint/s10-db-backed-style-admin-v1`（**已 merge** @ `147c2e7`）
- Sprint：Sprint 10 — Database-backed Style Admin v1
- 关联 Story / Bug / Decision：S10-STORY-009 · S10-STORY-002~008（前置）
- 执行者：Cursor
- 状态：**Done**（用户审查通过 · 2026-06-07）

## 2. 本轮目标

建立正式后台 HTML 粘贴采集入口：运营粘贴 HTML → sanitize → 自动/手动 blockType → 生成 candidate variant draft → 写入 DB → 在 `/admin/style-library` 可见；不进入用户侧 Runtime Gate。

## 3. 执行范围

**做了：**

- `/admin/style-library/harvest` 页面（admin login 保护）
- 列表页 **Harvest from HTML** 入口
- `src/server/style-admin/harvest/` 模块（sanitize · detect · extract · create）
- `create_html_harvest_candidate` audit + lifecycle event
- 幂等 runtimeVariantId（duplicate HTML + blockType 复用）
- 测试：sanitize · detection · builder · duplicate · auth · user pool 排除
- 文档同步

**未做（按范围）：**

- Preview / Copy / Validator / Evidence（S10-STORY-010）
- promote user-selectable（S10-STORY-011）
- OSS 上传 · 批量 URL 抓取 · 阿里云真实部署
- merge sprint / release / main

## 4. 修改文件

- `src/server/style-admin/actions/index.ts`
- `src/server/style-admin/actions/html-harvest-candidate.ts`（新增）
- `src/server/style-admin/harvest/*`（新增模块）
- `src/app/admin/(protected)/style-library/harvest/*`（新增）
- `src/app/admin/(protected)/style-library/style-library-admin-shell.tsx`
- `src/app/admin/(protected)/style-library/style-library-admin-view-model.ts`
- `docs/architecture/style-management-admin-v1.md`
- `docs/agile/sprint10-database-backed-style-admin-v1.md`
- `docs/agile/sprint-backlog.md`
- `docs/agile/sprint-plan.md`
- `docs/agile/changelog.md`
- `tests/app/admin/style-library/style-library-admin-view-model.test.ts`

## 5. 新增文件

- `src/server/style-admin/harvest/html-harvest-types.ts`
- `src/server/style-admin/harvest/sanitize-harvest-html.ts`
- `src/server/style-admin/harvest/detect-html-block-type.ts`
- `src/server/style-admin/harvest/normalize-html-for-hash.ts`
- `src/server/style-admin/harvest/extract-text-from-html.ts`
- `src/server/style-admin/harvest/extract-heading-candidate.ts`
- `src/server/style-admin/harvest/extract-info-card-candidate.ts`
- `src/server/style-admin/harvest/build-candidate-variant.ts`
- `src/server/style-admin/harvest/create-html-harvest-candidate.ts`
- `src/server/style-admin/harvest/index.ts`
- `src/app/admin/(protected)/style-library/harvest/page.tsx`
- `src/app/admin/(protected)/style-library/harvest/actions.ts`
- `src/app/admin/(protected)/style-library/harvest/harvest-form.tsx`
- `tests/server/style-admin/harvest/*.test.ts`
- `tests/server/style-admin/actions/html-harvest-candidate.test.ts`

## 6. 阅读但未修改的关键文件

- `src/server/style-admin/repositories/style-variant-repository.ts`
- `src/server/style-admin/import/style-variant-import-writer.ts`
- `src/core/style-library/html-style-extractor.ts`
- `src/core/style-library/html-candidate-proposal.ts`
- `src/server/style-admin/mappers.ts`
- `prisma/schema.prisma`

## 7. 关键变更说明

- HTML harvest 使用独立 server 模块，DB 写入仿 import writer 事务：variant + version + distribution + source + lifecycle + audit。
- `sourceType=html_paste`，`sourceCohort=s10_html_harvest_v1`，`qualityStatus=not_checked`，distribution 全 false，确保 Runtime Availability Gate 不暴露新 candidate。
- `runtimeVariantId` 基于 normalized HTML + blockType 的 8 位 hash，重复粘贴幂等返回 `reused`。
- Admin 页面不执行 HTML；sanitize 移除 script 与事件属性；详情页标注 S10-STORY-010/011 后续能力。

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| AC-1 `/admin/style-library/harvest` + admin 保护 | PASS | `(protected)` layout + `requireStyleAdmin` on create |
| AC-2 heading / info_card 创建 | PASS | 单元测试 + builder 覆盖 |
| AC-3 blockType 自动识别 + 人工修正 | PASS | detect + manual override when unknown |
| AC-4 DB 写入 + source 字段 | PASS | html_paste · s10_html_harvest_v1 · rawHtml |
| AC-5 candidate 不进入 user pool | PASS | `isEligibleForUserSelectablePool` 测试 |
| AC-6 duplicate 幂等 | PASS | reused existing candidate |
| AC-7 audit / lifecycle | PASS | `create_html_harvest_candidate` + lifecycle event |
| AC-8 lint / test / build | PASS | 见 §9 |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `corepack pnpm test` | PASS | 1141 tests（含 16 harvest 相关） |
| `corepack pnpm lint` | PASS | 0 errors（既有 warnings 未新增 error） |
| `corepack pnpm build` | PASS | `/admin/style-library/harvest` 出现在 route 表 |

## 10. 本地手动验收路径

**前置：**

```bash
export DATABASE_URL="postgresql://qingpian:qingpian_local_dev@localhost:54329/qingpian_style_admin?schema=public"
corepack pnpm prisma migrate deploy
corepack pnpm style-admin:import-existing-variants
corepack pnpm dev
```

**访问：** `http://localhost:3000/admin/style-library/harvest`（须先 `/admin/login`）

**heading 样例：**

```html
<section style="padding: 8px 0; border-left: 4px solid #1677ff;">
  <span style="font-size: 18px; font-weight: 700; color: #111;">这是一个测试小标题</span>
</section>
```

**info_card 样例：**

```html
<section style="padding: 14px; background: #f7f8fa; border: 1px solid #e5e7eb; border-radius: 8px;">
  <strong style="display:block; margin-bottom:8px;">核心提示</strong>
  <p style="margin:0;">这里是一段信息卡片正文，用于测试 info_card candidate。</p>
</section>
```

**预期：** 自动识别 blockType · 创建 candidate · 跳转 detail · sourceType=html_paste · sourceCohort=s10_html_harvest_v1 · qualityStatus=not_checked · userSelectable=false · `/preview` picker 不显示该 candidate。

**说明：** 本轮未在 Cursor 环境执行 DB 联调 E2E（依赖本地 PostgreSQL）；单元测试覆盖核心边界。

## 11. 未完成事项

- 本地 DB 联调 E2E（需用户环境 PostgreSQL · 非阻塞 merge）
- S10-STORY-010 Preview / Copy / Validator / Evidence
- S10-STORY-011 promote

## 12. 风险与阻塞

- blockType 启发式识别可能对复杂 HTML 误判为 `unknown`，需运营手动选择（符合 v1 设计）。
- candidate definition 为保守映射，视觉还原度有限；完整 Preview/Copy 验证在 S10-STORY-010。

## 13. 需要用户 / ChatGPT 审查的问题

- `styleFamily=htmlPaste` 是否与既有 `htmlPasteCandidate` / `harvestCandidate` 命名需统一？（可留 S10-STORY-010 前决策）
- 本地 DB E2E 验收结果是否 PASS？（建议用户补跑）

## 14. 建议下一步

1. 启动 **S10-STORY-010** Candidate Preview / Copy / Validator / Evidence
2. 可选：用户本地 E2E 验收 heading + info_card 样例
3. S10-STORY-011 promote 在 010 之后

## 15. Commit

- Feature commit：`147c2e7` — `feat(s10): add HTML harvest candidate workflow for admin style library (STORY-009)`
- Docs commit：`5f350fd` — `docs(s10): mark S10-STORY-009 Done after merge to sprint`
- Merge：`feature/s10-story-009-html-harvest-candidate` → `sprint/s10-db-backed-style-admin-v1` fast-forward @ `147c2e7`
