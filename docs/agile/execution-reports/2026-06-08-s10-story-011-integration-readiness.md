# Execution Report：S10-STORY-011 Integration Audit / Merge Readiness

## 1. 基本信息

- **日期：** 2026-06-08
- **当前分支：** `feature/s10-story-011-integration-readiness`
- **来源分支：** `sprint/s10-db-backed-style-admin-v1` @ `2ff90b1`
- **目标合并分支：** `sprint/s10-db-backed-style-admin-v1`（**本轮未 merge · 待用户确认**）
- **Sprint：** Sprint 10 — Database-backed Style Admin v1
- **关联 Story / Bug / Decision：** S10-STORY-011 · S10-CHORE-011B · S10-STORY-011A · DECISION-109
- **执行者：** Cursor
- **状态：** In Review（integration 完成 · 待用户人工验收 · 待 merge sprint 确认）

## 2. 本轮目标

将今日分散在多个 feature 分支的 S10-STORY-011 修复统一到一个 integration 分支，修复已知失败测试，跑完整 lint / test / build，输出 merge readiness report。**不新增功能 · 不散修单个 variant · 不 merge sprint。**

## 3. 执行范围

**做了：**

- Git 状态审计 · commit inventory
- 自 sprint 创建 `feature/s10-story-011-integration-readiness`
- Fast-forward merge `feature/s10-story-011-fidelity-border-theme-all-sides`（已包含其余三个候选分支全部 commits）
- 修复 `fidelity-encoder.test.ts` · `runtime-variant-dsl-pool.test.ts`
- 修复 build/TS 错误（decoder theme tokens · harvest-form · candidate-dsl-render 等）
- 定向测试 + 全量 lint / test / build
- 更新 sprint-backlog · changelog · architecture · sprint10 摘要
- 记录后续 S10-STORY-012~014（仅 backlog · 不开发）

**没做：**

- merge sprint / release / main
- 关闭 Sprint 10 或 S10-STORY-011
- 新增 variant · 继续单个样式散修
- Compatibility Spec 重写 · schema 全量清理 · 生产 RDS

## 4. Git 状态审计（集成前）

| 项 | 值 |
|----|-----|
| 集成前工作区 | 已在 `feature/s10-story-011-fidelity-border-theme-all-sides` 上 clean（仅 untracked debug log / `.pnpm-store`） |
| Sprint 基线 | `sprint/s10-db-backed-style-admin-v1` @ `2ff90b1` |
| 候选分支领先 sprint | promote 16 · theme-tokens 25 · compat-off 27 · border-all-sides 31 |

**分支包含关系：** `fidelity-border-theme-all-sides` 已包含 promote / theme-tokens / compat-off 全部 commits → **单次 FF merge** 即可，无需 4 次顺序 merge。

## 5. Merge / Commit Inventory

### 5.1 合入策略

| 顺序 | 分支 | 相对 sprint commits | 合入方式 | 冲突 |
|------|------|---------------------|----------|------|
| 1 | `feature/s10-story-011-promote-user-selectable-final` | 16 | 已含于 border 分支 | — |
| 2 | `feature/s10-story-011-html-paste-fidelity-theme-tokens` | 25 | 已含于 border 分支 | — |
| 3 | `feature/s10-wechat-compatibility-global-off-default` | 27 | 已含于 border 分支 | — |
| 4 | `feature/s10-story-011-fidelity-border-theme-all-sides` | 31 | **FF merge** | **无** |

### 5.2 合入 commits（sprint..`28c4cfa` · 31 条）

