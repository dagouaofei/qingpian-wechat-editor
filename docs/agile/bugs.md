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
| 处理记录 | FIX-B 曾标记 `qualityStatus=copy_fidelity_failed` · 2026-06-08 个案修复 Copy 双嵌套 section 竖线 · **根因类 DEBT-DSL-RC-002（legacy renderContract 双轨）** · 待 quality gate / userSelectable 评估 |

---

## 架构债务登记（非 Bug · Deferred）

### DEBT-DSL-RC Legacy renderContract 双轨渲染

| 字段 | 内容 |
|------|------|
| 债务 ID | DEBT-DSL-RC-001~006 |
| 标题 | Registry `title_block_v1`：Preview 走 React `TitleHeadingPreviewBlock`，Copy 走 `renderPublish*` 等 legacy HTML builder |
| 发现时间 | 2026-06-08 |
| 所属 | Sprint 10 · S10-STORY-013 · **DECISION-110** |
| 严重级别 | P1（架构） |
| 状态 | **Deferred** |
| 处理记录 | 11 个 first-wave title/heading release1 variant 仍受影响；html_paste `tree` 为目标形态；**本轮不批量修复** · 详见 [`variant-dsl-legacy-render-contract-debt.md`](../architecture/variant-dsl-legacy-render-contract-debt.md) |

---

---

### BUG-S10-COPY-FIDELITY-002 卡片居中 Copy 后多出横线

| 字段 | 内容 |
|------|------|
| Bug ID | BUG-S10-COPY-FIDELITY-002 |
| 标题 | 卡片居中（`heading_card_centered`）Copy 后多出两条横线 |
| 发现时间 | 2026-06-07 |
| 所属 | Sprint 10 · S10-STORY-005 FIX-B |
| 严重级别 | P1 |
| 状态 | **Fixed**（2026-06-08 · `copySafeCardCenteredHeadingStyle` 移除 h3 横线/padding · 用户验收 PASS） |
| 处理记录 | FIX-B 曾标记 `qualityStatus=copy_fidelity_failed` · 2026-06-08 个案修复 Copy 与 Preview 一致（无 h3 border-top/bottom） · **根因类 DEBT-DSL-RC-002（legacy renderContract 双轨）** · 待 quality gate / userSelectable 评估 |

---

### BUG-S11-STAGING-001 Staging 生成 loading 非打字机（SSE 被 Nginx 缓冲）

| 字段 | 内容 |
|------|------|
| Bug ID | BUG-S11-STAGING-001 |
| 标题 | staging 生成 loading 一块一块显示，dev 环境为打字机效果 |
| 发现时间 | 2026-06-10 |
| 所属 | Sprint 11 · S11-STORY-003A |
| 严重级别 | P1 |
| 复现步骤 | staging 首页输入主题 → 生成 → 观察 loading 文本出现方式 |
| 预期结果 | 与 dev 一致：逐字/逐 chunk 打字机 streaming |
| 实际结果 | 整块批量出现（Nginx 默认 `proxy_buffering on` 缓冲 SSE） |
| 状态 | **Fixed**（代码：`X-Accel-Buffering: no` · `deploy/nginx/staging.conf.example` 专用 location） |
| 处理记录 | ECS 需 reload Nginx · **待 staging 人工复验** |

---

### BUG-S11-STAGING-002 HTML 新增 variant 章节编号不递增

| 字段 | 内容 |
|------|------|
| Bug ID | BUG-S11-STAGING-002 |
| 标题 | HTML paste 新增 DB variant 后多 heading 编号均为 01 |
| 发现时间 | 2026-06-10 |
| 所属 | Sprint 11 · S11-STORY-003A · 关联 S10-STORY-011 |
| 严重级别 | P1 |
| 复现步骤 | admin HTML 新增 heading variant → 多章节文章 Preview/Copy |
| 预期结果 | 编号 01 / 02 / 03 按章节顺序递增 |
| 实际结果 | 静态 HTML 编号未替换（stale `semanticBindings.number.path` 覆盖 infer） |
| 状态 | **Fixed**（`resolveEffectiveSemanticBindings` 校验 path · number 替换 fallback infer） |
| 处理记录 | regression test 覆盖 stale binding · **待 staging 人工复验** |

---

### BUG-S11-STAGING-003 Preview heading picker 与 admin userSelectable 不一致且重复

| 字段 | 内容 |
|------|------|
| Bug ID | BUG-S11-STAGING-003 |
| 标题 | `/preview` 小标题样式下拉与 admin userSelectable 池不一致 · 重复项 · 混排 release1 静态 label |
| 发现时间 | 2026-06-10 |
| 所属 | Sprint 11 · S11-STORY-003A |
| 严重级别 | P1 |
| 复现步骤 | staging 生成文章 → `/preview` → 打开「小标题样式」下拉 |
| 预期结果 | 仅「跟随生成结果」+ DB userSelectable heading variants（与 admin `userSelectable=true&blockType=heading` 一致） |
| 实际结果 | release1 publish 静态项与 DB 项混排 · 同 label 重复 · definitionJson 英文 label 与 admin 中文 label 混用 |
| 状态 | **Fixed**（`resolvePreviewHeadingStyleOptions` · mapper 使用 `row.label`/`runtimeVariantId` · runtimeVariantId 去重） |
| 处理记录 | **待 staging 人工复验** · ECS rebuild/restart 后验证 |

---

### BUG-S11-STAGING-004 用户池未以 distribution.userSelectable 为唯一权威

| 字段 | 内容 |
|------|------|
| Bug ID | BUG-S11-STAGING-004 |
| 标题 | teal candidate userSelectable=false 仍出现在 picker · d26a6370 userSelectable=true 未出现 |
| 发现时间 | 2026-06-10 |
| 所属 | Sprint 11 · S11-STORY-003A |
| 严重级别 | P0 |
| 根因 | ① `runtime-variant-seed-config` 硬编码 teal 为 code fallback userSelectable · ② degraded pool 仍注入 static manifest · ③ admin 列表 filter 未对齐 quality gate · ④ lifecycle `user_selectable` 与 distribution 概念混淆 |
| 状态 | **Fixed** |
| 处理记录 | DB-only pool · seed 清空 · 治理/inspection/import 后 cache invalidate · lifecycle 数据迁移 SQL · admin UI 分区 |

---

### BUG-S11-STAGING-005 d26 inline heading 编号不递增 · 编号色不随主题

| 字段 | 内容 |
|------|------|
| Bug ID | BUG-S11-STAGING-005 |
| 标题 | `heading_html_paste_d26a6370_candidate` 多 heading 编号均为 01 · 编号色保留 source rgb |
| 发现时间 | 2026-06-10 |
| 所属 | Sprint 11 · S11-STORY-003A · 关联 S10-STORY-011 |
| 严重级别 | P1 |
| 根因 | ① `inferSemanticBindingsFromTree` 仅 fontSize≥36 漏掉 23px inline accent number · ② stale stored path 时 substitution/theme 均失败 · ③ theme remap 仅读 stored path 未用 effective bindings |
| 状态 | **Fixed** |
| 处理记录 | infer 扩展 inline/bold/badge · theme 用 `resolveEffectiveSemanticBindings` · substitution diagnostic · **待 staging 人工复验** |

---

暂无其它 Open Bug（除 DEBT-DSL-RC 架构债务）。
