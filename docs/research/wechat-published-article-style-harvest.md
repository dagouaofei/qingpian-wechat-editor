# 已发布公众号文章样式反向采集（S8-STORY-006B）

> **目标：** 从真实已发布文章中抽象 **稳定排版结构**，不复制正文、不抄完整样式、不保存可辨认文章全文。  
> **方法：** 按账号类型抽样浏览（2024–2026 常见形态）+ 与 PO Paste QA / Drift 交叉标注。  
> **样本数：** 15（`HARVEST-001` ~ `HARVEST-015`）

---

## 1. 采集说明

- **采集对象：** 公开可访问的微信公众号图文（仅记录账号类型与版式角色，不记录文章标题全文）。
- **工具：** 微信客户端阅读态 + 部分文章「查看源代码」能力（未系统导出 HTML 字符串入库）。
- **输出：** 模式 ID、DOM/CSS 能力摘要、风险、可映射 Pattern。

---

## 2. 样本表

### HARVEST-001

| 字段 | 值 |
|------|-----|
| sampleId | HARVEST-001 |
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

## 3. 跨样本汇总

| 样式类型 | 稳定做法（采集共识） | 对应 Drift / Matrix |
|----------|----------------------|---------------------|
| 卡片/浅底块 | 背景在 **`p`** | 004–007 |
| 左竖线 | `border-left` 与文字 **同节点** | 009 |
| 标题线 | 细 `border-bottom`，避免高盒 | 002 |
| 标题版式 | 避免多列分栏 DOM | 001 |
| CTA | 纯色底 `span`/`p`，慎用 radius | CTA-001 PASS |
| 分隔线 | `p`+`border-top` 或字符线 | DIV-001 PASS |

---

## 4. 变更记录

| 日期 | 变更 |
|------|------|
| 2026-06-04 | 初版 15 样本（S8-STORY-006B） |
