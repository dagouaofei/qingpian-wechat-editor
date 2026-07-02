# 轻篇公众号排版

**项目名：** `qingpian-wechat-editor`

本项目是「轻篇」品牌下的**轻篇公众号排版**正式项目，帮助公众号运营者完成文章生成、排版、预览和复制到微信公众号编辑器。

## 产品目标

当前产品目标是帮助公众号运营者从主题、资料或草稿出发，快速生成结构清晰、排版美观的公众号文章，并一键复制到微信公众号编辑器，粘贴效果基本一致。

**Release 1** 聚焦「公众号文章生成、样式排版、流式预览与复制一致性闭环」。

## 命名规范

本项目是正式产品主线。禁止在项目命名、README、文档或代码中使用以下表述：

- clean-core
- v2
- demo
- prototype
- 一键成稿 v2

## 开发规范

后续开发必须遵守以下规则来源：

- `docs/` — 产品、敏捷、架构文档（共享事实源）
- `.cursor/rules/` — Cursor 项目约束规则

## 旧项目经验

新项目可以参考旧「一键成稿 / 秒篇成稿」项目的**经验、原则、测试方法和规则**，但只迁移经验，**不复制旧项目代码或历史实验链路**。详见：

- `docs/agile/migration-reference.md`
- `docs/architecture/prototype-lessons.md`

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- pnpm
- ESLint / Prettier
- Vitest / Playwright（基础配置）
- Zod（后续用于 Schema 校验）

## 快速开始

```bash
pnpm install
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看开发环境。

## 目录结构

```
docs/
  agile/          # 敏捷管理文档
    sprints/      # 各 Sprint 独立详细文档
    releases/     # 各 Release 独立详细文档
  product/        # 产品文档
  governance/     # 产品治理与文档体系升级
  architecture/   # 架构文档
src/
  app/            # Next.js App Router
  components/     # UI 组件
  core/           # 核心业务模块（article / blocks / styles / renderer / copy / generation）
  lib/            # 工具函数
  styles/         # 全局样式
tests/            # 测试
.cursor/rules/    # Cursor 规则
```

## 文档索引

| 目录                                                                                       | 说明                       |
| ------------------------------------------------------------------------------------------ | -------------------------- |
| [docs/product/product-vision.md](docs/product/product-vision.md)                           | 产品愿景                   |
| [docs/product/release-1-scope.md](docs/product/release-1-scope.md)                         | Release 1 范围             |
| [docs/governance/s12-current-system-audit.md](docs/governance/s12-current-system-audit.md) | Sprint 12 当前治理体系审计 |
| [docs/agile/product-backlog.md](docs/agile/product-backlog.md)                             | Product Backlog            |
| [docs/agile/sprint-backlog.md](docs/agile/sprint-backlog.md)                               | Sprint 全局索引与状态总览  |
| [docs/agile/git-workflow.md](docs/agile/git-workflow.md)                                   | Git 工作流与分支策略       |
| [docs/architecture/architecture-overview.md](docs/architecture/architecture-overview.md)   | 架构总览                   |
