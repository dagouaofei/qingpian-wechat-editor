# Release Plan

> 轻篇公众号排版 · qingpian-wechat-editor

## Release 1 状态

| 项 | 状态 |
|----|------|
| **Release** | Release 1 — **进行中（未关闭）** |
| **主干分支** | `release/1` |
| **已完成 Sprint** | Sprint 1-A/B · Sprint 2 · Sprint 3-A/B/C · Sprint 4-A/B · Sprint 5 · **Sprint 6** |
| **当前 Sprint** | **Sprint 8** — **WeChat-safe CSS Contract & Fidelity Test System**（**In Progress** · 006D/008 Done · 007/009 收口 · DECISION-088~092） |
| **下一 Sprint** | **Sprint 9** — Style Management System v0（**Planned** · DECISION-092） |
| **上一 Sprint** | **Sprint 7** — **Done**（2026-06-03 · merge `release/1`） |
| **merge `main`** | **未执行** — Release 1 整体验收通过后才 merge |

> Sprint 5 已交付 Generation / Streaming 技术框架与 `/generate` 初版主链路（DECISION-069），但 **Release 1 不能以 lint/test/build/snapshot  alone 关闭**。Release 1 尾声已按 **方案 B（DECISION-070）** 重排为用户可见主链路 → 公众号文章体验 → 复制保真与关闭。

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

## Release 1 剩余 Sprint（方案 B · DECISION-070）

| Sprint | 名称 | 核心目标 | 状态 |
|--------|------|----------|------|
| **Sprint 6** | **Release 1 Visible AI Main Flow** | 真实 AI 用户侧最小闭环：首页 → 真实 AI 生成 → 带样式预览 → 风格 / 配色 → 复制 → 最小粘贴 QA | **Closed**（DECISION-078） |
| **Sprint 7** | **WeChat Article Experience & Style Richness** | 整篇文章像公众号文章；Style Gallery；样式丰富度；miaopian 协作对齐；**8 套**完整视觉样例 | **Done**（2026-06-03） |
| **Sprint 8** | **WeChat-safe CSS Contract & Fidelity Test System** | Contract · Validator · Matrix · Paste QA · Copy-safe 修复（006C/006D）；**收口** 007/009 → merge `release/1` | **In Progress**（DECISION-088） |
| **Sprint 9** | **Style Management System v0**（样式管理后台 v0） | 主项目内样式资产新增/验证/上线/分发闭环；file-backed；harvest 为入口之一 | **Planned**（DECISION-092） |
| **Sprint 10** | **Style Expansion & Visual Quality Upgrade** | 基于 S9 批量扩展样式与自动匹配 | **Planned（方向 only）** |

**Sprint 分支（启动时从 `release/1` 切出）：**

- Sprint 6：`sprint/s6-visible-ai-main-flow`
- Sprint 7：`sprint/s7-wechat-article-experience`（名称可在 Sprint 7 启动 Story 中最终确认）
- Sprint 8：`sprint/s8-wechat-safe-css-contract`（DECISION-088 · 2026-06-04 启动）

**原 Release 1 尾声计划变更说明：**

- 原 **Sprint 6-A（Fixture Triple）** / **Sprint 6-B（Paste QA）** 拆分（DECISION-045）在 Release 1 **剩余阶段**由方案 B 取代。
- Fixture / snapshot / PasteTestRecord 能力分别纳入 Sprint 6（可见主链路所需最小 fixture）、Sprint 7（文章样例与 Gallery）、Sprint 8（粘贴 QA 记录与 Release 关闭）。

---

## Release 1 关闭标准（方案 B）

Release 1 **不再**仅以 `lint` / `test` / `build` / renderer snapshot 作为关闭依据。

### 关闭前置条件（须全部满足）

1. 用户能打开**真实业务页面**（非仅开发文档或测试 harness）。
2. 用户能**输入主题**并**触发生成**。
3. 页面有**生成过程反馈**（流式 / 进度 / 状态），不能只是静态 Renderer 演示。
4. 用户能看到**完整公众号文章预览**（含 Release 1 首批 block 类型）。
5. 文章样式**不是单一模板**，至少具备**基础丰富度**（多 variant / 多 block 样式组合）。
6. 整篇文章**视觉上接近公众号文章**（非过度卡片化 demo 感）。
7. 用户能**复制**到公众号编辑器（Clipboard `text/html` + `text/plain`）。
8. 粘贴后**核心样式基本一致**（135 编辑器 + 微信公众号后台最小 Paste QA 通过或有明确 fallback）。
9. 有**手动 QA 记录**与**遗留问题 backlog**（含已知 unsupported / fallback 项）。

### 明确不宣称

- Sprint 5 关闭 **≠** Release 1 完成。
- Sprint 6 可见主链路 **≠** 复制保真已通过（归 Sprint 8）。
- Style Gallery / 样式丰富度 **≠** Sprint 6 必交付（归 Sprint 7）。

---

## Sprint 6 / 7 / 8 Story 索引

详见 [`sprint-backlog.md`](sprint-backlog.md)：

- **Sprint 6：** S6-STORY-001 ~ S6-STORY-006
- **Sprint 7：** S7-STORY-001 ~ S7-STORY-007
- **Sprint 8：** S8-STORY-001 ~ S8-STORY-009 · [`sprint8-wechat-safe-css-contract.md`](sprint8-wechat-safe-css-contract.md)
- **Sprint 9：** S9-STORY-001 ~ S9-STORY-009 · [`sprint9-style-management-system-v0.md`](sprint9-style-management-system-v0.md)
- **Sprint 10：** 方向见 [`product-backlog.md`](product-backlog.md)（无 story 清单）

---

## 相关文档

- [Product Backlog](product-backlog.md)
- [Sprint Plan](sprint-plan.md)
- [Sprint Backlog](sprint-backlog.md)
- [User Story Map](../product/user-story-map.md)
- [Release 1 范围](../product/release-1-scope.md)
- [Decisions](decisions.md) — DECISION-070
