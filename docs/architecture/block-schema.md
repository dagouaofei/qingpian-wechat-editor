# Block Schema 正式技术方案

> 轻篇公众号排版 · qingpian-wechat-editor
>
> 状态：正式技术方案 · Sprint 1-B 定稿
> 代码位置：`src/core/blocks/`（后续 Sprint 实现，本轮不写代码）

---

## 1. 设计目标

Block 是 Article 内的**内容语义单元**。Block 描述「这是什么内容」，不描述「长什么样」。

**Block 是内容语义，不等于视觉样式。**

---

## 2. 核心原则

| 原则 | 说明 |
|------|------|
| 语义与样式分离 | Block 只携带 `type` + `content`，不携带 CSS |
| 有序列表 | Article.blocks 是有序数组，顺序即阅读顺序 |
| 唯一 ID | 每个 block 有 `id`，供 styleAssignment override 和 DOM key 使用 |
| variant 外置 | 视觉 variant 由 Article.styleAssignment 指定，不在 block 内硬编码 |

---

## 3. Block 通用结构

```text
Block
├── id: string                     # 唯一标识（UUID）
├── type: BlockType                # 语义类型（见 §4）
├── content: BlockContent           # 类型相关的内容字段（discriminated union）
└── meta?: BlockMeta                # 可选元信息
```

```text
BlockMeta
├── label?: string                  # 编辑态显示名（可选）
└── sourceIndex?: number            # 流式生成时的到达顺序（可选）
```

---

## 3.1 InlineContent / InlineMark 文本协议（实现前契约）

> 解决 `paragraph.content.text + emphasis` 不足以表达词级 / 句内高亮的问题。

### 3.1.1 模型

```text
InlineContent = InlineTextNode[]

InlineTextNode
├── text: string
└── marks?: InlineMark[]

InlineMark
├── type: "bold" | "italic" | "highlight" | "color" | "link"
├── color?: string              # 语义色意图，非 CSS
├── href?: string                # link 预留；Release 1 不做真实跳转
└── semantic?: "keyword" | "warning" | "benefit" | "note"
```

### 3.1.2 规则

| 规则 | 说明 |
|------|------|
| 语义非 CSS | InlineMark 是语义级标记；视觉由 Style System + Copy inline 映射决定 |
| 禁止 HTML 富文本 | 不允许用 HTML string 存储富文本；不允许 Block 内直接存 `<span style="">` |
| 适用 block | `paragraph`、`lead` **Release 1 必须支持** InlineContent；`quote`、`highlight`、`cta` 等可逐步升级 |
| Copy 映射 | Copy Renderer 必须把 InlineMark 转为微信兼容 inline HTML |
| link mark | 可预留字段；Release 1 不实现真实链接跳转 |

### 3.1.3 Release 1 最小实现

- `paragraph.content` / `lead.content` 支持 `string` **或** `InlineContent`（联合类型）
- 代码实现阶段可先 **normalize 为 InlineContent** 统一处理
- `highlight` mark 至少支持 **background-color / font-weight** 的 copy-safe 映射
- 旧 `emphasis?: ("bold" \| "italic")[]` 在实现前应 migrate 为 InlineMark（文档兼容期可并存，normalize 时转换）

---

## 4. 核心 Block 类型清单

Release 1 必须支持以下 11 种 Block：

| type | 语义 | 用途 |
|------|------|------|
| `title` | 文章标题 | 文章主标题，通常 1 个 |
| `lead` | 导语 / 摘要 | 开篇引导段落 |
| `heading` | 小标题 | 章节标题，可多级 |
| `paragraph` | 正文段落 | 普通正文 |
| `list` | 列表 | 有序 / 无序列表 |
| `quote` | 引用 | 引用块 |
| `highlight` | 重点内容 | 强调段落或关键词 |
| `info_card` | 信息卡片 | 结构化信息展示 |
| `cta` | 行动号召 | 引导用户行动 |
| `divider` | 分隔线 | 视觉分隔（语义上标记章节断点） |
| `image_placeholder` | 配图占位 | 建议配图位置，不含真实图片 |

---

## 5. 各 Block 语义边界与建议字段

### 5.1 title

```text
content: { text: string }
```

- **语义边界：** 文章唯一主标题，全篇通常只有 1 个，位于 blocks 首位
- **与 metadata.title 关系：** 内容一致，生成链路负责同步
- **样式：** 由 style registry 中 `title` 的 variant 决定（如居中大字、左对齐等）

### 5.2 lead

```text
content: { body: string | InlineContent }
```

- **语义边界：** 开篇导语，1~3 句，概括全文；区别于普通 paragraph 的语义角色
- **InlineContent：** Release 1 必须支持（见 §3.1）
- **样式：** 通常比正文略大或带次要色，由 variant 控制

### 5.3 heading

```text
content: { text: string; level: 1 | 2 | 3 }
```

- **语义边界：** 章节小标题；`level` 表示层级，不是 CSS `h1/h2/h3` 的直接映射
- **样式：** level 影响 typography token，具体视觉由 variant 决定

