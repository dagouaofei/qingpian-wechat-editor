# WeChat Copy-safe Pattern Library v0.1

> 轻篇公众号排版 · qingpian-wechat-editor  
> **版本：** v0.1（文档规范 · **非** renderer 实现）  
> **约束：** [`wechat-safe-contract-v1`](wechat-safe-html-css-contract.md) · Clipboard `text/html` · 禁 class / 外链样式表 / SVG / pseudo-element / 复杂 flex·grid·absolute  
> **来源：** PO Paste QA · Drift 001–009 · 结构化调研 · **L0** HARVEST 模式归纳（**非**可审计实采）  
> **下游：** S8-STORY-006C（共性 renderer/fallback）· 006D（回归粘贴）· 007（Preview/Copy 审计）

---

## 1. Evidence 层级（Pattern v0.1）

| 来源类型 | 当前层级 | 说明 |
|----------|----------|------|
| PO Paste QA / Matrix（19 行） | **实机** | 006C **主依据** |
| Drift 001–009 | **实机/观察** | 与 Paste 绑定 |
| 竞品结构化调研（006B） | 文献 | 辅助 |
| HARVEST-001~015 | **L0** pattern-hypothesis | **不能** 当作真实文章采集证据 |
| `WX-HARVEST-EVIDENCE-*` | **L2 样本 1 条**（`WX-HARVEST-EVIDENCE-001`）· FIX-B 待补 | 见 [`harvest-input-template`](../research/wechat-published-article-harvest-input-template.md) · [`wechat-published-article-evidence/`](../research/wechat-published-article-evidence/) |

- 已发布文章部分 **目前以 L0 归纳为主**；后续 L2/L3/L4 通过 AI 提取 workflow 逐步写入。
- L0 **不删除** Pattern，但 **不得** 在 006C 中写成「已实采验证」。

### 1.1 S8-STORY-006C 落地状态（2026-06-04 · Done）

| patternId | Copy 落地 | 代码路径 | 006D |
|-----------|-----------|----------|------|
| `copy-safe-card` | **已落地** | `info-card-copy` · `text-block-copy` · `highlight-copy` · `quote-copy` | **006D PASS** |
| `copy-safe-left-border` | **已落地** | `text-block-copy` · `info-card-copy`（warning_note） | **006D PASS** |
| `copy-safe-title-divider` | **已落地** | `title-block-copy` · `heading-publish-copy-html` | **006D PASS** |
| Harvest candidates | **2 条** | `heading_purple_chapter_label_candidate` · `info_card_reading_path_candidate` → Matrix `S8M-HARVEST-001/002` | **candidate-paste-pass**（006D）· **S9 seed assets**（DECISION-092） |

- **未改** Contract v1 分级 · Validator 放宽 · harvest **不**直接 default preset / user-selectable（→ S9 promote）。
- Drift 001–002、004–009 → **`RESOLVED_BY_006C_REPASTE_PASS`**（006D · 2026-06-05）；Drift 003 保持 observation。

### 1.2 S8-STORY-006D 复测结果（2026-06-05 · Done）

| 文档 | 用途 |
|------|------|
| [`wechat-paste-qa-pack-2026-06-05-s8-story-006d.md`](../agile/paste-qa/wechat-paste-qa-pack-2026-06-05-s8-story-006d.md) | 8 re-test + 2 harvest + 5 control |
| [`wechat-paste-qa-session-2026-06-05-s8-story-006d.md`](../agile/paste-qa/wechat-paste-qa-session-2026-06-05-s8-story-006d.md) | PO 回填模板 |
| Overlay | `S8_FIDELITY_PASTE_QA_OVERLAY_20260605_006D` |

**006D 结果：** copy-safe-card / left-border / title-divider 实机 **PASS**（8/8 re-test）；Harvest **candidate-paste-pass**（2/2）；不入 default preset。

### 1.3 Sprint 9 路由（DECISION-092）

- 样式管理后台 v0 → **Sprint 9**（[`sprint9-style-management-system-v0.md`](../agile/sprint9-style-management-system-v0.md)）
- 006D 两 harvest candidate → **S9 首批 seed assets** · 经 S9-STORY-005/007 promote 流程后再考虑 user-selectable
- 批量视觉扩展 → **Sprint 10**（方向 only）

---

## 2. 使用说明

