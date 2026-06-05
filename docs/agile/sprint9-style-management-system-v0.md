# Sprint 9：Style Management System v0（样式管理后台 v0）

> 轻篇公众号排版 · qingpian-wechat-editor  
> **中文名：** 样式管理后台 v0  
> **状态：** **Planned**（2026-06-05 经 S8-STORY-008 重排进入 roadmap · DECISION-092）  
> **计划分支（启动时）：** `sprint/s9-style-management-system-v0`（从 `release/1` 切出 · **Sprint 8 收口 merge 后**）  
> **决策：** DECISION-092

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
3. **Admin Shell** — `/admin/style-library` 或 `/dev/style-library` 浏览与操作骨架
4. **Variant 生命周期** — draft → candidate → validator_pass → paste_qa_pass → user_selectable → default_eligible → deprecated
5. **Harvest 入口** — 真实公众号 HTML → candidate variant（**一种**新增方式，非系统全部）
6. **渲染集成** — 候选必须走现有 Preview / Copy Renderer + `validateWechatCopyHtml`
7. **Promote 规则** — 可进 user-selectable pool；**默认不**进 default preset
8. **S9 审计收口** — 判断是否具备进入 S10 批量扩展的基础

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
| S9-STORY-001 | Style Management Domain Model | Planned |
| S9-STORY-002 | File-backed Style Library Storage | Planned |
| S9-STORY-003 | Style Library Admin Shell | Planned |
| S9-STORY-004 | Variant Lifecycle Management | Planned |
| S9-STORY-005 | Harvest HTML to Candidate Workflow | Planned |
| S9-STORY-006 | Preview / Copy / Validator Integration | Planned |
| S9-STORY-007 | Promote to User-selectable Variant | Planned |
| S9-STORY-008 | Style / Palette / Rule Management v0 | Planned |
| S9-STORY-009 | S9 Audit / Closeout | Planned |

详情见 [`sprint-backlog.md`](sprint-backlog.md) Sprint 9 章节。

---

## 6. 建议执行顺序

```text
S9-STORY-001 Domain Model
  → S9-STORY-002 File-backed Storage
  → S9-STORY-003 Admin Shell（只读浏览）
  → S9-STORY-004 Lifecycle
  → S9-STORY-006 Renderer/Validator 集成（与 005 并行准备）
  → S9-STORY-005 Harvest → Candidate
  → S9-STORY-007 Promote
  → S9-STORY-008 Style / Palette / Rule v0
  → S9-STORY-009 Audit / Closeout
```

---

## 7. 与 Sprint 10 关系

**Sprint 10（初步）：** Style Expansion & Visual Quality Upgrade — 基于 S9 v0 批量扩展真实公众号启发样式、风格包、配色包与 block variants，并优化自动样式匹配。详见 [`product-backlog.md`](product-backlog.md)。

---

## 8. 相关决策

- **DECISION-092** — Style Management System v0 独立为 Sprint 9；file-backed；非独立仓库/部署
- **DECISION-088** — S8 为 fidelity 体系；不扩展后台
- **DECISION-091** — 视觉升级与 harvest 入库路由调整
