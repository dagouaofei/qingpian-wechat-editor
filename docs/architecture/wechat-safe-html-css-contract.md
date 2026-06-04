# WeChat-safe HTML/CSS Contract

> 轻篇公众号排版 · qingpian-wechat-editor
>
> **状态：** **Contract v1 · S8-STORY-002 定稿**
> **版本 ID：** `wechat-safe-contract-v1`
> **关联：** [`wechat-copy-style-rules.md`](wechat-copy-style-rules.md) · [`copy-drift-diagnostics.md`](copy-drift-diagnostics.md) · [`wechat-editor-compatibility-reference.md`](../research/wechat-editor-compatibility-reference.md) · DECISION-088 · **DECISION-089**

---

## 1. 版本、状态与适用范围

### 1.1 版本字段

| 字段 | 值 |
|------|-----|
| `contractVersionId` | `wechat-safe-contract-v1` |
| 定稿 Story | S8-STORY-002 |
| 上一版 | `contract-draft-0.1`（S8-STORY-001 草案，已废止） |

### 1.2 声明（必读）

1. **Contract v1** 是 Release 1 **后续样式开发、Copy HTML 产出、Validator、Matrix、Paste QA** 的约束依据。
2. Contract v1 **不等于**微信官方公布的 HTML/CSS 白名单；微信侧过滤规则可能变更且无完整公开规范。
3. Contract v1 是轻篇基于 **历史项目教训、Sprint 1-B 复制规则、S7 实机粘贴记录、公开资料调研框架、工程约束** 形成的 **内部契约**。
4. 任何 Green / Yellow / Red 调整 **必须** 经过 **Fidelity Matrix → Copy Drift → Decision → changelog** 闭环，禁止在 Renderer 中静默扩权。
5. **Green 不是永远安全**：仅表示默认可用；实机 FAIL 仍须降级或修正 contract。
6. **Yellow 不是默认允许**：须绑定 **waiver + evidence**；无 evidence 时 Validator（S8-STORY-004）须 **warning**。
7. **Red 默认禁止**进入 Clipboard HTML；Copy Renderer 须在输出前剥离或 fallback。

### 1.3 与 `wechat-copy-style-rules.md` 的关系

- Sprint 1-B 的 [`wechat-copy-style-rules.md`](wechat-copy-style-rules.md) 与 **WeChatCompatibilityProfile** 种子仍有效，但 **属性分级以 Contract v1 为准**。
- 已知差异（不 retro 大改历史文档）：
  - 历史 profile **Allowed** 含 `border-radius`；Contract v1 将 `border-radius` 定为 **Yellow**。
  - 历史 §2.3 写 `border-radius`「适度可靠」；v1 要求 Matrix evidence 后方可进入默认 preset。
- **S8-STORY-003** 实现 Profile 时须 **对齐 Contract v1**，并记录迁移说明。

---

## 2. 分级定义（Green / Yellow / Red）

| 级别 | 名称 | Copy HTML | Validator（STORY-004） | 默认 preset |
|------|------|-----------|------------------------|-------------|
| **Green** | 安全 | 允许 | Pass | 可进入 `release1_required`（仍须 Matrix 抽样） |
| **Yellow** | 慎用 | 允许 **仅当** 有有效 waiver + evidence | Warning（无 evidence 亦 warning） | **不默认**进入 `release1_required` |
| **Red** | 禁止 | **不得出现** | Fail | 不得进入任何 Copy 输出 |

---

## 3. HTML 标签分级

### 3.1 Green 标签

| 标签 | 使用约束 |
|------|----------|
| `p` | 段落块主容器；typography 须在元素或子 `span` 上 inline |
| `span` | 行内强调、颜色、字号片段 |
| `strong` | 粗体语义 |
| `em` | 斜体语义 |
| `br` | 显式换行；避免连续多个 `br` 模拟间距 |
| `ul` / `ol` / `li` | 列表结构；`list` block 保真须 Matrix 验证 |
| `h1` / `h2` / `h3` / `h4` | 与 `title` / `heading` 语义映射一致；禁止仅为字号而滥用 `h*` |

