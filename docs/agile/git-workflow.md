# Git 工作流

> 轻篇公众号排版 · qingpian-wechat-editor

## 仓库信息

| 项 | 值 |
|----|-----|
| 项目名 | qingpian-wechat-editor |
| 主分支 | `main` |
| Release 1 主干 | `release/1` |
| 包管理 | pnpm |
| Remote | `origin`（已配置） |

---

## 1. 分支模型总览

```text
main
  稳定主线，只接收已验收完成的 Release 级合并。

release/<n>
  Release 级主干。从 main 创建，聚合该 Release 内已验收 Sprint 成果。
  例如 release/1 代表 Release 1 主干；Sprint 1-B 已 merge 至 release/1。

sprint/<sprint-slug>
  迭代分支。每个 Sprint 从当前 Release 主干（如 release/1）新建。
  例如：
  sprint/s2-article-block-schema
  sprint/s3-style-system

feature/<short-task-slug>
  功能分支。从当前 sprint 分支切出。
  用于具体功能开发或技术实现。

docs/<short-task-slug>
  文档分支。从当前 sprint 分支切出。
  用于文档、规则、方案、协作机制等修改。

bugfix/<short-task-slug>
  Bug 修复分支。从当前 sprint 分支切出。
  用于当前 Sprint 内发现的问题修复。

chore/<short-task-slug>
  工程配置、依赖、脚本等非业务任务分支。
```

**合并方向（单向）：**

```text
main ← release/<n> ← sprint/<sprint-slug> ← feature|docs|bugfix|chore/<task-slug>
```

**Release 1 当前状态：** `sprint/s1b-core-tech-governance` 已 merge 至 `release/1`（`882a43d`）；Sprint 1-B 全部 story 工作分支已清理删除。

---

## 2. main 分支规则

- `main` 是**稳定主线**，只接收已验收完成的 **Release 级**合并
- **不允许在 main 上直接开发具体任务**
- `main` 应始终保持可 `pnpm lint`、`pnpm build` 通过
- 只有 Release **整体验收通过**且**用户确认**后，才允许将 `release/<n>` 合并回 `main`
- Cursor **不得未经用户确认**自行将 release 或 sprint 分支合并至 `main`

---

## 3. release 分支规则

- **每个 Release 开始前**，从 `main` 新建 `release/<n>` 分支（如 `release/1`）
- 一个 Release 对应**一个** release 分支，作为该 Release 的**开发主干**
- release 分支聚合本 Release 内所有**已验收**的 sprint 分支合并
- Release 整体验收通过前，release 分支**不合并** main
- Release 关闭需**用户确认**，Cursor 不得自行宣布 Release Done 或合并 main

**Release 1：** `release/1` 已从 `main` 创建；`sprint/s1b-core-tech-governance` 已 merge 至 `release/1`。

---

## 4. sprint 分支规则

- **每个 Sprint 开始前**，从当前 **Release 主干**（Release 1 为 `release/1`）新建 `sprint/<sprint-slug>` 分支
- 一个 Sprint 对应**一个** sprint 分支
- sprint 分支聚合本迭代内所有**已验收**的工作分支合并
- Sprint 整体验收通过且**用户确认**后，merge 至对应 `release/<n>`（**不直接** merge main）
- Sprint 关闭需**用户确认**，Cursor 不得自行宣布 Sprint Done

**命名示例：**

| Sprint | sprint 分支 |
|--------|-------------|
| Sprint 1 | `sprint/s1-project-foundation` |
| Sprint 2 | `sprint/s2-article-block-schema` |
| Sprint 3 | `sprint/s3-style-system` |

**说明：** Sprint 1 早期部分工作发生在规则定稿前，曾直接在 `main` 或 `docs/*` 分支上完成；Sprint 1-B 完成后 merge 至 `release/1`（DECISION-052）。自 Sprint 2 起，sprint 分支从 `release/1` 切出。

---

## 5. 迭代内工作分支规则

1. Sprint 内**每个具体任务**，都必须从**当前 sprint 分支**新建独立工作分支
2. **一个工作分支只解决一个问题**
3. **不允许多个无关任务共用一个工作分支**
4. 工作分支类型根据任务选择：`feature/`、`docs/`、`bugfix/`、`chore/`
5. 工作分支完成后，**不直接合并 release 或 main**，而是**先合并回当前 sprint 分支**
6. 合并需经 execution report 审查与用户确认（实际是否 merge 由用户决定）
7. Cursor 执行后须在 execution report 中记录：**当前分支、来源分支、目标合并分支**

**Story / 任务与分支对应：**

- 每个 Story / Bug / Docs / Chore 任务应对应**一个独立工作分支**
- `sprint-backlog.md` 中应记录任务分支名（如有）

**工作分支清理：** Story / 任务 merge 至 sprint 且 sprint merge 至 release 后，对应工作分支**可以删除**（本地与 remote）；删除前须确认内容已进入 release 主干。Sprint 1-B 全部 `docs/s1b-*` story 分支已于 2026-05-31 清理。

---

## 6. 分支命名规范

| 前缀 | 切出来源 | 用途 | 示例 |
|------|----------|------|------|
| `main` | — | 稳定主线 | — |
| `release/` | `main` | Release 级主干 | `release/1` |
| `sprint/` | 当前 `release/<n>` | Sprint 迭代分支 | `sprint/s2-article-block-schema` |
| `feature/` | 当前 `sprint/*` | 功能 / 技术实现 | `feature/s2-article-schema-contract` |
| `docs/` | 当前 `sprint/*` | 文档 / 规则 / 方案 | `docs/s2-article-schema-contract` |
| `bugfix/` | 当前 `sprint/*` | Bug 修复 | `bugfix/copy-border-missing` |
| `chore/` | 当前 `sprint/*` 或 `release/<n>` | 工程配置 / 依赖 / 分支清理 | `chore/s1b-cleanup-story-branches` |

