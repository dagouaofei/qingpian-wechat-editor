# Copy-to-WeChat 正式技术方案

> 轻篇公众号排版 · qingpian-wechat-editor
>
> 状态：正式技术方案 · Sprint 1-B 定稿
> 代码位置：`src/core/copy/`

---

## 1. 定位

**复制到微信公众号编辑器是一级核心能力。**

轻篇公众号排版的最终交付物不是网页预览，而是**粘贴到微信公众号编辑器后样式基本一致的 HTML**。

复制一致性是 Release 1 **P0**，不是后期补 Bug。

### 1.1 Copy Fidelity DoD（定稿）

| 状态 | 含义 |
|------|------|
| **Done（代码）** | Preview + Copy 成对实现已合并；CopyHtmlResult 可生成 |
| **Done（粘贴 QA）** | 该 block × variant 已通过微信公众号人工粘贴验收 |

不得将 Done（代码）等同于 Done（粘贴 QA）。

**`preview_only` 排除：** Release 1 正式 block × variant 不得使用 `copySafety: preview_only`；此类样式不计入 Copy Fidelity Done。

### 1.2 粘贴 QA 启动时机

| Sprint | 范围 |
|--------|------|
| **Sprint 4** | Preview/Copy 最小闭环时，启动**最小人工粘贴 QA**（classic-news 各 variant） |
| **Sprint 6** | fixture 三联系统化回归；**不是**首次粘贴验证 |

---

## 2. Copy Renderer 输出什么

Copy Renderer 输出**微信兼容 HTML 片段**：

```html
<section style="margin:0;padding:0;">
  <section style="text-align:center;margin-bottom:24px;">
    <span style="font-size:22px;font-weight:bold;color:#333333;font-family:PingFang SC,sans-serif;">
      文章标题
    </span>
  </section>
  <section style="margin-bottom:16px;line-height:1.75;">
    <span style="font-size:16px;color:#333333;font-family:PingFang SC,sans-serif;">
      正文段落内容...
    </span>
  </section>
  <!-- 更多 block... -->
</section>
```

**输出特征：**

- 纯 inline style，无 class、无 `<style>` 标签
- 安全字体栈（PingFang SC、Microsoft YaHei、sans-serif）
- 嵌套层级 ≤ 3 层
- 每个 block 包裹在 `<section>` 中
- 可直接写入 Clipboard 的 `text/html` MIME

---

## 3. 为什么微信兼容 HTML ≠ 普通网页 HTML

| 差异 | 普通网页 HTML | 微信兼容 HTML |
|------|---------------|---------------|
| 样式载体 | class + CSS 文件 | inline style only |
| 选择器 | 任意 CSS 选择器 | 微信 strip 大部分 |
| 字体 | @font-face、web font | 仅安全系统字体 |
| 布局 | flex、grid、position | 仅简单 block + inline |
| 阴影/渐变 | 常用 | 经常丢失 |
| 嵌套 | 不限 | 过深会被 flatten |
| 交互 | hover、JS | 不支持 |

微信公众号编辑器粘贴时会**重新解析 HTML 并 strip 不可识别样式**，因此必须按微信规则设计 Copy 输出。

---

## 4. 为什么 inline style 重要

- 微信粘贴后**只可靠保留 inline style**
- class 会被 strip 或忽略
- `<style>` 标签内容会被移除
- 外部 CSS 完全无效

因此 Style System 的 VariantDefinition 必须设计为**可完整映射为 inline style 字符串**，这是架构约束，不是实现细节。

---

## 5. 微信粘贴可能丢失的样式

| 样式 | 丢失概率 | 应对策略 |
|------|----------|----------|
| box-shadow | 高 | 用 border 代替 |
| linear-gradient | 高 | 用 background-color 纯色 |
| border-radius | 中 | 保留但不过度依赖 |
| font-family (web font) | 高 | 用系统字体栈 inline |
| letter-spacing | 中 | 可保留，但需测试 |
| opacity | 中 | 避免，用颜色代替 |
| flex/grid 复杂布局 | 高 | 用简单 block 布局 |
| ::before / ::after | 高 | 用真实 DOM 元素代替 |
| class-based 样式 | 极高 | 不使用 |

---

## 6. 旧项目 preview/copy 不一致的典型问题

| 问题 | 根因 | 新项目约束 |
|------|------|------------|
| 标题样式丢失 | Preview 用 CSS class，Copy 未 inline 同样属性 | 共享 ResolvedBlockStyle |
| 字体字号变化 | Copy 未 inline font-family / font-size | CopyAdapter 强制 inline typography |
| 卡片样式变化 | Copy 简化 HTML 结构，丢失 border/background | Copy 模板与 Preview 结构对齐 |
| 间距不一致 | Preview 用 margin collapse，Copy 用不同值 | 同一 spacing token |
| 135 正常但微信异常 | 以 135 为验收标准 | **以微信公众号编辑器为唯一标准** |

