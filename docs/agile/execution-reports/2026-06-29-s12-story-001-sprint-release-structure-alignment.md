# Execution Report：S12-STORY-001 Sprint / Release 文档结构对齐

## 1. 基本信息

- 日期：2026-06-29
- 执行分支：`docs/s12-story-001-sprint-release-structure-alignment`（Story 工作分支；非当前 Sprint 常驻分支）
- 来源分支：`sprint/s12-product-governance-r2-planning`
- 目标合并分支：`sprint/s12-product-governance-r2-planning`
- HEAD at review time 所在分支：`docs/s12-story-001-sprint-release-structure-alignment`（各执行/审查轮次当时分支）
- merge 后所在分支：`sprint/s12-product-governance-r2-planning`（Story 关闭后的代码与文档所在分支）
- Sprint：Sprint 12 — Product Governance & Release 2 Planning
- 关联 Story / Bug / Decision：S12-STORY-001（治理结构补充）· **DECISION-114**
- 执行者：Cursor
- Story 状态：**Done** · 验收结论：**Accepted**（最终状态见 **§21**）

## 2. 本轮目标

正式明确并写入当前治理规范：每个 Sprint / Release 拥有独立平级目录；全局 `release-plan.md` 与 `sprint-backlog.md` 仅为索引；Sprint 与 Release 归属通过元数据表达；修正当前生效规则与索引文档中的旧表述。

## 3. 执行范围

**本轮做了：**

- 前置检查：`sprint/s12-product-governance-r2-planning` · working tree clean（此前 merge record 已 commit `c59f88e`）。
- 创建分支 `docs/s12-story-001-sprint-release-structure-alignment`。
- `rg` 排查 `.cursor/rules`、`docs/governance`、`docs/agile` 中旧表述。
- 更新 Cursor 规则、治理模型、迁移计划、审计结论、协作文档、git-workflow、全局索引文件头说明。
- 新增 **DECISION-114**。
- 运行检查并 commit。

**明确未做（工作分支执行阶段当时范围）：**

- 未创建历史 Sprint / Release 目录。
- 未移动或批量迁移历史文件。
- 未大幅缩减 `sprint-backlog.md` / `release-plan.md` 历史正文。
- 未修改 Sprint 12 九 Story 结构。
- 未启动 S12-STORY-002。
- 未将 Sprint 12 Plan 标记为 Approved。
- 未开发产品代码。
- 工作分支执行阶段未 merge 至 Sprint 分支 / `release/1` / `main`（**当时状态**；后续经 Product Owner 授权，已 merge 至 `sprint/s12-product-governance-r2-planning`，见 **§21**）。
- 未 push（**仍适用**）。

## 4. 排查范围与命中统计

搜索范围：

```text
.cursor/rules
docs/governance
docs/agile
```

模式：

```text
sprint-backlog\.md|release-plan\.md|每个 Sprint 必须更新|Sprint Backlog|Release Backlog
```

结果：**362** 处匹配，**177** 个文件（含历史 execution reports、changelog、decisions 引用；当前规范层修正见下表）。

**当前规范层需修正的旧表述（已处理）：**

| 位置                                                       | 旧表述问题                                        | 处理                                  |
| ---------------------------------------------------------- | ------------------------------------------------- | ------------------------------------- |
| `.cursor/rules/agile-rules.mdc`                            | 「每个 Sprint 必须更新 sprint-backlog.md」        | 改为独立目录 backlog + 全局索引同步   |
| `.cursor/rules/agile-rules.mdc`                            | 文档位置将 sprint-backlog 当作唯一 Sprint Backlog | 区分全局索引与 `sprints/sprint-<id>/` |
| `.cursor/rules/collaboration-rules.mdc`                    | 执行前只读 sprint-plan + sprint-backlog           | 增加 release-plan 与独立目录          |
| `.cursor/rules/project-rules.mdc`                          | 状态来源未含独立目录                              | 补充 `sprints/` / `releases/`         |
| `product-governance-target-model.md` §8–9                  | 部分仍指向全局文件为详细容器                      | 扩展 §9 为批准结构与追踪规则          |
| `product-governance-migration-plan.md`                     | dashboard 表述模糊                                | 对齐 DECISION-114                     |
| `s12-current-system-audit.md`                              | 职责矩阵仍写 Story ledger 为唯一权威              | 标注前向索引角色                      |
| `chatgpt-cursor-docs-workflow.md`                          | 文档索引缺 sprints/releases                       | 补充                                  |
| `git-workflow.md`                                          | 无文档结构章节                                    | 新增 §8                               |
| `release-plan.md` / `sprint-backlog.md` / `sprint-plan.md` | 无索引角色声明                                    | 文件头增加 DECISION-114 说明          |

