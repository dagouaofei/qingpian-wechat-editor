# WeChat-safe HTML/CSS Contract（草案）

> 轻篇公众号排版 · qingpian-wechat-editor
>
> **状态：** 草案 · S8-STORY-001 占位 · **S8-STORY-002 定稿**
> **版本：** `contract-draft-0.1`
> **关联：** [`wechat-copy-style-rules.md`](wechat-copy-style-rules.md) · [`copy-drift-diagnostics.md`](copy-drift-diagnostics.md) · DECISION-088

---

## 1. Contract 目标

1. 定义轻篇 Copy HTML 在微信公众号编辑器中**允许、慎用、禁止**的 HTML/CSS 子集。
2. 为 Compatibility Profile、Copy HTML Validator、Fidelity Matrix 提供**单一事实源**。
3. 使 Preview / Copy / 粘贴结果可对照、可修正，避免样式开发靠猜。
4. **不替代**实机粘贴 QA；contract 违规或灰区须 Matrix 证据闭环。

---

## 2. Green / Yellow / Red 定义

| 级别 | 名称 | 含义 | Copy 输出 | Validator |
|------|------|------|-----------|-----------|
| **Green** | 安全 | 公众号粘贴高概率保留 | 允许默认使用 | 通过 |
| **Yellow** | 慎用 | 可能保留或部分剥离；须有 fallback + 粘贴记录 | 允许但须声明 + Matrix | 警告（须 waiver 或 evidence） |
| **Red** | 禁止 | 高概率失效或破坏粘贴 | **不得**出现在 Copy HTML | 失败 |

**分级变更：** 仅通过 [`copy-drift-diagnostics.md`](copy-drift-diagnostics.md) §4 流程与 DECISION 记录。

---

## 3. Green CSS 初始候选

> 与 `wechat-copy-style-rules.md` §1.3.2 对齐；002 定稿时逐条验收。

- `font-size`, `font-weight`, `font-family`
- `color`, `line-height`, `text-align`
- `margin`, `padding`
- `background-color`
- `border`, `border-width`, `border-style`, `border-color`
- `display: block | inline | inline-block`（值级约束在 Profile 中枚举）

---

## 4. Yellow CSS 初始候选

| 属性 | 默认 fallback 方向 | 备注 |
|------|-------------------|------|
| `box-shadow` | `border` 模拟层次 | 已有 risky 表 |
| `linear-gradient` | `background-color` | S7 heading 荧光笔已实机验证个案 |
| `opacity` | 显式 `color` / `background-color` | 避免透明丢失 |
| `letter-spacing` | 保留 · 须 Matrix | 中风险 |
| `border-radius` | 保留 · 须 Matrix | 中风险 |
| `border-left` / 装饰边条 | 保留 · 须 Matrix | 常用于 quote / info_card |

---

## 5. Red CSS 初始候选

- class 选择器依赖（Copy HTML 中带 `class=` 且无 inline 等效）
- `<style>` 标签、外链样式表
- `@font-face`、外链 web font
- CSS variables `var(--*)` 于 copy 输出
- `animation`, `transition`
- `:hover` 等伪类（粘贴无交互态）
- `::before`, `::after`（微信侧常剥离）
- Release 1 copy：**complex flex/grid**、**absolute / fixed positioning**
- `transform`, `filter`（待 Matrix 证据后可讨论 Yellow）

---

## 6. HTML 标签初始候选

| 级别 | 标签 |
|------|------|
| Green | `p`, `span`, `strong`, `em`, `br`, `a`（href 受限另议）, `ul`, `ol`, `li`, `h1`–`h4`（与 block 映射一致） |
| Yellow | `section`, `div`（仅作 copy-safe wrapper，深度受限）, `img`（R1 占位策略） |
| Red | `script`, `iframe`, `style`, `link`, `form`, `input` |

**约束：** 标签允许不等于任意嵌套；见 §7。

---

## 7. DOM 结构风险

1. **最大嵌套深度：** Release 1 建议 **≤3**（与现有 profile 一致）。
2. **禁止** 无语义的空 `div` 堆叠仅用于布局。
3. **文本排版：** 关键 typography 须在**文本节点或最近 inline 祖先**上（`requireTextNodeTypography`）。
4. **列表 / 卡片：** `list`、`info_card` 须有 copy 结构保真规则（S4-B 登记项在 Matrix 验证）。

---

## 8. inline style 规则

1. Copy 输出 **必须** `requireInlineStyle: true`。
2. 禁止依赖页面级 `<style>` 或 Tailwind class 进入 Clipboard HTML。
3. 同一元素上合并为单一 `style` 属性；避免重复属性名。
4. Yellow 属性须在 variant 元数据或 Matrix 中可追溯到 **evidence id**。

---

## 9. fallback 规则

1. **Yellow → Green：** 优先用纯色、border 替代 shadow/gradient。
2. **Red 出现：** Validator 失败；Renderer 须在输出前降级或标 `unsupported`。
3. **用户可见：** `balanced` / `preview_only` / `unsupported` 与 S8-STORY-006 流程对齐。
4. fallback **不得** 引入第二套样式来源（仍走 `resolveStyle()`）。

---

## 10. contract 误判修正流程

```text
实机粘贴 FAIL / WARNING
  → 填写 copy-drift-diagnostics 记录
  → 判定失真类型（CSS/DOM/上下文）
  → 选择修正动作（见 copy-drift-diagnostics §4）
  → 更新 contract 分级或 variant waiver
  → 更新 Fidelity Matrix 行
  → 必要时 DECISION + changelog
```

**原则：** 无 Matrix 证据不得将 Yellow 升为 Green；无多次 FAIL 不得将 Green 降为 Red。

---

## 11. 与 Copy HTML Validator 的关系

| Contract | Validator |
|----------|-----------|
| 定义 Green/Yellow/Red 与 DOM 规则 | 扫描 Copy HTML 输出 |
| 版本字段 `contract-draft-0.1` | 报告 `violation[]` + `warning[]` |
| variant 级 waiver 表 | 识别豁免是否过期 |

**S8-STORY-004** 实现；本草案不为实现细节。

---

## 12. 与 WeChat Fidelity Matrix 的关系

| Contract | Matrix |
|----------|--------|
| 理论分级 | 每行 `CSS capability` + `status` |
| 修正建议字段 | `contract action` 列 |

**S8-STORY-005** 建立 [`docs/agile/paste-qa/wechat-fidelity-matrix.md`](../agile/paste-qa/wechat-fidelity-matrix.md)。

---

## 13. 变更记录

| 日期 | 变更 | Story |
|------|------|-------|
| 2026-06-04 | 创建草案 v0.1 | S8-STORY-001 |
