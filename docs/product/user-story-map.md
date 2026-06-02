# 用户故事地图

> 轻篇公众号排版 · qingpian-wechat-editor

## 主干流程

```
准备内容 → 发起生成 → 生成文章 → 自动排版 → 预览检查 → 调整优化 → 复制到公众号 → 发布前检查
```

## Release 1 · 用户可见主路径（方案 B · DECISION-070）

> Sprint 5 已交付 Generation 技术框架（DECISION-069）。Release 1 尾声按 **可见主链路 → 样式体验 → 复制保真** 顺序验收。

| 步骤 | 用户行为 | 负责 Sprint | 状态 |
|------|----------|-------------|------|
| 1 | **输入主题**（资料 / 草稿可扩展） | **Sprint 6** Visible Main Flow | Planned |
| 2 | **触发生成** | **Sprint 6** | Planned |
| 3 | **观察生成过程**（流式 / 进度 / 状态反馈） | **Sprint 6** | Planned |
| 4 | **查看完整公众号文章预览** | **Sprint 6**（基础）· **Sprint 7**（体验增强） | Planned |
| 5 | **评审样式**（Gallery / 样例 / 整篇观感） | **Sprint 7** WeChat Article Experience | Planned |
| 6 | **复制到公众号** | **Sprint 6**（按钮 / payload）· **Sprint 8**（保真验证） | Planned |
| 7 | **粘贴验证**（135 编辑器 · 公众号后台） | **Sprint 8** Copy Fidelity & Closure | Planned |

```text
输入主题 → 触发生成 → 观察生成过程 → 查看完整预览 → 评审样式 → 复制 → 粘贴验证
   │           │              │                │            │         │         │
 Sprint 6    Sprint 6       Sprint 6      Sprint 6/7     Sprint 7   Sprint 6  Sprint 8
```

---

## Release 1 · P0 用户故事

### 准备内容 & 发起生成

| ID | 用户故事 | 优先级 | Sprint |
|----|----------|--------|--------|
| US-R1-001 | 用户可以输入主题并发起生成 | P0 | Sprint 6 |
| US-R1-002 | 用户可以粘贴资料并发起生成 | P0 | Sprint 6+ |
| US-R1-003 | 用户可以粘贴草稿并发起优化排版 | P0 | Sprint 6+ |

### 生成 & 结构化

| ID | 用户故事 | 优先级 | Sprint |
|----|----------|--------|--------|
| US-R1-004 | 用户可以看到生成进度（流式 / 打字机式展示） | P0 | Sprint 6（可见反馈）· Sprint 5 技术已具备 |
| US-R1-005 | 用户可以获得包含标题、导语、小标题、正文、重点内容、列表、信息卡片、总结和 CTA 的完整文章 | P0 | Sprint 6 / 7 |
| US-R1-006 | 系统生成结果必须进入统一 Article Schema | P0 | Sprint 5 Done |

### 排版 & 预览

| ID | 用户故事 | 优先级 | Sprint |
|----|----------|--------|--------|
| US-R1-007 | 用户可以看到自动排版后的文章预览 | P0 | Sprint 6 |
| US-R1-008 | 用户可以看到配图位置建议（image_placeholder） | P0 | Sprint 6 / 7 |
| US-R1-012 | 用户可以在 Style Gallery 中浏览样式样例 | P0 | **Sprint 7** |
| US-R1-013 | 整篇文章视觉上接近公众号文章（非过度卡片化） | P0 | **Sprint 7** |

### 复制 & 质量保障

| ID | 用户故事 | 优先级 | Sprint |
|----|----------|--------|--------|
| US-R1-009 | 用户可以一键复制微信兼容 HTML | P0 | Sprint 6 |
| US-R1-010 | 粘贴到微信公众号编辑器后基础样式基本一致 | P0 | **Sprint 8** |
| US-R1-011 | 产品团队可以通过固定 fixture 和人工粘贴测试验证复制效果 | P0 | **Sprint 8** |

---

## 后续 Release 用户故事（占位）

- Release 2：样式切换、轻编辑、手动配图
- Release 3：资料增强、智能配图
- Release 4：样式导入、品牌样式库
- Release 5：运营工作台、团队协作

## 相关文档

- [Release 1 范围](release-1-scope.md)
- [Release Plan](../agile/release-plan.md)
- [Product Backlog](../agile/product-backlog.md)
- [Sprint Plan](../agile/sprint-plan.md)
