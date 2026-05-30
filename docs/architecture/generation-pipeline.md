# 生成链路正式技术方案

> 轻篇公众号排版 · qingpian-wechat-editor
>
> 状态：正式技术方案 · Sprint 1-B 定稿
> 代码位置：`src/core/generation/`

---

## 1. Release 1 输入模型

Release 1 支持三类输入，共用同一生成链路和 Article 输出：

| 输入类型 | type 值 | 用户行为 | 系统行为 |
|----------|---------|----------|----------|
| 主题 | `topic` | 输入主题关键词 | 从零生成完整文章 |
| 资料 | `material` | 粘贴参考资料 | 整理资料并生成文章 |
| 草稿 | `draft` | 粘贴已有初稿 | 优化结构并排版 |

**输入模型不能写死为 `topic → article`。** 三种输入通过统一的 InputSource 进入生成链路，差异仅在 prompt 策略，不在数据结构。

---

## 2. 输入标准化

```text
用户原始输入 (raw)
  │
  ▼
InputNormalizer.normalize(inputSource)
  │
  ├── topic:   清洗主题文本，提取关键词
  ├── material: 分段、去噪、提取关键信息
  └── draft:   识别已有结构（标题、段落），标记可优化区域
  │
  ▼
NormalizedInput
├── type: InputSource.type
├── raw: string
├── normalized: string
├── hints?: { suggestedBlocks?, suggestedTitle? }
└── capturedAt: string
```

标准化结果写入 Article.input，供追溯和重生成使用。

---

## 3. 生成链路与 Article Schema 的关系

```text
NormalizedInput
  │
  ▼
GenerationEngine.generate(input, options)
  │
  ├── mode: "batch" → 一次性返回 Article
  └── mode: "stream" → SSE 事件流 → 终态 Article
  │
  ▼
Article（唯一输出结构）
├── metadata（从生成内容提取）
├── input（InputSource 快照）
├── styleAssignment（系统默认 preset）
├── blocks[]（生成的 Block 列表）
└── generation（GenerationMeta）
```

**所有生成结果必须进入统一 Article Schema。** 不存在 `aiArticle`、`streamArticle` 等平行结构。

---

## 4. 流式生成：旧项目经验严谨表述

> 旧一键成稿项目的历史经验不是简单「纯 token streaming」或「纯 block streaming」二选一。
>
> 更准确地说：**底层模型侧可能是 token/chunk streaming**；**应用层应吸收 SSE + JSONL/block 增量事件 + done.article 最终可信成稿的经验**；**前端体验可表现为打字机式或逐步出现**；**最终可信结果必须归一为 Article**。

### 4.1 三层架构

| 层级 | 职责 | 技术 |
|------|------|------|
| 模型层 | token/chunk 输出 | LLM API streaming |
| 应用层 | 事件解析、block 组装、状态管理 | SSE + JSONL events |
| 体验层 | 用户看到的逐步显示 | 打字机式 UI / block 增量渲染 |

### 4.2 应用层事件模型

```text
SSE 连接: POST /api/generate/stream

事件类型:
├── { type: "status",    status: "started" | "generating" | "structuring" }
├── { type: "metadata",  data: { title?: string } }
├── { type: "block.append", block: Block }
├── { type: "block.update", blockId: string, content: Partial<BlockContent> }
├── { type: "block.delta",  blockId: string, field: string, delta: string }  // 可选：字段级增量
├── { type: "error",     message: string }
└── { type: "done.article", article: Article }
```

### 4.3 关键原则

1. **block.append / block.update** 事件中的 Block 立即符合 Block Schema
2. UI 收到 block 事件后，更新 Article.blocks 并触发 Preview 增量渲染
3. **done.article** 携带完整、校验通过的 Article，作为唯一可信终态
4. 若 done.article 与增量 blocks 不一致，**以 done.article 为准**
5. 原始 token 流**不暴露给前端**，不在 UI 层维护 token 缓冲区作为文章结构

---

## 5. batch generate 与 stream generate 不分裂

