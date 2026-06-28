# Execution Report：S12-STORY-001 Sprint / Release 文档结构对齐

## 1. 基本信息

- 日期：2026-06-29
- 执行分支：`docs/s12-story-001-sprint-release-structure-alignment`
- 来源分支：`sprint/s12-product-governance-r2-planning`
- 目标合并分支：`sprint/s12-product-governance-r2-planning`（本轮未 merge，待用户确认）
- Sprint：Sprint 12 — Product Governance & Release 2 Planning
- 关联 Story / Bug / Decision：S12-STORY-001（治理结构补充）· **DECISION-114**
- 执行者：Cursor
- 状态：In Review

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

**明确未做：**

- 未创建历史 Sprint / Release 目录。
- 未移动或批量迁移历史文件。
- 未大幅缩减 `sprint-backlog.md` / `release-plan.md` 历史正文。
- 未修改 Sprint 12 九 Story 结构。
- 未启动 S12-STORY-002。
- 未将 Sprint 12 Plan 标记为 Approved。
- 未开发产品代码。
- 未 merge 到 Sprint 分支 / `release/1` / `main`。
- 未 push。

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
| 已 commit                       | PASS | 见 §14                                         |
| working tree clean              | PASS | commit 后确认                                  |
| 未 merge、未 push               | PASS | —                                              |

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

1. 用户 / ChatGPT 审查 DECISION-114 与规则修正。
2. 若通过，授权 merge 至 `sprint/s12-product-governance-r2-planning`。
3. S12-STORY-006 可据此完善 DoR/DoD 与 Sprint / Release 目录模板。

## 13. Commit

- Commit hash：`81fa694`
- Merge 状态：未 merge
- Push 状态：未 push
