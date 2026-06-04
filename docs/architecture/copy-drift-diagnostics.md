# Copy 失真诊断与 Contract 修正

> 轻篇公众号排版 · qingpian-wechat-editor
>
> **状态：** **S8-STORY-006 可执行流程** · **Contract：** [`wechat-safe-html-css-contract.md`](wechat-safe-html-css-contract.md) **`wechat-safe-contract-v1`**
> **关联：** Fidelity Matrix · Paste QA Workflow · DECISION-088 · DECISION-089 · DECISION-090

---

## 1. Copy 失真的定义

**Copy 失真：** 用户在轻篇侧看到的 **Preview**、复制得到的 **Clipboard HTML**、粘贴进 **微信公众号编辑器** 后的视觉或结构，三者之间存在**不可接受的差异**，且差异可归因于 HTML/CSS/DOM/平台过滤，而非内容语义变化。

**可接受差异：** 字体回退（系统字体）、亚像素级间距、微信编辑器 chrome 不影响正文的差异——须在 Matrix 标 **WARNING** 并说明，不得标 PASS 冒充一致。

---

## 2. 三份材料对比

| 材料 | 来源 | 用途 |
|------|------|------|
| **Preview HTML** | 编辑器内预览 DOM（或导出快照） | 用户「以为」会看到的效果 |
| **Clipboard HTML** | `text/html` 剪贴板 payload | Copy Renderer 直接产物 · Validator 输入 |
| **WeChat pasted** | 公众号后台粘贴后「查看源码」或审查元素 | **终态裁判** |

**诊断步骤：**

1. 对同一 `fixtureId` + `variantId`（Matrix `matrixRowId`）固定样本。
2. 分别保存三份 HTML（或规范化 diff）。
3. 标注首次出现差异的层级（属性 / 节点 / 上下文）。

---

## 3. 失真类型

| 类型 | 描述 | 典型原因 |
|------|------|----------|
| **CSS 被删除** | inline 属性整段消失 | 微信白名单过滤 |
| **CSS 被改写** | 值变化（如 `px`→`em`、颜色归一） | 编辑器规范化 |
| **DOM 被改写** | 标签替换、子节点合并/剥离 | 消毒 / 扁平化 |
| **样式保留但表现异常** | 属性仍在但视觉不对 | 字体、行高上下文、父级样式 |
| **上下文导致失效** | 相邻块、外层 `section` 影响 | 嵌套过深、非法父节点 |

---

## 4. contract 修正动作

| 动作 | 何时使用 |
|------|----------|
| **Green 降级 Yellow** | 实机多次 WARNING 或偶发 FAIL |
| **Yellow 降级 Red** | 实机稳定 FAIL，fallback 也无法接受 |
| **Red 升级 Yellow** | 有可靠 fallback + 新 Matrix PASS 证据 |
| **增加 block / variant 豁免** | 业务必须保留且风险可控；须 PO 签字 + `evidenceId` |
| **增加 fallback** | Renderer 可在输出前自动降级 |
| **移出默认 preset** | 保留 variant 但不进入 `release1_required` / 默认池 |

每次修正须更新：**Contract v1** · Compatibility Profile · Validator · Matrix 行 ·（若分级变化）`decisions.md` · `changelog.md`。

完整步骤见 Contract v1 §9。

---

## 5. Drift ID 规则（S8-STORY-006）

| 规则 | 说明 |
|------|------|
| **格式** | `DRIFT-S8-YYYYMMDD-###`（三位序号，当日递增） |
| **示例** | `DRIFT-S8-20260604-001` |
| **存放** | `docs/agile/paste-qa/drift/`（建议单文件 `DRIFT-S8-20260604-001.md` 或集中 ledger） |
| **关联** | Matrix 行 `pasteEvidence` / Session `driftId` / `contractAction` |

---

## 6. Drift 触发条件

在以下情况**必须**创建 Drift（或更新已有 Drift）：

1. Matrix / Session **`pasteStatus = FAIL`**
2. **`pasteStatus = WARNING`** 且涉及 Contract 分级决策（Yellow waiver 是否成立、是否降级）
3. **Validator PASS**（或无 error）但 **Paste FAIL**（机器与实机分叉）
4. **Yellow waiver** 实机失效（如 `heading_highlight_marker` 渐变被剥离）
5. 微信粘贴后 **DOM/CSS 明显改写**（与 Clipboard diff 可复现）