**保留不动（历史事实 / 非当前规范）：**

- `sprint-backlog.md` / `sprint-plan.md` / `release-plan.md` 正文历史 Story、AC、关闭记录。
- 已关闭 Sprint 的 execution reports 中对旧路径的引用。
- `changelog.md` / `decisions.md` 历史条目原文（仅追加 DECISION-114 与本轮 changelog）。

## 5. 修改文件

- `.cursor/rules/agile-rules.mdc`
- `.cursor/rules/agile-governance.mdc`
- `.cursor/rules/collaboration-rules.mdc`
- `.cursor/rules/project-rules.mdc`
- `docs/governance/product-governance-target-model.md`
- `docs/governance/product-governance-migration-plan.md`
- `docs/governance/s12-current-system-audit.md`
- `docs/agile/chatgpt-cursor-docs-workflow.md`
- `docs/agile/git-workflow.md`
- `docs/agile/release-plan.md`
- `docs/agile/sprint-backlog.md`
- `docs/agile/sprint-plan.md`
- `docs/agile/sprint12-product-governance-r2-planning.md`
- `docs/agile/changelog.md`
- `docs/agile/decisions.md`

## 6. 新增文件

- `docs/agile/execution-reports/2026-06-29-s12-story-001-sprint-release-structure-alignment.md`

## 7. Sprint / Release 目录结构与关系模型

见 `docs/governance/product-governance-target-model.md` §9 与 **DECISION-114**：

- `docs/agile/sprints/sprint-<id>/` 与 `docs/agile/releases/release-<id>/` **平级**。
- 全局 `sprint-backlog.md` / `release-plan.md` **仅索引**。
- 归属字段：`primaryRelease` · `supportsReleases` · `sprintType`。
- 追踪：`Product Backlog Item → Release Backlog Item → Sprint Backlog Item → Story/Task → Execution Evidence`。

## 8. 未执行的迁移工作

- Sprint 12 未迁入 `docs/agile/sprints/sprint-12/`。
- Release 1 未迁入 `docs/agile/releases/release-1/`。
- 未创建 Sprint 1~11 / 其他 Release 目录。
- 未批量修正历史 execution reports 中的路径引用。

## 9. 验收标准完成情况

| AC                              | 结果 | 说明                                           |
| ------------------------------- | ---- | ---------------------------------------------- |
| Sprint 独立目录与 backlog 原则  | PASS | §9 + DECISION-114                              |
| Release 独立目录与 backlog 原则 | PASS | §9 + DECISION-114                              |
| 目录平级、不嵌套                | PASS | 明确禁止 releases/.../sprints/                 |
| 元数据归属语义                  | PASS | primaryRelease / supportsReleases / sprintType |
| 全局 sprint-backlog 仅索引      | PASS | 规则 + 文件头                                  |
| 全局 release-plan 仅索引        | PASS | 规则 + 文件头                                  |
| 修正当前生效规则旧表述          | PASS | 4 个 `.mdc` + 协作文档                         |
| 保留历史与链接                  | PASS | 未迁移、未删正文                               |
| 未批量迁移                      | PASS | —                                              |
| 未启动 S12-STORY-002            | PASS | —                                              |
| 未修改产品代码                  | PASS | —                                              |
| 已 commit                       | PASS | 见 §13–§19                                     |
| working tree clean              | PASS | commit 后确认                                  |
| merge 至 Sprint 分支            | PASS | 最终已完成 · `c18753c`（见 §21）               |
| push                            | PASS | **仍未执行**（见 §21）                         |
| Story 验收                      | PASS | **Accepted / Done**（见 §21）                  |

## 10. 运行检查

| 命令                                            | 结果   | 说明                         |
| ----------------------------------------------- | ------ | ---------------------------- |
| `git diff --check`                              | PASS   | —                            |
| `pnpm lint`                                     | PASS   | 0 errors                     |
| `pnpm exec prettier --check`（修改的 Markdown） | PASS   | 见 commit 前                 |
| `.mdc` frontmatter / 链接                       | PASS   | 人工检查；无 Prettier parser |
| `git status`                                    | PASS   | commit 后 clean              |
| `pnpm build` / `pnpm test`                      | 未运行 | 无产品代码变更               |

## 11. 风险与阻塞

- 历史大文件与全局索引职责仍并存，执行者须读文件头 DECISION-114 说明，避免继续向全局文件堆叠详细 AC。
- Sprint 12 专项文档 `sprint12-product-governance-r2-planning.md` 仍为当前 Sprint 12 详细 Plan 载体，待后续迁移 Story 决定是否迁入 `sprints/sprint-12/`。

