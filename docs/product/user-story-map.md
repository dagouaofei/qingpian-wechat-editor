# 用户故事地图

> 轻篇公众号排版 · qingpian-wechat-editor

## 主干流程

```
准备内容 → 发起生成 → 生成文章 → 自动排版 → 预览检查 → 调整优化 → 复制到公众号 → 发布前检查
```

## Release 1 · Sprint 6 用户闭环路径（DECISION-071）

> Sprint 6 覆盖以下 **8 步**用户路径；Sprint 5 已交付 Generation 技术框架（DECISION-069）。Sprint 6 验收以**真实 AI + 可手测页面**为准。

| 步骤 | 用户行为                                       | 负责 Sprint                                       | Story Map 阶段 | 状态                                                  |
| ---- | ---------------------------------------------- | ------------------------------------------------- | -------------- | ----------------------------------------------------- |
| 1    | **进入工具：** 用户打开首页                    | **Sprint 6**                                      | 进入工具       | Done（`/`）                                           |
| 2    | **输入需求：** 主题、场景、目标读者、风格等    | **Sprint 6**                                      | 输入需求       | Done（S6-STORY-002）                                  |
| 3    | **触发生成：** 用户点击开始生成                | **Sprint 6**                                      | 触发生成       | Done（→ `/preview`）                                  |
| 4    | **等待生成：** 用户看到生成中状态              | **Sprint 6**                                      | 等待生成       | 基础 loading（S6-STORY-004）；复杂反馈归 S6-STORY-005 |
| 5    | **查看结果：** 完整带样式公众号文章            | **Sprint 6**                                      | 查看结果       | Done（S6-STORY-004 · `/preview`）                     |
| 6    | **调整观感：** 切换基础风格和配色              | **Sprint 6**                                      | 调整观感       | Planned（S6-STORY-006）                               |
| 7    | **复制使用：** 复制到公众号编辑器              | **Sprint 6**                                      | 复制使用       | Planned（S6-STORY-006）                               |
| 8    | **粘贴验证：** 公众号 / 135 编辑器最小粘贴验证 | **Sprint 6**（最小 QA）· **Sprint 8**（全量保真） | 粘贴验证       | Planned（S6-STORY-006 记录 · S8 全量）                |

```text
打开首页 → 输入需求 → 触发生成 → 等待生成 → 查看结果 → 调整观感 → 复制使用 → 粘贴验证
     │         │          │           │           │           │           │           │
  Sprint 6   Sprint 6   Sprint 6    Sprint 6    Sprint 6    Sprint 6    Sprint 6   S6 最小 / S8 全量
```

**对应 Product Backlog：** PB-R1-01 ~ PB-R1-08

---

## Sprint 6 明确不做

以下能力**不属于 Sprint 6**（Release 1 之外或归后续 Sprint）：

- 完整富文本编辑器
- 块级拖拽
- 图片生成
- 图片上传
- 样式市场
- 用户登录
- 历史文章管理
- 多文章项目管理
- 复杂模板商城
- 完整真流式 block-aware token streaming
- Style Gallery / 整篇样式丰富度大改（**Sprint 7**）
- 全量 Paste QA 归档与 Release 1 关闭（**Sprint 8**）

---

## Release 1 · 方案 B 扩展路径（Sprint 7 / 8）

| 步骤     | 用户行为                          | 负责 Sprint  | 状态        |
| -------- | --------------------------------- | ------------ | ----------- |
| 评审样式 | Style Gallery / 样例 / 整篇观感   | **Sprint 7** | Done        |
| 粘贴保真 | Contract · Matrix · 实机 Paste QA | **Sprint 8** | In Progress |

---

## Post-S8 Roadmap（DECISION-092）

| Sprint        | 名称                                          | 用户/团队价值                                                                      | 状态                     |
| ------------- | --------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------ |
| **Sprint 9**  | Style Management System v0（样式管理后台 v0） | 团队可治理 style · palette · variant · preset · 规则与生命周期；harvest 为入口之一 | **Planned**              |
| **Sprint 10** | Style Expansion & Visual Quality Upgrade      | 批量扩展真实公众号启发样式与自动匹配                                               | **Planned（方向 only）** |

006D harvest candidates（`heading_purple_chapter_label_candidate` · `info_card_reading_path_candidate`）为 **S9 seed assets**，不直接对用户开放。

---

## Release 1 · P0 用户故事

### 准备内容 & 发起生成

| ID        | 用户故事                       | 优先级 | Sprint                   |
| --------- | ------------------------------ | ------ | ------------------------ |
| US-R1-001 | 用户可以输入主题并发起生成     | P0     | Sprint 6（S6-STORY-002） |
| US-R1-002 | 用户可以粘贴资料并发起生成     | P0     | Sprint 6+                |
| US-R1-003 | 用户可以粘贴草稿并发起优化排版 | P0     | Sprint 6+                |

### 生成 & 结构化

| ID        | 用户故事                                                                                  | 优先级 | Sprint                                        |
| --------- | ----------------------------------------------------------------------------------------- | ------ | --------------------------------------------- |
| US-R1-004 | 用户可以看到生成进度（流式 / 打字机式展示）                                               | P0     | Sprint 6（S6-STORY-005）· Sprint 5 技术已具备 |
| US-R1-005 | 用户可以获得包含标题、导语、小标题、正文、重点内容、列表、信息卡片、总结和 CTA 的完整文章 | P0     | Sprint 6（S6-STORY-003 / 004）                |
| US-R1-006 | 系统生成结果必须进入统一 Article Schema                                                   | P0     | Sprint 5 Done                                 |

### 排版 & 预览

| ID        | 用户故事                                      | 优先级 | Sprint                   |
| --------- | --------------------------------------------- | ------ | ------------------------ |
| US-R1-007 | 用户可以看到自动排版后的文章预览              | P0     | Sprint 6（S6-STORY-004） |
| US-R1-008 | 用户可以看到配图位置建议（image_placeholder） | P0     | Sprint 6 / 7             |
| US-R1-012 | 用户可以在 Style Gallery 中浏览样式样例       | P0     | **Sprint 7**             |
| US-R1-013 | 整篇文章视觉上接近公众号文章（非过度卡片化）  | P0     | **Sprint 7**             |

### 复制 & 质量保障

| ID        | 用户故事                                                | 优先级 | Sprint                               |
| --------- | ------------------------------------------------------- | ------ | ------------------------------------ |
| US-R1-009 | 用户可以一键复制微信兼容 HTML                           | P0     | Sprint 6（S6-STORY-006）             |
| US-R1-010 | 粘贴到微信公众号编辑器后基础样式基本一致                | P0     | Sprint 6 最小 QA · **Sprint 8** 全量 |
| US-R1-011 | 产品团队可以通过固定 fixture 和人工粘贴测试验证复制效果 | P0     | **Sprint 8**                         |

---

## 后续 Release 用户故事（占位）

- Release 2：样式切换、轻编辑、手动配图
- Release 3：资料增强、智能配图
- Release 4：样式导入、品牌样式库
- Release 5：运营工作台、团队协作

## 相关文档

- [Release 1 范围](release-1-scope.md)
- [Release Plan](../agile/release-plan.md) — Release 全局索引
- [Product Backlog](../agile/product-backlog.md) — PB-R1-01 ~ PB-R1-08
- [Sprint Plan](../agile/sprint-plan.md) — 历史 Sprint 计划叙事
- [Sprint Backlog](../agile/sprint-backlog.md) — Sprint 全局索引

新 Sprint / Release 的详细 Plan、Backlog、Review 等内容进入 `docs/agile/sprints/` 与 `docs/agile/releases/` 独立目录。
