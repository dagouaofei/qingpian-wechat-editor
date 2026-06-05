# Sprint 9：Style Management System v0（样式管理后台 v0）

> 轻篇公众号排版 · qingpian-wechat-editor  
> **中文名：** 样式管理后台 v0  
> **状态：** **In Progress**（2026-06-05 启动 · **DECISION-094**）  
> **分支：** `sprint/s9-style-management-system-v0`（从 `release/1` 切出 · 2026-06-05）  
> **领域模型：** [`style-management-domain-model.md`](../architecture/style-management-domain-model.md)  
> **存储：** [`style-library-storage.md`](../architecture/style-library-storage.md)  
> **Admin Shell：** [`style-library-admin-shell.md`](../architecture/style-library-admin-shell.md) · `/dev/style-library`  
> **决策：** DECISION-092 · **DECISION-094** · **DECISION-095** · **DECISION-096** · **DECISION-097** · **DECISION-098**

---

## 1. Sprint 名称与定位

| 项 | 内容 |
|----|------|
| **名称** | S9：Style Management System v0 |
| **定位** | 轻篇**主项目内**独立子系统 — 样式资产从新增、验证、上线到用户侧分发的**最小闭环** |
| **不是什么** | 独立仓库 · 独立部署 · 数据库后台 · 多用户权限 · 样式市场 · 批量 URL 抓取 · 完整 SaaS 运营后台 |
| **与 S8 关系** | S8 完成 WeChat Fidelity Reset；**采集样式入库 / 后台管理不再塞进 S8**（DECISION-092） |

---

## 2. 核心目标

1. **领域模型** — style / style family · palette · variant · preset · copy-safe rule · selection rule · lifecycle · QA evidence
2. **File-backed 存储** — Git 可审查的 source of truth；metadata · registry patch · rollback 边界
3. **Operator Workbench** — `/dev/style-library` 面向**运营管理人员**的样式管理工作台 v0（非 manifest 技术浏览器）
4. **Variant 生命周期** — 运营可见 lifecycle pipeline + 最小状态流转（S9-STORY-004）
5. **Harvest 入口** — 新增候选样式向导：粘贴 HTML / 采集片段 → candidate review（S9-STORY-005）
6. **运营可读验证面板** — 候选样式 Preview · Copy HTML · validator 结果（S9-STORY-006）
7. **Promote 审查** — 运营可执行 promote review：进入 user-selectable；**默认不**进 default preset（S9-STORY-007）
8. **Style / Palette / Rule 运营入口** — 至少可读列表与基础管理入口（S9-STORY-008 · **P0**）
9. **S9 运营验收 audit** — 判断是否具备进入 S10 批量扩展的基础（S9-STORY-009）

**Sprint 9 关闭标准（DECISION-097）：** 不是 manifest / storage / validator 技术闭环 alone；必须形成运营人员可理解、可操作的 **Style Management Workbench v0**，并通过运营验收场景（见 §10）。

---

## 3. Sprint 9 明确不做

1. 不新建独立仓库或独立部署项目
2. 不上数据库（v0 为 file-backed / code-backed）
3. 不做多用户权限与审批流
4. 不做样式市场 / 模板商城
5. 不做批量 URL 抓取公众号文章
6. 不做完整 SaaS 化运营后台
7. 不在 S9 批量视觉升级（归 **Sprint 10**）

---

## 4. Seed Assets（来自 S8-STORY-006D）

006D 两个 harvest candidate 作为 S9 **首批输入样本**，当前状态保持：

| matrixRowId | variantId | 状态 | S9 角色 |
|-------------|-----------|------|---------|
| S8M-HARVEST-001 | `heading_purple_chapter_label_candidate` | candidate-paste-pass | seed asset · pool review 输入 |
| S8M-HARVEST-002 | `info_card_reading_path_candidate` | candidate-paste-pass | seed asset · pool review 输入 |

**禁止（本轮规划）：** 直接改为 user-selectable 或 default preset。

证据：[`WX-HARVEST-EVIDENCE-001`](../research/wechat-published-article-evidence/WX-HARVEST-EVIDENCE-001.md) · Session [`wechat-paste-qa-session-2026-06-05-s8-story-006d.md`](paste-qa/wechat-paste-qa-session-2026-06-05-s8-story-006d.md)

---

## 5. Story 索引

