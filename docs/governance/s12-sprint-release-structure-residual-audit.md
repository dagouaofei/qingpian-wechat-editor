# Sprint / Release 文档结构残留审计

> 轻篇公众号排版 · S12-STORY-001 治理结构补充  
> 审计类型：**只读残留排查**（本轮不修改现有规范文件）  
> 基准原则：**DECISION-114** · `product-governance-target-model.md` §9  
> 审计日期：2026-06-29

## 1. 审计目标

在 `docs/s12-story-001-sprint-release-structure-alignment` 分支完成结构对齐后，全面排查仓库内与 Sprint / Release 文档结构有关的表述残留，区分：

- 当前生效规范冲突（A）
- 历史正文（B/C）
- 正确引用（D）
- 需 PO 决策（E）

为 ChatGPT / 用户审查提供可验证证据，**不**在本轮自动修正规范文件。

## 2. 搜索范围

```text
.cursor/rules/
docs/governance/
docs/agile/
docs/product/
README.md
```

覆盖：当前规则、治理文档、全局索引、流程文档、Sprint 12 文档、Decision Log、历史 Sprint 文档、execution reports、README 与产品文档链接。

## 3. 搜索命令

主命令（组合模式，与 TSV 生成一致）：

```bash
rg -n --no-heading \
  'sprint-backlog\.md|release-plan\.md|sprint-plan\.md|Sprint Backlog|Release Backlog|每个 Sprint|每个 Release|所有 Sprint|所有 Release|必须更新|统一维护|唯一事实源|全局索引|独立目录|sprints/sprint-|releases/release-|primaryRelease|supportsReleases|sprintType|Release 目录内包含 Sprint|Sprint 目录嵌套在 Release|releases/.+/sprints/|一个统一 Sprint Backlog 保存全部 Story 详情|一个统一 Release Plan 保存全部 Release 详情' \
  .cursor/rules docs/governance docs/agile docs/product README.md \
  --glob '*.md' --glob '*.mdc'
```

补充主题命令（用于交叉验证）：

```bash
rg -n '必须更新|Story ledger|Release dashboard|当前 Sprint Backlog|作为全部|共用一份|唯一容器' \
  .cursor/rules docs/governance docs/agile README.md --glob '*.md' --glob '*.mdc'

rg -n 'releases/.+/sprints/|嵌套在 Release|Release 目录内包含 Sprint' \
  .cursor/rules docs/governance docs/agile --glob '*.md' --glob '*.mdc'
```

分类脚本：仓库内一次性 Python 分类器（读取 `rg` 输出 → 写入 TSV），规则见 §6。

## 4. 命中统计

| 指标                 | 数量 |
| -------------------- | ---- |
| TSV 总行数（含表头） | 1117 |
| 实质命中行（数据行） | 1116 |
| 涉及文件数           | 181  |
| A 类                 | 1    |
| B 类                 | 50   |
| C 类                 | 355  |
| D 类                 | 701  |
| E 类                 | 9    |

说明：同一物理行若匹配多个搜索主题，TSV 中可出现多行（`matched_text` 不同）；分类以文件路径与行上下文为准。

### 排除规则

- 未排除中文/英文混合的产品与敏捷术语命中。
- 未将 DECISION-114 **反例说明**（如「不是所有 Sprint 共用一份详细 Sprint Backlog」）计为 A 类。
- 未将全局索引文件头 **DECISION-114 角色声明**（前 30 行内）计为 A 类。
- 审计材料自身（`residual-audit` / `residual-matches`）不计入冲突。

## 5. 分类摘要

| 分类 | 含义                 | 数量 | 本轮处理 |
| ---- | -------------------- | ---- | -------- |
| A    | 当前生效规范冲突     | 1    | 只登记   |
| B    | 当前文件中的历史正文 | 50   | 保留     |
| C    | 已关闭历史记录       | 355  | 保留     |
| D    | 正常引用或正确表述   | 701  | 无需修改 |
| E    | 存疑，需 PO 决策     | 9    | 只登记   |