**不触发 alone：** 仅 Validator WARNING（如 `section` 标签）且实机 PASS — 记 Matrix WARNING 即可，可选 Drift。

---

## 7. Drift 记录字段

```markdown
### DRIFT-S8-YYYYMMDD-###

| 字段 | 值 |
|------|-----|
| matrixRowId | S8M-… |
| fixtureId | s8-… |
| blockType | title / heading / … / summary→highlight |
| variantId | … |
| cssCapability | （来自 Matrix） |
| validatorStatus | PASS / WARNING / FAIL |
| pasteStatus | FAIL / WARNING |
| evidenceId | （若 Yellow waiver） |

#### 三份材料
- Preview HTML：（路径 / hash / 未采集）
- Clipboard HTML：`tests/snapshots/wechat-paste-qa/<fixtureId>.html`
- WeChat pasted HTML：（PO 粘贴后导出 / 截图路径）

#### 失真类型
（§3 选一或组合）

#### 根因假设
（微信过滤 / renderer Red 输出 / Preview-Copy 分叉 / …）

#### contractAction
（fallback / waiver / 移出候选 / Green→Yellow / 修 renderer）

#### fallback 建议
（引用 `wechat-fallback-policy` id）

#### follow-up story
（Bug / S8 后续 / S9 视觉）

#### 状态
OPEN / IN_REVIEW / FIXED / WONTFIX
```

---

## 8. 与 Fidelity Matrix 的关系

| 方向 | 规则 |
|------|------|
| Matrix → Paste | 每行须有 `pasteStatus`；实机后更新 `pasteEvidence` |
| Paste → Drift | FAIL（及重要 WARNING）创建 `DRIFT-S8-*` |
| Drift → Matrix | `contractAction` 列引用 Drift；关闭 Drift 后更新 evidence |
| Validator | **不**因 Paste PASS 而自动改 `validatorStatus`；Contract 变更后重跑 builder 刷新 Matrix |

**Risk Set（五条 validator FAIL）：** 不在 STORY-005/006 修 renderer；实机结果写入 Session/Matrix/Drift，再决定 fallback、waiver、移出候选或后续 renderer/Contract 修正。

---

## 9. Validator 与 Drift 的分工

| 阶段 | 工具 | 发现什么 |
|------|------|----------|
| **复制前 / CI** | `validateWechatCopyHtml` | Red 标签/CSS、class、未豁免 Yellow 等 |
| **实机粘贴** | 公众号后台 | 视觉与结构失真（终态） |
| **闭环** | Drift + Matrix | 驱动 Profile / Contract / Renderer 决策 |

**原则：** Validator PASS ≠ Paste PASS；Validator FAIL 必须跟踪；Paste FAIL 必须 Drift。

**Matrix：** [`docs/agile/paste-qa/wechat-fidelity-matrix.md`](../agile/paste-qa/wechat-fidelity-matrix.md)

**Paste QA：** [`docs/agile/paste-qa/wechat-paste-qa-workflow.md`](../agile/paste-qa/wechat-paste-qa-workflow.md)

---

## 10. 与 S8-STORY-007 的关系

| 失真根因 | 跟进 |
|----------|------|
| Preview 与 Copy **渲染分叉** | **S8-STORY-007** Preview/Copy 统一渲染审计 |
| 微信剥离 CSS / DOM | Contract / Profile / Renderer fallback（S8） |
| 单纯「不好看」 | **不在 S8 解决** → Release 2 / S9 视觉 |

---

## 11. PO 与开发闭环

```text
PO 公众号粘贴 → Session 表 → Matrix pasteStatus
  → FAIL/WARNING → DRIFT-S8-*
  → 开发修正 Profile / Contract / Renderer（按决策）
  → 重跑 Validator + Matrix builder + PO 复测
  → 关闭 Drift
```

**禁止：** 仅凭 Validator 或 snapshot 标 Matrix Paste PASS。

---

## 12. 变更记录

| 日期 | 变更 | Story |
|------|------|-------|
| 2026-06-04 | 创建草案 | S8-STORY-001 |
| 2026-06-04 | 对齐 Contract v1 术语与 §9 修正流程 | S8-STORY-002 |
| 2026-06-04 | 补充 Validator vs Drift 分工 | S8-STORY-004 |
| 2026-06-04 | 第一版 Fidelity Matrix（35 行 · paste UNTESTED） | S8-STORY-005 |
| 2026-06-04 | Drift ID 规则 · 触发条件 · 与 007 分工 · Paste QA 闭环 | S8-STORY-006 |