| Story | 名称 | 状态 |
|-------|------|------|
| S9-STORY-001 | Style Management Domain Model | **Done**（2026-06-05 · [`style-management-domain-model.md`](../architecture/style-management-domain-model.md)） |
| S9-STORY-002 | File-backed Style Library Storage | **Done**（2026-06-05 · [`style-library-storage.md`](../architecture/style-library-storage.md) · DECISION-095） |
| S9-STORY-003 | Style Library Admin Shell | **In Review**（FIX-A operator workbench · FIX-B zh/en i18n · `/dev/style-library` · DECISION-096 · **DECISION-097** · **DECISION-098**） |
| S9-STORY-004 | Variant Lifecycle Management | Planned · **运营可见 lifecycle pipeline + 最小状态流转** |
| S9-STORY-005 | Harvest HTML to Candidate Workflow | Planned · **新增候选样式向导：粘贴 HTML / 采集片段 → candidate review** |
| S9-STORY-006 | Preview / Copy / Validator Integration | Planned · **候选样式 Preview · Copy HTML · validator 运营可读面板** |
| S9-STORY-007 | Promote to User-selectable Variant | Planned · **运营 promote review：进入 user-selectable · 默认不进 default preset** |
| S9-STORY-008 | Style / Palette / Rule Management v0 | Planned · **P0** · 运营可读列表与基础管理入口 |
| S9-STORY-009 | S9 Audit / Closeout | Planned · **运营验收 audit + 技术 audit** |

详情见 [`sprint-backlog.md`](sprint-backlog.md) Sprint 9 章节。

---

## 6. 建议执行顺序

```text
S9-STORY-001 Domain Model
  → S9-STORY-002 File-backed Storage
  → S9-STORY-003 Admin Shell（operator workbench · 只读）
  → S9-STORY-004 Lifecycle（运营 pipeline + 最小流转）
  → S9-STORY-006 运营可读 Preview / Copy / Validator 面板
  → S9-STORY-005 Harvest 候选样式向导
  → S9-STORY-007 Promote review
  → S9-STORY-008 Style / Palette / Rule 运营入口（P0）
  → S9-STORY-009 运营 + 技术 audit / closeout
```

---

## 10. 运营验收场景（DECISION-097 · Sprint 9 关闭前必须通过）

S9 关闭前，运营人员应能完成或模拟完成以下场景：

| # | 场景 | 承接 Story |
|---|------|------------|
| 1 | 能打开后台入口 | S9-STORY-003 |
| 2 | 能看到候选样式池 | S9-STORY-003 · 004 |
| 3 | 能看懂候选样式状态 | S9-STORY-003 · 004 |
| 4 | 能看到 preview / copy / validator 结果 | S9-STORY-006 |
| 5 | 能完成或模拟完成 promote 路径 | S9-STORY-007 |
| 6 | 能清楚区分 user_selectable 与 default_eligible | S9-STORY-003 · 007 · 008 |
| 7 | 能支撑 S10 批量样式扩展 | S9-STORY-008 · 009 |

当前 S9-STORY-003-FIX-A 仅覆盖场景 1~3 的**只读雏形**；场景 4~7 由后续 Story 承接。

---

## 7. 与 Sprint 10 关系

**Sprint 10（初步）：** Style Expansion & Visual Quality Upgrade — 基于 S9 v0 批量扩展真实公众号启发样式、风格包、配色包与 block variants，并优化自动样式匹配。详见 [`product-backlog.md`](product-backlog.md)。

---

## 8. 启动条件（S8-STORY-009 审计 · 2026-06-05）

| # | 条件 | 状态 |
|---|------|------|
| 1 | Contract v1 + Profile + Validator 可运行 | **满足** |
| 2 | Fidelity Matrix + Paste QA 流程 | **满足** |
| 3 | Drift / Pattern Library 文档 | **满足** |
| 4 | Harvest seed assets（006D） | **满足** |
| 5 | DECISION-092 story map | **满足** |
| 6 | S8 audit 报告 | **满足** · [`sprint8-wechat-contract-fidelity-audit.md`](../architecture/audits/sprint8-wechat-contract-fidelity-audit.md) |
| 7 | `sprint/s8-wechat-safe-css-contract` merge `release/1` | **满足** · DECISION-093 · `806fa47` |

---

## 9. 相关决策

- **DECISION-098** — Workbench v0 支持 zh/en 双语；默认中文；范围限定 `/dev/style-library`
- **DECISION-097** — Sprint 9 operator-facing acceptance；关闭标准以运营 Workbench 为准
- **DECISION-096** — Admin Shell v0 路由 `/dev/style-library`；内部只读 · 无权限
- **DECISION-095** — Style Library v0 code-backed TS manifest · 独立 `@/core/style-library`
- **DECISION-094** — 正式启动 Sprint 9；创建 `sprint/s9-style-management-system-v0`；S9-STORY-001 Domain Model Done
- **DECISION-092** — Style Management System v0 独立为 Sprint 9；file-backed；非独立仓库/部署
- **DECISION-093** — Sprint 8 关闭；S9 启动条件满足
- **DECISION-088** — S8 为 fidelity 体系；不扩展后台
- **DECISION-091** — 视觉升级与 harvest 入库路由调整
