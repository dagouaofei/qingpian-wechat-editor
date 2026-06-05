# 已发布公众号文章样式模式归纳与证据采集（S8-STORY-006B · 006B-FIX-A）

> **定位：** 两阶段 — **阶段 1（006B-FIX-A）** 建立 evidence 提取工作流；**阶段 2（006B-FIX-B，未启动）** 批量补 5–10 篇真实 evidence。  
> **重要：** 下文 `HARVEST-001`~`015` 为 **L0 pattern-hypothesis**（无真实 `articleUrl`），**不等于** 可审计的真实文章反向采集。  
> **真实证据：** 使用 [`wechat-published-article-harvest-input-template.md`](wechat-published-article-harvest-input-template.md) + [`wechat-published-article-style-extraction-guide.md`](wechat-published-article-style-extraction-guide.md) 产出 `WX-HARVEST-EVIDENCE-###`。已收录见 [`wechat-published-article-evidence/`](wechat-published-article-evidence/)（006B-FIX-B 批量补采未启动）。

---

## 1. 模式归纳说明（HARVEST-001~015）

| 项 | 说明 |
|----|------|
| **来源** | 行业经验 + PO Paste QA / Drift 交叉 + 结构化调研推论 |
| **evidenceLevel** | 全部为 **L0**（无 URL / 无 HTML 片段） |
| **用途** | 辅助假设、Pattern 设计参考；**不能单独** 作为 006C 修复主依据 |
| **006C 主依据** | PO Paste QA · Drift · Matrix · Pattern Library（实机） |

---

## 2. evidenceLevel 定义（L0–L4）

### L0：pattern-hypothesis

- 无真实文章 URL；
- 仅为模式假设或行业经验归纳；
- **不得** 称为真实文章采集证据；
- **不能单独** 作为 006C 修复依据，只能作辅助假设。

### L1：url-registered

- 有真实公众号文章 URL；
- 尚未分析 HTML / DOM / CSS；
- 只证明「存在可参考样本」，**不能** 证明实现结构；
- **价值有限**，须尽快升级到 L2/L3 或仅作登记。

### L2：ai-reading-extracted

- 有真实 URL；
- AI / 人工基于 **阅读态** 提取样式类型、DOM/CSS 摘要、pattern；
- 未提供完整 HTML；
- **弱证据**，可作 supporting-evidence。

### L3：html-extracted

- 有真实 URL + 用户提供的 **HTML 片段**；
- AI / Cursor 从片段提取 DOM/CSS/pattern；
- **006C 重要证据**（`primary-evidence` / `supporting-evidence`）。

### L4：paste-verified

- 有 URL + HTML/摘要 + 轻篇 Copy 或公众号后台粘贴对照；
- **强 evidence**。

**指导 006C 修复：** 主要靠 **L2 / L3 / L4**；L0 仅假设；L1 不指导结构。

---

## 3. Evidence Backfill Workflow

```text
用户 → 填写 ARTICLE-EVIDENCE-INPUT（URL 或 URL+HTML）
     → Cursor / AI 按 extraction-guide 输出 WX-HARVEST-EVIDENCE-###
     → 判定 evidenceLevel（L1–L4）
     → 映射 Pattern Library + 可选关联 Drift
     → recommendedUseIn006C（primary / supporting / hypothesis-only）
     → 006C 实施时引用；006D Paste Re-test 验证（L4 优先）
```

| 文档 | 角色 |
|------|------|
| [`wechat-published-article-harvest-input-template.md`](wechat-published-article-harvest-input-template.md) | 用户最小输入 |
| [`wechat-published-article-style-extraction-guide.md`](wechat-published-article-style-extraction-guide.md) | AI 输出字段规范 |

**本轮（FIX-A）：** 不补满 15 篇 URL；不虚构链接。

---

## 4. 样本表（L0 模式归纳 · HARVEST-001~015）

### HARVEST-001

| 字段 | 值 |
|------|-----|
| sampleId | HARVEST-001 |
| evidenceLevel | L0 pattern-hypothesis |
| articleUrl | — |
| 文章类型 | 科普类 |
| 采集对象 | 科技科普类订阅号（长文解说） |
| 样式类型 | 一级标题 |
| DOM 模式摘要 | `p` 居中加粗大字；或 `section`> `p` 居中（单层） |
| CSS 能力摘要 | `font-size` `font-weight` `text-align:center` `color` |
| 是否疑似图片/SVG | 否 |
| 是否疑似插件/同步 | 否 |
| 适合轻篇复用 pattern | `copy-safe-inline-emphasis`（标题字重级） |
| 风险 | 外层 section 无内容仅包标题时粘贴可能多留白 |

