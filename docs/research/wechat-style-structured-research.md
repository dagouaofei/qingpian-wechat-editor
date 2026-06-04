# 公众号排版样式结构化调研（S8-STORY-006B）

> 轻篇公众号排版 · qingpian-wechat-editor  
> **Story：** S8-STORY-006B · **状态：** 本轮结构化调研完成（文献 + PO Paste QA 交叉验证）  
> **约束：** 不复制竞品 HTML/CSS · 只抽象模式 · 以「普通复制到公众号后台是否稳定」为裁判  
> **关联：** [`wechat-editor-compatibility-reference.md`](wechat-editor-compatibility-reference.md) · [`wechat-published-article-style-harvest.md`](wechat-published-article-style-harvest.md) · [`wechat-copy-safe-pattern-library.md`](../architecture/wechat-copy-safe-pattern-library.md) · Paste QA Session 2026-06-04

---

## 1. 调研目标

1. 在 **S8-STORY-006** 第一轮 Paste QA（19 行 · Drift 001–009）暴露的共性问题基础上，对成熟排版方案做 **结构化** 对照，而非单点猜修。
2. 归纳卡片、左竖线、标题装饰、CTA、分隔线等在 **Clipboard → 公众号后台** 路径上的常见 DOM/CSS 做法与失效边界。
3. 为 [`wechat-copy-safe-pattern-library.md`](../architecture/wechat-copy-safe-pattern-library.md) v0.1 与 **S8-STORY-006C** 共性 renderer/fallback 修复提供依据。
4. **本轮不修 renderer、不改 Contract v1 分级、不新增 variant。**

---

## 2. 调研对象

| 对象 | 类型 | 调研深度（本轮） | 与轻篇路径关系 |
|------|------|------------------|----------------|
| **135 编辑器** | 商业排版 | 公开资料 + 行业实践摘要 | Clipboard 复制为主 · 接近轻篇 |
| **壹伴** | 浏览器插件 | 公开产品说明 | **同步/插件** 为主 · 非纯 Copy |
| **秀米** | 商业排版 | 公开资料 + 结构模式摘要 | 导出/复制多入口 · DOM 偏深 |
| **mdnice** | 开源/在线 | README + 社区 issue 方向 | **高度接近** Markdown→inline→复制 |
| **Doocs 微信 Markdown** | 开源 | 生态文档 + 皮肤思路 | **高度接近** CSS 子集文档化 |
| **微信官方图文编辑器** | 平台 | Contract v1 + PO 实机 | **终态裁判** |
| **已发布公众号文章** | 模式归纳 + 待补 evidence | HARVEST L0 ×15（见 harvest）· FIX-A workflow | **非**可审计实采；FIX-B 补 L2/L3 |

**未展开：** markdown-css 整包（非微信路径，见 compatibility-reference §4.6）。

---

## 3. 调研方法

| 步骤 | 做法 |
|------|------|
| 文献 | 各产品公开介绍、GitHub README、社区「粘贴微信失效」类讨论（不保存完整 HTML） |
| 模式拆解 | 统一维度：DOM · inline CSS · 卡片/边框/标题线/CTA/divider · 依赖通道 · Copy 适合度 |
| 交叉验证 | 对照 Matrix 19 行 paste 结果 + Drift 001–009 现象 |
| 抽象输出 | Pattern Library v0.1 + Drift triage（禁止照搬竞品字符串） |
| **禁止** | 只截图、只评美观、复制竞品完整样式、虚构新 Paste 结果 |

---

## 4. 样式模式拆解维度

每个对象/样本均按下列维度记录（见 §5–§9）：

- 常见 **DOM 结构**（标签层级、是否 `section` 包裹）
- 常见 **inline CSS**（背景、边框、字号、对齐）
- **卡片背景** 落在哪一层（外层 wrapper vs 内层 `p`）
- **border / border-left** 实现方式
- **标题装饰线**（下划线、双线、色块）实现方式
- **CTA**（文字链 vs 色块按钮）
- **divider**（`hr` / `p` 边框 / 字符线）
- 是否依赖 **SVG / 图片 / 插件 / 同步 API**
- **普通复制到公众号** 后是否仍稳定（高/中/低）
- **可借鉴** / **不可借鉴**

---

## 5. 135 编辑器调研

