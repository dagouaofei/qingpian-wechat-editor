# 渲染链路正式技术方案

> 轻篇公众号排版 · qingpian-wechat-editor
>
> 状态：正式技术方案 · Sprint 1-B 定稿
> 代码位置：`src/core/renderer/`（Preview）、`src/core/copy/`（Copy）

---

## 1. 设计目标

渲染链路负责将 **Article + Style Definition** 转化为用户可见的输出：

- **Preview Renderer** → 页面预览（React DOM）
- **Copy Renderer** → 微信兼容 HTML（Clipboard）

核心原则：

```text
Preview Renderer 和 Copy Renderer 可以分离；
但二者不得拥有两套样式来源。
```

---

## 2. Preview Renderer 职责

| 职责 | 说明 |
|------|------|
| 读取 Article | 遍历 `blocks[]`，按顺序渲染 |
| 解析样式 | 调用 Style Resolver 获取 `ResolvedBlockStyle` / `ResolvedArticleStyle` |
| 渲染 InlineContent | paragraph / lead 的 InlineMark 由 Style System 映射为 DOM 样式（非 Block 内 CSS） |
| 输出 DOM | React 组件树，用于页面预览 |
| 流式更新 | 支持 blocks 增量追加时的增量渲染 |
| 交互 | Release 1 仅只读预览，不含编辑 |

**不负责：**

- 生成 HTML 字符串用于复制（Copy Renderer 职责）
- 解析输入或调用 AI（Generation 职责）
- 决定样式（Style System 职责）

---

## 3. Copy Renderer 职责

| 职责 | 说明 |
|------|------|
| 读取同一 Article | 与 Preview 相同数据源 |
| 解析同一 Style Definition | 调用同一 Style Resolver |
| 输出 HTML | 微信兼容 inline style HTML 片段 |
| Clipboard 写入 | 封装为 `text/html` MIME 供一键复制 |

**不负责：**

- 页面 DOM 渲染
- 样式定义（来自 Style System）
- 粘贴测试执行（测试流程职责，但输出必须可测）

---

## 4. 为什么二者需要分离

| 原因 | 说明 |
|------|------|
| 输出格式不同 | Preview 用 React/DOM；Copy 用 HTML 字符串 + inline style |
| 适配层不同 | Preview 可用 CSS variables / Tailwind；Copy 必须 inline style |
| 微信特殊处理 | Copy 需控制嵌套层级、禁用 class、安全字体栈 |
| 独立测试 | Copy 可单独用 fixture + 粘贴测试验证 |
| 性能 | Copy 不需要 React hydration，可纯函数生成 HTML |

分离的是**输出适配层**，不是**样式来源**。

---

## 5. 为什么必须共享样式定义

旧项目最大教训：**Preview 用一套 CSS，Copy 另写 inline style，导致「网页好看、公众号变形」。**

共享方式：

```text
                    Style System
                         │
                    resolveStyle(article, block)
                         │
                         ▼
                 ResolvedBlockStyle
                    ╱         ╲
                   ╱           ╲
                  ▼             ▼
        PreviewRenderer    CopyRenderer
        (style → DOM)      (style → inline HTML)
```

- 两者调用**同一个** `resolveStyle()` → 产出 **ResolvedArticleStyle**
- Preview / Copy **不直接消费** VariantDefinition；消费 **ResolvedBlockStyle**（见 [style-system.md](style-system.md) §3.2）
- 两者读取**同一个** BlockStyleRegistry（StyleResolver 内部）
- 数值（fontSize、color、padding、slots 等）完全一致，只是输出适配层不同

---

## 6. 数据流

```text
Article
  │
  ├── blocks[] ──────────────────────────────┐
  └── styleAssignment ──→ Style Resolver     │
                              │                │
                              ▼                │
                    ResolvedArticleStyle       │
                    (Map<blockId, ResolvedBlockStyle>)
                              │                │
              ┌───────────────┴───────────────┐│
              ▼                               ▼▼
     PreviewRenderer                  CopyRenderer
     for each block:                  for each block:
       component(block, style)         template(block, style)
              │                               │
              ▼                               ▼
         React DOM                      HTML string
              │                               │
              ▼                               ▼
         页面预览                        Clipboard / 下载
```

---

## 7. Style Definition 如何分别输出预览和复制

### 7.1 共享层：ResolvedBlockStyle

```text
ResolvedBlockStyle
├── layout: { textAlign, display, ... }
├── spacing: { marginTop, padding, lineHeight, ... }
├── typography: { fontSize, fontWeight, color, fontFamily, ... }
├── decoration: { border, borderRadius, backgroundColor, ... }
└── slots: { slotName: ResolvedSlotStyle }
```