### HARVEST-002

| 字段 | 值 |
|------|-----|
| sampleId | HARVEST-002 |
| evidenceLevel | L0 pattern-hypothesis |
| articleUrl | — |
| 文章类型 | 科普类 |
| 采集对象 | 科普类订阅号（小节标题） |
| 样式类型 | 二级标题 + 下划线 |
| DOM 模式摘要 | `p`/`h2` + `border-bottom:1px` 细线 |
| CSS 能力摘要 | `border-bottom` `padding-bottom` `font-size` |
| 是否疑似图片/SVG | 否 |
| 是否疑似插件/同步 | 否 |
| 适合轻篇复用 pattern | `copy-safe-title-divider`（细线版） |
| 风险 | 粗 border+大 padding 变高块（对照 DRIFT-002） |

### HARVEST-003

| 字段 | 值 |
|------|-----|
| sampleId | HARVEST-003 |
| evidenceLevel | L0 pattern-hypothesis |
| articleUrl | — |
| 文章类型 | 商业推广类 |
| 采集对象 | 品牌商业推广文 |
| 样式类型 | 浅底提示卡片 |
| DOM 模式摘要 | 单 `p`：`background-color` + `padding` + 可选 `border-left` |
| CSS 能力摘要 | `background-color` `padding` `border-left` `line-height` |
| 是否疑似图片/SVG | 否 |
| 是否疑似插件/同步 | 否 |
| 适合轻篇复用 pattern | `copy-safe-card` / `copy-safe-left-border` |
| 风险 | 背景写在外层 section 时易丢（Drift A） |

### HARVEST-004

| 字段 | 值 |
|------|-----|
| sampleId | HARVEST-004 |
| evidenceLevel | L0 pattern-hypothesis |
| articleUrl | — |
| 文章类型 | 商业推广类 |
| 采集对象 | 电商/活动推广文 |
| 样式类型 | 强调卖点色块 |
| DOM 模式摘要 | `p` 或 `span` 纯色底 + 居中短句 |
| CSS 能力摘要 | `background-color` `color` `padding` `text-align:center` |
| 是否疑似图片/SVG | 偶见角标图 |
| 是否疑似插件/同步 | 否 |
| 适合轻篇复用 pattern | `copy-safe-highlight-band` |
| 风险 | `border-radius` 大面积可能失效 |

### HARVEST-005

| 字段 | 值 |
|------|-----|
| sampleId | HARVEST-005 |
| evidenceLevel | L0 pattern-hypothesis |
| articleUrl | — |
| 文章类型 | 个人表达类 |
| 采集对象 | 个人创作者随笔 |
| 样式类型 | 引用/金句左线 |
| DOM 模式摘要 | 单 `p`：`border-left:3px solid` + `padding-left` + 斜体可选 |
| CSS 能力摘要 | `border-left` `padding-left` `color` `font-style` |
| 是否疑似图片/SVG | 否 |
| 是否疑似插件/同步 | 否 |
| 适合轻篇复用 pattern | `copy-safe-left-border` |
| 风险 | 仅外层包裹 border 时丢失（DRIFT-009） |

### HARVEST-006

| 字段 | 值 |
|------|-----|
| sampleId | HARVEST-006 |
| evidenceLevel | L0 pattern-hypothesis |
| articleUrl | — |
| 文章类型 | 个人表达类 |
| 采集对象 | 生活方式类个人号 |
| 样式类型 | 分隔线 |
| DOM 模式摘要 | `p` `border-top:1px` 或居中 `···` 字符段 |
| CSS 能力摘要 | `border-top` `margin` `text-align:center` `letter-spacing` |
| 是否疑似图片/SVG | 少数装饰线图 |
| 是否疑似插件/同步 | 否 |
| 适合轻篇复用 pattern | `copy-safe-divider` |
| 风险 | Yellow `border` 组合需 Matrix 证据 |

### HARVEST-007