| 维度 | 结构化结论 |
|------|------------|
| 常见 DOM | 样式块多用 `section` 或单层 `div` 包 `p`/`span`；标题块常 `section` > `h1`/`h2` + 装饰用 `span` |
| inline CSS | `font-size` `color` `line-height` `text-align`；卡片常用 `background-color` + `border` + `padding` 写在**块容器**上 |
| 卡片背景 | 倾向 **容器节点**（section/div）承载背景+圆角；与轻篇 Drift A 类（外层剥离）风险一致 |
| border-left | 引用/提示条：`border-left` + `padding-left` 写在 `p` 或左侧 `span` 色块模拟 |
| 标题装饰线 | 下划线：`border-bottom` 或独立 `p` 细线；色条标题：左侧色块 + 标题并排（易触发多列误解析，对照 **DRIFT-001**） |
| CTA | 色块按钮：`span`/`a` + `background-color` + `padding` + `border-radius`（radius 为 Yellow） |
| divider | `section` 内 `p` 仅 `border-top` 或居中短 `hr` 样式 div |
| SVG/图片/插件 | 样式库含 SVG 图标、分隔图；**纯文字复制** 时常丢失或变图床 |
| Copy 适合度 | **中高** — 与轻篇同路径，但 DOM 偏装饰性；须 **扁平化 + 内层承载背景** |
| 可借鉴 | 装饰语义用 **少层级**；左竖线/浅底块优先 **`p` 单节点** 承载样式 |
| 不可借鉴 | 深层嵌套 section、多列 flex 式标题、依赖 135 专属 class（粘贴后失效） |

**来源方向：** 135editor.com 产品说明 · 行业稿「复制到微信」流程（未保存 HTML 样本）。

---

## 6. 壹伴调研

| 维度 | 结构化结论 |
|------|------------|
| 常见 DOM | 素材库与排版常经 **插件注入** 或后台同步，非用户从网页「选区复制」 |
| inline CSS | 与微信后台编辑能力对齐的简化 inline 为主 |
| 卡片/边框 | 运营向「图文卡片」多走素材模板，Copy 路径样本不透明 |
| 依赖通道 | **强依赖插件 / 公众号 API 同步** |
| Copy 适合度 | **低**（相对轻篇 R1「仅 Clipboard HTML」主链路） |
| 可借鉴 | 运营工作流（素材分类、复盘清单） |
| 不可借鉴 | 插件同步替代 Validator+Paste QA、非 inline-first 的 class 样式表 |

---

## 7. 秀米调研

| 维度 | 结构化结论 |
|------|------------|
| 常见 DOM | **多层** `section` > `div` > `p`/`span`；布局组件多 |
| inline CSS | 大量 inline；布局组件带 `width` `display` 等（部分触 Red/Yellow） |
| 卡片背景 | 外层 layout + 内层 content；粘贴后常见 **扁平化** 丢外层样式 |
| border-left | 布局列模拟左条，非单纯 CSS border |
| 标题装饰线 | 绝对定位/多列布局多见 → 微信侧重排风险高（对照 **DRIFT-001/002**） |
| SVG/图片 | 组件级 SVG、背景图常见 |
| Copy 适合度 | **中低** — 装饰 DOM 深，与 Contract `maxNestingDepth` 冲突 |
| 可借鉴 | 视觉组件分类法（标题/卡片/分隔） |
| 不可借鉴 | 深嵌套 section、绝对定位标题、SVG 装饰依赖 |

---

## 8. mdnice / Doocs 调研

### 8.1 mdnice

| 维度 | 结构化结论 |
|------|------------|
| 常见 DOM | Markdown 语义 → `p` `h1-h3` `blockquote` `ul/ol`；主题转 **inline** |
| inline CSS | 主题配置色值、字号、行高；代码块单独处理 |
| 卡片/引用 | `blockquote` 或自定义 `p` + `border-left` + 背景（与轻篇 quote/lead 接近） |
| 复杂样式 | 部分主题含 `box-shadow` `border-radius` — 社区反馈微信会剥 |
| 依赖通道 | **Clipboard 为主** |
| Copy 适合度 | **高** — 与轻篇路径一致 |
| 可借鉴 | **主题 → 全 inline**、维护「微信友好」属性子集 |
| 不可借鉴 | 直接复用主题 ID / HTML 字符串；未验证属性仍须 Matrix |

### 8.2 Doocs 微信 Markdown

| 维度 | 结构化结论 |
|------|------------|
| 常见 DOM | 语义化标签 + 皮肤层转 inline |
| inline CSS | 皮肤文档化 **允许/禁止** 列表（与 Contract 思路同构） |
| 卡片/提示 | 多用 `p` + 背景色 + 左边框，少用无意义 wrapper |
| Copy 适合度 | **高** |
| 可借鉴 | **CSS 子集文档化**、fallback 表格式维护 |
| 不可借鉴 | 皮肤即 preset；须与 `wechat-safe-contract-v1` 逐条 diff |

**公开入口：** https://github.com/mdnice · https://github.com/doocs/md

---

