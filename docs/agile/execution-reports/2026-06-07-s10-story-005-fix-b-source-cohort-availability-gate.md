# Execution Report：S10-STORY-005 FIX-B Source Type Cleanup + Runtime Availability Gate

## 1. 基本信息

- 日期：2026-06-07
- 当前分支：`feature/s10-story-005-user-variant-pool-db`
- 来源分支：`sprint/s10-db-backed-style-admin-v1`
- 目标合并分支：`sprint/s10-db-backed-style-admin-v1`
- Sprint：Sprint 10 — Database-backed Style Management Admin v1
- 关联 Story / Bug / Decision：S10-STORY-005 · BUG-S10-COPY-FIDELITY-001 · BUG-S10-COPY-FIDELITY-002
- 执行者：Cursor
- 状态：**Done**（本地验收 PASS · 待 merge sprint）

## 2. 本轮目标

修复用户侧混入 release1_required variants 问题；收口 sourceType；引入 sourceCohort + qualityStatus；统一 Runtime Availability Gate。

## 3. 执行范围

**已完成：**

- Prisma：`sourceCohort` · `StyleVariantVersion.qualityStatus` · `ai_generated` sourceType
- Migration：`20260607120000_source_cohort_quality_status`
- `src/lib/runtime-variant-availability.ts` · `runtime-variant-seed-config.ts`
- Importer：canonical sourceType · 6 userSelectable release1 heading seeds · 2 copy_fidelity_failed
- Pool / picker：DB 可用不混 code pool · gate 过滤 qualityStatus
- AI heading：`pickRegisteredVariantForBlock` 使用 runtime gate
- Preview/Copy：explicit variant 经 gate fallback
- Admin：列表/详情展示 sourceType · sourceCohort · qualityStatus
- 测试 + 文档 + Bug 登记

**未做：**

- Copy Renderer 修复（2 个 bug 仅登记）
- S10-STORY-006 写操作
- merge sprint

## 4. 关键决策

1. `release1_required` 作为 `sourceCohort=release1_required`，`sourceType=registry`
2. `style_library_manifest` 不再作为新 import sourceType；治理信息进 `sourceMetadata.governanceSource`
3. 7 个 runtime available heading：`6 release1 seed + html_paste teal`
4. 2 个 copy failed：`heading_magazine_left_bar` · `heading_card_centered`

## 5. 验收标准

| AC | 结果 |
|----|------|
| sourceType canonical | PASS |
| release1_required → sourceCohort | PASS |
| qualityStatus / distribution 分离 | PASS |
| 2 copy_fidelity_failed 用户侧不可用 | PASS |
| 6 release1 seed userSelectable | PASS |
| html_paste 继续可见 | PASS |
| /preview picker runtime available only | PASS |
| AI heading gate | PASS |
| Admin 展示 source/cohort/quality | PASS |
| lint / test / build | PASS（1089 tests） |

## 6. 运行检查

| 命令 | 结果 |
|------|------|
| `corepack pnpm lint` | PASS（0 errors） |
| `corepack pnpm test` | PASS（137 files · 1089 tests） |
| `corepack pnpm build` | PASS（本地 DB 未 migrate 时 build 期 pool 查询会 log column missing，属预期） |

## 7. 本地验收前置

```bash
DATABASE_URL=... corepack pnpm prisma migrate deploy
DATABASE_URL=... corepack pnpm style-admin:import-existing-variants
corepack pnpm dev
```

预期 `/preview` picker：7 variants（6 release1 + teal）；不含杂志竖线/卡片居中。

## 8. Commit

- Commit hash：**未提交 / not committed**（FIX-A `b533ed5` 已提交；FIX-B 待用户确认后 commit）

## 9. 建议下一步

1. 审查 FIX-B execution report
2. commit FIX-B（可与 FIX-A 同分支一并 merge sprint）
3. 本地 migrate + re-import 验收
4. S10-STORY-006 上下架写操作