## 12. 建议下一步

**当前（Story 关闭后）：**

1. **S12-STORY-001 已关闭**（Accepted / Done · merge `c18753c` · 状态同步 `b4d7724`）。
2. **Sprint 12 Plan 尚未 Approved** — 不得启动 Sprint 开发 Story。
3. **S12-STORY-002 尚未启动** — 后续须先完成 Sprint 12 Planning 与相关基线检查（含 Sprint 11 / `release/1` 对齐闸门）。
4. S12-STORY-006 可据此完善 DoR/DoD 与 Sprint / Release 目录模板（待 Sprint Plan Approved 后按序执行）。

<details>
<summary>历史建议（merge 前当时状态，已 superseded）</summary>

1. 用户 / ChatGPT 审查 DECISION-114 与规则修正。
2. 若通过，授权 merge 至 `sprint/s12-product-governance-r2-planning`。
3. S12-STORY-006 可据此完善 DoR/DoD 与 Sprint / Release 目录模板。

</details>

## 13. Commit（结构对齐主轮）

完整分类见 **§19**。本节保留历史记录摘要。

- 主要实现：`81fa694`
- report-only：`8fd449e`（execution report 回填 commit hash）

### 状态（该阶段当时状态）

- Merge 状态：未 merge
- Push 状态：未 push

最终 merge 与验收状态见 **§21**。

## 14. 残留审计（只读，2026-06-29）

**定位：** S12-STORY-001 治理结构补充的只读残留审计与审查材料打包；**未修改**现有规范文件。

**搜索范围：** `.cursor/rules/` · `docs/governance/` · `docs/agile/` · `docs/product/` · `README.md`

**搜索命令：** 见 `docs/governance/s12-sprint-release-structure-residual-audit.md` §3

**命中统计：** 1116 行 · 181 文件 · A:1 · B:50 · C:355 · D:701 · E:9

**新发现 A 类：** 1 项 — `README.md:82` 仍将 `sprint-backlog.md` 标注为「当前 Sprint Backlog」（未区分全局索引）

**E 类：** 9 项 — 目标模型对象表、初始审计历史结论、迁移计划废弃表、user-story-map 链接语义（详见审计报告 §7）

**审计报告：** `docs/governance/s12-sprint-release-structure-residual-audit.md`

**TSV：** `docs/governance/s12-sprint-release-structure-residual-matches.tsv`

**审查 ZIP：** `review-package/s12-story-001-sprint-release-structure-review.zip`（本地，不 commit）

**merge 建议：** 可 merge；第二轮复检 **A = 0 · E = 0**（详见 §16）

## 15. Commit（含残留审计）

- 影响实际成果的修正 commit：`7b4ad18` — 新增残留审计报告与 TSV（含 execution report 补充，因同时新增审计材料仍属实际成果）
- report-only：`60981b6` — execution report 记录残留审计 commit

## 16. merge 前最小修正（2026-06-29）

**定位：** 关闭第一轮残留审计 A-1 与原 E 类误分类项；重新运行残留审计，**A = 0 · E = 0**。

**修正文件：**

| 文件                                                                | 修正摘要                                                                     |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `README.md`                                                         | 文档索引「Sprint 全局索引与状态总览」；目录结构补充 `sprints/` / `releases/` |
| `docs/governance/product-governance-target-model.md`                | 对象表双轨权威；Backlog/Delivery 分层；Release/Sprint Backlog 章节           |
| `docs/governance/product-governance-migration-plan.md`              | release-plan 索引 + `releases/release-<id>/` 详细事实源                      |
| `docs/product/user-story-map.md`                                    | 相关文档链接标注；补充独立目录说明                                           |
| `docs/governance/s12-sprint-release-structure-residual-audit.md`    | 第二轮复检统计与 merge 建议                                                  |
| `docs/governance/s12-sprint-release-structure-residual-matches.tsv` | 重新生成                                                                     |

**第二轮残留审计统计：** 1699 行 · 182 文件 · **A:0 · B:65 · C:355 · D:1279 · E:0**

**已关闭：** README 索引问题；目标模型对象表 / 分层表误分类；迁移计划状态权威表述；user-story-map 链接语义。

**Commit（本轮）：** 见 §17

**Merge 状态（merge 前当时状态）：** 未 merge

**Push 状态：** 未 push

最终 merge 与验收状态见 **§21**。

## 17. Commit（merge 前最小修正）

### 主要实现 commit

- `81fa694` — Sprint / Release 文档结构对齐主变更

