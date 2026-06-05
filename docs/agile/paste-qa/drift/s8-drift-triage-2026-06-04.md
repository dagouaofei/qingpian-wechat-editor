# S8 Drift Triage — 2026-06-04（S8-STORY-006B）

> **输入：** Paste QA Session 2026-06-04 · 19 行 Matrix · Drift `DRIFT-S8-20260604-001` ~ `009`  
> **输出：** 共性分类 + Pattern 映射 + 后续 Story 路由  
> **关联：** [`s8-drift-triage`](.) · [`README.md`](README.md) · [`wechat-copy-safe-pattern-library.md`](../../../architecture/wechat-copy-safe-pattern-library.md)

---

## 1. 总览

| 类 | 主题 | Drift / Matrix | 建议主 Story |
|----|------|----------------|--------------|
| **A** | 卡片背景 / 边框丢失 | 004 · 005 · 006 · 007（+003 观察） | **S8-STORY-006C** |
| **B** | 左侧竖线 / border-left 丢失 | 007（部分）· 009 | **S8-STORY-006C** |
| **C** | 标题装饰线 / 标题结构异常 | 001 · 002 · 008 | **S8-STORY-006C** |
| **D** | Validator FAIL · Paste PASS | S8M-HEAD-002 | **S8-STORY-007** |
| **E** | 测试口径 / 预期待确认 | 003 | 产品澄清 → 再路由 |

**不进入本轮：** 修改 Contract v1 分级 · 新增 variant · 启动 006C/007 实现。

### 1.1 Evidence 与 006C / 006D（006B-FIX-A）

| 依据 | 层级 | 对 006C |
|------|------|---------|
| PO Paste QA + Drift + Matrix | **实机** | **主依据** — 不因 harvest 缺证而阻塞 |
| Pattern Library v0.1 | 文档 | 结构规范 |
| HARVEST-001~015 | **L0** pattern-hypothesis | 辅助假设 only |
| `WX-HARVEST-EVIDENCE-*`（待补） | L2/L3/L4 | 可增强，非 006C 前置 |

- **已发布文章 harvest 目前为 L0 支撑**，不声称 15 篇可审计实采。
- **006C 可启动**（用户批准后）基于 Paste/Drift；**006D 必须** Paste Re-test 验证修复。

---

## 2. A 类 — 卡片背景 / 边框丢失

### 问题描述

PO 粘贴后 **看不到卡片边框与背景色**（及 probe 横幅类组合样式）。Clipboard 含 `section` + 背景/边框，微信侧常 **剥离外层** 或仅保留内层无样式文本。

### 涉及 Matrix 行

| matrixRowId | pasteStatus |
|-------------|-------------|
| S8M-CARD-001 | WARNING |
| S8M-PARA-004 | FAIL |
| S8M-SUM-004 | FAIL |
| S8M-CARD-004 | FAIL |
| S8M-TITLE-001 | WARNING（**观察** · 见 E 类） |

### 涉及 Drift

- DRIFT-S8-20260604-004 · 005 · 006 · 007  
- DRIFT-003（可能非同类，待产品确认）

### 可能根因

1. **样式写在外层 `section`**，公众号粘贴后外层被剥或不起作用（调研 §10 共性 #1）。  
2. Yellow 属性（`border-radius` · `box-shadow`）触发降级时 **连带删除** `background-color`（待 006C 用三份材料 diff 验证）。  
3. probe 布局双层 wrapper 加深 nesting。

### 与 Contract v1 的关系

- `background-color` · `border` 为 **Green**，问题不在「禁止」而在 **DOM 落点**。  
- `section` 为 **Yellow wrapper** — 允许但不保证装饰性外壳保留。  
- **本轮不降级/升级 Contract**；006C 改 renderer 符合 Pattern `copy-safe-card` / `copy-safe-info-box`。

### 竞品/文章调研支撑

- 135 / 行业归纳：**背景在 `p` 更稳**（HARVEST L0 假设，待 L2/L3 evidence 验证）。  
- 见 [`wechat-style-structured-research.md`](../../../research/wechat-style-structured-research.md) · [`harvest-input-template`](../../../research/wechat-published-article-harvest-input-template.md)。

### 建议 Copy-safe Pattern

- **`copy-safe-card`**  
- **`copy-safe-info-box`**  
- **`copy-safe-highlight-band`**（色带类合并）

### 后续处理方式