| 原则 | 说明 |
|------|------|
| Pattern 只定义 **结构规范** | 不得在本文档中写正式 TS/renderer 代码 |
| 分级不变 | Green/Yellow/Red 以 Contract v1 为准；Pattern **不得**扩权 |
| DOM 浅层 | 优先 `p` / `span` / 至多一层语义 `section` wrapper |
| 内层承载 | 背景、边框、左线写在 **内容节点** 上，不写空壳外层 |
| fallback 必填 | Yellow 能力须有文档化降级 |
| 证据 | 须链 Matrix / Drift；HARVEST 仅 L0 时标 `needsArticleEvidence` |

---

## 3. Pattern 索引

| patternId | 适用 block | 006C 优先级 |
|-----------|------------|-------------|
| `copy-safe-card` | info_card · paragraph · summary · title（浅底块） | **P0** |
| `copy-safe-left-border` | lead · quote · info_card · paragraph | **P0** |
| `copy-safe-title-divider` | title · heading | **P0** |
| `copy-safe-highlight-band` | summary · lead · paragraph | P1 |
| `copy-safe-cta-button` | cta | P1 |
| `copy-safe-info-box` | info_card | **P0** |
| `copy-safe-divider` | divider | P1 |
| `copy-safe-inline-emphasis` | summary · paragraph · title | P2 |

---

## 4. `copy-safe-card`

| 字段 | 内容 |
|------|------|
| **patternId** | `copy-safe-card` |
| **适用 block type** | `info_card` · `paragraph` · `summary`（highlight）· 浅底 `title`/`heading` |
| **适用 variant 场景** | 要点卡、软底段落、高亮块、probe 软卡（PARA-004 · SUM-004 · CARD-004） |
| **推荐 DOM 结构** | `section`（可选，≤1 层）> **`p`** 承载全文；背景/边框/内边距 **全部在 `p`**；避免空 `section` 仅作视觉壳 |
| **允许 CSS** | `background-color` · `border` · `padding` · `margin` · `line-height` · `color` · `font-size`（Green） |
| **慎用 CSS** | `border-radius` · `box-shadow`（Yellow → fallback） |
| **禁止 CSS** | `background` 简写渐变 · `linear-gradient` · `position` · flex/grid 分栏 |
| **fallback** | 剥 radius/shadow 后保留 `border:1px solid` + `background-color` on `p`；仍失败则纯 `border-left` 条 |
| **Matrix evidence** | S8M-CARD-001 WARNING · S8M-PARA-004 FAIL · S8M-SUM-004 FAIL · S8M-CARD-004 FAIL |
| **currentEvidenceLevel** | Paste QA + Drift（实机）；HARVEST L0 假设 |
| **needsArticleEvidence** | **yes** — FIX-B 补 L2/L3 可增强，不阻塞 006C |
| **当前 Drift 关联** | DRIFT-004 · 005 · 006 · 007；DRIFT-003（观察） |
| **是否可进入 Release 1** | **是**（实现须按本 pattern 改 renderer，非扩 Contract） |
| **后续实现建议** | 006C：Copy Renderer 将卡片样式下沉至 `p`；Validator 仍 WARNING section 可保留 |

---

## 5. `copy-safe-left-border`

| 字段 | 内容 |
|------|------|
| **patternId** | `copy-safe-left-border` |
| **适用 block type** | `lead` · `quote` · `paragraph` · `info_card` |
| **适用 variant 场景** | 引言竖线、引用左条、步骤卡左线（CARD-004 左线+底） |
| **推荐 DOM 结构** | 单 **`p`**（或 `blockquote` 若 Contract 允许且 Matrix 有证据）+ `border-left` + `padding-left`；**禁止** 左列 `span`+右列正文分栏 |
| **允许 CSS** | `border-left` · `border-left-width` · `border-left-color` · `padding-left` · `margin` · `color` · `font-style`（Green 值域内） |
| **慎用 CSS** | `background-color` 与 border 分属不同节点 |
| **禁止 CSS** | 多列模拟左条 · `display:flex` 左栏 |
| **fallback** | 剥 `background` 后保留 `border-left`；仍失败则用 **Unicode 竖线字符** 前缀（仅 006C 评估，非默认） |
| **Matrix evidence** | S8M-LEAD-003 WARNING · S8M-CARD-004 FAIL（含左线） |
| **currentEvidenceLevel** | Paste QA + Drift；HARVEST L0 |
| **needsArticleEvidence** | **yes** |
| **当前 Drift 关联** | DRIFT-009 · 007（部分） |
| **是否可进入 Release 1** | **是** |
| **后续实现建议** | 006C：合并为单 `p` 左线；禁止 section 仅包 border |