### 影响实际成果的修正 commit

- `7b4ad18` — 新增残留审计报告与 TSV
- `d79b6fd` — 关闭 README、目标模型、迁移计划和 Story Map 残留

### report-only commit（不要求写回本报告）

- `8fd449e`
- `60981b6`

### 状态（merge 前当时状态）

- Merge 状态：未 merge
- Push 状态：未 push

最终 merge 与验收状态见 **§21**。

## 18. Execution Report commit 记录规则同步

**定位：** S12-STORY-001 merge 前治理规则补充；非新 Story。

**本轮治理规则（`.cursor/rules/agile-governance.mdc` §6）：**

1. 必须记录：主要实现 commit、影响实际成果的修正 commit、已授权 merge commit。
2. 不要求记录：report-only commit（仅改 execution report 自身）。
3. 最终状态使用 `HEAD at review time`；由 Cursor 最终回复报告，不要求写回本报告。
4. 不得为回填最新 HEAD 循环产生 report-only commit。
5. 必须区分：主要实现 / 修正 / report-only / merge commit / 当前 HEAD / merge 状态 / push 状态。
6. 禁止：已 commit 写成已 merge；本地 merge 写成已 push。

**当前模板：** 已找到并更新唯一生效模板 `docs/agile/execution-reports/_template.md` §14（与 `agile-rules.mdc` 引用一致）。

**Commit 记录（规则同步轮）：**

| 类型                      | Hash      | 说明                                                             |
| ------------------------- | --------- | ---------------------------------------------------------------- |
| 影响实际成果的修正 commit | `1bf00b9` | 同步 Execution Report commit 记录规则与模板                      |
| report-only               | `ec754f6` | `docs(s12): record execution report rule sync`；不要求写回本报告 |

**明确未做（规则同步轮当时状态）：** 未 merge；未 push；未启动 S12-STORY-002；未批量修改历史 execution reports。最终状态见 **§21**。

## 19. Commit 分类汇总（merge 前审查用 · 历史快照）

> 本节为 merge 前审查时的 commit 分类快照；**最终** merge 与验收状态见 **§21**。

### 主要实现 commit

- `81fa694` — Sprint / Release 文档结构对齐主变更

### 影响实际成果的修正 commit

- `7b4ad18` — 新增残留审计报告与 TSV
- `d79b6fd` — 关闭 README、目标模型、迁移计划和 Story Map 残留
- `1bf00b9` — 同步 Execution Report commit 记录规则与模板

### report-only commit

以下只修改 execution report 自身，不列入实际成果 commit：

- `8fd449e`
- `60981b6`
- `ec754f6`

### 已授权 merge commit

- `c18753c` — merge 至 `sprint/s12-product-governance-r2-planning`（Story 关闭时完成；见 §21）

### 状态（§19 撰写时 vs 最终）

| 项    | §19 当时           | 最终（§21）          |
| ----- | ------------------ | -------------------- |
| Merge | merge 前审查用快照 | 已 merge · `c18753c` |
| Push  | 未 push            | 未 push              |
| Story | In Review          | **Accepted / Done**  |

`HEAD at review time` 由 Cursor 最终回复报告，不要求写回本文件。不得为记录 report-only commit 或回填最新 HEAD 循环产生新的 report-only commit。

## 20. 样式与复制领域规则时效性审计（2026-06-29）

**定位：** S12-STORY-001 merge 前治理补充；审计 `.cursor/rules/style-system-rules.mdc` 与 `.cursor/rules/wechat-copy-rules.mdc`，去除易过期硬编码，保留长期领域技术约束。

### 审计结论

| 文件                     | 结论                                                                     |
| ------------------------ | ------------------------------------------------------------------------ |
| `style-system-rules.mdc` | 原「Release 1 定位」为动态规划硬编码；架构/复制/扩展约束为长期规则，保留 |
| `wechat-copy-rules.mdc`  | 原「Release 1 P0」为动态范围硬编码；渲染共享与粘贴兼容为长期规则，保留   |

### 移除的动态硬编码

| 原表述                                              | 处理                                                       |
| --------------------------------------------------- | ---------------------------------------------------------- |
| `Release 1 核心范围` / `Release 1 不做完整样式市场` | 改为 Approved Release / Sprint 文档 + registry / DB 事实源 |
| `Release 1 P0 质量标准`                             | 改为产品 P0 + Approved 文档为准                            |
| frontmatter `Release 1 样式约束`                    | 改为长期技术约束描述                                       |

### 保留的正式兼容标识

