# Release Plan

> 轻篇公众号排版 · qingpian-wechat-editor

## Release 1 状态

| 项 | 状态 |
|----|------|
| **Release** | Release 1 — **进行中（未关闭）** |
| **主干分支** | `release/1` |
| **已完成 Sprint** | Sprint 1-A/B · Sprint 2 · Sprint 3-A/B/C · Sprint 4-A/B · Sprint 5 · Sprint 6 · Sprint 7 · **Sprint 8** · **Sprint 9** · **Sprint 10** |
| **当前 Sprint** | **Sprint 11** — Production Ops Go-Live（**In Progress** · **DECISION-111**） |
| **专项 Sprint（治理）** | **Sprint 12** — Product Governance & Release 2 Planning（In Progress / Needs Review · 从 `sprint/s11-production-ops-go-live` 建立） |
| **后续 Sprint（规划）** | Sprint 12+ / 13+ — Compat Recalibration · DSL Cleanup · Release 1 Closeout（旧 Compat / DSL 占位需分配新 Backlog / Story ID） |
| **merge `main`** | **未执行** — Release 1 整体验收通过后才 merge |

> Sprint 5~10 已交付可见主链路、样式管理 v0/v1、DSL runtime、Harvest/Promote 等；**Release 1 不能以 lint/test/build alone 关闭**。S11 目标为 **staging/production 正式部署上线**（DECISION-111）。

---

## Release 1 目标（不变）

跑通正式主链路，并建立样式系统、复制一致性、多输入和流式展示地基。

**主链路：**

```text
输入主题 / 资料 / 草稿
  → 触发生成（可有生成过程反馈）
  → 预览完整公众号文章
  → 评审样式
  → 复制微信兼容 HTML
  → 粘贴验证（135 编辑器 · 公众号后台）
```

---

## Release 1 Sprint 索引（方案 B · DECISION-070 + 108 + 111）

| Sprint | 名称 | 核心目标 | 状态 |
|--------|------|----------|------|
| **Sprint 6** | Release 1 Visible AI Main Flow | 首页 → AI 生成 → 预览 → 复制 → 最小粘贴 QA | **Closed** |
| **Sprint 7** | WeChat Article Experience & Style Richness | Gallery · heading publish 8 款 | **Done** |
| **Sprint 8** | WeChat-safe CSS Contract & Fidelity | Contract · Validator · Paste QA | **Closed** |
| **Sprint 9** | Style Management System v0 | file-backed `/dev/style-library` | **Closed** @ `c96e869` |
| **Sprint 10** | Database-backed Style Admin v1 | DB admin · pool · Harvest · Promote · DSL | **Closed**（001~011） |
| **Sprint 11** | **Production Ops Go-Live** | ECS/RDS/OSS/SLS · staging→prod 部署 · 监控 | **In Progress** |
| **Sprint 12** | Product Governance & Release 2 Planning | 9 Story：文档体系审计 · 产品模型 · Story Map · Backlog/覆盖追踪 · R2 路线 · closeout | **In Progress / Needs Review** |
| **Sprint 12+** | Compat + DSL 债务 | 原 S10-012/013 · 旧 S12 ID 不再作为正式 Story ID | **Planned** |
| **Sprint 13+** | Release 1 Closeout | 原 S10-014 · audit · merge main 决策 | **Planned** |

**Sprint 分支：**

- Sprint 10：`sprint/s10-db-backed-style-admin-v1`（Closed · merge `release/1`）
- Sprint 11：`sprint/s11-production-ops-go-live`（从 `release/1`）

---

## Release 1 关闭标准（方案 B）

Release 1 **不再**仅以 `lint` / `test` / `build` / renderer snapshot 作为关闭依据。

### 关闭前置条件（须全部满足）

1. 用户能打开**真实业务页面**（非仅开发文档或测试 harness）。
2. 用户能**输入主题**并**触发生成**。
3. 页面有**生成过程反馈**（流式 / 进度 / 状态）。
4. 用户能看到**完整公众号文章预览**（含 Release 1 首批 block 类型）。
5. 文章样式**不是单一模板**，至少具备**基础丰富度**。
6. 整篇文章**视觉上接近公众号文章**。
7. 用户能**复制**到公众号编辑器（Clipboard `text/html` + `text/plain`）。
8. 粘贴后**核心样式基本一致**（最小 Paste QA 通过或有明确 fallback）。
9. 有**手动 QA 记录**与**遗留问题 backlog**。
10. **（S11 新增）** staging + production 部署验收 · admin 登录 · DB 分发 · 基础监控。

### 明确不宣称

- Sprint 11 上线 **≠** Release 1 自动关闭（须 S13+ Closeout + 用户确认）。
- Sprint 11 **≠** merge `main`。

---

## 相关文档

- [Product Backlog](product-backlog.md)
- [Sprint Plan](sprint-plan.md)
- [Sprint Backlog](sprint-backlog.md)
- [Sprint 11 Plan](sprint11-production-ops-go-live.md)
- [Decisions](decisions.md) — DECISION-070 · 108 · 111