| 字段 | 值 |
|------|-----|
| sampleId | HARVEST-007 |
| evidenceLevel | L0 pattern-hypothesis |
| articleUrl | — |
| 文章类型 | 企业品牌类 |
| 采集对象 | 企业官方品牌号 |
| 样式类型 | 品牌色标题条 |
| DOM 模式摘要 | `p` 左 `border-left` 粗线 + 标题文字同行 |
| CSS 能力摘要 | `border-left-width` `padding-left` `font-weight` |
| 是否疑似图片/SVG | 品牌 logo 图（独立块） |
| 是否疑似插件/同步 | 否 |
| 适合轻篇复用 pattern | `copy-safe-left-border` + `copy-safe-title-divider` |
| 风险 | 拆成多列 DOM 易 FAIL（DRIFT-001） |

### HARVEST-008

| 字段 | 值 |
|------|-----|
| sampleId | HARVEST-008 |
| evidenceLevel | L0 pattern-hypothesis |
| articleUrl | — |
| 文章类型 | 企业品牌类 |
| 采集对象 | 企业资讯通报 |
| 样式类型 | 信息框（灰底边框） |
| DOM 模式摘要 | 单 `p` 灰底 + 1px 边框 + 内边距 |
| CSS 能力摘要 | `background-color` `border` `padding` |
| 是否疑似图片/SVG | 否 |
| 是否疑似插件/同步 | 否 |
| 适合轻篇复用 pattern | `copy-safe-info-box` |
| 风险 | 与 Drift 004/005/006 同类 |

### HARVEST-009

| 字段 | 值 |
|------|-----|
| sampleId | HARVEST-009 |
| evidenceLevel | L0 pattern-hypothesis |
| articleUrl | — |
| 文章类型 | 知识总结类 |
| 采集对象 | 知识总结/清单类账号 |
| 样式类型 | 有序列表要点 |
| DOM 模式摘要 | `ol`/`ul` > `li` + `span` 序号（inline） |
| CSS 能力摘要 | `margin` `padding` `line-height` `font-weight` |
| 是否疑似图片/SVG | 否 |
| 是否疑似插件/同步 | 否 |
| 适合轻篇复用 pattern | 列表 Green 路径（非本库独立 pattern） |
| 风险 | `display:inline-block` 序号（HEAD-002 类）需 Matrix |

### HARVEST-010

| 字段 | 值 |
|------|-----|
| sampleId | HARVEST-010 |
| evidenceLevel | L0 pattern-hypothesis |
| articleUrl | — |
| 文章类型 | 知识总结类 |
| 采集对象 | 读书/课程总结号 |
| 样式类型 | 小结卡片（要点提炼） |
| DOM 模式摘要 | `p` 浅黄/浅灰底 + 左侧色条 |
| CSS 能力摘要 | `background-color` `border-left` `padding` |
| 是否疑似图片/SVG | 否 |
| 是否疑似插件/同步 | 否 |
| 适合轻篇复用 pattern | `copy-safe-card` + `copy-safe-left-border` |
| 风险 | section 包裹导致背景丢失 |

### HARVEST-011

| 字段 | 值 |
|------|-----|
| sampleId | HARVEST-011 |
| evidenceLevel | L0 pattern-hypothesis |
| articleUrl | — |
| 文章类型 | 商业推广类 |
| 采集对象 | 课程/训练营推广 |
| 样式类型 | CTA 按钮样 |
| DOM 模式摘要 | `p`/`span` 居中；纯色底圆角块（圆角常降级） |
| CSS 能力摘要 | `background-color` `padding` `border-radius` `text-align:center` |
| 是否疑似图片/SVG | 按钮偶为图片 |
| 是否疑似插件/同步 | 否 |
| 适合轻篇复用 pattern | `copy-safe-cta-button` |
| 风险 | radius Yellow · 需 fallback 直角 |

### HARVEST-012

| 字段 | 值 |
|------|-----|
| sampleId | HARVEST-012 |
| evidenceLevel | L0 pattern-hypothesis |
| articleUrl | — |
| 文章类型 | 科普类 |
| 采集对象 | 医学/健康科普（严谨体） |
| 样式类型 | 警示提示框 |
| DOM 模式摘要 | `p` 浅红/浅黄底 + `border` |
| CSS 能力摘要 | `background-color` `border` `color` `padding` |
| 是否疑似图片/SVG | 图标少 |
| 是否疑似插件/同步 | 否 |
| 适合轻篇复用 pattern | `copy-safe-info-box` |
| 风险 | 多色边框+阴影易剥 |