---

## 6. `copy-safe-title-divider`

| 字段 | 内容 |
|------|------|
| **patternId** | `copy-safe-title-divider` |
| **适用 block type** | `title` · `heading` |
| **适用 variant 场景** | 居中标题下细线（TITLE-003）· 上下横线标题卡（HEAD-004）· 左条标题（TITLE-002） |
| **推荐 DOM 结构** | **单节点** `h1`/`h3`/`p` 承载标题文字；下划线：`border-bottom:1px solid` + 小 `padding-bottom`；**禁止** 独立高 `padding` 块仅作线 |
| **允许 CSS** | `text-align` · `font-size` · `font-weight` · `color` · `border-bottom` · `margin` · `padding-bottom`（小值） |
| **慎用 CSS** | `border` 四边 · `height` 撑线 · `section` 多子列 |
| **禁止 CSS** | 三列分栏 · 左方块+竖线分置不同列（DRIFT-001） |
| **fallback** | 下划线失败 → 删除 border，保留纯文字标题；装饰线改 `span` 内 `border-bottom`（仍单层） |
| **Matrix evidence** | S8M-TITLE-002 FAIL · S8M-TITLE-003 FAIL · S8M-HEAD-004 WARNING |
| **currentEvidenceLevel** | Paste QA + Drift；HARVEST L0 |
| **needsArticleEvidence** | **yes** |
| **当前 Drift 关联** | DRIFT-001 · 002 · 008 |
| **是否可进入 Release 1** | **是**（TITLE-002 candidate 须修复或降级后再入池） |
| **后续实现建议** | 006C：重写 `title_left_bar_classic` DOM 为单节点左 border；`title_bottom_line` 降低 padding |

---

## 7. `copy-safe-highlight-band`

| 字段 | 内容 |
|------|------|
| **patternId** | `copy-safe-highlight-band` |
| **适用 block type** | `summary` · `lead` · `paragraph` |
| **适用 variant 场景** | 浅色彩带强调、lead 色条 |
| **推荐 DOM 结构** | `p` + `background-color` + 可选 `border-left`（同节点） |
| **允许 CSS** | `background-color` · `padding` · `border-left` · `line-height` · `color` |
| **慎用 CSS** | 宽 `margin` 负值 · 双层 section |
| **禁止 CSS** | `linear-gradient` · `box-shadow` glow（除非 waiver+证据） |
| **fallback** | 去渐变/阴影 → 纯色底；再失败 → 仅加粗文字 |
| **Matrix evidence** | S8M-SUM-001 PASS · 未测 SUM-002/003 |
| **currentEvidenceLevel** | 部分 Paste PASS；HARVEST L0 |
| **needsArticleEvidence** | optional |
| **当前 Drift 关联** | 间接支撑 A 类（与 card 合并修复） |
| **是否可进入 Release 1** | **是** |
| **后续实现建议** | 006C 与 `copy-safe-card` 统一「p 承载」策略 |

---

## 8. `copy-safe-cta-button`

| 字段 | 内容 |
|------|------|
| **patternId** | `copy-safe-cta-button` |
| **适用 block type** | `cta` |
| **适用 variant 场景** | 按钮样 CTA、纯文字 CTA（CTA-001 已 PASS） |
| **推荐 DOM 结构** | `p` > `span` 或单 `p` 居中；纯色底+内边距；链接受 Contract `a` Yellow 约束 |
| **允许 CSS** | `background-color` · `color` · `padding` · `text-align` · `font-size` · `display:inline-block`（Matrix 证据后） |
| **慎用 CSS** | `border-radius`（Yellow → 直角 fallback） |
| **禁止 CSS** | 大图按钮 · flex 居中容器 |
| **fallback** | 去 radius → 直角色块；再失败 → 纯文字链 |
| **Matrix evidence** | S8M-CTA-001 PASS |
| **currentEvidenceLevel** | Paste PASS |
| **needsArticleEvidence** | optional |
| **当前 Drift 关联** | 无 FAIL |
| **是否可进入 Release 1** | **是** |
| **后续实现建议** | 006C 低优先；button-like variant 待 006D 补测 |

---

## 9. `copy-safe-info-box`

