# 微信公众号实机粘贴 QA 流程（S8-STORY-006）

> 轻篇公众号排版 · qingpian-wechat-editor  
> **Contract：** `wechat-safe-contract-v1` · **Matrix：** [`wechat-fidelity-matrix.md`](wechat-fidelity-matrix.md)  
> **Drift：** [`copy-drift-diagnostics.md`](../../architecture/copy-drift-diagnostics.md)

---

## 1. 流程目标

1. 验证 **Copy HTML** 在**微信公众号后台编辑器**中粘贴后的视觉与结构保真度。
2. **不能**用以下方式替代公众号后台粘贴判定：
   - 浏览器内 Preview  alone
   - 135 编辑器 alone（可作辅助对照，**不作终态裁判**）
   - `validateWechatCopyHtml()` Validator alone
   - Vitest snapshot / CI alone
3. **Validator** 职责：在粘贴前暴露 Contract **Red / Yellow** 风险；**Paste QA** 是发布保真度的**最终裁判**。

---

## 2. 角色分工

| 角色 | 职责 |
|------|------|
| **PO / 用户** | 在微信公众号后台执行粘贴；填写 Session 表 `pasteStatus` / `pasteEvidence`；FAIL/WARNING 时创建 Drift |
| **开发** | 维护 QA pack、Matrix、Profile/Validator；按 Drift 修正 renderer（非本 Story 默认范围） |
| **ChatGPT / 审查者** | 审查 Session 完整性；判断是否可关闭 Story / 开 Bug；**禁止**在无实机记录时宣称 Paste QA Done |

---

## 3. 测试环境记录（Session 必填）

每次 Paste QA Session 须记录：

| 字段 | 说明 |
|------|------|
| 操作系统 | 如 macOS 14.x |
| 浏览器 | 粘贴操作所用浏览器 |
| 微信公众号后台 | 图文消息编辑器 |
| 测试日期 | ISO 日期 |
| 是否经 135 辅助 | 是/否；若仅 135 测过须单独标注，**不能**替代公众号结论 |
| 是否直接粘贴到公众号编辑器 | **必须为「是」** 方可作为 Matrix 正式 evidence |
| 是否查看粘贴后源码/DOM | 建议「是」；记录方式（后台源码 / 审查元素截图路径） |

---

## 4. 标准测试步骤

1. 打开 [`wechat-paste-qa-pack-2026-06-04.md`](wechat-paste-qa-pack-2026-06-04.md) 或当前 Session 文档。
2. 按 **Smoke → Risk → Probe** 顺序（或 Session 指定顺序）选取样本。
3. 复制 **Copy HTML**（pack 内代码块或 `tests/snapshots/wechat-paste-qa/<fixtureId>.html`）。
4. 粘贴到 **微信公众号后台** 正文编辑器（非 135 作为主结论）。
5. 对照三份材料（见 Drift 文档 §2）：
   - 轻篇 Preview（如有）
   - Clipboard HTML（复制源）
   - 粘贴后公众号内效果 / 源码
6. 检查：**字体、字号、行高、颜色、背景、边框、圆角、间距、装饰、结构**。
7. 在 Session 表填写 `pasteStatus`、`pasteEvidence`。
8. 回填 [`wechat-fidelity-matrix.md`](wechat-fidelity-matrix.md) 对应行的 `pasteStatus` / `pasteEvidence` / `contractAction`（及 `driftId` 若适用）。
9. 若 **FAIL** 或 **Contract 相关 WARNING** → 创建 **Drift** 记录（`DRIFT-S8-YYYYMMDD-###`）。

---

## 5. pasteStatus 判定

| 状态 | 定义 |
|------|------|
| **PASS** | 核心视觉与结构与预期基本一致；可作为 waiver / 入池 evidence |
| **WARNING** | 有轻微差异或可接受降级；`pasteEvidence` 必须说明差异点 |
| **FAIL** | 核心样式丢失、结构变形或影响发布；必须关联 Drift |
| **UNTESTED** | 尚未在公众号后台实机粘贴 |

---

## 6. Validator 与 Paste QA 的关系

| 情况 | 处理 |
|------|------|
| Validator **PASS** | **不**等于 Paste PASS；仍须实机测或保持 UNTESTED |
| Validator **WARNING** | **可以**进入 Paste QA；实机可能 PASS / WARNING / FAIL |
| Validator **FAIL** | **不建议**标 Paste PASS；必须进入 **Risk Set** 与 Drift 跟踪；实机可能仍「看起来还行」但 Contract 已违规 |
| Paste **FAIL** | 终态裁判；驱动 Drift / contractAction，即使 Validator 仅 WARNING |

---

## 7. QA 结果回填规则

### 7.1 Matrix（`wechat-fidelity-matrix.md`）

| 列 | 回填要求 |
|----|----------|
| `pasteStatus` | PASS / WARNING / FAIL / UNTESTED |
| `pasteEvidence` | 简短说明 + 日期 + 测试人；PASS 可写「MP editor paste 2026-xx-xx · 一致」 |
| `contractAction` | 无动作 / fallback / waiver / 移出候选 / 修 renderer（引用 Drift） |
| （notes） | 可补充 `evidenceId`（Yellow waiver 实机验证） |

### 7.2 Drift（FAIL / 重要 WARNING）

- 格式：`DRIFT-S8-YYYYMMDD-###`
- Session 表 `driftId` 列填写
- Matrix 行 `contractAction` 可写 `See DRIFT-S8-...`

### 7.3 五条 validator FAIL（Risk Set）

不在 S8-STORY-005/006 修 renderer。实机粘贴用于确认 Red issue 是否转化为视觉失真：

- `S8M-TITLE-002` / `title_left_bar_classic`
- `S8M-TITLE-003` / `title_bottom_line_editorial`
- `S8M-HEAD-002` / `heading_numbered_section`
- `S8M-HEAD-004` / `heading_card_centered`
- `S8M-LEAD-003` / `lead_quote_intro`

---

## 8. 第一轮样本集合（2026-06-04）

| 集合 | 条数 | 文档 |
|------|------|------|
| **Smoke** | 10 | 每类控件 1 条 · [`wechat-paste-qa-session-2026-06-04-s8-story-006.md`](wechat-paste-qa-session-2026-06-04-s8-story-006.md) |
| **Risk** | 5 | validator FAIL |
| **Probe** | 4 | probe variant · 不入 preset |

可选：**`S8M-HEAD-003`**（`heading_highlight_marker` · waiver 实机复测）

---

## 9. 相关文档

| 文档 | 用途 |
|------|------|
| [`wechat-paste-qa-session-2026-06-04-s8-story-006.md`](wechat-paste-qa-session-2026-06-04-s8-story-006.md) | Session 记录表（待 PO 填写） |
| [`wechat-paste-qa-pack-2026-06-04.md`](wechat-paste-qa-pack-2026-06-04.md) | Copy HTML 样本包 |
| [`wechat-fidelity-matrix.md`](wechat-fidelity-matrix.md) | 35 行全量 Matrix |
| [`copy-drift-diagnostics.md`](../../architecture/copy-drift-diagnostics.md) | Drift 编号与闭环 |

---

## 10. 变更记录

| 日期 | 变更 | Story |
|------|------|-------|
| 2026-06-04 | 定稿 Paste QA workflow | S8-STORY-006 |
