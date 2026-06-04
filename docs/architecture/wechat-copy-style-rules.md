# 微信公众号复制样式规则

> 轻篇公众号排版 · qingpian-wechat-editor
>
> 状态：正式技术方案 · Sprint 1-B 定稿
>
> **后续 Copy HTML 约束依据（2026-06-04）：** [`wechat-safe-html-css-contract.md`](wechat-safe-html-css-contract.md) · **`wechat-safe-contract-v1`**（DECISION-089）。本文档 §1.3 WeChatCompatibilityProfile 种子在 **S8-STORY-003** 对齐 Contract v1；属性分级冲突时 **以 Contract v1 为准**。

---

## 1. P0 质量标准

**复制一致性是 Release 1 P0，不是后期补 Bug。**

- 不允许只追求网页预览效果
- 不允许「先上线 Preview，Copy 以后再修」
- 每个涉及样式的 Story 必须同时验收 Preview 和 Copy
- 复制到微信公众号编辑器后的样式一致性是首要质量目标

### 1.1 Copy Fidelity DoD

| 状态 | 含义 |
|------|------|
| **Done（代码）** | Preview + Copy 成对实现完成 |
| **Done（粘贴 QA）** | 微信公众号粘贴验收通过 |

Story / variant 关闭须区分上述两种 Done。

### 1.2 粘贴 QA 时间线

- **Sprint 4：** Preview/Copy 闭环时启动最小人工粘贴 QA
- **Sprint 6：** fixture 三联（Article JSON + copy HTML snapshot + paste checklist）系统化回归

---

## 1.3 WeChatCompatibilityProfile（实现前契约）

> 将微信复制规则从原则变为**可执行 profile**，供 Copy Renderer 与 Style System 开发阶段判断 copy-safe。

### 1.3.1 结构

```text
WeChatCompatibilityProfile
├── profileId: "wechat-mp-editor-v1"
├── allowedCssProperties: string[]
├── riskyCssProperties: { property: string; fallback: string; note: string }[]
├── forbiddenCssProperties: string[]
├── maxNestingDepth: number              # Release 1: 3
├── requireInlineStyle: true
├── requireTextNodeTypography: true      # 文本节点必须 inline font-size / font-family
└── fallbackPolicy: FallbackPolicy[]

FallbackPolicy
├── from: string                         # CSS 属性或模式
├── to: string                           # fallback 属性或值策略
├── reason: string
└── requiredForRelease1: boolean
```

### 1.3.2 AllowedCssProperties（Release 1）

`font-size`, `font-weight`, `font-family`, `color`, `line-height`, `text-align`, `margin`, `padding`, `background-color`, `border`, `border-radius`, `display:block`, `display:inline`, `display:inline-block`

### 1.3.3 RiskyCssProperties（须 fallback + 粘贴测试）

| property | fallback | note |
|----------|----------|------|
| `box-shadow` | `border` | 用 border 模拟卡片层次 |
| `linear-gradient` | `background-color` | 纯色背景 |
| `opacity` | explicit `color` / `background-color` | 避免透明度丢失 |
| `letter-spacing` | 保留但须 paste test | 中风险 |
| `border-radius` | 保留但须 paste test | 中风险 |

### 1.3.4 ForbiddenCssProperties（Copy HTML 禁止）

- class-based style（依赖 class 的选择器）
- `<style>` 标签
- external / web font（`@font-face`、外链字体）
- CSS variables（`var(--*)`）在 copy HTML 中
- `animation`、`transition`
- `:hover` 及交互伪类
- `::before` / `::after`
- Release 1 copy：**complex grid / flex layout**、**absolute positioning**

### 1.3.5 使用规则

1. **VariantDefinition** 必须声明或可推导 `wechatCompatibility`（关联 profileId）
2. **Copy Renderer** 输出前必须使用 WeChatCompatibilityProfile 过滤 / fallback inline style
3. **InlineMark** 映射（bold/highlight/color）须符合 profile 的 allowed + risky 规则
4. Release 1 variant 若无法满足 profile，**不得**进入正式可用集
5. profile 是开发阶段 copy-safe 判断依据，**不替代**人工粘贴 QA

---

## 2. 设计原则

### 2.1 共享样式定义

Preview Renderer 和 Copy Renderer 必须调用同一 `resolveStyle()`，读取同一 `BlockStyleRegistry`，输出数值一致的 typography / spacing / decoration。

### 2.2 Inline Style 优先

Copy 输出全部使用 inline style。VariantDefinition 设计时必须可完整转为 inline style 字符串。

### 2.3 微信安全子集

只使用微信粘贴后可靠保留的 CSS 属性：

**可靠：**

- `font-size`、`font-weight`、`font-family`、`color`
- `line-height`、`text-align`
- `margin-*`、`padding-*`
- `background-color`
- `border`、`border-radius`（适度）
- `display: block` / `inline` / `inline-block`

**不可靠（需 fallback）：**

- `box-shadow` → border
- `linear-gradient` → background-color
- `::before` / `::after` → 真实 DOM
- `flex` 复杂布局 → 简单 block
- `class` 引用 → inline

### 2.4 以微信公众号编辑器为唯一验收标准

135 编辑器、浏览器预览、截图对比均不能替代微信公众号编辑器粘贴测试。

---

## 3. 样式检查维度

每个 variant 粘贴测试必须检查：

