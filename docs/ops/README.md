# 轻篇公众号排版 · 运维与部署文档

> qingpian-wechat-editor · Sprint 10 ops docs（S10-STORY-007）

本目录为**正式部署前**的操作手册与检查清单，不包含真实 secret、连接串或 AccessKey。

## 文档索引

| 文档 | 用途 |
|------|------|
| [`aliyun-deployment-runbook.md`](aliyun-deployment-runbook.md) | 阿里云 ECS / RDS / OSS / SLS / CloudMonitor 手工部署主 Runbook |
| [`aliyun-resource-checklist.md`](aliyun-resource-checklist.md) | 资源创建与隔离检查清单 |
| [`environment-variables.md`](environment-variables.md) | 环境变量与 secret 管理（local / staging / production） |
| [`production-release-checklist.md`](production-release-checklist.md) | 上线与生产验收清单 |
| [`incident-and-rollback-runbook.md`](incident-and-rollback-runbook.md) | 故障处理与回滚手册 |

## 关联架构

- [`../architecture/style-management-admin-v1.md`](../architecture/style-management-admin-v1.md) §9 阿里云部署概要
- [`../agile/sprint10-database-backed-style-admin-v1.md`](../agile/sprint10-database-backed-style-admin-v1.md)

## 本轮范围（S10-STORY-007）

- **做：** Runbook · 资源清单 · 环境变量说明 · 验收与回滚文档 · `GET /api/health`
- **不做：** 真实创建阿里云资源 · 连接生产 RDS · OSS / SLS SDK · CI/CD
