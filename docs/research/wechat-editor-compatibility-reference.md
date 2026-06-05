# 公众号排版工具与开源方案兼容性调研

> 轻篇公众号排版 · qingpian-wechat-editor
>
> **Story：** S8-STORY-001（框架）· **S8-STORY-006B**（结构化调研 · 2026-06-04）
> **状态：** §4 种子已填 · **结构化调研见专项文档**（下文 §9）
> **关联：** [`wechat-safe-html-css-contract.md`](../architecture/wechat-safe-html-css-contract.md) · **`wechat-safe-contract-v1`** · DECISION-088 · DECISION-091

---

## 1. 调研目标

1. 归纳公众号编辑器（含 135、壹伴、秀米等）与开源 Markdown→微信方案在 **HTML / inline CSS** 上的常见做法与已知边界。
2. 提炼轻篇 **第一版 WeChat-safe Contract seed**（Green / Yellow / Red 候选），写入 contract 草案。
3. 区分 **可直接借鉴**、**须轻篇实机验证**、**不建议进入 Release 1** 三类经验。
4. 为 S8-STORY-002~008（contract 定稿、Profile、Validator、Matrix、实机 QA）提供事实输入，避免后续样式开发靠猜。

**本轮范围：** 文献与公开资料梳理 + 框架；**不**在本 Story 完成全量实机粘贴矩阵。

---

## 2. 调研对象

| 对象 | 类型 | 公开入口 / 备注 | 调研状态 |
|------|------|-----------------|----------|
| **135 编辑器** | 商业排版工具 | 135editor.com · 样式库 + 复制到微信 | **006B 已摘要** · [`wechat-style-structured-research.md`](wechat-style-structured-research.md) §5 |
| **壹伴** | 浏览器插件 / 助手 | 同步公众号、素材库 | **006B 已摘要** · §6 · 不进 R1 主链路 |
| **秀米** | 商业排版工具 | 图文排版 · 导出/复制 | **006B 已摘要** · §7 |
| **mdnice** | 开源 / 在线 | Markdown → 微信主题 · GitHub 活跃 | **006B 已摘要** · §8.1 |
| **Doocs 微信 Markdown** | 开源 | doocs/md · 微信排版生态 | **006B 已摘要** · §8.2 |
| **已发布公众号文章** | L0 归纳 + evidence 待补 | HARVEST L0×15 · FIX-A workflow | [`wechat-published-article-style-harvest.md`](wechat-published-article-style-harvest.md) |
| **markdown-css** | 开源 CSS 集 | 通用 Markdown 样式 · 非微信专用 | 框架已列 · **待验证** |
| **微信官方编辑器** | 平台 | mp.weixin.qq.com 图文编辑器 | 作为粘贴 **终态** 参照 · **待验证** |
| **其它** | — | 新媒体管家、易点、壹写作等（按需追加） | 未展开 |

---

## 3. 需要重点拆解的信息

对每个调研对象，按下列维度记录（见 §4 模板）：

| 维度 | 说明 |
|------|------|
| **常用 HTML 标签** | `section` / `p` / `span` / `strong` / `img` 等实际输出 |
| **常用 inline CSS** | `font-size` `color` `background` `border` `padding` `line-height` 等 |
| **复杂样式处理** | 渐变、阴影、圆角、伪元素、flex/grid 如何降级或拆分 |
| **普通复制能力边界** | 从工具复制到微信后仍保留什么；什么必丢 |
| **依赖通道** | 是否依赖同步 API、插件注入、专属「同步到公众号」而非纯 Clipboard |
| **已知过滤问题** | 标签剥离、`style` 清洗、class 失效、外链字体等 |

---

## 4. 各对象记录（模板 · 待填）

### 4.1 135 编辑器