### 3.2 Yellow 标签

| 标签 | 约束 |
|------|------|
| `section` | **仅**作 copy-safe wrapper；须计嵌套深度；不得堆叠无语义 section |
| `div` | **仅**作 copy-safe wrapper 或经 Matrix 验证的卡片外壳；**不得**默认自由布局 |
| `a` | 见 §3.4；默认不进 Release 1 主路径 unless waiver |
| `img` | R1 **占位策略**：仅 `image_placeholder` 约定 src/尺寸；须 Matrix + 实机 |
| `table` / `tbody` / `tr` / `td` | **仅**允许经 Matrix 验证的**特定 variant** 结构；**不得**作为通用布局能力 |
| `thead` / `th` | 同 `table`；无 Matrix 证据视为 Red |

**Yellow 标签总则：**

1. Yellow 标签 **不得**「默认可用」；代码生成须显式声明 DOM 模式。
2. `section` / `div` **禁止**深层嵌套仅模拟视觉效果（见 §5）。
3. 所有 Yellow 标签结构须对应 Matrix 行（S8-STORY-005）。

### 3.3 Red 标签（禁止进入 Copy HTML）

`script` · `style` · `link` · `iframe` · `form` · `input` · `button` · `canvas` · `svg` · `video` · `audio`

以及：任何未在 Green/Yellow 白名单且经评估的标签。

### 3.4 `a` 标签专项（Yellow）

| 规则 | 说明 |
|------|------|
| `href` | Release 1 默认 **不输出** 外链；若业务必须，仅 `https:` / `http:`，禁止 `javascript:`、`data:` |
| `target` | `_blank` 等在粘贴环境常无效；须 Matrix 验证 |
| 协议风险 | 微信可能剥离或改写 `href`；失真记 Drift |
| 默认策略 | CTA block 以 **视觉按钮样式** 为主，**不依赖**可点击链接完成排版 |

### 3.5 `img` 占位（Yellow · R1）

- 仅服务于 `image_placeholder` block 的约定占位图。
- 须 inline `width` / `height` 或 `max-width:100%`（Green 值约束见 §4）。
- 真实配图能力 **不在** Release 1 Contract 范围。

---

## 4. CSS 属性分级

> **值级约束：** `display` 等属性 **必须**按「属性 + 值」判定，不得仅因属性名在 Green 列表即放行。

### 4.1 Green 属性与允许值

| 属性 | 允许值 / 约束 |
|------|----------------|
| `font-size` | 长度值；token 已解析为 `px`/`em` |
| `font-weight` | `normal` / `bold` / `100`–`900` |
| `font-family` | 字体栈字符串；**系统回退为可接受差异**（Matrix 标 WARNING，不冒充 FAIL） |
| `color` | 十六进制 / `rgb()`；禁止未解析 token |
| `line-height` | 数字或长度 |
| `text-align` | `left` / `center` / `right` / `justify` |
| `margin` / `margin-*` | 长度；避免负 margin（无 evidence 时视为 Yellow） |
| `padding` / `padding-*` | 长度 |
| `background-color` | 纯色 |
| `border` / `border-*` | 宽度 + style + color；见各边子属性 |
| `border-width` / `border-style` / `border-color` | 标准值 |
| `border-top` / `border-right` / `border-bottom` / `border-left` | 装饰边条常用 |
| `display` | **仅** `block` · `inline` · `inline-block` |
| `width` | **仅** `100%` 或明确 `px`（禁止 `auto` 依赖复杂布局） |
| `box-sizing` | **仅** `border-box` |

### 4.2 Yellow 属性与默认 fallback

