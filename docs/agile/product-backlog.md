# Product Backlog

> 轻篇公众号排版 · qingpian-wechat-editor

## Release 规划

### Release 1：公众号文章生成、样式排版、流式预览与复制一致性闭环

**目标：** 跑通正式主链路，并建立样式系统、复制一致性、多输入和流式展示地基。

**Epic 列表：**

| Epic ID | 名称 | 说明 |
|---------|------|------|
| EPIC-001 | 多输入内容准备 | 主题、资料、草稿三类输入的标准化与入口 |
| EPIC-002 | 文章生成与结构化 | AI 生成与结构化输出，结果进入 Article Schema |
| EPIC-003 | Article / Block 核心模型 | 统一 Article Schema 与 Block 语义定义 |
| EPIC-004 | 样式系统基础架构 | theme、preset、variant、registry、assignment |
| EPIC-005 | 公众号预览渲染 | Preview Renderer，页面预览 |
| EPIC-006 | 复制到公众号与样式一致性 | Copy Renderer，微信兼容 HTML，粘贴一致性 P0 |
| EPIC-007 | 流式生成与打字机式展示 | SSE + block 增量 + 最终 Article 归一 |
| EPIC-008 | 配图位置与图片占位 | image_placeholder 语义与展示 |
| EPIC-009 | 基础重生成与反馈 | 段落/区块级重生成与反馈入口 |
| EPIC-010 | 测试 Fixture 与质量保障 | fixture、人工粘贴测试、复制一致性验证 |

---

### Release 2：样式增强、轻编辑与手动配图

**目标：** 支持更多样式、基础编辑、整篇风格切换、手动上传 / 替换图片。

---

### Release 3：资料增强、智能配图与内容质量提升

**目标：** 支持文件、链接、知识库、联网搜索、图库搜索、AI 生图、引用来源。

---

### Release 4：样式导入与品牌样式库

**目标：** 支持 135 / 秀米样式导入、用户自定义样式、品牌样式沉淀。

---

### Release 5：运营工作台与团队能力

**目标：** 支持多篇管理、团队协作、审批、素材库、多账号与数据分析。

## 优先级说明

- P0：Release 1 主链路必需
- P1：Release 1 增强或 Release 2 前置
- P2：后续 Release

## 历史经验参考

旧一键成稿项目的可继承经验已沉淀至：

- `docs/architecture/prototype-lessons.md`
- `docs/agile/migration-reference.md`

样式系统、复制一致性、流式生成等方向已在 Release 1 Epic 中前置，不后置预留。