## 6. A 类：当前生效规范冲突清单

| 文件        | 行号 | 原文摘要                                             | 分类 | 判断理由                                                                                              | 建议处理                                                                                                    |
| ----------- | ---: | ---------------------------------------------------- | ---- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `README.md` |   82 | `\| … sprint-backlog.md … \| 当前 Sprint Backlog \|` | A    | 项目入口仍将全局索引文件描述为「当前 Sprint Backlog」，未体现 DECISION-114「全局索引 + 独立目录」语义 | merge 前或后续 docs 任务改为「Sprint 全局索引（`sprint-backlog.md`）」并可选补充 `docs/agile/sprints/` 说明 |

**结论：** 除 README 文档索引表 1 处外，**当前 `.mdc` 规则与已更新的全局索引文件头均已对齐 DECISION-114**。未发现 Cursor 规则仍要求「每个 Sprint 必须更新 sprint-backlog 详细 AC」的残留。

## 7. E 类：存疑项清单

| 文件                                                   | 行号 | 原文摘要                                                                                      | 分类 | 判断理由                                                                                                   | 建议处理                                           |
| ------------------------------------------------------ | ---: | --------------------------------------------------------------------------------------------- | ---- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `docs/governance/s12-current-system-audit.md`          |  103 | Release Backlog 不是独立对象；主要由 release-plan / product-backlog / sprint-backlog 共同承担 | E    | S12 初始审计记录的是**变更前**体系结论；与 DECISION-114 并存，是否追加「已被 DECISION-114 补充」需 PO 确认 | 可选在 §7.1 或缺口节追加前向说明；**非阻塞 merge** |
| `docs/governance/product-governance-migration-plan.md` |  107 | release-plan 与 product-backlog 状态重复 · release-plan 作为状态权威                          | E    | 位于「后续可能废弃」表，与 DECISION-114「release-plan 仅索引」边界需 PO 确认                               | S12-STORY-005/006 或 PO 确认 dashboard vs 索引职责 |
| `docs/governance/product-governance-target-model.md`   |   54 | User Story · 当前文档 `docs/agile/sprint-backlog.md`                                          | E    | 对象表「当前文档」列未区分全局索引 vs `sprints/.../backlog.md` 双轨                                        | S12-STORY-006 模板化时统一对象表                   |
| `docs/governance/product-governance-target-model.md`   |   56 | Release Backlog · 后续新增或升级 release plan                                                 | E    | Release Backlog 落点仍写 release plan，未明确 `releases/release-<id>/backlog.md`                           | S12-STORY-005/006 补充                             |
| `docs/governance/product-governance-target-model.md`   |   57 | Sprint Backlog · `sprint-backlog.md` + Sprint 专项文档                                        | E    | 同上，未显式写独立 Sprint backlog 目录                                                                     | S12-STORY-006 补充                                 |
| `docs/governance/product-governance-target-model.md`   |  222 | 追踪矩阵示例仍引用 sprint-backlog / execution reports                                         | E    | 示例链路未展示独立目录层；属模板完善问题                                                                   | S12-STORY-005 追踪矩阵 Story                       |
| `docs/product/user-story-map.md`                       |  122 | 相关文档 → Release Plan (`release-plan.md`)                                                   | E    | 产品文档链接未标注「全局索引」；是否改为索引 + Release 目录链接需 PO 确认                                  | 后续产品治理 Story 统一链接语义                    |
| `docs/product/user-story-map.md`                       |  124 | 相关文档 → Sprint Plan (`sprint-plan.md`)                                                     | E    | 链接指向历史叙事文件，未指向 `sprints/`                                                                    | 同上                                               |
| `docs/product/user-story-map.md`                       |  125 | 相关文档 → Sprint Backlog (`sprint-backlog.md`)                                               | E    | 链接未区分全局索引 vs 详细 backlog                                                                         | 同上                                               |

## 8. 历史保留项说明

### B 类（50）