| 项 | 记录 |
|----|------|
| HTML 标签 | _待调研_ |
| inline CSS | _待调研_ |
| 复杂样式 | 样式库多装饰性块；常见 border + background 模拟卡片 |
| 复制边界 | _待实机：复制到公众号后台 vs 135 内预览_ |
| 特殊通道 | 可能存在「保存同步」；**Clipboard 路径须单独验证** |
| 已知问题 | _待记录_ |
| **初步结论** | **须轻篇验证**（装饰 DOM 深度与轻篇 block 模型对齐前不照搬） |

### 4.2 壹伴

| 项 | 记录 |
|----|------|
| HTML 标签 | _待调研_ |
| inline CSS | _待调研_ |
| 复杂样式 | 偏运营侧素材，非纯 HTML 复制主路径 |
| 复制边界 | _待调研_ |
| 特殊通道 | **强依赖插件** · 与轻篇「纯 Copy HTML」路径不同 |
| 已知问题 | _待记录_ |
| **初步结论** | **不建议进入 Release 1 主链路**（可参考运营工作流，不复制技术路径） |

### 4.3 秀米

| 项 | 记录 |
|----|------|
| HTML 标签 | 常见嵌套 `section` + 多层级 `div` |
| inline CSS | 大量 inline；偶见工具内 class（复制后可能失效） |
| 复杂样式 | 布局组件、SVG、绝对定位较多 |
| 复制边界 | _待实机_ |
| 特殊通道 | 导出 HTML / 复制多种入口 |
| 已知问题 | 深层嵌套可能导致微信侧 DOM 扁平化 |
| **初步结论** | **须轻篇验证**（DOM 深度 → 对齐 contract `maxNestingDepth`） |

### 4.4 mdnice

| 项 | 记录 |
|----|------|
| HTML 标签 | Markdown 语义标签 + 主题 CSS 转 inline 的常见实践 |
| inline CSS | 主题可配置；开源主题库可参考 Green 列表 |
| 复杂样式 | 代码块、公式等与轻篇 R1 block 集部分重叠 |
| 复制边界 | 社区反馈：部分主题属性在微信被剥 |
| 特殊通道 | 以 Clipboard 为主 · 与轻篇路径接近 |
| 已知问题 | _待对照 GitHub issues_ |
| **初步结论** | **可直接借鉴**（主题 → inline 的思路）；**须轻篇验证**（具体属性分级） |

### 4.5 Doocs 微信 Markdown

| 项 | 记录 |
|----|------|
| HTML 标签 | 与 md 转换器输出一致，偏语义化 |
| inline CSS | doocs 生态内联样式方案、多皮肤 |
| 复杂样式 | 强调微信兼容的 CSS 子集文档 |
| 复制边界 | _待调研 README / 皮肤源码_ |
| 特殊通道 | 多为静态生成 + 复制 |
| 已知问题 | _待记录_ |
| **初步结论** | **可直接借鉴**（文档化 CSS 子集）；合并前须与轻篇 contract 逐条 diff |

### 4.6 markdown-css

| 项 | 记录 |
|----|------|
| HTML 标签 | 通用 `article` 结构，非微信优化 |
| inline CSS | 常为 class + 外部样式表 |
| 复杂样式 | 现代 CSS 特性多 |
| 复制边界 | **不适合**直接粘贴微信 |
| 特殊通道 | 无 |
| 已知问题 | class / `@media` 在微信无效 |
| **初步结论** | **不建议进入 Release 1**（仅作「网页 vs 微信」对照） |

### 4.7 微信官方图文编辑器

| 项 | 记录 |
|----|------|
| HTML 标签 | 粘贴后常规范化标签 |
| inline CSS | 保留子集 inline；剥离危险属性 |
| 复杂样式 | flex/grid/position 高风险 |
| 复制边界 | **终态裁判** |
| 特殊通道 | 粘贴即入库 |
| 已知问题 | 见轻篇历史教训（标题丢样式、卡片变形） |
| **初步结论** | **须轻篇验证**（所有 contract 分级以实机粘贴为准） |

---

## 5. 初步结论汇总（模板）