| Hash | Message | 所属分支线 | 对应 report / 主题 |
|------|---------|------------|-------------------|
| `882259b` | checkpoint: promote and dsl fidelity fixes | promote | promote gate |
| `c669eb0` | checkpoint: clean fidelity encoder | promote | encoder |
| `4d6ba79` | preserve fidelity tree and semantic slot bindings | promote | semantic bindings |
| `65ce68a` | docs: fidelity semantic slot binding report | promote | docs |
| `6493be6` | substitute heading title via semantic binding | promote | title substitution |
| `3eb6138` | render candidate inspection through fidelity tree | promote | inspection refresh |
| `85ee305` | render preview from fidelity dsl tree | promote | user preview |
| `6d388f1` | docs: preview fidelity tree fix | promote | docs |
| `1a32f13` | preresolve fidelity DSL from sourceHtml | promote | FIX-C refresh |
| `6178cb8` | docs: FIX-C refresh report | promote | docs |
| `58e58cb` | preserve decorative bar height in copy | theme/copy | copy height |
| `6c8870d` | docs: red bar copy height | theme/copy | docs |
| `7d4055c` | increment heading number by chapter ordinal | theme | background number |
| `2e5e3b4` | docs: number ordinal | theme | docs |
| `427d3b7` | substitute ordinal into eyebrow | theme | CHAPTER eyebrow |
| `e6bbb09` | docs: eyebrow ordinal | theme | docs |
| `ba8816b` | apply theme palette to fidelity tree decode | theme-tokens | html_paste theme |
| `a34ee71` | docs: theme tokens fix | theme-tokens | docs |
| `55c12a7` | docs: theme tokens accepted pending merge | theme-tokens | docs |
| `a7f272f` | theme-remap e21 border-bottom + copy parity | theme-tokens | border-bottom |
| `571a139` | docs: border-bottom copy parity | theme-tokens | docs |
| `41c1a8e` | circle badge bg + split border for copy | theme-tokens | circle badge |
| `4f32c46` | docs: badge border copy | theme-tokens | docs |
| `603f8a7` | infer circular badge number slot | theme-tokens | circle ordinal |
| `deeb546` | docs: circle number ordinal | theme-tokens | docs |
| `006c7c2` | default global WeChat compatibility off | compat-off | CHORE-011B |
| `e1a026e` | preserve inline number accent color | border-all-sides | number color |
| `ce91b1c` | remap decorative borders all sides | border-all-sides | four-side border |
| `a31ad82` | docs: border theme all sides | border-all-sides | docs |
| `2266b5d` | infer heading title/number bindings (aa555cbf) | border-all-sides | binding fix |
| `28c4cfa` | docs: aa555cbf binding fix | border-all-sides | docs |

### 5.3 Integration 收口 commit（本轮新增 · 见下方 commit hash）

- 测试：`fidelity-encoder.test.ts` · `runtime-variant-dsl-pool.test.ts`
- TS/build：decoder · harvest-form · candidate-dsl-render · resolve-fidelity-variant-dsl
- 文档：本 report · changelog · sprint-backlog · architecture

## 6. 冲突解决

**无 merge 冲突。** 候选分支为线性包含关系，单次 fast-forward 完成。

## 7. 已知失败测试修复

### 7.1 `fidelity-encoder.test.ts` — ordinal 期望

- **现象：** 期望 HTML 含 `03`，实际 `01`
- **根因：** 测试走 decoder/runtime 路径，runtime 对 chapter ordinal 做 01/02/03 替换
- **处理：** 期望改为 `01` · `CHAPTER 01` · `not.toContain("03")`（decoder/runtime 测试；raw encode 仍保留 source `03` 的独立测试若有）

### 7.2 `runtime-variant-dsl-pool.test.ts` — source code_fallback

- **现象：** DB mock 场景下 `pool.source === code_fallback`
- **根因：** mock row 缺 `sources: []` → `pickInspectionHtmlSource(undefined)` 抛错 → catch → fallback
- **处理：** mock 行补 `sources: []`；**DB 可用时必须 database**

## 8. 必须保留的行为（集成后）

| 能力 | 状态 |
|------|------|
| User preview / copy fidelity refresh（同源 · server pool 预解析 · 无 client encode） | 代码已合入 · **待人工验收** |
| 动态 heading 编号（background / CHAPTER eyebrow / circle badge 01/02/03） | 代码 + 定向测试 PASS |
| html_paste theme remap（四边 border · accent · badge · admin_inspection 保留 source 色） | 代码 + 定向测试 PASS |
| Copy 一致性（bar height · split border-bottom · text-stroke · 非全宽短横线） | 代码已合入 · **待人工验收** |
| `QINGPIAN_WECHAT_COMPATIBILITY_MODE` 默认 off · sanitize 常开 | 代码 + `global-compatibility-mode.test.ts` PASS |

## 9. 运行检查

### 9.1 定向测试