主要为 `docs/agile/sprint-backlog.md`、`docs/agile/sprint-plan.md`、`docs/agile/release-plan.md` 中 **DECISION-114 文件头之后** 的历史 Sprint / Release 详细正文，以及根目录 Sprint 专项文档（如 `sprint11-*.md`）中的交叉引用。**保留，不修正。**

### C 类（355）

主要为：

- `docs/agile/execution-reports/` 历史报告（约 300+ 行命中）
- `docs/agile/changelog.md` 历史条目
- `docs/agile/decisions.md` 历史 Decision 正文与索引（DECISION-114 之前）

**保留，不重写。**

## 9. 未发现问题的关键文件（当前规范层）

以下文件在本轮搜索中**仅出现 D 类**（及索引文件合理的 B 类历史正文），未发现 A/E 类：

| 文件                                                    | 说明                                |
| ------------------------------------------------------- | ----------------------------------- |
| `.cursor/rules/agile-rules.mdc`                         | 已改为独立目录 + 全局索引同步       |
| `.cursor/rules/agile-governance.mdc`                    | 参考文档含 DECISION-114 路径        |
| `.cursor/rules/collaboration-rules.mdc`                 | 执行前读全局索引与独立目录          |
| `.cursor/rules/project-rules.mdc`                       | 状态来源含 `sprints/` / `releases/` |
| `docs/agile/chatgpt-cursor-docs-workflow.md`            | 文档索引含 sprints/releases         |
| `docs/agile/git-workflow.md`                            | §8 敏捷文档结构（DECISION-114）     |
| `docs/agile/sprint12-product-governance-r2-planning.md` | 仅 D + 历史 ID 说明（B）            |
| `docs/agile/release-plan.md`                            | 文件头 D + 历史正文 B               |
| `docs/agile/sprint-backlog.md`                          | 文件头 D + 历史正文 B               |
| `docs/agile/sprint-plan.md`                             | 文件头 D + 历史正文 B               |
| `docs/agile/decisions.md`                               | DECISION-114 为 D；其余为 C         |

## 10. DECISION-114 一致性

| 检查项                     | 结果                                                         |
| -------------------------- | ------------------------------------------------------------ |
| 规则要求独立平级目录       | PASS（`.mdc` + git-workflow §8）                             |
| 全局文件仅索引             | PASS（规则 + 三文件头）                                      |
| 禁止 Release 内嵌套 Sprint | PASS（目标模型 §9.1 / git-workflow）                         |
| 元数据字段语义             | PASS（目标模型 §9.4）                                        |
| 历史不批量迁移             | PASS（迁移计划 §4.1 / DECISION-114 §8）                      |
| 跨规范矛盾                 | **1 处 A（README）**；**无 DECISION-114 与 `.mdc` 直接矛盾** |

## 11. 是否建议 merge

**建议：可以 merge**，前提为用户接受以下残留处理方式：

| 项                  | 阻塞 merge？           | 说明                                                                    |
| ------------------- | ---------------------- | ----------------------------------------------------------------------- |
| A-1 README 索引表述 | **否**（建议后续修正） | 仅影响项目入口说明，不影响 DECISION-114 规则执行                        |
| E 类 9 项           | **否**                 | 多为对象表/产品链接/初始审计历史结论，适合 S12-STORY-005/006 或 PO 确认 |
| 历史大文件并存      | **否**                 | 已文档化；执行者须遵守文件头 DECISION-114 说明                          |

## 12. merge 前是否仍有必须修正项

**无必须修正项**（若 PO 要求 README 与入口文档完全一致，可将 README A-1 作为 merge 前可选小修）。

## 13. 机器可读清单

完整命中与分类：

```text
docs/governance/s12-sprint-release-structure-residual-matches.tsv
```

字段：`path` · `line` · `matched_text` · `classification` · `reason` · `recommended_action`

## 14. 审查材料 ZIP

```text
review-package/s12-story-001-sprint-release-structure-review.zip
```

含本分支相对 `sprint/s12-product-governance-r2-planning` 的全部修改文件、本审计材料及 `review-manifest.txt`（**不 commit**）。
