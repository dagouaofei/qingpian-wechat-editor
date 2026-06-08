# Bug Backlog

> 轻篇公众号排版 · qingpian-wechat-editor

## 字段说明

| 字段 | 说明 |
|------|------|
| Bug ID | 唯一标识，如 BUG-001 |
| 标题 | 简短描述 |
| 发现时间 | YYYY-MM-DD |
| 所属 Release / Sprint | 关联 Release 或 Sprint |
| 严重级别 | P0 / P1 / P2 |
| 复现步骤 | 操作步骤 |
| 预期结果 | 期望行为 |
| 实际结果 | 实际行为 |
| 状态 | Open / In Progress / Fixed / Won't Fix |
| 处理记录 | 修复说明或决策 |

---

## 已知 Bug

### BUG-001 Copy HTML `font-family` 双引号截断 style 属性

| 字段 | 内容 |
|------|------|
| Bug ID | BUG-001 |
| 标题 | 粘贴公众号时字体栈失效：`style` 属性被 `font-family:"PingFang` 截断 |
| 发现时间 | 2026-06-02 |
| 所属 | Sprint 7 · S7-STORY-007B |
| 严重级别 | P0 |
| 复现步骤 | `/dev/style-fidelity` → `r1-golden-default-article` → 复制 Copy HTML → 粘贴公众号；或检查 HTML 中 `style="...font-family:"PingFang` |
| 预期结果 | `font-family` 完整写入 inline style，粘贴后保留 PingFang/微软雅黑栈 |
| 实际结果 | `buildInlineStyle` 输出未转义双引号，属性在第一个字体名引号处结束，后续 `font-size`/`color` 可能丢失 |
| 状态 | **Fixed**（007B · `copy-typography.ts` + `inline-style.ts` + 各 Copy renderer 补 `fontFamily`） |
| 处理记录 | 单引号字体栈；golden 自动化断言 `font-family:'PingFang SC'`；**待 PO 公众号粘贴复验** |

---

### BUG-S10-COPY-FIDELITY-001 杂志竖线 Copy 后左侧竖线高度不一致

| 字段 | 内容 |
|------|------|
| Bug ID | BUG-S10-COPY-FIDELITY-001 |
| 标题 | 杂志竖线（`heading_magazine_left_bar`）Preview 竖线上下顶到头，Copy 后只在标题文字左边 |
| 发现时间 | 2026-06-07 |
| 所属 | Sprint 10 · S10-STORY-005 FIX-B |
| 严重级别 | P1 |
| 状态 | **Fixed**（2026-06-08 · `renderPublishMagazineLeftBarCopy` 双嵌套 section 竖线 · 用户验收 PASS） |
| 处理记录 | FIX-B 曾标记 `qualityStatus=copy_fidelity_failed` · 2026-06-08 修复 Copy 与 Preview 同源双轨（1px 浅线 + 3px 深线包裹编号/SECTION/标题）· **待 re-run quality gate / userSelectable 评估** |

---

### BUG-S10-COPY-FIDELITY-002 卡片居中 Copy 后多出横线

| 字段 | 内容 |
|------|------|
| Bug ID | BUG-S10-COPY-FIDELITY-002 |
| 标题 | 卡片居中（`heading_card_centered`）Copy 后多出两条横线 |
| 发现时间 | 2026-06-07 |
| 所属 | Sprint 10 · S10-STORY-005 FIX-B |
| 严重级别 | P1 |
| 状态 | **Open** |
| 处理记录 | 同 BUG-S10-COPY-FIDELITY-001；`copy_fidelity_failed` 不得进入 userSelectable / defaultEligible / AI candidate pool |

---

暂无其它 Open Bug（除上述两条 Copy Fidelity 登记项）。