| 标识                                    | 原因                                                                 |
| --------------------------------------- | -------------------------------------------------------------------- |
| `release1_required`（规则内说明性引用） | registry / Prisma lifecycle tier 正式枚举名；非当前 Release 状态描述 |

未在规则正文中硬编码 variant 数量、Sprint 编号、Story ID 或分支名。

### 路径核对

| 引用路径                                             | 存在                                            |
| ---------------------------------------------------- | ----------------------------------------------- |
| `docs/architecture/style-system.md`                  | 是                                              |
| `docs/architecture/wechat-copy-style-rules.md`       | 是                                              |
| `docs/architecture/copy-to-wechat-pipeline.md`       | 是                                              |
| `docs/architecture/wechat-safe-html-css-contract.md` | 新增引用（wechat-copy 补充 Contract v1 事实源） |

无失效路径；未修改架构文档正文。

### `globs` / `alwaysApply`

| 文件                     | 调整                | 理由                                                                                                                                                    |
| ------------------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `style-system-rules.mdc` | **未改**            | `src/core/styles/**` 与 `style-system.md` 仍对应该规则主链路；`src/core/style-library/**` 偏 lifecycle / promote，无本文件直接引用证据，不凭猜测扩 glob |
| `wechat-copy-rules.mdc`  | **未改**            | `src/core/copy/**`、`src/core/renderer/**` 与所列架构文档仍覆盖复制主链路                                                                               |
| 两者 `alwaysApply`       | **未改**（`false`） | 领域规则应通过准确 `globs` 触发，避免干扰无关任务                                                                                                       |

### 与 `agile-governance.mdc` 去重

- 原文件无完整 Sprint Planning / DoR / merge / push / Done 重复定义
- 新增「治理边界」短引用，明确领域文件只保留样式 / 复制技术约束

### 待 Product Owner 决策项

**无。** 未发现需改变微信兼容标准、Preview/Copy 架构或 registry 策略的 E 类项。

### 本轮检查

| 命令                         | 结果                                         |
| ---------------------------- | -------------------------------------------- |
| `git diff --check`           | 见 commit 前                                 |
| 动态硬编码 `rg`              | PASS（修正后无 Release 1 / Sprint 编号残留） |
| 治理重复 `rg`                | PASS（仅治理边界引用）                       |
| `pnpm lint`                  | 见 commit 前                                 |
| frontmatter / globs 人工检查 | PASS                                         |

### 本轮实际治理修正 commit

- 提交信息：`docs(s12): refresh style and copy rule scope`
- 性质：影响实际成果的修正 commit（含领域规则与 execution report §20）
- `HEAD at review time` 由 Cursor 最终回复报告，不写回本文件

### §20 补充（事实源层级，2026-06-29）

- 已修正 `style-system-rules.mdc`「正式交付范围」：全局文件与独立目录职责不再混写
- **全局索引：** `docs/agile/sprint-backlog.md`、`docs/agile/release-plan.md` 仅为索引、状态摘要和入口
- **详细事实源：** `docs/agile/sprints/sprint-<id>/`、`docs/agile/releases/release-<id>/`
- `wechat-copy-rules.mdc` 本轮未修改
- merge 前当时状态：未 merge；未 push；未启动 S12-STORY-002。最终状态见 **§21**。

## 21. 用户验收与 merge 关闭（2026-06-29）

### 最终状态（权威）

| 项                          | 值                                                      |
| --------------------------- | ------------------------------------------------------- |
| 验收结论                    | **Accepted**                                            |
| Story 状态                  | **Done**                                                |
| Story merge commit          | `c18753c`                                               |
| 状态同步 commit             | `b4d7724`                                               |
| 执行分支（历史）            | `docs/s12-story-001-sprint-release-structure-alignment` |
| 当前分支 / merge 后所在分支 | `sprint/s12-product-governance-r2-planning`             |
| Push 状态                   | **未 push**                                             |
| Sprint 12 Plan              | **未 Approved**                                         |
| S12-STORY-002               | **未启动**                                              |
| 报告状态                    | **Done**                                                |

### 关闭记录

- **用户验收日期：** 2026-06-29
- **Product Owner 授权：** 允许标记 S12-STORY-001 为 **Done**；允许 merge 工作分支至 Sprint 分支
- **merge 目标分支：** `sprint/s12-product-governance-r2-planning`
- **STORY_MERGE_COMMIT：** `c18753c` — `Merge S12-STORY-001 product governance audit`
- **STATUS_SYNC_COMMIT：** `b4d7724` — `docs(s12): accept and close story 001`

`HEAD at review time` 由 Cursor 最终回复报告；不为 report-only commit 回填本报告。