### 5.4 paragraph

```text
content: { body: string | InlineContent }
```

- **语义边界：** 普通正文段落；段内强调通过 InlineMark 表达（见 §3.1）
- **Release 1：** 必须支持 InlineContent；`string` 形式在 normalize 时转为单节点 InlineContent
- **样式：** 段落间距、字号由 preset + density 决定

### 5.5 list

```text
content: {
  ordered: boolean
  items: { text: string; subItems?: string[] }[]
}
```

- **语义边界：** 结构化列表；支持一级子项
- **样式：** 序号样式、缩进、间距由 variant 决定

### 5.6 quote

```text
content: { text: string; attribution?: string }
```

- **语义边界：** 引用他人观点或金句；`attribution` 为出处
- **样式：** 左边框、背景色、斜体等由 variant 决定

### 5.7 highlight

```text
content: { text: string; label?: string }
```

- **语义边界：** 重点提示，区别于 quote（引用）和 info_card（结构化卡片）
- **样式：** 背景高亮、边框等由 variant 决定

### 5.8 info_card

```text
content: {
  title?: string
  body: string
  icon?: string              # 语义图标名，不是图片 URL
}
```

- **语义边界：** 结构化信息卡片（提示、数据、步骤摘要等）
- **样式：** 边框、背景、圆角、内边距由 variant 决定；Copy 时 inline style 必须完整

### 5.9 cta

```text
content: { text: string; action?: string }
```

- **语义边界：** 行动号召（关注、点击、购买等）；`action` 为意图描述，Release 1 不含真实链接
- **样式：** 按钮感、强调色由 variant 决定

### 5.10 divider

```text
content: { style?: "line" | "space" | "dot" }
```

- **语义边界：** 章节分隔；`style` 为语义偏好，不是 CSS
- **样式：** 线条、间距、装饰由 variant 决定

### 5.11 image_placeholder

```text
content: {
  caption?: string           # 配图说明
  aspectRatio?: "16:9" | "4:3" | "1:1" | "free"
  position?: "full" | "inline"
  suggestion?: string        # AI 配图建议描述（如"团队讨论场景"）
}
```

- **正式定位：** Release 1 不实现图片上传，但必须在 Article 中预留配图位置语义
- **Preview 表现：** 显示占位框 + caption + suggestion 文字
- **Copy 表现：** 输出占位区域 HTML（虚线框 + 说明文字），或省略图片仅保留 caption
- **后续扩展：** Release 2+ 可替换为真实 `image` block，placeholder 升级为 image

---

## 6. Block 与样式的关系

```
Block (语义)          Style Assignment (引用)       Style Definition (解析)
─────────────         ─────────────────────         ──────────────────────
type: info_card   →   variantId: "card-bordered" →  typography, spacing,
content: {...}        blockId: "block-uuid"         decoration, layout tokens
                                                    ↓
                                              Preview DOM / Copy HTML
```

- Block **不携带** `variantId`、`className`、`style` 字段
- 若某 block 需要特殊 variant，在 `Article.styleAssignment.blockOverrides` 中指定
- 未 override 的 block 使用 preset 默认 variant

---

## 7. Block 与 Generation / Streaming 的关系

流式生成时，Generation Pipeline 按 block 增量追加到 `Article.blocks`：

```text
SSE: { type: "block.start",    blockId, blockType, index }
SSE: { type: "block.delta",    blockId, field, delta }
SSE: { type: "block.complete", block: Block }
SSE: { type: "done.article",   article: Article }
```

- `block.complete` 中的 Block 立即符合 Block Schema，可直接用于流式 Preview
- 不允许维护独立的 `streamBlock[]` 结构
- `done.article` 中的 blocks 是全量终态
- 事件命名见 [architecture-overview.md](architecture-overview.md) §11.2、[generation-pipeline.md](generation-pipeline.md) §4.2

---

## 8. 禁止项

| 禁止 | 原因 |
|------|------|
| Block 内嵌 CSS / className | 破坏语义与样式分离 |
| Block 硬编码 variant | variant 由 styleAssignment 管理 |
| 为 preview/copy 定义不同 Block 类型 | 同一 Block，不同 Renderer 输出 |
| `wechatBlock` / `previewBlock` 平行类型 | 违反唯一 Schema |
| Block 内嵌 HTML 富文本 | 须使用 InlineContent / InlineMark（§3.1） |

---

## 9. 后续实现边界

| 项 | 位置 |
|----|------|
| BlockType 枚举 | `src/core/blocks/types.ts` |
| BlockContent discriminated union | `src/core/blocks/content.ts` |
| Zod Block Schema | `src/core/blocks/schema.ts` |
| Block 工厂 / 校验工具 | `src/core/blocks/utils.ts` |

**前置条件：** 本方案定稿 + Article Schema 方案定稿后方可实现。

## 相关文档

- [Article Schema](article-schema.md)
- [样式系统](style-system.md)
- [生成链路](generation-pipeline.md)