---

## 7. 完整链路

```text
用户点击「复制到公众号」
  │
  ▼
Article（当前文章）
  │
  ▼
Style Resolver → ResolvedArticleStyle
  │
  ▼
CopyRenderer.renderCopyHtml(article) → HTML string
  │
  ▼
Clipboard API: write({ "text/html": html })
  │
  ▼
用户粘贴到微信公众号编辑器
  │
  ▼
人工验证 / 自动化结构校验
```

---

## 8. 每个样式 variant 为什么必须进入复制测试

- 每个 variant 的 Copy 输出可能不同（typography、decoration 差异）
- 一个 variant 的 Copy 正常不代表另一个正常
- 旧项目中多个 variant 在 Preview 正常但 Copy 丢失样式

**规则：** 新增 variant = 必须新增粘贴测试记录。

---

## 9. 人工粘贴测试如何记录

测试记录模板（建议存放 `docs/agile/` 或 `tests/manual/`）：

```text
## 粘贴测试记录

- 日期：2026-06-01
- 测试人：
- Fixture：article-classic-news.json
- Preset：classic-news
- 测试环境：微信公众号编辑器（Chrome / macOS）

| Block | Variant | 检查项 | 预期 | 实际 | 结果 |
|-------|---------|--------|------|------|------|
| title | title-centered | 字号 22px | 22px | 22px | PASS |
| info_card | card-bordered | 边框+圆角 | 有 | 边框丢失 | FAIL |

- Bug ID：（如有）BUG-001
- 截图：（附件路径）
```

---

## 10. 135 编辑器 vs 微信公众号编辑器

| 维度 | 135 编辑器 | 微信公众号编辑器 |
|------|------------|------------------|
| 用途 | 第三方排版工具 | **最终发布环境** |
| CSS 支持 | 较宽松 | 严格 strip |
| 测试价值 | 参考 | **P0 验收标准** |
| 旧项目教训 | 135 正常 ≠ 微信正常 | 必须以微信为准 |

135 测试可作为**辅助参考**，但不能替代微信公众号编辑器测试。

---

## 11. Bug 如何进入 bugs.md

复制不一致 Bug 记录示例：

```text
Bug ID: BUG-001
标题: info_card card-bordered 粘贴后边框丢失
发现时间: 2026-06-01
所属 Release / Sprint: Release 1 / Sprint 3
严重级别: P0
复现步骤: 使用 fixture article-classic-news → 复制 → 粘贴到微信公众号编辑器
预期结果: info_card 保留 1px solid #eee 边框
实际结果: 边框丢失
状态: Open
处理记录: Copy 模板未 inline border 属性，需修复 copy-adapter
```

---

## 12. Copy 一致性如何影响 Style System 设计

| Style System 设计 | Copy 影响 |
|-------------------|-----------|
| VariantDefinition 含 box-shadow | Copy 需提供 border fallback |
| 使用 CSS gradient | Copy 需用 background-color 纯色 |
| slot 装饰用 pseudo-element | Copy 需用真实 DOM 元素 |
| 字体用 web font | Copy 需用系统字体栈 |
| 嵌套 > 3 层 | Copy 模板需 flatten |

**结论：** Style System 设计时必须同步考虑 Copy 约束，见 [style-system.md §8](style-system.md)。

---

## 13. Release 1 复制一致性验收范围

| 验收项 | 标准 |
|--------|------|
| 全部 11 种 block 类型 | Copy HTML 结构正确 |
| classic-news preset 全部 variant | 粘贴后样式基本一致 |
| title | 字号、字重、颜色、对齐 |
| info_card | 边框、背景、圆角、内边距 |
| heading | 字号、装饰（下划线/色条） |
| list | 序号/圆点、缩进 |
| highlight | 背景色 |
| cta | 按钮样式 |
| image_placeholder | 占位框 + 说明文字 |
| 整体 | 段落间距、字体一致 |

**「基本一致」定义：** 允许微信 strip 阴影/渐变等低概率属性，但 typography、spacing、border、background 必须保留。

---

## 14. 后续实现边界

| 模块 | 路径 |
|------|------|
| Copy HTML 生成 | `src/core/copy/index.ts` |
| Block Copy 模板 | `src/core/copy/templates/` |
| Inline style 适配 | `src/core/copy/adapter/copy-adapter.ts` |
| Clipboard 写入 | `src/core/copy/clipboard.ts` |
| 粘贴测试 fixture | `tests/fixtures/` + 测试记录 |

## 相关文档

- [渲染链路](rendering-pipeline.md)
- [公众号复制样式规则](wechat-copy-style-rules.md)
- [样式系统](style-system.md)