| 分类 | 含义 | 当前种子（S8-STORY-001） |
|------|------|-------------------------|
| **可直接借鉴** | 有公开文档且与轻篇 Copy 路径一致，可进 contract 候选 | mdnice / Doocs 的 **inline 优先**、**CSS 子集文档化** |
| **须轻篇验证** | 方向合理但 DOM/CSS 须实机矩阵验证 | 135 / 秀米 的装饰块与嵌套深度；官方编辑器剥属性规则 |
| **不建议进入 Release 1** | 依赖插件、class 样式表或非 Copy 主路径 | 壹伴同步路径；markdown-css 整包 |

---

## 6. 对轻篇 WeChat-safe Contract 的启发

1. **Inline-first 是共识** — 与 [`wechat-copy-style-rules.md`](../architecture/wechat-copy-style-rules.md) §1.3、[`wechat-safe-html-css-contract.md`](../architecture/wechat-safe-html-css-contract.md) 一致。
2. **Yellow 须绑定 Paste 证据** — 竞品普遍对 `box-shadow`、`linear-gradient`、`border-radius` 做降级；轻篇已在 profile risky 表中有种子，S8-STORY-005 Matrix 须逐 variant 填 PASS/FAIL。
3. **DOM 深度与扁平化** — 秀米类深层 `section` 提示轻篇应限制 nesting + 避免无意义 wrapper。
4. **不引入第二套粘贴通道** — Release 1 坚持 Clipboard `text/html` + 实机粘贴 QA，不以插件同步替代 Validator。
5. **开源主题 ≠ 轻篇 preset** — 仅抽取 **属性分级** 与 **fallback 模式**，不复制 HTML 字符串或 variant ID。

---

## 7. 下一步

- [x] 将 §6 种子并入 **Contract v1**（S8-STORY-002 · `wechat-safe-contract-v1`）
- [x] Fidelity Matrix + 第一轮 Paste QA（S8-STORY-005 / 006）
- [x] 结构化调研 + Pattern Library v0.1 + Drift triage（**S8-STORY-006B**）
- [ ] 按 Pattern 做共性 renderer/fallback（**S8-STORY-006C** · 未启动）
- [ ] Matrix 回归 + re-paste（**S8-STORY-006D**）
- [ ] 可选：§4 附更多公开来源链接（chore）

---

## 8. S8-STORY-006B 结构化调研入口

| 文档 | 用途 |
|------|------|
| [`wechat-style-structured-research.md`](wechat-style-structured-research.md) | 135 / 壹伴 / 秀米 / mdnice / Doocs + 共性结论 |
| [`wechat-published-article-style-harvest.md`](wechat-published-article-style-harvest.md) | 已发布文章 15 条模式采集 |
| [`wechat-copy-safe-pattern-library.md`](../architecture/wechat-copy-safe-pattern-library.md) | Copy-safe Pattern Library **v0.1** |
| [`s8-drift-triage-2026-06-04.md`](../agile/paste-qa/drift/s8-drift-triage-2026-06-04.md) | 9 Drift 归类 + 006C/007/S9 路由 |
| [`wechat-published-article-harvest-input-template.md`](wechat-published-article-harvest-input-template.md) | 用户 URL / URL+HTML 输入（**006B-FIX-A**） |
| [`wechat-published-article-style-extraction-guide.md`](wechat-published-article-style-extraction-guide.md) | AI 提取 `WX-HARVEST-EVIDENCE-*` 规范 |

**006B-FIX-A 结论：** 先建立 evidence extraction workflow；HARVEST-001~015 标 **L0**；**不** 声称 15 篇已实采；FIX-B 再批量补 URL/HTML。

---

## 9. 参考资料（公开 · 待扩充链接）

- mdnice：https://github.com/mdnice
- Doocs：https://github.com/doocs
- markdown-css：https://github.com/markdowncss
- 轻篇内部：[`wechat-copy-style-rules.md`](../architecture/wechat-copy-style-rules.md) · S7 heading 粘贴记录（execution reports）