### HARVEST-013

| 字段 | 值 |
|------|-----|
| sampleId | HARVEST-013 |
| evidenceLevel | L0 pattern-hypothesis |
| articleUrl | — |
| 文章类型 | 企业品牌类 |
| 采集对象 | 央企/国企官方号 |
| 样式类型 | 章节分隔大间距 |
| DOM 模式摘要 | `p` 仅 `margin` 增高；或细 `border-top` |
| CSS 能力摘要 | `margin` `border-top` `height` |
| 是否疑似图片/SVG | 章节头图常见（独立） |
| 是否疑似插件/同步 | 否 |
| 适合轻篇复用 pattern | `copy-safe-divider` |
| 风险 | section 空块 spacer 可能被删 |

### HARVEST-014

| 字段 | 值 |
|------|-----|
| sampleId | HARVEST-014 |
| evidenceLevel | L0 pattern-hypothesis |
| articleUrl | — |
| 文章类型 | 个人表达类 |
| 采集对象 | 摄影/旅行个人号 |
| 样式类型 | 图注/说明文字 |
| DOM 模式摘要 | `p` 小字号灰色居中 |
| CSS 能力摘要 | `font-size` `color` `text-align:center` |
| 是否疑似图片/SVG | 正文大图为主 |
| 是否疑似插件/同步 | 否 |
| 适合轻篇复用 pattern | `copy-safe-inline-emphasis` |
| 风险 | 与配图链路无关本 Story |

### HARVEST-015

| 字段 | 值 |
|------|-----|
| sampleId | HARVEST-015 |
| evidenceLevel | L0 pattern-hypothesis |
| articleUrl | — |
| 文章类型 | 知识总结类 |
| 采集对象 | 年终总结/清单长文 |
| 样式类型 | 多段浅底卡片并列 |
| DOM 模式摘要 | 连续多个 `p` 各带 `background-color`，少共用外层 |
| CSS 能力摘要 | `background-color` `padding` `margin-bottom` |
| 是否疑似图片/SVG | 否 |
| 是否疑似插件/同步 | 否 |
| 适合轻篇复用 pattern | `copy-safe-card`（**每段 p 独立承载**） |
| 风险 | 共用外层 section 卡片壳（Drift 005–007） |

---

## 5. 跨样本汇总（L0 假设共识 · 待 evidence 验证）

| 样式类型 | 稳定做法（采集共识） | 对应 Drift / Matrix |
|----------|----------------------|---------------------|
| 卡片/浅底块 | 背景在 **`p`** | 004–007 |
| 左竖线 | `border-left` 与文字 **同节点** | 009 |
| 标题线 | 细 `border-bottom`，避免高盒 | 002 |
| 标题版式 | 避免多列分栏 DOM | 001 |
| CTA | 纯色底 `span`/`p`，慎用 radius | CTA-001 PASS |
| 分隔线 | `p`+`border-top` 或字符线 | DIV-001 PASS |

---

## 6. 示例：URL + HTML 提取结果格式（非真实 evidence）

> **以下为格式示例，不作为真实 evidence。不得写入虚构 URL。**

| 字段 | 值 |
|------|-----|
| sourceId | WX-HARVEST-EVIDENCE-EXAMPLE |
| articleUrl | `<user-provided-url>` |
| harvestDate | YYYY-MM-DD |
| evidenceLevel | L3 html-extracted |
| inputType | url-plus-html |

### observedStyleTypes

- card
- left-border

### domSummary

- p carries background-color, padding and border-left directly
- no flex/grid/absolute detected in the observed snippet

### cssSummary

- background-color
- padding
- border-left
- line-height

### patternMapping

- copy-safe-card
- copy-safe-left-border

### riskFlags

- none

### wechatSafeAssessment

likely-safe

### relatedDrift

- DRIFT-S8-20260604-004
- DRIFT-S8-20260604-009

### recommendedUseIn006C

supporting-evidence

### notes

格式示例 only — 替换为 FIX-B 中用户提供的真实输入后生成的记录。

---

## 7. 变更记录

| 日期 | 变更 |
|------|------|
| 2026-06-04 | 初版 15 样本（S8-STORY-006B） |
| 2026-06-04 | FIX-A：L0–L4 · 输入模板 · 提取规范 · HARVEST 标 L0 · 两阶段策略 |
