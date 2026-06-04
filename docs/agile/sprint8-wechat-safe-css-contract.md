# Sprint 8：WeChat-safe CSS Contract & Fidelity Test System

> 轻篇公众号排版 · qingpian-wechat-editor
>
> **状态：** In Progress（2026-06-04 启动）
> **Sprint 分支：** `sprint/s8-wechat-safe-css-contract`
> **来源分支：** `release/1`
> **决策：** DECISION-088

---

## 1. Sprint 名称与定位

| 项 | 内容 |
|----|------|
| **名称** | S8：WeChat-safe CSS Contract & Fidelity Test System |
| **定位** | 建立轻篇自己的公众号安全样式规范、复制一致性验证体系、失真诊断机制、多控件 variant 粘贴测试矩阵 |
| **为谁服务** | **S9** 文章视觉升级与后续样式开发（不再靠猜、不再单点试错） |
| **不是什么** | 视觉美化 Sprint、网站 UI 改版、streaming/配图/小程序 |

---

## 2. 核心目标（S8 交付物）

1. **WeChat-safe HTML/CSS Contract** — Green / Yellow / Red、标签白名单、DOM 与 inline 规则
2. **Preview / Copy 一致性原则** — 正式 Preview 应尽量展示 Copy-safe HTML
3. **多控件、多 variant 粘贴测试矩阵** — Fidelity Matrix（PASS / FAIL / WARNING / UNTESTED）
4. **Copy 失真诊断与 contract 修正流程** — 三份材料对比 + 修正动作
5. **竞品与开源参考库** — 可借鉴 vs 须验证 vs 不进 Release 1
6. **Compatibility Profile + Copy HTML Validator** — contract 的机器可读与自动校验
7. **公众号实机粘贴 QA 流程** — 不替代自动化，但不跳过实机

---

## 3. Sprint 8 明确不做

1. 不做大规模视觉美化
2. 不做成熟网站 UI 改版
3. 不做 streaming、生成速度优化
4. 不做配图、二维码、小程序
5. 不继续围绕单个 heading 样式反复修
6. 不把复杂样式直接进入默认样式池
7. 不只依赖自动化测试替代公众号实机粘贴 QA

---

## 4. Story 索引

| Story | 名称 | 类型 | 状态 |
|-------|------|------|------|
| S8-STORY-001 | 公开资料与竞品兼容性调研 + Sprint 初始化 | docs | **Done**（详细调研待后续补充 · 2026-06-04） |
| S8-STORY-002 | WeChat-safe HTML/CSS Contract 文档 | docs | **Done**（`wechat-safe-contract-v1` · DECISION-089） |
| S8-STORY-003 | Compatibility Profile 代码实现 | feature | **Done**（`profileId` + `contractVersionId` 分离） |
| S8-STORY-004 | Copy HTML Validator | feature | **Done** |
| S8-STORY-005 | 多控件 Fixture 与 Fidelity Matrix | feature + docs | **Done** |
| S8-STORY-006 | 公众号实机粘贴 QA 流程 | docs | **Done**（2026-06-04 · PO paste 19 行 · Drift 001–009） |
| S8-STORY-006B | 结构化样式调研与 Drift 归类 | docs | **In Review** |
| S8-STORY-006B-FIX-A | 已发布文章 evidence 提取工作流 | docs | **In Review** |
| S8-STORY-006B-FIX-B | 批量补 article evidence（5–10） | docs | Planned |
| S8-STORY-006C | 共性 Copy-safe renderer / fallback 修复 | feature | Planned（**未启动**） |
| S8-STORY-006D | Matrix 回归与 Paste 复测 | docs + QA | Planned（**未启动**） |
| S8-STORY-007 | Preview / Copy 统一渲染方案审计 | docs | Planned（**未启动**） |
| S8-STORY-008 | S8 Contract Audit 与关闭准备 | docs | Planned |

