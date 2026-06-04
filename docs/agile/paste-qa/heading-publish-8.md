# Heading Publish · 8 款微信公众号粘贴 QA

> **Story：** S7-STORY-008 · **Catalog：** `[heading-publish-catalog.md](../../product/heading-publish-catalog.md)`  
> **日期：** 2026-06-03  
> **状态：** **Done**（第六轮 PO 粘贴 **8/8 PASS** · 代码基线 `7d8e38c`+ · S7-STORY-008 已关闭）

## 手测步骤

1. `npm run dev` → 打开 `/gallery` 或 `/dev/style-fidelity`（需 `STYLE_FIDELITY_DEBUG=1` 时）
2. 对每一款 `heading_`*：将样例中所有 heading 设为该 variant（Gallery 小标题下拉或 block 切换）
3. 点击「复制到公众号」或 Copy 对照区复制 HTML
4. 粘贴至 **微信公众号编辑器** 正文区
5. 对照下表：装饰（底线/左条/编号/胶囊/图标）是否与 Preview 一致

## 分项记录

| Variant ID | 中文名 | 第一轮测试 | 第二轮测试 | 第三轮测试 | 结果 | 第四轮测试 | 第五轮测试 | 第六轮测试（`7d8e38c`+） |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `heading_short_line` | 短线标题 | … | pass | … | pass | pass | pass | **pass** |
| `heading_highlight_marker` | 荧光笔强调 | … | … | … | fail | fail | fail | **pass**（`h3` + `linear-gradient` · 公众号实机确认） |
| `heading_magazine_left_bar` | 杂志竖线 | … | … | … | pass | pass | pass | **pass** |
| `heading_magazine_offset` | 杂志错位 | … | … | … | pass | pass | pass | **pass** |
| `heading_numbered_section` | 编号小节 | … | … | … | fail | … | fail | **pass** |
| `heading_card_centered` | 卡片居中 | … | … | pass | pass | pass | … | **pass** |
| `heading_icon_prefix` | 图标前缀 | … | … | pass | pass | pass | **pass** |
| `heading_minimal_number` | 极简数字 | … | pass | pass | pass | pass | pass | **pass** |

## 汇总

| 指标 | 目标 | 当前 |
| --- | --- | --- |
| PASS 款数 | ≥6/8 | **8/8**（第六轮 PO） |
| FAIL 登记 | 须写 `bugs.md` | **无**（历史 FAIL 已由后续轮次修复；第六轮全 PASS） |
| Story | S7-STORY-008 可关闭 | **是**（用户 2026-06-03 确认） |

## 判定规则

- **PASS：** 与 Preview 核心装饰一致，无整段变纯文本、无 `style` 截断
- **FAIL：** 登记 Bug；不得在无真实粘贴时标 PASS
- **边界：** 不宣称 Release 1 / Sprint 8 全量粘贴完成；全文 golden 仍见 [`r1-golden-paste-qa.md`](r1-golden-paste-qa.md)

## 代码侧预检（Cursor）

- `heading-publish-parity.test.ts`：8× copy-safe + `HEADING_PUBLISH_COPY_CONTRACT`
- `heading-ordinal.test.ts`：多 heading 自动 01/02
- 同源 token：`heading-publish-decoration.ts`（Preview/Copy 共用）
- Copy HTML：除 `heading_highlight_marker` 外无 `linear-gradient`
- **最终实现（荧光笔）：** `section` + `h3{display:inline}` + `linear-gradient(180deg, … accent20/accent33 …)` + `box-decoration-break:clone`（`7d8e38c`）