| 维度 | 检查项 | 通过标准 |
|------|--------|----------|
| 字体 | font-family | 粘贴后字体未变为 Times New Roman 等默认字体 |
| 字号 | font-size | 与 Preview 一致（±1px 容忍） |
| 字重 | font-weight | bold 保留 |
| 颜色 | color | 文字颜色未丢失 |
| 背景 | background-color | 卡片/高亮背景保留 |
| 间距 | margin, padding | 段落间距、卡片内边距基本一致 |
| 边框 | border, border-radius | 卡片边框、圆角保留 |
| 对齐 | text-align | 标题居中/左对齐保留 |
| 列表 | 序号/圆点 | 列表标记保留 |
| 装饰 | slot 元素 | 下划线、色条等保留 |

---

## 4. 旧项目历史问题（质量约束清单）

以下问题来自旧一键成稿项目，新项目必须作为**设计阶段约束**：

| # | 问题 | 约束 |
|---|------|------|
| 1 | preview 与 copy 不一致 | 共享 ResolvedBlockStyle，禁止独立样式 |
| 2 | 135 与微信公众号编辑器表现不一致 | 以微信为唯一标准 |
| 3 | 标题样式丢失 | title variant Copy 必须 inline 全部 typography |
| 4 | 字体字号变化 | Copy 必须 inline font-family + font-size |
| 5 | 卡片样式变化 | info_card Copy 模板必须 inline border + background + padding |
| 6 | 间距丢失 | Copy 必须 inline margin + padding，不依赖 margin collapse |
| 7 | 高亮背景丢失 | highlight variant Copy 必须 inline background-color |
| 8 | CTA 按钮样式丢失 | cta variant Copy 必须 inline 按钮样式 |

---

## 5. 测试流程

### 5.1 每个 variant 必须测试

新增或修改 variant 时：

1. 准备包含该 variant 的 fixture Article
2. 生成 Copy HTML
3. 粘贴到微信公众号编辑器
4. 逐项检查 §3 维度
5. 记录结果（PASS / FAIL + 截图）
6. FAIL → 创建 Bug 到 `docs/agile/bugs.md`

### 5.2 测试记录存放

- 手动测试记录：`tests/manual/paste-test-log.md`（后续 Sprint 创建）
- Bug 跟踪：`docs/agile/bugs.md`

### 5.3 135 编辑器测试

- 可选辅助测试
- 结果标注「135 参考，非最终标准」
- 135 PASS + 微信 FAIL = 以微信 FAIL 为准

---

## 6. Copy 一致性对 Style System 的反向约束

Style System 设计 VariantDefinition 时必须回答：

1. 这个 variant 的全部视觉属性能否转为 inline style？
2. Copy 输出嵌套是否 ≤ 3 层？
3. 是否有 unreliable CSS 属性？fallback 是什么？
4. 字体是否使用安全栈？

若任一答案不满足，variant 设计需要修改，不是 Copy Renderer 单独兜底。

---

## 7. Release 1 复制一致性验收范围

| 范围 | 验收标准 |
|------|----------|
| classic-news preset 全部 11 block variant | 粘贴后 typography + spacing + decoration 基本一致 |
| standard density | 间距正确 |
| 完整 fixture 文章 | 端到端粘贴测试 PASS |
| 流式生成终态 Article | 与 batch 生成 Copy 结果一致 |

**不在 Release 1 验收范围：**

- 多 preset 切换（架构支持，测试随 preset 增加而扩展）
- 135 编辑器兼容性
- 图片真实渲染（仅 placeholder）

---

## 8. Bug 严重级别

| 级别 | 定义 | 示例 |
|------|------|------|
| P0 | 粘贴后核心样式丢失，影响发布 | 标题字号丢失、卡片无边框 |
| P1 | 粘贴后次要样式差异 | 间距差 4px、圆角丢失 |
| P2 | 视觉微调 | 颜色偏差、装饰细节 |

复制相关 Bug 默认 P0 或 P1，不设 P2 预置。

---

## 9. 与渲染链路的关系

```text
Style System (设计约束: 可 inline)
       ↓
Style Resolver (共享)
       ↓
  ╱         ╲
Preview     Copy
(视觉对照)  (粘贴验收 ← P0)
```

Copy 是样式系统的**最终验收环节**，不是附属功能。

---

## 10. titleBlock family / variant / slot 与 Copy 约束

| 约束 | 说明 |
|------|------|
| Profile 校验 | titleBlock family / variant / slot 须经 WeChatCompatibilityProfile |
| Slot fallback | icon / badge / decorationLine / bgShape / extraMark 须有 copy-safe fallback |
| 禁止项 | 不得依赖 pseudo、复杂 absolute、复杂 flex/grid |
| 高风险 | bgShape / magazine / overlay 类须有真实 DOM fallback |
| Done 分离 | titleBlock Done（代码）≠ Done（粘贴 QA） |
| QA | 每 titleBlock variant 进入 block × variant × paste QA |

**Release 1 Paste QA 范围（DECISION-039、DECISION-043）：** **First wave 33 variants**（11×3）须进入 Paste QA；Sprint 4-A/B 启动最小 QA；Sprint 6-B first-wave 全量回归；expansion variants 后续批次 QA。

> **`magazine_left_bar_title`（candidate）：** 不进入 first-wave QA 范围；若实现须单独 Paste QA（DECISION-044）。

### 10.1 TitleBlockLayoutCompatibility 与 WeChat profile

Copy Renderer 对 titleBlock 须额外校验 `TitleBlockLayoutCompatibility`（见 [style-system.md](style-system.md) §11.10）：

- Release 1 copy 禁止 absolute positioning
- overlay / offset-bg 类须 `fallbackLayoutMode`
- 不满足 `allowedInCopy` 的 layoutMode 不得进入 release1RequiredVariants
- Copy 不得因 layout 复杂降级为 paragraph

## 相关文档

- [复制链路](copy-to-wechat-pipeline.md)
- [样式系统](style-system.md)
- [渲染链路](rendering-pipeline.md)
- [旧项目经验](prototype-lessons.md)
