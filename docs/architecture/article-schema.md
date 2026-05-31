# Article Schema 正式技术方案

> 轻篇公众号排版 · qingpian-wechat-editor
>
> 状态：正式技术方案 · Sprint 1-B 定稿
> 代码位置：`src/core/article/`（后续 Sprint 实现，本轮不写代码）

---

## 1. 设计目标

Article 是轻篇公众号排版的**唯一文章主模型**。所有输入来源、生成结果、测试 fixture、流式终态，最终都必须归一到同一 Article Schema。

Article 回答的问题是：**这篇文章的结构化内容是什么**，而不是**这篇文章长什么样**。

---

## 2. 核心约束

| 约束 | 说明 |
|------|------|
| 唯一主模型 | 全项目只有一套 Article Schema |
| 不承载 CSS | Article 不直接包含具体 CSS、inline style 或 Tailwind class |
| 内容与样式分离 | 视觉样式由 Style Assignment + Style Definition 处理 |
| 输入归一 | 主题 / 资料 / 草稿 / fixture / batch / stream 终态均进入 Article |
| 禁止平行结构 | 不得出现 `mockArticle`、`aiArticle`、`streamArticle`、`wechatArticle` |

---

## 3. Article 顶层结构

```text
Article
├── id: string                    # 文章唯一标识（UUID）
├── version: number                # Schema 版本，便于后续迁移
├── metadata: ArticleMetadata      # 文章元信息
├── input: InputSource             # 输入来源快照（只读记录）
├── styleAssignment: StyleAssignment  # 样式分配（引用样式系统，不含 CSS）
├── blocks: Block[]                # 有序 Block 列表（核心内容）
└── generation?: GenerationMeta    # 生成过程元信息（可选）
```

### 3.1 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | 是 | 全局唯一，用于 fixture、测试、缓存键 |
| `version` | number | 是 | 当前固定为 `1`，Schema 演进时递增 |
| `metadata` | ArticleMetadata | 是 | 标题、摘要、标签等元信息 |
| `input` | InputSource | 是 | 记录本文如何产生，不参与渲染 |
| `styleAssignment` | StyleAssignment | 是 | 指向 theme + preset，及 block 级 override |
| `blocks` | Block[] | 是 | 有序内容块，至少 1 个 |
| `generation` | GenerationMeta | 否 | 生成状态、模型、时间等，fixture 可省略 |

---

## 4. ArticleMetadata 设计

```text
ArticleMetadata
├── title: string                  # 文章标题（与 title block 内容一致或由其推导）
├── subtitle?: string              # 副标题（可选）
├── summary?: string               # 摘要 / 导语文本（可选，也可由 lead block 承载）
├── author?: string                # 作者（Release 1 可选）
├── createdAt: string              # ISO 8601 创建时间
├── updatedAt: string              # ISO 8601 最后更新时间
├── locale: string                  # 默认 "zh-CN"
└── tags?: string[]                 # 标签（Release 1 可选）
```

**设计原则（与 [architecture-overview.md](architecture-overview.md) §6 一致）：**

- `metadata.title` 是文章级标题，用于列表展示、SEO、复制 HTML `<title>` 等
- `metadata` 不重复 block 内的全部内容，只承载文章级元信息
- 若 `title` block 存在，`metadata.title` 应与其 `content.text` 保持一致（生成链路负责同步）
- `metadata.summary` 可与 `lead` block 镜像（列表/SEO），但不替代 blocks[] 内结构
- 正文结构（heading、paragraph、list 等）**仅**存在于 `blocks[]`
- 段内富文本语义（词级高亮、加粗等）通过 **InlineContent / InlineMark** 表达（见 [block-schema.md](block-schema.md) §3.1）；不属于 metadata 层
- Release 1 文本型 block 主文本字段统一为 `content.text`；`paragraph` / `lead` 支持 `string | InlineContent`，实现阶段 normalize 为 InlineContent

---

## 5. InputSource 设计

InputSource 记录文章的**输入来源快照**，用于追溯、重生成和 analytics，不参与渲染。

```text
InputSource
├── type: "topic" | "material" | "draft" | "fixture"
├── raw: string                    # 用户原始输入文本
├── normalized?: string            # 标准化后的输入（可选）
└── capturedAt: string             # ISO 8601 输入时间
```

| type | 说明 | raw 示例 |
|------|------|----------|
| `topic` | 用户输入主题 | "如何提高团队执行力" |
| `material` | 用户粘贴资料 | 长文本参考资料 |
| `draft` | 用户粘贴草稿 | 已有文章初稿 |
| `fixture` | 测试固定数据 | fixture 文件名或 ID |