| 属性 / 模式 | 默认 fallback | 备注 |
|-------------|---------------|------|
| `border-radius` | 直角（移除 radius） | **非 Green**；须 Matrix 证据方可进默认 preset |
| `box-shadow` | `border` 或浅色 `background-color` | |
| `background`（非 `background-color`） | `background-color` | 含简写背景 |
| `linear-gradient(...)` | `background-color` 或 `border-bottom` 色条 | **全局禁止放行**；须 per-variant evidence |
| `opacity` | 显式 `color` / `background-color` | |
| `letter-spacing` | 移除或保留（须 evidence） | |
| `max-width` / `min-width` | 移除或 `width:100%` | |
| `height` / `min-height` | 移除，由内容撑开 | |
| `vertical-align` | 移除 | |
| `overflow` | 移除 | `hidden` 可能导致粘贴裁切 |
| `display: table` / `table-row` / `table-cell` | `block` / `inline-block` 流式结构 | 与 table 标签联动 |
| `word-break` | 移除或 `break-all`（须 evidence） | |
| `white-space` | 移除 | `nowrap` 高风险 |
| `box-decoration-break` | 移除；或随 `linear-gradient` 一并 waiver | **不得 Green** |
| `-webkit-box-decoration-break` | 同 `box-decoration-break` | |
| 负 `margin` | `0` | 无 evidence 按 Yellow 处理 |

### 4.3 Red 属性与模式（禁止进入 Copy HTML）

| 类别 | 项 |
|------|-----|
| 定位 | `position: absolute` · `position: fixed` · `z-index` |
| 布局 | `display: grid` · **complex flex**（`flex` 简写、`justify-content` / `align-items` / `gap` / `flex-grow` 等组合布局） |
| 变换 / 滤镜 | `transform` · `filter` · `backdrop-filter` |
| 动效 | `animation` · `transition` |
| 计算 / 变量 | `var(--*)` · `calc()` |
| 依赖 | pseudo-element（`::before` / `::after`）· **class selector 依赖** · **external stylesheet** · **media query** |
| 其它 | `!important` · `@font-face` · 外链 web font |

**complex flex 定义（Release 1）：** 任一元素同时使用 `display:flex` 与以下任一：`flex-direction`（非默认）、`flex-wrap`、`justify-content`、`align-items`、`align-content`、`gap`、`flex` 简写、`order`。单独 `display:flex` 无子项布局属性仍视为 **Red**（一律 fallback 为 `block`）。

### 4.4 已知 S7 evidence（Yellow waiver 种子 · 非全局 Green）

> 详证见 [`heading-publish-8.md`](../agile/paste-qa/heading-publish-8.md)、DECISION-087、`heading-publish-copy-contract.md`。

| capability | block | variant | evidence 摘要 |
|------------|-------|---------|---------------|
| `linear-gradient` + `box-decoration-break` | `heading` | `heading_highlight_marker` | 公众号实机 8/8 PASS 含本款；`h3` + inline gradient |
| `section` wrapper | `heading` | 发布池多款 | 经发布池粘贴 QA |

上述 waiver **不得**自动扩展到其它 variant、其它 block 类型或默认 preset 的全局策略。

**明确禁止外推：**

- 不得因 `heading_highlight_marker` 在公众号粘贴通过，而将 `linear-gradient` / `box-decoration-break` 升为全局 Green。
- 其它 heading variant、title、quote、info_card 等 **若使用 gradient**，须独立 Matrix 行 + 独立 `evidenceId` + PO 确认；不得引用本 seed 作为依据。
- `warm` preset 默认使用本 variant 不构成对其它 preset 的 gradient 授权。

---

## 5. DOM 结构约束

1. **最大推荐嵌套深度：** Release 1 Copy HTML **≤ 3**（根容器计 1 层；Profile `maxNestingDepth: 3` 对齐）。
2. **禁止**无语义空 wrapper 堆叠（连续 `div`/`section` 无文本、无角色）。
3. **禁止**用深层 DOM **仅**模拟阴影、渐变、定位效果；应优先 Green 属性或 Yellow+fallback。
4. **文本核心样式**（`font-size` / `font-family` / `color` / `line-height`）须落在**文本节点**或其**最近** block/inline 祖先上（`requireTextNodeTypography`）。
5. **block 与 block 之间**不得依赖相邻兄弟选择器（Copy HTML 无 stylesheet）。
6. **不允许** class selector 生效假设；Copy HTML 中带 `class=` **且无** inline 等效 → **Red**（debug class 亦禁止，见 §6）。
7. **不允许**外部 stylesheet、`<style>`、Tailwind utility class 进入 Clipboard HTML。
8. **不允许** Preview-only 装饰 DOM 进入 Copy HTML（S8-STORY-007 审计）。
9. **Yellow DOM 结构**（`table`、`section` 深套等）**必须**有 Matrix 行；无行则按 Red 处理。

