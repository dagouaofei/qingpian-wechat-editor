# Sprint / Release 文档结构残留审计

> 轻篇公众号排版 · S12-STORY-001 治理结构补充
>
> 审计类型：**残留排查**（第一轮只读登记；第二轮 merge 前最小修正后复检）
>
> 基准原则：**DECISION-114** · `product-governance-target-model.md` §9
>
> 审计日期：2026-06-29（第二轮复检同 day）

## 1. 审计目标

在 `docs/s12-story-001-sprint-release-structure-alignment` 分支完成结构对齐后，全面排查仓库内与 Sprint / Release 文档结构有关的表述残留，区分：

- 当前生效规范冲突（A）
- 历史正文（B/C）
- 正确引用（D）
- 需 PO 决策（E）

为 ChatGPT / 用户审查提供可验证证据。第一轮仅登记 A/E；第二轮 merge 前最小修正后复检，**A 类必须为 0**。

## 1.1 第二轮 merge 前修正（2026-06-29）

| 文件                                   | 修正摘要                                                                            |
| -------------------------------------- | ----------------------------------------------------------------------------------- |
| `README.md`                            | 文档索引改为「Sprint 全局索引与状态总览」；目录结构补充 `sprints/` / `releases/`    |
| `product-governance-target-model.md`   | 对象表与 Backlog/Delivery 分层明确双轨权威；Release/Sprint Backlog 章节补充独立目录 |
| `product-governance-migration-plan.md` | 「状态权威」改为 release-plan 索引 + `releases/release-<id>/` 详细事实源            |
| `user-story-map.md`                    | 相关文档链接标注索引/历史叙事；补充独立目录说明                                     |

**已关闭问题：** 第一轮 A-1（README）、原 E 类目标模型 / 迁移计划 / user-story-map 误分类项。

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

### 4.1 第一轮（结构对齐后 · 只读登记）

| 指标       | 数量 |
| ---------- | ---- |
| TSV 数据行 | 1116 |
| 涉及文件数 | 181  |
| A          | 1    |
| B          | 50   |
| C          | 355  |
| D          | 701  |
| E          | 9    |

### 4.2 第二轮（merge 前最小修正后 · 当前 HEAD）

| 指标       | 第一轮 | 第二轮 |
| ---------- | ------ | ------ |
| TSV 数据行 | 1116   | 1699   |
| 涉及文件数 | 181    | 182    |
| **A**      | 1      | **0**  |
| **B**      | 50     | 65     |
| **C**      | 355    | 355    |
| **D**      | 701    | 1279   |
| **E**      | 9      | **0**  |

说明：同一物理行若匹配多个搜索主题，TSV 中可出现多行；第二轮 TSV 行数增加因目标模型等修正后同屏匹配更多关键词。**A = 0 · E = 0** 为 merge 前验收条件。

### 排除规则

- 未排除中文/英文混合的产品与敏捷术语命中。
- 未将 DECISION-114 **反例说明**计为 A 类。
- 未将全局索引文件头 **DECISION-114 角色声明**（前 30 行内）计为 A 类。
- 审计材料自身（`residual-audit` / `residual-matches`）不计入冲突。
- 目标模型 / README / user-story-map / migration-plan 在 merge 前修正后统一归为 **D**。
- `s12-current-system-audit.md` 审计时点历史结论归为 **B**，不再误分类为 E。

## 5. 分类摘要（第二轮）

| 分类 | 含义                 | 数量  | 处理     |
| ---- | -------------------- | ----- | -------- |
| A    | 当前生效规范冲突     | **0** | 已关闭   |
| B    | 当前文件中的历史正文 | 65    | 保留     |
| C    | 已关闭历史记录       | 355   | 保留     |
| D    | 正常引用或正确表述   | 1279  | 无需修改 |
| E    | 存疑，需 PO 决策     | **0** | 已关闭   |

## 6. A 类：当前生效规范冲突清单

**（空）** — 第二轮复检 **A = 0**。

第一轮 A-1（`README.md:82`「当前 Sprint Backlog」）已在 §1.1 merge 前修正中关闭。

## 7. E 类：存疑项清单

**（空）** — 第二轮复检 **E = 0**。

原 E 类 9 项已通过最小修正关闭或重分类：

| 原 E 项                          | 第二轮处理                             |
| -------------------------------- | -------------------------------------- |
| README A-1                       | 已修正 → D                             |
| 目标模型对象表 / 追踪示例        | 已修正 → D                             |
| 迁移计划「状态权威」             | 已修正 → D                             |
| user-story-map 链接              | 已修正 → D                             |
| `s12-current-system-audit.md` §5 | 重分类 → **B**（历史审计正文，不重写） |

## 8. 历史保留项说明

### B 类（65）

主要为 `docs/agile/sprint-backlog.md`、`sprint-plan.md`、`release-plan.md` 历史正文，以及 `s12-current-system-audit.md` **§5 主要缺口**等审计时点历史结论。**保留，不修正。**

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

| 检查项                        | 结果                                    |
| ----------------------------- | --------------------------------------- |
| 规则要求独立平级目录          | PASS（`.mdc` + git-workflow §8）        |
| 全局文件仅索引                | PASS（规则 + 三文件头）                 |
| 禁止 Release 内嵌套 Sprint    | PASS（目标模型 §9.1 / git-workflow）    |
| 元数据字段语义                | PASS（目标模型 §9.4）                   |
| 历史不批量迁移                | PASS（迁移计划 §4.1 / DECISION-114 §8） |
| README 索引与目标模型双轨表述 | PASS（第二轮修正）                      |
| 跨规范矛盾                    | **PASS（A = 0）**                       |

## 11. 是否建议 merge

**建议：可以 merge。** 第二轮复检 **A = 0 · E = 0**；README 与目标模型残留已关闭。

## 12. merge 前是否仍有必须修正项

**无。**

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