| 维度 | batch | stream |
|------|-------|--------|
| 输出结构 | Article | Article（终态相同） |
| 用户体验 | 等待 → 完整展示 | 逐步显示 → 完整展示 |
| API | POST /api/generate | POST /api/generate/stream (SSE) |
| 中间态 | 无 | block 增量事件 |
| GenerationMeta.mode | `"batch"` | `"stream"` |

两者共用：

- 同一 InputNormalizer
- 同一 Block Schema
- 同一 Article Schema
- 同一默认 styleAssignment 策略

**不允许 batch 走一套 Schema、stream 走另一套 Schema。**

---

## 6. 生成过程如何归一到 Article

### 6.1 Stream 模式状态机

```text
idle → started → generating → structuring → completed
                                    ↓
                                  failed
```

| 状态 | Article 状态 | UI 表现 |
|------|-------------|---------|
| started | generation.status = "streaming", blocks = [] | 显示加载 |
| generating | blocks 逐步增加 | 打字机 / 逐 block 出现 |
| structuring | blocks 完整，metadata 更新 | 排版中 |
| completed | done.article 替换当前 Article | 完整预览 |
| failed | generation.status = "failed" | 错误提示 |

### 6.2 终态归一

```text
stream 过程中:
  UI Article = { ...partial, blocks: [block1, block2, ...] }  // 仍是 Article Schema

done.article 到达:
  UI Article = done.article  // 完整终态，替换 partial
  generation.status = "completed"
```

- 过程中 Article 是「不完整但合法」的 Article（blocks 逐步增加）
- 不是 `streamArticle` 平行结构
- done.article 是全量替换，不是 merge patch

---

## 7. 生成状态如何服务用户体验

| 体验 | 实现 |
|------|------|
| 打字机式 | block.append 事件 → 新 block 动画进入 Preview |
| 逐步显示 | 已有 block 的 content 通过 block.update 增量更新 |
| 进度感 | status 事件 → 进度条 / 状态文字 |
| 生成中预览 | Preview Renderer 渲染 partial Article |
| 生成完成 | done.article → 完整 Preview + 可复制 |

---

## 8. 生成与样式系统的关系

生成链路**不负责样式**，只负责产出 Article（含 blocks + 默认 styleAssignment）：

```text
GenerationEngine 产出:
  Article.styleAssignment = { themeId: "default", presetId: "classic-news" }

样式解析由 Style System 在渲染时完成。
```

后续 Release 2 可支持「生成后切换 preset」，但 Release 1 使用系统默认 preset。

---

## 9. 生成与 Renderer 的关系

```text
Generation → Article → Preview Renderer（流式增量渲染）
Generation → Article → Copy Renderer（仅在 completed 后可用）
```

- 流式过程中：Preview 实时渲染 partial Article
- Copy：**仅在 generation.status = "completed" 后**允许复制（保证 Copy 内容完整且终态可信）

---

## 10. 禁止项

| 禁止 | 原因 |
|------|------|
| `streamArticle` 独立结构 | 终态必须归一 Article |
| 前端维护 token 缓冲区作为文章 | token 不是 Article |
| batch / stream 两套 Schema | 分裂主链路 |
| mock generate 主链路 | 不允许 mock 主链路 |
| 生成结果不经过 Block Schema | 破坏渲染和复制 |

---

## 11. 后续实现边界

| 模块 | 路径 |
|------|------|
| InputNormalizer | `src/core/generation/input-normalizer.ts` |
| GenerationEngine | `src/core/generation/engine.ts` |
| SSE 事件定义 | `src/core/generation/events.ts` |
| Stream 状态管理 | `src/core/generation/stream-state.ts` |
| API Route | `src/app/api/generate/`（后续 Sprint） |

**前置条件：** Article/Block Schema 方案定稿 + 样式系统方案定稿后方可实现生成链路。

## 相关文档

- [Article Schema](article-schema.md)
- [Block Schema](block-schema.md)
- [渲染链路](rendering-pipeline.md)
- [旧项目经验](prototype-lessons.md)