---

## 6. inline style 规则

1. Copy HTML **必须**使用 **inline `style` 属性**承载全部有效样式（`requireInlineStyle: true`）。
2. Clipboard HTML **不得**依赖 `<style>` 标签。
3. Clipboard HTML **不得**依赖 Tailwind / 原子 class 作为样式来源。
4. **`class` 属性（Clipboard 专条）：**
   - **最终 Clipboard HTML（`text/html` payload）禁止**保留 `class`（含 debug、Tailwind、BEM）。
   - **Preview / dev / test DOM 不受本条限制** — 页面预览、开发 harness、Vitest/Playwright 夹具可使用 class 便于调试与样式挂载。
   - **Copy Renderer 出口责任：** 写入剪贴板前必须 **剥离** 全部 `class`（及 Red 级依赖）；Validator 仅扫描 Clipboard 产物，不扫描 Preview DOM。
   - 若未来 Clipboard 必须保留 class，须 **Red 级例外 + DECISION**；Contract v1 一律禁止。
5. 同一元素 `style` 内 **不得**重复同名 CSS 属性；合并为单一样式字符串。
6. **建议**稳定属性排序（字母序或 typography → box → border）便于 snapshot diff。
7. 所有 design token **必须在进入 Copy HTML 前**解析为具体值（色值、px、字体栈）。
8. **禁止** `var(--*)` 进入 Copy HTML。
9. Yellow 属性出现在 inline style 时，须在 variant 元数据或 waiver 表可追溯到 **evidenceId**。

---

## 7. Yellow waiver / evidence 机制

### 7.1 原则

1. Yellow **可**出现在实验 variant、候选池、发布池（须有 evidence）。
2. Yellow **不默认**进入 `release1_required` 或默认 preset。
3. Yellow **进入默认 preset** 必须：Matrix **PASS** + PO 确认 + waiver 记录 + `decisions.md`（若分级争议）。
4. Yellow **无 evidence** → Validator **warning**（STORY-004）；不得标 Story Done（粘贴 QA）。
5. Yellow **实机 FAIL** → 必须 fallback、降级为 Red、或移出默认池。

### 7.2 Waiver 记录（每 Yellow 使用点必填）

| 字段 | 说明 |
|------|------|
| `cssCapability` | 如 `linear-gradient`、`border-radius` |
| `htmlDomContext` | 标签组合，如 `section>h3` |
| `blockType` | 语义块，如 `heading` |
| `variantId` | 如 `heading_highlight_marker` |
| `fallback` | 触发的 fallback 策略 ID |
| `evidenceId` | 如 `PASTE-HEADING-8-20260603` |
| `verifiedAt` | ISO 日期 |
| `matrixRowId` | Fidelity Matrix 行（STORY-005 后必填） |
| `allowedInDefaultPreset` | `true` / `false` |
| `waiverExpiresAt` | 可选；过期须复测 |

**存储（规划）：** S8-STORY-003 Profile `yellowWaivers[]`；S8-STORY-005 Matrix 为证据源。

### 7.3 示例 waiver（Contract v1 种子）

```yaml
evidenceId: PASTE-HEADING-HIGHLIGHT-20260603
contractVersionId: wechat-safe-contract-v1
blockType: heading
variantId: heading_highlight_marker
cssCapability:
  - linear-gradient(180deg, ...)
  - box-decoration-break: clone
  - -webkit-box-decoration-break: clone
htmlDomContext: section > h3[style*=inline]
fallback: background-color + border-bottom accent strip
verifiedAt: 2026-06-03
matrixRowId: TBD-S8-STORY-005
allowedInDefaultPreset: true  # warm preset only; business 默认无 gradient
```

---

## 8. fallback 规则

