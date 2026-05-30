# 旧一键成稿项目历史经验

> 轻篇公众号排版 · qingpian-wechat-editor

本文档沉淀旧「一键成稿 / 秒篇成稿」项目的历史经验，供新项目参考。**只继承经验，不复制代码。**

---

## 一、可继承经验

### 1. 敏捷管理文档经验

- Sprint、Story、Bug、AC、Decision、Changelog 文档体系有效
- 固定 fixture 与人工粘贴测试记录对质量保障至关重要
- 测试清单驱动的复制一致性验证应前置建立

### 2. 样式系统经验

- Component DSL 方向可行
- slot、density、variant、style registry 等概念值得继承
- theme、preset、assignment 分层思路清晰
- 样式不能写死为页面 CSS，需可复用、可扩展
- 样式系统应前置设计，不能后置补丁

### 3. 公众号复制一致性经验

- **网页预览与微信公众号粘贴不一致必须前置解决**
- 135 编辑器与微信公众号编辑器表现可能不同，以微信粘贴为准
- 标题样式丢失、字体字号变化、卡片样式变化是常见踩坑点
- Preview 和 Copy 必须共享样式定义，不能分裂

### 4. SSE / 流式生成经验

- 底层模型侧可能是 token/chunk streaming
- 应用层应沉淀为：**SSE + JSONL/block 增量事件 + `done.article` 最终可信成稿**
- 流式体验 + 结构化 block 增量 + 最终 Article 归一
- 原始 token 流不应成为独立文章结构

### 5. Fixture / 手动测试经验

- 固定 fixture 对回归测试至关重要
- 样式 gallery 可用于视觉对比（Release 1 不做完整 gallery，但 fixture 体系必需）
- 公众号粘贴测试记录必须保留并可追溯

### 6. JSONL / Block Streaming 经验

- 结构化 block 输出适合公众号文章预览
- block 增量事件比 raw token 更适合 UI 展示
- 但最终必须进入统一 Article Schema
- 不允许 stream 中间态成为独立文章结构

### 7. ChatGPT + Cursor + docs 协作经验

- ChatGPT 负责产品规划、架构讨论、Cursor 指令生成和结果审查
- Cursor 负责读取项目文件、修改代码、维护 docs、执行测试
- **docs 是跨工具、跨会话、跨 Sprint 的共享事实源**
- 旧项目经验应先进入 docs，再影响技术方案

---

## 二、不可迁移内容

| 类别 | 原因 |
|------|------|
| 旧项目整体代码 | 架构混杂，不可整包复制 |
| Visual Layer | 废弃视觉层方案 |
| Space Style | 废弃样式方案 |
| 多套 JSONL | 格式不统一，增加维护成本 |
| 多套 renderer | 导致预览复制分裂 |
| 旁路兼容逻辑 | 增加复杂度，掩盖架构问题 |
| 历史实验代码 | 未经验证，不应进入正式项目 |
| 废弃测试开关 | feature flag 式旁路，增加维护负担 |
| 临时 mock generate 链路 | 不应成为正式主链路 |

---

## 三、迁移原则

1. **参考经验，不复制代码**
2. **迁移原则，不迁移包袱**
3. **先文档化，再进入方案**
4. **先统一架构，再实现功能**
5. 避免旧项目中多方案并存、实验代码残留、预览复制分裂的问题

---

## 四、经验在新项目中的落地

| 经验领域 | 落地文档 |
|----------|----------|
| 敏捷管理 | `docs/agile/` |
| 样式系统 | `docs/architecture/style-system.md` |
| 复制一致性 | `docs/architecture/wechat-copy-style-rules.md` |
| 流式生成 | `docs/architecture/generation-pipeline.md` |
| 迁移清单 | `docs/agile/migration-reference.md` |
| 协作机制 | `docs/agile/chatgpt-cursor-docs-workflow.md` |

## 相关决策

- DECISION-009：旧一键成稿项目只作为经验来源，不作为代码来源