- `<short-task-slug>` 使用小写英文和连字符，简短描述任务
- 如果 Cursor 不确定应从哪个分支切出，必须先检查 `sprint-plan.md`、`sprint-backlog.md`、本文件，再向用户确认

---

## 7. 合并规则

### 7.1 工作分支 → sprint 分支

```bash
git checkout sprint/<sprint-slug>
git merge --no-ff <work-branch>
```

- 工作分支完成、execution report 审查通过、**用户确认**后执行
- Cursor **不应自动 merge**，除非用户明确要求

### 7.2 sprint 分支 → release 分支

```bash
git checkout release/<n>
git pull   # 如有 remote
git merge --no-ff sprint/<sprint-slug>
```

- 仅当 Sprint **整体验收通过**且**用户确认**后执行
- Cursor **不得自动**将 sprint 分支合并 release

### 7.3 release 分支 → main

```bash
git checkout main
git pull   # 如有 remote
git merge --no-ff release/<n>
```

- 仅当 Release **整体验收通过**且**用户确认**后执行
- Cursor **不得自动**将 release 分支合并 main

### 7.4 合并原则

- 优先使用 `--no-ff` 保留合并历史
- 合并前确保 `pnpm lint`、`pnpm build` 通过
- 合并后在 changelog / sprint-backlog 中同步状态

---

## 8. 禁止事项

| 禁止 | 说明 |
|------|------|
| 在 main 上直接开发具体任务 | 必须从 release / sprint 分支切工作分支 |
| 多个无关任务共用一个工作分支 | 一个分支一个问题 |
| 工作分支直接合并 main 或 release | 必须先合并回 sprint 分支 |
| Sprint 未验收就合并 release | 需用户确认 Sprint 完成 |
| Release 未验收就合并 main | 需用户确认 Release 完成 |
| Cursor 自行关闭 Sprint / Release | 需用户确认 |
| Cursor 自行 merge 至 release 或 main | 需用户确认 |
| 不确定切分支来源时不查 docs | 先读 sprint-plan / sprint-backlog / 本文件 |

---

## 9. 示例流程（Release 1 · Sprint 2+）

```bash
# 0. Release 1 主干已存在：release/1

# 1. 从 release/1 创建 Sprint 分支
git checkout release/1
git pull
git checkout -b sprint/s2-article-block-schema

# 2. 从 Sprint 分支创建具体任务分支
git checkout sprint/s2-article-block-schema
git checkout -b feature/s2-article-schema-contract

# 3. 完成任务后提交
git add .
git commit -m "feat: add article schema contract"

# 4. 合并回 Sprint 分支（用户确认后）
git checkout sprint/s2-article-block-schema
git merge --no-ff feature/s2-article-schema-contract

# 5. Sprint 验收通过后，合并至 release/1（用户确认后）
git checkout release/1
git merge --no-ff sprint/s2-article-block-schema

# 6. Release 1 整体验收通过后，再合并回 main（用户确认后）
git checkout main
git merge --no-ff release/1
```

**重要：** 实际是否 merge，由**用户确认**；Cursor 不应自动把 sprint 合并 release，或 release 合并 main。

---

## 提交规范

```text
<type>: <summary>
```

| type | 用途 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档变更 |
| `chore` | 工程配置 |
| `test` | 测试 |

---

## .gitignore 覆盖范围

- `node_modules/`
- `.next/`、`out/`、`build/`
- `.env`、`.env.local`、`.env*.local`
- `coverage/`
- `test-results/`、`playwright-report/`
- `.DS_Store`
- `*.tsbuildinfo`

---

## 8. 敏捷文档结构（DECISION-114）

Git 分支与敏捷文档结构分离管理：

- **全局索引：** `docs/agile/release-plan.md`（Release 索引）· `docs/agile/sprint-backlog.md`（Sprint 索引）— 只保存名称、目标摘要、状态、链接；**不**作为全部详细 Backlog 的唯一容器。
- **独立目录：** `docs/agile/releases/release-<id>/` 与 `docs/agile/sprints/sprint-<id>/` **平级**；**不**使用 `releases/.../sprints/...` 嵌套。
- **新 Sprint / Release：** 详细 `plan.md`、`backlog.md`、Review / Retro / Closeout 写入对应独立目录；同步更新全局索引。
- **历史：** 现有 `sprint-plan.md`、`sprint-backlog.md`、`release-plan.md` 中的历史详细内容保留；不批量迁移；旧链接继续有效。

详见 `docs/governance/product-governance-target-model.md` §9。

---

## 相关决策

- DECISION-016：Git 主分支为 `main`
- DECISION-017：Remote 仓库已配置（`origin`）
- DECISION-020：建立 Sprint 分支与迭代内工作分支机制
- DECISION-052：建立 `release/1` 作为 Release 1 主干；Sprint 1-B merge 至 release/1
- DECISION-114：Sprint / Release 独立平级目录与全局索引原则

## 相关文档

- [Release Plan（全局索引）](release-plan.md)
- [Sprint Backlog（全局索引）](sprint-backlog.md)
- [Sprint Plan（历史叙事）](sprint-plan.md)
- [Decisions](decisions.md)
- [ChatGPT + Cursor + docs 协作机制](chatgpt-cursor-docs-workflow.md)