| Yellow 能力 | fallback 策略 |
|-------------|----------------|
| `linear-gradient` | `background-color`（纯色）或 `border-bottom` 色条 |
| `box-shadow` | `border` 1px solid 或略深 `background-color` |
| `border-radius` | 移除 radius（直角卡片） |
| `table` 布局 | `section` / `p` / `span` 流式结构 + `display:block` |
| complex `display` / flex / grid | `display:block` 或 `inline-block` |
| `opacity` | 不透明 `color` / `background-color` |
| `box-decoration-break` | 移除；gradient 回退纯色 |

**总则：**

1. fallback 必须由 **同一** `resolveStyle()` → Copy Renderer 链路生成，**不得**引入第二套样式系统。
2. fallback 输出仍须满足 Green/Red 规则；不得 fallback 到 Red 属性。
3. 用户可见策略：`balanced` / `preview_only` / `unsupported` 与 S8-STORY-006 对齐。

---

## 9. Contract 修正流程

```text
1. Matrix 或 PO 实机粘贴发现失真（FAIL / WARNING）
2. 填写 copy-drift 记录（DRIFT-*）
3. 对比 Preview HTML / Clipboard HTML / WeChat pasted HTML
4. 判定失真类型（见 copy-drift-diagnostics §3）
5. 选择 contract action（Green→Yellow / Yellow→Red / waiver / fallback / 移出 preset）
6. 更新本 Contract（版本递增或 v1 补丁说明 + DECISION）
7. 更新 Compatibility Profile（S8-STORY-003）
8. 更新 Copy HTML Validator 规则（S8-STORY-004）
9. 更新 Fidelity Matrix 行（S8-STORY-005）
10. 记录 decisions.md + changelog.md
11. 必要时调整默认 preset / Orchestrator
```

**原则：** 无 Matrix 证据不得 Yellow→Green；无重复 FAIL 不得 Green→Red。

---

## 10. 与后续 Sprint Story 的关系

| Story | 与 Contract v1 关系 |
|-------|---------------------|
| **S8-STORY-003** | 将 Green/Yellow/Red **代码化**为 `WeChatCompatibilityProfile`；实现 `yellowWaivers`、值级 `display` 枚举、maxNestingDepth |
| **S8-STORY-004** | **Copy HTML Validator**：Red → fail；Yellow 无 evidence → warning；Green → pass |
| **S8-STORY-005** | **Fidelity Matrix**：10 类控件 × 每类 2–4 variant；结果 **反向修正** Contract |
| **S8-STORY-006** | **实机 Paste QA** + Drift 模板；修正误判 |
| **S8-STORY-007** | 审计 Preview 是否应输出 **Copy-safe HTML**；避免 Preview-only DOM/CSS |
| **S8-STORY-008** | contract ↔ profile ↔ validator ↔ matrix ↔ paste 闭环审计 |

### 10.1 Copy HTML Validator（STORY-004）

| Contract 级别 | Validator 行为 |
|---------------|----------------|
| Green | Pass（仍可做 DOM 深度等结构检查） |
| Yellow + valid waiver | Pass with note |
| Yellow 无 waiver | **Warning** |
| Red | **Fail** |

输入：`contractVersionId: wechat-safe-contract-v1` + Clipboard HTML 字符串。

### 10.2 WeChat Fidelity Matrix（STORY-005）

Matrix 列与 Contract 映射：

| Matrix 列 | Contract 来源 |
|-----------|---------------|
| `CSS capability` | §4 Green/Yellow/Red |
| `DOM structure` | §3 + §5 |
| `status` | PASS / FAIL / WARNING / UNTESTED |
| `contract action` | §9 动作 |

路径：[`docs/agile/paste-qa/wechat-fidelity-matrix.md`](../agile/paste-qa/wechat-fidelity-matrix.md)（STORY-005 创建）。

---

## 11. 变更记录

| 日期 | 版本 | 变更 | Story |
|------|------|------|-------|
| 2026-06-04 | `contract-draft-0.1` | 草案 | S8-STORY-001 |
| 2026-06-04 | `wechat-safe-contract-v1` | 定稿：HTML/CSS 分级、DOM、inline、waiver、fallback、修正流程 | S8-STORY-002 |