| 字段 | 内容 |
|------|------|
| **patternId** | `copy-safe-info-box` |
| **适用 block type** | `info_card` |
| **适用 variant 场景** | key_takeaway · warning_note · steps |
| **推荐 DOM 结构** | 单 `p` 或 `section`>单 `p`；`border`+`background-color`+`padding` 同在 `p` |
| **允许 CSS** | `border` · `background-color` · `padding` · `color` · `font-size` |
| **慎用 CSS** | `box-shadow` · 左侧独立装饰列 |
| **禁止 CSS** | 横幅式多层嵌套+左竖线分节点（DRIFT-007） |
| **fallback** | 同 `copy-safe-card` |
| **Matrix evidence** | S8M-CARD-001 · 004 |
| **currentEvidenceLevel** | Paste QA + Drift；HARVEST L0 |
| **needsArticleEvidence** | **yes** |
| **当前 Drift 关联** | DRIFT-004 · 007 |
| **是否可进入 Release 1** | **是** |
| **后续实现建议** | 006C 与 card pattern 合并实现 |

---

## 10. `copy-safe-divider`

| 字段 | 内容 |
|------|------|
| **patternId** | `copy-safe-divider` |
| **适用 block type** | `divider` |
| **适用 variant 场景** | 细线 · 短 accent · 点线（待测 DIV-002/003） |
| **推荐 DOM 结构** | `p` 或 `div`（浅层）仅 `border-top` / 居中文字 `···`；避免空 section 占位 |
| **允许 CSS** | `border-top` · `margin` · `height`（小）· `text-align` · `letter-spacing` |
| **慎用 CSS** | 多 Yellow border 组合 |
| **禁止 CSS** | 大图分隔 · SVG 线 |
| **fallback** | 剥复杂 border → `border-top:1px`；再失败 → 字符分隔线 |
| **Matrix evidence** | S8M-DIV-001 PASS · S8M-DIV-004 PASS |
| **currentEvidenceLevel** | Paste PASS |
| **needsArticleEvidence** | optional |
| **当前 Drift 关联** | 无 006 Session FAIL |
| **是否可进入 Release 1** | **是** |
| **后续实现建议** | 006C 低优先；probe accent 已 PASS |

---

## 11. `copy-safe-inline-emphasis`

| 字段 | 内容 |
|------|------|
| **patternId** | `copy-safe-inline-emphasis` |
| **适用 block type** | `summary` · `paragraph` · `title` |
| **适用 variant 场景** | 行内加粗/强调色、极简标题（TITLE-001） |
| **推荐 DOM 结构** | `p` 内 `span`/`strong` + `color`/`font-weight`/`background-color`（小面积） |
| **允许 CSS** | `font-weight` · `color` · `background-color`（行内小范围） |
| **慎用 CSS** | `h1` 级大区块 bg/border 可被微信剥离（DRIFT-003 已澄清） |
| **禁止 CSS** | 整段假卡片式外层 section 无文字 |
| **fallback** | 去背景 → 仅加粗/变色 |
| **Matrix evidence** | S8M-SUM-001 PASS · S8M-TITLE-001 WARNING（历史观察 · 产品已澄清） |
| **currentEvidenceLevel** | Paste WARNING = 平台剥离 · Copy HTML 含卡片 chrome |
| **needsArticleEvidence** | optional（P2-S10-001） |
| **当前 Drift 关联** | DRIFT-003 **CLOSED** · PRODUCT_EXPECTATION_CLARIFIED |
| **是否可进入 Release 1** | **是** |
| **后续实现建议** | 更强卡片标题 → `title_left_bar` / info_card / S10 cardTitle variants |

---

## 12. Pattern ↔ 修复 Story 路由

| 目标 Story | 范围 |
|------------|------|
| **S8-STORY-006C** | card · left-border · title-divider · info-box（P0 Drift 簇） |
| **S8-STORY-006D** | Matrix 16 未测行 + 19 行 re-paste |
| **S8-STORY-007** | HEAD-002 **Done** — validator false positive（`font-variant-numeric` uncatalogued）· Preview/Copy 同源 · no S8 code change |
| **S9** | 主题视觉升级、丰富装饰、非保真优先的版式探索 |

---

## 13. 变更记录

| 日期 | 变更 |
|------|------|
| 2026-06-04 | v0.1 初版（S8-STORY-006B · DECISION-091） |
| 2026-06-04 | FIX-A：evidence 层级说明 · currentEvidenceLevel / needsArticleEvidence |