### 7.2 Preview 映射

```text
PreviewAdapter.toProps(resolvedStyle):
  typography → CSS variables 或 Tailwind arbitrary values
  spacing    → className 或 style prop
  decoration → className 或 style prop
  slots      → 子 React 元素
```

Preview 允许使用 CSS variables 提升开发效率，但 variables 的值必须来自 ResolvedBlockStyle，不是硬编码。

### 7.3 Copy 映射

```text
CopyAdapter.toInlineStyle(resolvedStyle):
  typography → "font-size:16px;color:#333;font-family:PingFang SC,sans-serif;"
  spacing    → "margin-top:16px;padding:16px;line-height:1.75;"
  decoration → "border:1px solid #eee;border-radius:8px;background-color:#f9f9f9;"
  slots      → <span style="..."> 或 <div style="...">
```

Copy **全部 inline**，不输出 class 或 `<style>` 标签。

---

## 8. 可共享 vs 必须特殊处理

### 8.1 可共享的逻辑

| 逻辑 | 共享方式 |
|------|----------|
| Block 遍历顺序 | 同一 `article.blocks` |
| Style 解析 | 同一 `resolveStyle()` |
| Block 类型 → 模板映射 | 同一 registry 查询 |
| slot 解析 | 同一 slot resolver |
| density 计算 | 同一 density multiplier |

### 8.2 Copy 必须特殊处理

| 项 | Preview | Copy |
|----|---------|------|
| 样式载体 | class / CSS vars / style prop | 纯 inline style |
| 字体 | 可依赖系统字体 | 必须 inline font-family 安全栈 |
| 嵌套 | 不限 | ≤ 3 层 div |
| 阴影 | box-shadow 可用 | 可能丢失，需 border fallback |
| 渐变 | 可用 | 可能丢失，需纯色 fallback |
| 交互元素 | 可有 hover | 无交互，静态 HTML |
| 图片 | 可用 `<img>` | placeholder 用 div + 说明文字 |

---

## 9. 如何避免「网页好看，公众号变形」

1. **设计阶段：** 每个 variant 设计时同步定义 Copy 输出约束
2. **开发阶段：** Preview 和 Copy 共用 `resolveStyle()`，禁止 Copy 独立写样式
3. **测试阶段：** 每个 variant 必须人工粘贴到微信公众号编辑器验证
4. **CI 阶段（后续）：** fixture → Copy HTML 快照 + 结构校验
5. **Bug 流程：** 复制不一致 Bug 进入 `docs/agile/bugs.md`，关联 variant ID

---

## 10. 模块边界

### Preview Renderer — `src/core/renderer/`

```text
src/core/renderer/
├── index.ts                 # 公开 API: renderPreview(article) → ReactNode
├── PreviewArticle.tsx       # 文章级容器
├── blocks/                  # 各 block 的 Preview 组件
│   ├── TitlePreview.tsx
│   ├── InfoCardPreview.tsx
│   └── ...
└── adapter/
    └── preview-adapter.ts   # ResolvedBlockStyle → React props
```

### Copy Renderer — `src/core/copy/`

```text
src/core/copy/
├── index.ts                 # 公开 API: renderCopyHtml(article) → string
├── templates/               # 各 block 的 Copy HTML 模板
│   ├── title-copy.ts
│   ├── info-card-copy.ts
│   └── ...
├── adapter/
│   └── copy-adapter.ts      # ResolvedBlockStyle → inline style string
└── clipboard.ts             # 写入 Clipboard API（后续 Sprint）
```

---

## 11. 后续最小实现建议

**Sprint 2+ 建议顺序：**

1. 实现 Style Resolver + 1 个 preset + 全部 block 的默认 variant
2. 实现 Copy Renderer（优先，因为 Copy 约束更严）
3. 用 fixture Article 验证 Copy HTML → 人工粘贴
4. 实现 Preview Renderer，对照 Copy 确认样式数值一致
5. 建立 variant 级粘贴测试记录

**最小可验收闭环：**

```text
fixture Article → resolveStyle → Copy HTML → 粘贴微信 → 样式基本一致
                                      ↘ Preview DOM → 视觉对照
```

---

## 12. 禁止项

- Preview 和 Copy 各自维护样式数值
- Preview 用 Tailwind 硬编码，Copy 另写 inline style
- 为 Copy 创建 `wechatBlock` 平行类型
- mock render 链路

## 相关文档

- [样式系统](style-system.md)
- [复制链路](copy-to-wechat-pipeline.md)
- [公众号复制样式规则](wechat-copy-style-rules.md)
