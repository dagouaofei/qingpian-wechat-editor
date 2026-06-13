# Execution Report：S11-STORY-003B Gate B — Legacy Path Removal（Closed）

## 1. 基本信息

- 日期：2026-06-11（staging 验收 · Story **Done** · merge sprint）
- 当前分支（closeout）：`refactor/s11-story-003b-legacy-path-removal` @ `d4665ed`
- 来源分支：`sprint/s11-production-ops-go-live` @ `381e146`
- 目标合并分支：`sprint/s11-production-ops-go-live`（`--no-ff` merge · 本轮）
- Sprint：Sprint 11 · **In Progress**（未关闭）
- Story：**S11-STORY-003B Done** · S11-STORY-004 **Pending**
- **production：未启动** · **main：未 merge**

## 2. Staging 部署与验收

| 项 | 值 |
|----|-----|
| 部署分支 | `refactor/s11-story-003b-legacy-path-removal` |
| 部署 commit | **`d4665ed`**（含 Gate B 代码 + docs） |
| 验收日期 | 2026-06-11 |
| 结果 | **PASS**（用户人工回归） |

**验收摘要：**

- `/api/health`：`ok:true`、`database:"ok"`
- Admin `userSelectable=true + heading` 与用户侧 picker 一致
- 用户侧仅额外「跟随生成结果」· 无重复静态 fallback
- `userSelectable=false` 的 teal variant 不显示 · d26 正常显示
- d26 编号按章节递增 · 编号颜色跟随主题
- Lifecycle 筛选无 `User Selectable` · Hide/Restore 正常
- SSE 打字机正常 · Admin 登录/刷新/Logout 正常
- Preview/Copy 无本轮相关回归

## 3. Gate B P0 完成状态

| LP | 状态 |
|----|------|
| LP-001～007 | **已删除/隔离** |
| LP-009、LP-010 | **已删除/隔离** |
| LP-008 | **P1 · 未处理** |
| P1/P2/P3（LP-101+ 等） | **inventory backlog · 未批量删除** |

## 4. 全量测试失败基线对比

对比基线：`sprint/s11-production-ops-go-live` @ **`381e146`** vs `refactor/s11-story-003b-legacy-path-removal` @ **`d4665ed`**

| 分支 | 结果 | 说明 |
|------|------|------|
| sprint @ 381e146 | **1323/1334 PASS · 11 failures** | 无 architecture guards 测试文件 |
| 003B @ d4665ed | **1340/1348 PASS · 8 failures** | +14 tests（含 architecture guards） |

### 两边均失败（既有失败 · 可 merge）

1. `tests/app/admin/style-library/style-library-admin-page.test.tsx` › renders detail shell with governance placeholders
2. `tests/core/wechat-compat/wechat-paste-qa-pack-006d.test.ts` › matches committed 006D QA pack markdown
3. `tests/core/wechat-compat/wechat-paste-qa-pack.test.ts` › matches committed QA pack markdown
4. `tests/lib/dsl-tree-html-preview.test.ts` › does not route article title through slots.title when semantic binding exists
5. `tests/server/style-admin/import/collect-existing-style-variants.test.ts` › keeps userSelectable independent from defaultEligible
6. `tests/server/style-admin/import/collect-existing-style-variants.test.ts` › marks release1_required registry variants with seed-based userSelectable only
7. `tests/server/style-admin/import/import-existing-style-variants.test.ts` › builds report summary with collected counts
8. `tests/server/style-admin/import/import-existing-style-variants.test.ts` › reports release1_required lifecycle separately from default_eligible

### 仅 sprint 失败 · 003B 已修复（非回归）

1. `tests/core/style-library/sprint9-e2e-closeout-audit-v2.test.ts` › passes preview/copy parity…
2. `tests/lib/dsl-runtime-single-track.test.ts` › decodes all userSelectable heading variants…
3. `tests/lib/user-selectable-preview-picker-007c.test.ts` › renders preview and copy when user manually selects user_selectable heading

### 003B 新增失败

**无** — merge 前无需额外修复。

## 5. 检查命令（closeout 前 · 003B 分支）

| 命令 | 结果 |
|------|------|
| `corepack pnpm lint` | PASS |
| `corepack pnpm build` | PASS |
| `vitest tests/architecture/legacy-path-guards.test.ts` | PASS（12） |
| Gate B targeted tests | PASS |

## 6. commit hash 链

```
381e146  sprint · 003A closeout
9fec9c3  Gate A Approved
b55c9b7  Gate B batch 1
48c80d0  Gate B batch 2
be8c736  Gate B architecture guards
d4665ed  Gate B execution report
（本轮）  docs closeout + merge sprint --no-ff
```

## 7. 明确未执行

- production 启动
- main merge
- Sprint 11 / Release 1 关闭
- LP-008 删除
- P1/P2/P3 批量删除

## 8. 剩余债务摘要（P1/P2/P3）

见 [`legacy-parallel-path-inventory.md`](../../architecture/legacy-parallel-path-inventory.md)：

- **P1：** LP-008（SSE registry vs DSL render 双轨）· LP-101～108 等
- **P2/P3：** 文档登记的 backlog 项 · 不批量删除

## 9. merge sprint 后检查

（merge 后填写 lint/build/architecture tests · push 结果 · sprint HEAD）
