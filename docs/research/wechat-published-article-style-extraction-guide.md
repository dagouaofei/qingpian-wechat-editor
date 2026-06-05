# 公众号文章样式 AI 提取规范（S8-STORY-006B-FIX-A）

> **输入：** [`wechat-published-article-harvest-input-template.md`](wechat-published-article-harvest-input-template.md)  
> **输出：** 单条 `WX-HARVEST-EVIDENCE-###` 记录（Markdown）  
> **映射：** [`wechat-copy-safe-pattern-library.md`](../architecture/wechat-copy-safe-pattern-library.md) · Drift · [`evidenceLevel`](wechat-published-article-style-harvest.md#2-evidencelevel-定义-l0l4)

---

## 1. 触发条件

| inputType | 条件 | 最高 evidenceLevel |
|-----------|------|-------------------|
| `url-only` | 仅 `articleUrl` | L1；可读页面时 L2 |
| `url-plus-html` | URL + `htmlSnippet` | L3 |
| `url-plus-paste-result` | URL + HTML/摘要 + 粘贴对照 | L4 |

**无法访问 URL 且无 HTML：** 只输出 L1 登记，**禁止** 填写 `domSummary` / `cssSummary` / `patternMapping`。

---

## 2. 输出字段（必填清单）

```text
sourceId
articleUrl
harvestDate
evidenceLevel
inputType
observedStyleTypes
domSummary
cssSummary
patternMapping
riskFlags
wechatSafeAssessment
relatedDrift
recommendedUseIn006C
notes
```

---

## 3. 字段说明

### 3.1 `sourceId`

- 格式：`WX-HARVEST-EVIDENCE-###`（三位序号，与输入 `ARTICLE-EVIDENCE-INPUT-###` 可同号）
- 示例：`WX-HARVEST-EVIDENCE-001`

### 3.2 `articleUrl`

- 用户提供的 `mp.weixin.qq.com` 链接（**不得虚构**）

### 3.3 `harvestDate`

- ISO 或 `YYYY-MM-DD`（提取执行日）

### 3.4 `evidenceLevel`

| 级别 | 名称 | 条件 |
|------|------|------|
| **L0** | pattern-hypothesis | 无 URL；模式假设 |
| **L1** | url-registered | 有 URL，未分析 |
| **L2** | ai-reading-extracted | 有 URL + 阅读态观察，无完整 HTML |
| **L3** | html-extracted | 有 URL + HTML 片段分析 |
| **L4** | paste-verified | URL + HTML/摘要 + 公众号或轻篇粘贴验证 |

**006C 依据：** 主要用 **L2/L3/L4**；L1 不指导结构修复；L0 仅假设。

### 3.5 `inputType`

- `url-only` · `url-plus-html` · `url-plus-paste-result`

### 3.6 `observedStyleTypes`（多选）

`card` · `left-border` · `title-divider` · `highlight-band` · `cta-button` · `info-box` · `divider` · `inline-emphasis` · `unknown`

### 3.7 `domSummary`

- 英文或中文 **短语列表**（bullet），描述结构，**不贴完整 HTML**
- 示例：
  - `p carries background-color and padding directly`
  - `border-left on same p node as text`
  - `h2 carries border-bottom directly; no extra spacer block`
  - `section wrapper present but styles on inner p only`

### 3.8 `cssSummary`

- 关键 **inline 能力** 列表，不复制整段 `style="..."`
- 示例：`background-color` · `padding` · `border-left` · `border-bottom` · `font-size` · `line-height`

### 3.9 `patternMapping`

映射 Pattern Library v0.1：

`copy-safe-card` · `copy-safe-left-border` · `copy-safe-title-divider` · `copy-safe-highlight-band` · `copy-safe-cta-button` · `copy-safe-info-box` · `copy-safe-divider` · `copy-safe-inline-emphasis`

### 3.10 `riskFlags`（多选）

`deep-wrapper` · `background-on-wrapper` · `border-left-separated-from-text` · `svg-decoration` · `image-based-decoration` · `flex-like-layout` · `unknown-css` · `none`

### 3.11 `wechatSafeAssessment`

| 值 | 含义 |
|----|------|
| `likely-safe` | 符合 Contract v1 浅层 inline 路径 |
| `needs-validation` | 含 Yellow 或结构存疑，须 Matrix/Paste |
| `not-release1-safe` | 依赖 SVG/插件/深嵌套等 |

### 3.12 `relatedDrift`

- 可选：`DRIFT-S8-20260604-00x` 或 `—`

### 3.13 `recommendedUseIn006C`

| 值 | 含义 |
|----|------|
| `primary-evidence` | 可作为该 pattern 修复的主证据（通常 L3/L4） |
| `supporting-evidence` | 辅助印证 |
| `hypothesis-only` | 仅假设，等同 L0/L1 |
| `do-not-use` | 不可用或口径不清 |

### 3.14 `notes`

- 访问限制、片段不完整、与 HARVEST-00x 假设对齐说明等

---

## 4. 输出模板（Markdown）

```markdown
## WX-HARVEST-EVIDENCE-001

| 字段 | 值 |
|------|-----|
| sourceId | WX-HARVEST-EVIDENCE-001 |
| articleUrl | （用户提供的 URL） |
| harvestDate | YYYY-MM-DD |
| evidenceLevel | L3 html-extracted |
| inputType | url-plus-html |

### observedStyleTypes

- card
- left-border

### domSummary

- p carries background-color, padding and border-left directly
- no flex/grid/absolute in snippet

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

（可选）
```

---

## 5. AI / Cursor 执行规则

1. **先判定** 能否访问 URL、是否有 HTML；再定 L1–L4，不默认拔高。
2. **DOM/CSS** 只写观察到的节点层级与属性名，不臆造未在 HTML/阅读中出现的结构。
3. **patternMapping** 须与 [`wechat-copy-safe-pattern-library.md`](../architecture/wechat-copy-safe-pattern-library.md) 定义一致。
4. **不得** 将输出写入为「已完成 15 篇实采」；每条 evidence 独立编号。
5. **不得** 在 repo 保存用户粘贴的全文 HTML（仅会话或 gitignore 的 evidence 目录，FIX-B 再定）。
6. URL-only 且页面不可读 → 输出 L1 + `recommendedUseIn006C: hypothesis-only` + 空 dom/css 或「N/A」。

---

## 6. 与 HARVEST-001~015 的关系

- 旧 `HARVEST-*` 行保留为 **L0 pattern-hypothesis**。
- 新真实证据用 **`WX-HARVEST-EVIDENCE-*`**，不覆盖 HARVEST 编号。
- FIX-B 可将 evidence 回链到 HARVEST 假设（notes 中注明「验证 HARVEST-003」等）。

---

## 7. 变更记录

| 日期 | 变更 |
|------|------|
| 2026-06-04 | 初版（S8-STORY-006B-FIX-A） |