| 项 | 说明 |
|----|------|
| **006C** | **P0** — 样式下沉至 `p`；统一 fallback 去 shadow/radius 保留底+边 |
| **006D** | 004–007 行 re-paste 验收 |
| **007** | 无（除非 Preview 展示外层壳导致误判） |
| **S9** | 更丰富的卡片视觉在保真通过后再做 |

---

## 3. B 类 — 左侧竖线 / border-left 丢失

### 问题描述

**最左侧竖线不显示**（lead 引言）或 **卡片左线+背景同时丢失**（info banner probe）。

### 涉及 Matrix 行

| matrixRowId | pasteStatus |
|-------------|-------------|
| S8M-LEAD-003 | WARNING |
| S8M-CARD-004 | FAIL（含左线+背景） |

### 涉及 Drift

- DRIFT-S8-20260604-009  
- DRIFT-S8-20260604-007（与 A 类重叠）

### 可能根因

1. `border-left` 写在 **与文本分离** 的节点或外层 section。  
2. 与 A 类同时发生时，左线随背景一并被剥。  
3. `font-style` 等 Red 标记存在但 Paste 为 WARNING（非主因）。

### 与 Contract v1 的关系

- `border-left` 为 **Green** — 须保证与内容 **同节点** `p`。  
- 不新增 waiver；不修 Contract。

### 竞品/文章调研支撑

- HARVEST-005/007/010 · mdnice 引用块模式。  
- Pattern **`copy-safe-left-border`**。

### 后续处理方式

| 项 | 说明 |
|----|------|
| **006C** | **P0** — 与 A 类一并改 DOM；007 左线禁止分栏 |
| **006D** | LEAD-003 · CARD-004 re-paste |
| **007** | 否 |
| **S9** | 装饰性双竖线等延后 |

---

## 4. C 类 — 标题装饰线 / 标题结构异常

### 问题描述

1. **DRIFT-001：** 标题左条布局变成 **左右三等分**，方框与竖线错位。  
2. **DRIFT-002：** 标题下划线变成 **高长方形/错误边框**。  
3. **DRIFT-008：** 标题卡 **上下横线不显示**。

### 涉及 Matrix 行

| matrixRowId | pasteStatus |
|-------------|-------------|
| S8M-TITLE-002 | FAIL |
| S8M-TITLE-003 | FAIL |
| S8M-HEAD-004 | WARNING |

### 涉及 Drift

- DRIFT-001 · 002 · 008

### 可能根因

1. **多列/多子节点** 模拟左条（001）— 微信当 layout 重排。  
2. `border-bottom` + 大 `padding`/`border` 盒模型（002）。  
3. 卡片式 `h3` 背景/上下线写在 **外层或 Yellow 组合** 被剥（008）。

### 与 Contract v1 的关系

- TITLE-002 含 **Red CSS**（validator FAIL）— Paste 亦 FAIL，一致。  
- 本轮 **不** 为通过 Paste 而删除 Red 规则；应 **改 DOM** 消 Red。  
- `title_left_bar_classic` 保持 **candidate** 直至 006C 修复后 Matrix PASS。

### 竞品/文章调研支撑

- 135/秀米多列标题风险 · HARVEST-002 细线下划线。  
- Pattern **`copy-safe-title-divider`**。

### 后续处理方式

| 项 | 说明 |
|----|------|
| **006C** | **P0** — 单节点标题+细 border；重写 left_bar / bottom_line DOM |
| **006D** | Risk Set 三行 re-paste |
| **007** | 否 |
| **S9** | 复杂杂志风标题延后 |

---

## 5. D 类 — Validator FAIL · Paste PASS

### 问题描述

`heading_numbered_section`：**Validator FAIL**（`WECHAT_COPY_RED_CSS`）但 **公众号粘贴 PASS**。

### 涉及 Matrix 行

- **S8M-HEAD-002** — paste PASS · contractAction: track before Contract downgrade

### 涉及 Drift

- **无独立 Drift 文件**（按 006 审查结论：不单独开 renderer bug Drift）

### 可能根因

1. Validator 对某声明过严（如 `font-style` / `display` 组合）而微信 **仍保留视觉效果**。  
2. 序号 `span` + `inline-block` 在实机可接受但触发 Red。

### 与 Contract v1 的关系

- **本轮不放宽 Red/Yellow**（用户审查明确）。  
- 应在 **007** 审计：Preview vs Copy vs Validator 三角；或 006C 仅 **减 Red 触发**（改 HTML 结构）而非改 Contract。

### 竞品/文章调研支撑