| 命令 | 结果 |
|------|------|
| `tests/lib/dsl-runtime-fidelity-heading-substitution.test.ts` | PASS |
| `tests/lib/html-paste-fidelity-theme-tokens.test.ts` | PASS |
| `tests/lib/dsl-tree-html-preview.test.ts` | PASS |
| `tests/server/style-admin/inspection/candidate-inspection-background-number-heading.test.ts` | PASS |
| `tests/lib/dsl-runtime-single-track.test.ts` | PASS |
| `tests/lib/resolve-runtime-pool-definition.test.ts` | PASS |
| `tests/core/wechat-compatibility/global-compatibility-mode.test.ts` | PASS |

### 9.2 全量检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `npm run lint` | **PASS** | 31 条 pre-existing warnings |
| `npm run test` | **PASS** | **1293 / 1293** |
| `npm run build` | **PASS** | Next.js production build OK |

## 10. 人工验收建议（Cursor 不代做）

### 10.1 Dynamic number variants

至少 3 个 html_paste heading variant（background number · CHAPTER eyebrow · circle badge），多 heading 时确认 `01/02/03` · `CHAPTER 01/02/03`。

### 10.2 Theme switching

切换 `businessBlue` / `creamOrange`，确认 accent bar · 四边 border · circle badge 随 theme 变化。

### 10.3 Copy parity

preview 短横线 copy 也有 · 保留必要高度 · 短横线不全宽 · 保留 `-webkit-text-stroke`。

## 11. 修改文件

- `src/app/admin/(protected)/style-library/harvest/harvest-form.tsx`
- `src/core/dsl/decoder/decode-variant-dsl.ts`
- `src/core/dsl/decoder/fidelity-tree-substitution.ts`
- `src/core/dsl/decoder/fidelity-tree-theme-tokens.ts`
- `src/core/dsl/decoder/render-style.ts`
- `src/lib/dsl-runtime/resolve-fidelity-variant-dsl.ts`
- `src/server/style-admin/inspection/candidate-dsl-render.ts`
- `tests/core/dsl/encoder/fidelity-encoder.test.ts`
- `tests/server/style-admin/runtime/runtime-variant-dsl-pool.test.ts`
- `docs/agile/sprint-backlog.md`
- `docs/agile/sprint-plan.md`
- `docs/agile/sprint10-database-backed-style-admin-v1.md`
- `docs/agile/changelog.md`
- `docs/architecture/article-variant-dsl-runtime.md`
- `docs/architecture/wechat-compatibility-known-debt.md`

## 12. 新增文件

- `docs/agile/execution-reports/2026-06-08-s10-story-011-integration-readiness.md`（本文件）

## 13. 后续 Story（仅记录 · 本轮不开发）

| Story | 标题 |
|-------|------|
| S10-STORY-012 | WeChat Compatibility Spec Recalibration |
| S10-STORY-013 | DSL Runtime Schema Cleanup |
| S10-STORY-014 | S10 Architecture Audit / Closeout |

## 14. 已知剩余风险

1. **S10-STORY-011 仍为 In Review** — 自动化全绿 ≠ 用户 E2E 验收通过
2. **Compatibility report/enforce** — 默认 off，Release 1 前须 S10-STORY-012 专项收口
3. **Vitest setup** 可能对 validator 快照仍 enforce — 与 runtime off 默认并存，文档已说明
4. **多 feature 分支历史** — integration 已 FF 统一，merge sprint 前建议删除或归档旧 011 工作分支避免混淆
5. **生产 RDS** — 本轮未连接；DB path 行为基于 mock + 本地验收

## 15. Merge Readiness 结论

| 项 | 结论 |
|----|------|
| Integration 分支 | `feature/s10-story-011-integration-readiness` |
| 当前 HEAD（merge 后） | `0b38aa5`（`28c4cfa` FF merge + 收口 commit） |
| git status | clean（排除 untracked debug log / `.pnpm-store`） |
| 自动化检查 | lint / test / build 全 PASS |
| 是否建议提交用户人工验收 | **是** — 011 功能已统一，自动化门禁通过 |
| 是否建议 merge sprint | **有条件建议** — 用户人工验收 PASS 后 FF merge `sprint/s10-db-backed-style-admin-v1`；**本轮未执行 merge** |

## 16. commit hash

- Merge 基线 HEAD：`28c4cfa`
- Integration 收口 commit：`0b38aa5` — chore: S10-STORY-011 integration readiness — tests, build, docs
