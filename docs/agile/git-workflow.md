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

## 分支策略

```text
main                              # 稳定主线，可部署
├── sprint/s1-project-foundation  # Sprint 级工作分支（可选）
├── feature/s2-article-block-schema
├── feature/s3-style-system
├── feature/s4-render-copy-pipeline
├── bugfix/<short-name>
└── docs/<short-name>
```

### 分支命名规则

| 前缀 | 用途 | 示例 |
|------|------|------|
| `main` | 稳定主线 | — |
| `sprint/` | Sprint 级集成分支 | `sprint/s1-project-foundation` |
| `feature/` | 功能开发 | `feature/s2-article-block-schema` |
| `bugfix/` | Bug 修复 | `bugfix/copy-border-missing` |
| `docs/` | 纯文档变更 | `docs/style-system-spec` |

### 合并规则

1. 功能分支从 `main` 切出
2. 完成后通过 PR（或本地 review）合并回 `main`
3. `main` 分支始终保持可 build、可 lint 状态
4. 不在 `main` 上直接开发业务功能

## 提交规范

提交信息应简洁说明「为什么」：

```text
<type>: <summary>

[optional body]
```

| type | 用途 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档变更 |
| `chore` | 工程配置 |
| `test` | 测试 |

示例：

```text
docs: finalize style system technical specification

Define theme, preset, variant, registry, slot, density
and preview/copy shared style definition per Sprint 1-B.
```

## .gitignore 覆盖范围

- `node_modules/`
- `.next/`、`out/`、`build/`
- `.env`、`.env.local`、`.env*.local`
- `coverage/`
- `test-results/`、`playwright-report/`
- `.DS_Store`
- `*.tsbuildinfo`

## Sprint 1 Git 历史

| Commit | 内容 |
|--------|------|
| Sprint 1-A | 项目初始化、Cursor 规则、文档骨架 |
| Sprint 1-B | 核心技术方案定稿、Git 治理、Sprint 状态修正 |

## 相关决策

- DECISION-016：Git 主分支为 `main`，采用 feature/sprint/bugfix/docs 分支策略
- DECISION-017：Remote 仓库待配置，配置后 push 至 origin

## 相关文档

- [Sprint Plan](sprint-plan.md)
- [Decisions](decisions.md)