详情见 [`sprint-backlog.md`](sprint-backlog.md) Sprint 8 章节。

---

## 5. 关键文档地图

| 文档 | 路径 | Story |
|------|------|-------|
| 竞品与开源调研 | [`docs/research/wechat-editor-compatibility-reference.md`](../research/wechat-editor-compatibility-reference.md) | 001 · 006B |
| 结构化样式调研 | [`docs/research/wechat-style-structured-research.md`](../research/wechat-style-structured-research.md) | 006B |
| 已发布文章采集 | [`docs/research/wechat-published-article-style-harvest.md`](../research/wechat-published-article-style-harvest.md) | 006B |
| Copy-safe Pattern Library | [`docs/architecture/wechat-copy-safe-pattern-library.md`](../architecture/wechat-copy-safe-pattern-library.md) | 006B |
| Drift Triage | [`docs/agile/paste-qa/drift/s8-drift-triage-2026-06-04.md`](paste-qa/drift/s8-drift-triage-2026-06-04.md) | 006B |
| Contract v1 | [`docs/architecture/wechat-safe-html-css-contract.md`](../architecture/wechat-safe-html-css-contract.md) · `wechat-safe-contract-v1` | 002 Done · DECISION-089 |
| 失真诊断 | [`docs/architecture/copy-drift-diagnostics.md`](../architecture/copy-drift-diagnostics.md) | 001 占位 → 006 流程 |
| Fidelity Matrix | [`docs/agile/paste-qa/wechat-fidelity-matrix.md`](paste-qa/wechat-fidelity-matrix.md) | 005 |
| 历史复制规则 | [`docs/architecture/wechat-copy-style-rules.md`](../architecture/wechat-copy-style-rules.md) | 对齐 002 |

---

## 6. 与 Release 1 / S7 的关系

- **S7** 已完成样式丰富度与 heading 发布池（DECISION-087）；S8 **不继续**单点 heading 修图。
- **S7-STORY-007B**（R1 golden 全文粘贴）承接至 S8 的 Matrix + 实机 QA，不阻塞 S7 关闭。
- **Release 1 关闭** 仍须满足 [`release-plan.md`](release-plan.md) 用户可见条件；S8 建立保真体系 **不等于** 自动关闭 Release 1。
- **S9**（规划外本文档）拟在 S8 contract 闭环后进入「文章视觉升级」。

---

## 7. Git 分支

```text
release/1
  └── sprint/s8-wechat-safe-css-contract
        ├── docs/s8-story-001-compatibility-research  ← Done（已 merge）
        ├── docs/s8-story-002-wechat-safe-contract-doc  ← Done（已 merge）
        ├── feature/s8-story-003-compatibility-profile  ← Done（已 merge）
        ├── feature/s8-story-004-copy-html-validator  ← 下一步
        ├── feature/s8-story-003-compatibility-profile
        └── …
```

**合并方向：** 工作分支 → `sprint/s8-wechat-safe-css-contract` →（Sprint 验收后）`release/1` →（Release 验收后）`main`

---

## 8. 验收口径（Sprint 8 级）

Sprint 8 关闭须用户确认，且至少满足：

- [ ] Contract 文档定稿（002）
- [ ] Profile + Validator 可运行（003、004）
- [ ] Fidelity Matrix 覆盖 10 类控件、每类 2–4 variant（005）
- [ ] 实机粘贴 QA 流程与记录模板可用（006）
- [ ] Preview/Copy 审计结论与后续 Story 拆分（007）
- [ ] S8 audit 报告与 S9 进入条件（008）

---

## 9. 相关决策

- **DECISION-088** — Sprint 8 范围重定义为 Contract & Fidelity Test System
- **DECISION-070** — Release 1 尾声方案 B（Sprint 8 原「Copy Fidelity & Closure」叙事由 088 细化取代）
- **DECISION-006 / 027** — 复制一致性 P0；Done（代码）vs Done（粘贴 QA）分离