**与生成链路的关系：**

- 输入标准化（`normalized`）在 Generation Pipeline 中完成
- InputSource 写入 Article 后不再变更（重生成产生新 Article 或新版本）
- 生成链路不得写死为 `topic → article`；三种输入类型共用同一 Article 输出结构

---

## 6. StyleAssignment 在 Article 中的位置

Article 通过 `styleAssignment` 引用样式系统，**不包含具体 CSS**。

```text
StyleAssignment（Article 级引用）
├── themeId: string                # 如 "default"
├── presetId: string               # 如 "classic-news"
└── blockOverrides?: BlockStyleOverride[]
    └── { blockId, variantId?, slotOverrides? }
```

**关系说明：**

| 层级 | 职责 |
|------|------|
| Article.styleAssignment | 声明本文使用哪个 theme / preset，及 block 级 override |
| Style System | 根据 assignment 解析出 Style Definition |
| Renderer | 消费 Style Definition，分别输出 Preview DOM 和 Copy HTML |

Article 只存**引用 ID**，Style Definition 的解析在渲染时由样式系统完成。详见 [style-system.md](style-system.md)。

---

## 7. Article 与各模块的关系

```
                    ┌─────────────┐
  主题/资料/草稿 ──→│  Generation  │──→ block.start/delta/complete / done.article
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Article    │ ← fixture 直接构造
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        Style System   Preview Renderer  Copy Renderer
```

| 模块 | 与 Article 的关系 |
|------|-------------------|
| Generation | 产出 Article；流式中间态不持久化为独立结构 |
| Style System | 读取 `styleAssignment`，不修改 Article 内容 |
| Preview Renderer | 读取 `blocks` + resolved Style Definition |
| Copy Renderer | 读取同一 Article + 同一 Style Definition |
| Fixture | 直接构造完整 Article，用于测试和回归 |

---

## 8. GenerationMeta 设计

```text
GenerationMeta
├── status: "idle" | "streaming" | "completed" | "failed"
├── mode: "batch" | "stream"
├── modelId?: string
├── startedAt?: string
├── completedAt?: string
└── error?: string
```

- 流式生成过程中，UI 可展示 `status: "streaming"` 的中间 Article（blocks 逐步增加）
- 终态 `done.article` 事件携带完整 Article，`status` 变为 `"completed"`
- **中间态 Article 仍是 Article Schema**，不是 `streamArticle` 平行结构
- batch 与 stream 共用同一 Article 结构，`mode` 字段区分生成方式

---

## 9. Fixture 与 Article Schema

Fixture 是**完整 Article 实例的 JSON 文件**，用于：

- Preview / Copy Renderer 开发验证
- 样式 variant 粘贴测试
- 回归测试基准

```text
tests/fixtures/
├── article-classic-news.json      # 完整 Article + blocks + styleAssignment
├── article-minimal.json
└── ...
```

**Fixture 规则：**

- Fixture 必须符合 Article Schema，不是简化结构
- Fixture 的 `input.type` 为 `"fixture"`
- Fixture 是 Article 的合法实例，不是 mock 平行模型
- 每个 fixture 应覆盖不同 block 组合和 style preset

---

## 10. 禁止项

| 禁止 | 原因 |
|------|------|
| 多套 Article Schema | 导致 preview/copy/generation 分裂 |
| Article 内嵌 CSS | 破坏内容与样式分离 |
| `streamArticle` 持久化 | 流式终态必须归一 Article |
| `mockArticle` 作为主链路 | 不允许 mock 主链路 |
| Block 绑定具体 variant ID 为硬编码 | variant 由 styleAssignment 管理 |

---

## 11. 后续实现边界

| 项 | 位置 | Sprint |
|----|------|--------|
| Zod Article Schema | `src/core/article/schema.ts` | Sprint 2+ |
| Article 类型导出 | `src/core/article/types.ts` | Sprint 2+ |
| Article 工具函数 | `src/core/article/utils.ts` | Sprint 2+ |
| Fixture 加载 | `tests/fixtures/` + loader | Sprint 2+ |

**前置条件：** 本方案定稿后方可开始 Article TypeScript / Zod 实现。

## 相关文档

- [Block Schema](block-schema.md)
- [样式系统](style-system.md)
- [生成链路](generation-pipeline.md)
- [渲染链路](rendering-pipeline.md)
