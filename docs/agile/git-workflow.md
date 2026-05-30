# Git 工作流

> 轻篇公众号排版 · qingpian-wechat-editor

## 仓库信息

| 项 | 值 |
|----|-----|
| 项目名 | qingpian-wechat-editor |
| 主分支 | `main` |
| 包管理 | pnpm |
| Remote | **待配置**（暂无远程仓库） |

配置远程仓库后执行：

```bash
git remote add origin <repository-url>
git push -u origin main
```

---

## 1. 分支模型总览

```text
main
  稳定主线，只接收已验收完成的 Sprint / Release 级合并。

sprint/<sprint-slug>
  迭代分支。每个 Sprint 新建一个 sprint 分支。
  例如：
  sprint/s1-project-foundation
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
main ← sprint/<sprint-slug> ← feature|docs|bugfix|chore/<task-slug>
```

---

## 2. main 分支规则

- `main` 是**稳定主线**，只接收已验收完成的 Sprint / Release 级合并
- **不允许在 main 上直接开发具体任务**
- `main` 应始终保持可 `pnpm lint`、`pnpm build` 通过
- 只有 Sprint **整体验收通过**且**用户确认**后，才允许将 `sprint/<sprint-slug>` 合并回 `main`
- Cursor **不得未经用户确认**自行将 sprint 分支合并至 `main`

---

## 3. sprint 分支规则

- **每个 Sprint 开始前**，从 `main` 新建 `sprint/<sprint-slug>` 分支
- 一个 Sprint 对应**一个** sprint 分支
- sprint 分支聚合本迭代内所有**已验收**的工作分支合并
- Sprint 整体验收通过前，sprint 分支**不合并** main
- Sprint 关闭需**用户确认**，Cursor 不得自行宣布 Sprint Done 或合并 main

**命名示例：**

| Sprint | sprint 分支 |
|--------|-------------|
| Sprint 1 | `sprint/s1-project-foundation` |
| Sprint 2 | `sprint/s2-article-block-schema` |
| Sprint 3 | `sprint/s3-style-system` |

**说明：** Sprint 1 早期部分工作发生在规则定稿前，曾直接在 `main` 或 `docs/*` 分支上完成；自 DECISION-020 起，后续 Sprint 必须按本规则从 main 创建 sprint 分支。

---

## 4. 迭代内工作分支规则

1. Sprint 内**每个具体任务**，都必须从**当前 sprint 分支**新建独立工作分支
2. **一个工作分支只解决一个问题**
3. **不允许多个无关任务共用一个工作分支**
4. 工作分支类型根据任务选择：`feature/`、`docs/`、`bugfix/`、`chore/`
5. 工作分支完成后，**不直接合并 main**，而是**先合并回当前 sprint 分支**
6. 合并需经 execution report 审查与用户确认（实际是否 merge 由用户决定）
7. Cursor 执行后须在 execution report 中记录：**当前分支、来源分支、目标合并分支**

**Story / 任务与分支对应：**

- 每个 Story / Bug / Docs / Chore 任务应对应**一个独立工作分支**
- `sprint-backlog.md` 中应记录任务分支名（如有）

---

## 5. 分支命名规范

| 前缀 | 切出来源 | 用途 | 示例 |
|------|----------|------|------|
| `main` | — | 稳定主线 | — |
| `sprint/` | `main` | Sprint 迭代分支 | `sprint/s2-article-block-schema` |
| `feature/` | 当前 `sprint/*` | 功能 / 技术实现 | `feature/s2-article-schema-contract` |
| `docs/` | 当前 `sprint/*` | 文档 / 规则 / 方案 | `docs/s1b-iteration-branch-workflow` |
| `bugfix/` | 当前 `sprint/*` | Bug 修复 | `bugfix/copy-border-missing` |
| `chore/` | 当前 `sprint/*` | 工程配置 / 依赖 | `chore/update-eslint-config` |

- `<short-task-slug>` 使用小写英文和连字符，简短描述任务
- 如果 Cursor 不确定应从哪个分支切出，必须先检查 `sprint-plan.md`、`sprint-backlog.md`、本文件，再向用户确认

---

## 6. 合并规则

### 6.1 工作分支 → sprint 分支

```bash
git checkout sprint/<sprint-slug>
git merge --no-ff <work-branch>
```

- 工作分支完成、execution report 审查通过、**用户确认**后执行
- Cursor **不应自动 merge**，除非用户明确要求

### 6.2 sprint 分支 → main

```bash
git checkout main
git pull   # 如有 remote
git merge --no-ff sprint/<sprint-slug>
```

- 仅当 Sprint **整体验收通过**且**用户确认**后执行
- Cursor **不得自动**将 sprint 分支合并 main

### 6.3 合并原则

- 优先使用 `--no-ff` 保留合并历史
- 合并前确保 `pnpm lint`、`pnpm build` 通过
- 合并后在 changelog / sprint-backlog 中同步状态

---

## 7. 禁止事项

| 禁止 | 说明 |
|------|------|
| 在 main 上直接开发具体任务 | 必须从 sprint 分支切工作分支 |
| 多个无关任务共用一个工作分支 | 一个分支一个问题 |
| 工作分支直接合并 main | 必须先合并回 sprint 分支 |
| Sprint 未验收就合并 main | 需用户确认 Sprint 完成 |
| Cursor 自行关闭 Sprint | 需用户确认 |
| Cursor 自行 merge 至 main | 需用户确认 |
| 不确定切分支来源时不查 docs | 先读 sprint-plan / sprint-backlog / 本文件 |

---

## 8. 示例流程

```bash
# 1. 从 main 创建 Sprint 分支
git checkout main
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

# 5. Sprint 验收通过后，再合并回 main（用户确认后）
git checkout main
git merge --no-ff sprint/s2-article-block-schema
```

**重要：** 实际是否 merge，由**用户确认**；Cursor 不应自动把 Sprint 分支合并 main。

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

## 相关决策

- DECISION-016：Git 主分支为 `main`
- DECISION-017：Remote 仓库待配置
- DECISION-020：建立 Sprint 分支与迭代内工作分支机制

## 相关文档

- [Sprint Plan](sprint-plan.md)
- [Sprint Backlog](sprint-backlog.md)
- [Decisions](decisions.md)
- [ChatGPT + Cursor + docs 协作机制](chatgpt-cursor-docs-workflow.md)
