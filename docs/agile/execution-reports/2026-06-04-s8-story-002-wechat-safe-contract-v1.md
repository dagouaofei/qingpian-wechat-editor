# Execution Report：S8-STORY-002 WeChat-safe Contract v1 定稿

## 1. 基本信息

- 日期：2026-06-04
- 当前分支：`docs/s8-story-002-wechat-safe-contract-doc`
- 来源分支：`sprint/s8-wechat-safe-css-contract`
- 目标合并分支：`sprint/s8-wechat-safe-css-contract`
- Sprint：S8 — WeChat-safe CSS Contract & Fidelity Test System
- 关联 Story / Decision：S8-STORY-002 · DECISION-089（待确认）
- 执行者：Cursor
- 状态：**Done**（2026-06-04 · DECISION-089 已确认 · 已 merge sprint）

## 2. 本轮目标

将 `wechat-safe-html-css-contract.md` 从草案定为 **`wechat-safe-contract-v1`**，作为 Profile / Validator / Matrix / Paste QA 的统一约束依据。

## 3. 执行范围

**做了：**

- Contract v1 全文（HTML/CSS 分级、DOM、inline、waiver、fallback、修正流程、后续 Story 关系）
- `copy-drift-diagnostics.md` 术语与 Contract §9 对齐
- `wechat-editor-compatibility-reference.md` 引用 v1
- `wechat-copy-style-rules.md` 顶部引用段（§1.3 冲突说明在 Contract §1.3）
- agile：`sprint-backlog`、`changelog`、`decisions`（DECISION-089 待确认）、`sprint-plan`、`product-backlog`、`sprint8` 索引

**没做：**

- `src/**`、tests、fixture、Matrix 文件、Validator、Profile 代码
- 详细竞品调研 §4
- merge sprint / commit（待用户）
- S8-STORY-003 启动

## 4. 修改文件

- `docs/architecture/wechat-safe-html-css-contract.md`（重写为 v1）
- `docs/architecture/copy-drift-diagnostics.md`
- `docs/architecture/wechat-copy-style-rules.md`（引用段）
- `docs/research/wechat-editor-compatibility-reference.md`
- `docs/agile/sprint-backlog.md`
- `docs/agile/changelog.md`
- `docs/agile/decisions.md`
- `docs/agile/sprint-plan.md`
- `docs/agile/product-backlog.md`
- `docs/agile/sprint8-wechat-safe-css-contract.md`

## 5. 新增文件

- `docs/agile/execution-reports/2026-06-04-s8-story-002-wechat-safe-contract-v1.md`

## 6. Contract v1 定稿摘要

- **版本 ID：** `wechat-safe-contract-v1`
- **三分法：** HTML 标签 + CSS 属性（含 `display` 等值级约束）
- **Yellow：** 强制 waiver/evidence 表；S7 `heading_highlight_marker` 为 gradient/box-decoration-break 种子
- **Red：** flex/grid/position/transform、`var()`、class 依赖、debug class 等
- **修正闭环：** Contract §9 ↔ Drift ↔ Matrix ↔ Decision

## 7. Green / Yellow / Red 关键变化（相对 draft-0.1）

| 项 | draft-0.1 | Contract v1 |
|----|-----------|---------------|
| `a` | Green | **Yellow**（href 协议约束） |
| `border-radius` | Yellow 表内 | 明确 **非 Green**；进 preset 须 evidence |
| `box-decoration-break` | 未单列 | **Yellow**（不得 Green） |
| `display` | 属性级 | **值级** Green 仅 block/inline/inline-block |
| `width` / `box-sizing` | 未列 | **Green**（受限值） |
| `table` 标签 | 未列 | **Yellow**（仅特定 variant） |
| `class` on Copy HTML | 模糊 | **禁止**（§6） |
| complex flex | Red 简述 | **操作化定义** §4.3 |
| waiver 机制 | 一句 | **§7 完整字段表 + YAML 示例** |
| 历史 profile | 未写 | §1.3 冲突以 v1 为准 |

## 8. 与后续 Story 的关系

| Story | 依赖 v1 |
|-------|---------|
| 003 | Profile 代码化 Green/Yellow/Red + waivers |
| 004 | Validator fail/warn/pass |
| 005 | Matrix 反向修正分级 |
| 006 | Drift + 实机 QA |
| 007 | Preview 应用 Copy-safe HTML |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| npm run lint | PASS | 0 errors |
| npm run test | PASS | 814 tests |
| npm run build | PASS | Next.js build OK |

## 10. 未完成事项

- DECISION-089 用户确认（当前「待确认」）
- S8-STORY-005 Matrix 文件
- Profile / Validator 实现（003/004）
- 竞品调研 §4 详表

## 11. 风险

1. **代码与 Contract 漂移：** 现有 Copy 输出可能含 Contract v1 标为 Yellow/Red 的项（如历史 profile 允许 `border-radius`）— **003** 须做差异扫描。
2. **DECISION-089 待确认：** merge 前建议用户一并确认，避免 Profile 实现依据争议。

## 12. 用户确认（2026-06-04）

1. ✅ `border-radius` 全局 Yellow
2. ✅ Clipboard 禁止 class；Preview/dev/test 不限；Copy payload 须剥离
3. ✅ `heading_highlight_marker` gradient waiver 种子；**不得外推**其它 variant
4. ✅ DECISION-089 已确认

## 13. 建议下一步

启动 **S8-STORY-003**（`feature/s8-story-003-compatibility-profile`）

## 14. Merge

- 已 merge `docs/s8-story-002-wechat-safe-contract-doc` → `sprint/s8-wechat-safe-css-contract`

## 15. Commit

- Story commit：见 sprint 分支 log（`docs(s8): Contract v1 and DECISION-089`）
