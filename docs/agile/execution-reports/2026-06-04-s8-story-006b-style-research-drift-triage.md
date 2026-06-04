# Execution Report：S8-STORY-006B 结构化样式调研与 Drift 归类

## 1. 基本信息

- 日期：2026-06-04
- 当前分支：`docs/s8-story-006b-style-research-drift-triage`
- 来源分支：`sprint/s8-wechat-safe-css-contract`
- 目标合并分支：`sprint/s8-wechat-safe-css-contract`
- Sprint：Sprint 8 — WeChat-safe CSS Contract
- 关联 Story / Decision：S8-STORY-006B · DECISION-091 · S8-STORY-006（Drift 001–009）
- 执行者：Cursor
- 状态：**Done**（用户确认 2026-06-04 · merge sprint）

## 2. 本轮目标

在 **不修 renderer、不改 Contract v1** 前提下，完成竞品/开源/已发布文章结构化调研，建立 Copy-safe Pattern Library v0.1，并将 9 个 Drift 归入共性类别，为 **S8-STORY-006C** 提供依据。

## 3. 执行范围

**做了：** 3 份新调研/架构文档 · Drift triage · 更新 compatibility-reference / sprint-backlog / sprint8 / changelog / decisions

**未做：** renderer · Contract/Profile/Validator · 新 variant · Paste 虚构 · **006C/007 启动**

## 4. 修改文件

- `docs/research/wechat-editor-compatibility-reference.md`
- `docs/agile/sprint-backlog.md`
- `docs/agile/sprint-plan.md`
- `docs/agile/sprint8-wechat-safe-css-contract.md`
- `docs/agile/changelog.md`
- `docs/agile/decisions.md`
- `docs/agile/paste-qa/drift/README.md`

## 5. 新增文件

- `docs/research/wechat-style-structured-research.md`
- `docs/research/wechat-published-article-style-harvest.md`
- `docs/architecture/wechat-copy-safe-pattern-library.md`
- `docs/agile/paste-qa/drift/s8-drift-triage-2026-06-04.md`
- `docs/agile/execution-reports/2026-06-04-s8-story-006b-style-research-drift-triage.md`

## 6. 阅读但未修改的关键文件

- `docs/agile/paste-qa/wechat-fidelity-matrix.md`
- `docs/agile/paste-qa/wechat-paste-qa-session-2026-06-04-s8-story-006.md`
- `docs/agile/paste-qa/drift/DRIFT-S8-20260604-001.md` ~ `009.md`
- `docs/architecture/wechat-safe-html-css-contract.md`
- `docs/architecture/copy-drift-diagnostics.md`

## 7. 调研摘要

| 对象 | 结论要点 |
|------|----------|
| 135 | Clipboard 接近轻篇；卡片背景常写 wrapper → 与 Drift A 一致；宜 **p 承载** |
| 壹伴 | 插件/同步为主 · **不进 R1 主链路** |
| 秀米 | 深嵌套/SVG · Copy 适合度中低 |
| mdnice / Doocs | inline-first + CSS 子集文档 · **可借鉴分级思路** |
| 已发布文 15 样本 | 稳定：p 上背景/左线/细 border-bottom；不稳定：多列标题、空 section 壳 |

## 8. 已发布文章采集摘要

- **15 条** `HARVEST-001`~`015`：科普 / 商业 / 个人 / 企业 / 知识总结五类
- 跨样本共识：**内层承载** 背景与 `border-left`；标题避免多列 DOM

## 9. Pattern Library 摘要（v0.1）

8 个 pattern：`copy-safe-card` · `copy-safe-left-border` · `copy-safe-title-divider` · `copy-safe-highlight-band` · `copy-safe-cta-button` · `copy-safe-info-box` · `copy-safe-divider` · `copy-safe-inline-emphasis`

核心原则：**样式写在 `p`/标题节点** · ≤1 层 `section` · Yellow 有 fallback · 禁 class/SVG/flex 标题布局

## 10. Drift 归类摘要

| 类 | Drift / Matrix | 主 Story |
|----|----------------|----------|
| A 卡片背景/边框 | 004–007 (+003 观察) | **006C** P0 |
| B 左竖线 | 009 · 007 部分 | **006C** P0 |
| C 标题线/结构 | 001 · 002 · 008 | **006C** P0 |
| D Validator≠Paste | HEAD-002 | **007** |
| E 口径 | 003 OBSERVATION | 产品澄清 |

## 11. 建议进入 S8-STORY-006C 的共性修复项

1. 卡片/软底/信息框：样式下沉 `p`（`copy-safe-card` / `copy-safe-info-box`）
2. 左竖线与文字同节点（`copy-safe-left-border`）
3. 标题左条/下划线/横线卡：单节点 + 细 border（`copy-safe-title-divider`）；TITLE-002 消 Red DOM
4. **排除：** DRIFT-003 待产品确认；HEAD-002 不以放宽 Contract 处理

## 12. 建议进入 S8-STORY-007 的问题

- **S8M-HEAD-002** validator false positive / 过严 Red 规则
- Preview vs Copy 是否展示已剥外层样式（潜在误判）

## 13. 建议进入 S9 的问题

- 主题化视觉升级、复杂杂志风标题、SVG/图片装饰、非 R1 必要丰富度

## 14. 未完成事项

- 用户确认 006B Done · merge sprint
- 006C / 006D / 007 未启动（按指令）
- DRIFT-003 产品口径
- Matrix 16 行 UNTESTED 粘贴

## 15. 风险

- 调研为文献+PO 交叉抽象，**非**本轮竞品/文章全量实机 HTML diff
- 006C 若仅改 DOM 不改 Contract，须 006D 验证是否引入新 Validator 告警

## 16. 是否建议 merge story → sprint

**已 merge** → `sprint/s8-wechat-safe-css-contract`（用户确认 2026-06-04 · 经 FIX 工作分支链）。

## 17. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `npm run test` | PASS | 94 files · 845 tests |
| `npm run lint` | PASS | 0 errors · 12 warnings（既有） |
| `npm run build` | PASS | Next.js production build |

（环境无 `pnpm` CLI，使用 `npm run`。）

## 18. Commit

- Commit message：`docs: add wechat style research and drift triage`
- Commit hash：`d726017`
- **未 merge** sprint / release / main