- HARVEST-009 列表序号 inline — 说明此类结构行业常见。

### 建议 Copy-safe Pattern

- 列表/序号模式待 006C 后补充子 pattern；暂沿用现有 `ol`+`span` 结构优化。

### 后续处理方式

| 项 | 说明 |
|----|------|
| **006C** | 可选：仅 **减少无效 Red 触发**（结构微调），**不以 Paste 为由降 Contract** |
| **006D** | HEAD-002 保持监控 |
| **007** | **主归属** — validator false positive / 过严观察清单 |
| **S9** | 否 |

---

## 6. E 类 — 测试口径 / 预期待确认 → **已澄清（2026-06-05）**

### 问题描述

`title_plain_minimal` Paste **WARNING**：「没有卡片边框和背景」。

### 产品澄清结论（S8-DRIFT-003）

| 项 | 结论 |
|----|------|
| variant 语义 | `cardTitle` 轻量框 + 星标胶囊 · `plain` = layoutMode 非「无卡片」 |
| Copy HTML | **含** bg/border（snapshot 可证）· Preview/Copy 同源 |
| Paste 现象 | 平台剥离 `h1` 卡片 chrome · **非 renderer 漏输出** |
| S8 修复 | **不需要** · 006C `no effect` 成立 |
| 判据 | PO 用 Preview 卡片一致性作 FAIL 口径 → **QA rubric 不匹配** |
| 关闭标签 | `PRODUCT_EXPECTATION_CLARIFIED` · `NOT_A_COPY_RENDERER_BUG` · `NO_CODE_CHANGE_REQUIRED` |

### 涉及 Matrix 行

- **S8M-TITLE-001** — pasteStatus 保留 WARNING（历史观察）· contractAction / notes 已更新

### 涉及 Drift

- **DRIFT-S8-20260604-003** — **CLOSED** · 详见 [`DRIFT-S8-20260604-003.md`](DRIFT-S8-20260604-003.md)

### 与 Contract v1 的关系

- 无分级变更 · 不为本行降 Contract · 不为本行放宽 Validator

### 后续处理方式

| 项 | 说明 |
|----|------|
| **006C / 006D** | 不适用 · 已 `no effect` · 未 re-paste |
| **007** | 否 |
| **009 closeout** | **不阻塞** |
| **S9** | compatibility metadata / lifecycle 可承接 QA evidence |
| **S10** | P2-S10-001 卡片 chrome 分级 · 更强 cardTitle variants |

---

## 7. 006C 共性修复项（建议范围）

| 优先级 | 项 | Pattern | Drift |
|--------|-----|---------|-------|
| P0 | 卡片/软底/横幅背景边框 | `copy-safe-card` · `copy-safe-info-box` | 004–007 |
| P0 | 左竖线同节点 | `copy-safe-left-border` | 009 · 007 |
| P0 | 标题左条/下划线/卡片横线 | `copy-safe-title-divider` | 001 · 002 · 008 |
| P1 | 色带强调块 | `copy-safe-highlight-band` | 与 A 合并 |
| P2 | CTA radius fallback | `copy-safe-cta-button` | 无 FAIL |
| 排除 | TITLE-001 口径 | — | 003 待产品 |
| 观察 | HEAD-002 | — | **007** 主审 |

---

## 8. 007 / S9 路由摘要

| 问题 | Story |
|------|-------|
| HEAD-002 validator vs Paste 分叉 | **S8-STORY-007** |
| Preview 与 Copy 装饰不一致（潜在） | **S8-STORY-007** |
| 主题化视觉、复杂装饰、非 R1 必要样式 | **S9** |
| Matrix 16 行未测 + 全量回归 | **S8-STORY-006D** |

---

## 9. 变更记录

| 日期 | 变更 |
|------|------|
| 2026-06-04 | 初版 triage（S8-STORY-006B） |
| 2026-06-04 | FIX-A：006C 不因 L0 harvest 阻塞 · 006D 须实机验证 |
| 2026-06-05 | **S8-STORY-006D** 启动（Mode A）：QA pack 15 行 · Session 模板 · overlay `20260605_006D` |
| 2026-06-05 | **S8-STORY-006D Done**（Mode B）：PO 15/15 PASS · Drift 001/002/004–009 → `RESOLVED_BY_006C_REPASTE_PASS` · Harvest candidate-paste-pass |
| 2026-06-05 | **S8-STORY-007 Done**：HEAD-002 · validator false positive（`font-variant-numeric` uncatalogued）· paste PASS · no S8 code change |