## 9. 已发布公众号文章模式归纳与待补 evidence（摘要）

- **HARVEST-001~015** 均为 **L0 pattern-hypothesis**（无真实 URL），见 [`wechat-published-article-style-harvest.md`](wechat-published-article-style-harvest.md)。
- **不得** 表述为「已完成 15 篇可审计真实采集」。
- 证据补全流程：[`wechat-published-article-harvest-input-template.md`](wechat-published-article-harvest-input-template.md) · [`wechat-published-article-style-extraction-guide.md`](wechat-published-article-style-extraction-guide.md)（**006B-FIX-A**）。
- **后续 FIX-B：** 批量 5–10 篇 L2/L3，用户仅提供 URL 或 URL+HTML。

| 共性观察 | 说明 |
|----------|------|
| 稳定块 | 正文 `p` 字号色；**单层** 引用左线；浅灰底 **写在 p 上** 的提示框 |
| 不稳定块 | 外层 section 大圆角卡片；三列标题；粗 border-bottom 变「高方块」线（**DRIFT-002**） |
| 标题 | 居中标题 + 细下划线常见；复杂「编辑线」多为图片或编辑器组件 |
| CTA | 文末「阅读原文」链为主；色块按钮较少但可用 `span` 纯色底 |
| divider | `p` + `border-top:1px` 或居中 `···` 字符，少用空 section |

---

## 10. 结论来源分层

| 来源 | 可信度 | 用途 |
|------|--------|------|
| **PO Paste QA**（19 行） | 高 · 实机 | 006C 主依据 |
| **Drift 001–009** | 高 · 实机/观察 | 006C 主依据 |
| **竞品结构化调研**（§5–8） | 中 · 文献 | 辅助 |
| **HARVEST L0** | 低 · 假设 | 仅辅助假设，须 L2/L3 验证 |
| **WX-HARVEST-EVIDENCE**（待补） | L2/L3/L4 | 可增强 Pattern/006C |

---

## 11. 共性结论（对接 PO Paste QA）

| # | 共性问题（006 已暴露） | 调研印证 |
|---|------------------------|----------|
| 1 | 卡片背景/边框丢失（Drift 004–007 等） | 竞品也常把背景放在 wrapper；**微信更稳的是 p/span 承载** |
| 2 | border-left 丢失（009） | 左线应合并到 **同一文本容器** `p`，避免仅外层 section |
| 3 | 标题装饰线异常（001–002、008） | 多列/高 border 盒模型在微信侧易变形；宜 **单节点 h + 细 border** |
| 4 | Validator FAIL · Paste PASS（HEAD-002） | 机器规则过严 ≠ 用户可见失败；宜 **007 审计** 而非本轮放宽 Contract |
| 5 | 测试口径（003） | 极简 title 不应预期「卡片」；产品语义先于 renderer |

---

## 12. 对轻篇 Copy-safe Pattern 的启发

1. **内层承载原则：** `background-color` / `border` / `border-left` 优先写在 **`p` 或 `h*`**，外层 `section` 仅作浅层 copy-safe wrapper（≤1 层）。
2. **标题装饰简化：** 避免「左块+标题+右留白」多列 DOM；下划线用 `border-bottom:1px solid` 于 `h1`/`p`，避免高 padding 盒（对照 DRIFT-002）。
3. **卡片降级链：** `box-shadow` / `border-radius`（Yellow）→ fallback 为 `border` + 纯色 `background-color` on `p`。
4. **左竖线模式：** `copy-safe-left-border` = 单 `p` + `border-left` + `padding-left`，不拆两列。
5. **禁止路径：** 插件同步、class 主题、SVG 装饰、flex/grid 标题布局 — 不进 Release 1 主链路。

详见 Pattern Library v0.1 各 `patternId`。

---

## 13. 不建议进入 Release 1 的能力

| 能力 | 原因 |
|------|------|
| 插件/API 同步排版（壹伴式） | 非 Clipboard 主链路 |
| 深嵌套 layout（秀米式多 section/div） | 粘贴扁平化 · Matrix nesting 警告 |
| SVG/图片标题装饰 | 非纯文本 Copy · 运维成本高 |
| flex/grid/absolute 标题版式 | PO 实机 FAIL（DRIFT-001 类） |
| 全局放开 `box-shadow` / `linear-gradient` | Contract Yellow · 无 evidence 不放行 |
| 竞品 HTML/主题整包复用 | 违反轻篇单 Schema/单 Renderer 约束 |

---

## 14. 变更记录

| 日期 | 变更 |
|------|------|
| 2026-06-04 | 创建结构化调研（S8-STORY-006B） |
| 2026-06-04 | FIX-A：harvest 改 L0 表述 · evidence workflow |
