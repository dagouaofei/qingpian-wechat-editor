# S8-STORY-007 Audit：S8M-HEAD-002 / heading_numbered_section

> **日期：** 2026-06-05  
> **Story：** S8-STORY-007 · Preview / Copy / Validator 审计  
> **对象：** `S8M-HEAD-002` · `heading_numbered_section` · `s8-heading-numbered`  
> **结论：** **NO_CODE_CHANGE_REQUIRED_IN_S8** · **VALIDATOR_FALSE_POSITIVE_WITH_PASTE_EVIDENCE**

---

## 1. 背景

| 字段 | 值 |
|------|-----|
| matrixRowId | S8M-HEAD-002 |
| blockType | heading |
| variantId | `heading_numbered_section` |
| validatorStatus | **FAIL** |
| pasteStatus | **PASS** |
| pasteEvidence | MP editor 2026-06-04 · 维多（Session 2026-06-04 Risk Set） |
| Drift | **无**（D 类 · triage §5 · 非 renderer bug） |

006 第一轮 Paste QA 已记录：**Validator FAIL · 公众号实机 PASS**。006C/006D **未**将 HEAD-002 纳入 re-test（triage：保持监控 · 主归属 007）。本轮审计三角关系：**Validator · Copy HTML · Paste 证据 · Preview 同源**。

---

## 2. Copy HTML 实际结构

**来源：** `tests/snapshots/wechat-paste-qa/s8-heading-numbered.html` · `renderPublishNumberedSectionCopy()`

```html
<section style="margin:28px 0 12px;padding:0">
  <p style="margin:0;line-height:1.5">
    <span style="display:inline-block;min-width:32px;...;border-radius:6px;background-color:#576b95;...;font-variant-numeric:tabular-nums;letter-spacing:0.04em">01</span>
    <span style="color:#333333;font-size:17px;font-weight:600;...">章节 · heading_numbered_section</span>
  </p>
</section>
```

| 层 | 标签 | 作用 |
|----|------|------|
| 外层 | `section` | margin-only wrapper（Yellow tag） |
| 内容 | `p` | 单行承载 badge + 标题文本 |
| 编号 | `span` | accent 方牌 badge（`inline-block` · `border-radius` · 背景色） |
| 标题 | `span` | 标题 typography |

**关键 CSS（badge `span`）：**

- Green 类：`display:inline-block` · `background-color` · `color` · `font-size` · `font-weight` · `line-height` · `text-align` · `margin` · `padding`
- Yellow 类（warning）：`min-width` · `border-radius` · `vertical-align` · `letter-spacing`
- **触发 FAIL 的声明：** `font-variant-numeric: tabular-nums`

**Validator 报错（唯一 error）：**

| code | property | value | 说明 |
|------|----------|-------|------|
| `WECHAT_COPY_RED_CSS` | `font-variant-numeric` | `tabular-nums` | 属性**未**列入 Contract v1 allowed/risky/forbidden → profile `unknown` → validator 按 fail-safe 标 **Red error** |

**Validator warnings（Yellow，不导致 FAIL）：**

- `WECHAT_COPY_YELLOW_TAG` — `<section>`
- `WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER` — `min-width` · `border-radius` · `vertical-align` · `letter-spacing`

**代码路径：** `copySafeNumberedSectionBadgeStyle()` · [`heading-publish-decoration.ts`](../../src/core/renderer/heading-publish-decoration.ts) · `renderPublishNumberedSectionCopy()` · [`heading-publish-copy-html.ts`](../../src/core/renderer/heading-publish-copy-html.ts)

---

## 3. Preview vs Copy 对比

| 项 | 结论 |
|----|------|
| 同一 variant | 是 · `heading_numbered_section` · publish pool |
| 同一 style token | 是 · `copySafeNumberedSectionBadgeStyle(palette)` |
| Preview 入口 | `headingPreviewNumberedSectionBadgeStyle` → 同源 token（[`heading-publish-visual.ts`](../../src/core/renderer/heading-publish-visual.ts)） |
| Copy 入口 | `renderPublishNumberedSectionCopy`（[`title-block-copy.ts`](../../src/core/copy/title-block-copy.ts) `layoutMode === "numbered"` + `isPublishHeading`） |
| DOM 结构 | **一致意图：** `section` > `p` > badge `span` + title `span` |
| 分叉风险 | **未发现**「Preview 一套装饰、Copy 另走 table/空壳」类问题（006C 已修其他 variant 的此类问题） |

**判断：** Preview 与 Copy **共享 publish decoration token**；不存在 HEAD-002 特有的 Preview/Copy 结构分叉。Validator FAIL **不是**由 Preview/Copy 不一致导致。

---

## 4. Validator vs Paste 分歧原因

### 4.1 机制链

```text
font-variant-numeric 未写入 Contract v1 三分表
  → WECHAT_MP_COMPATIBILITY_PROFILE 分类为 unknown
  → validateWechatCopyHtml 将 unknown 与 forbidden 同级标 WECHAT_COPY_RED_CSS（fail-safe）
  → Matrix validatorStatus = FAIL
```

实现依据：

- [`compatibility.ts`](../../src/core/styles/compatibility.ts) — `css_property_unknown` · severity warning at profile layer
- [`copy-html-validator.ts`](../../src/core/wechat-compat/copy-html-validator.ts) — `result.level === "unknown"` → `severity: "error"` · `WECHAT_COPY_RED_CSS`

### 4.2 分类判断（本轮）

| 假设 | 是否成立 |
|------|----------|
| Validator false positive（相对 Paste 证据） | **是** — 实机 PASS，Red 来自 **未编目属性 fail-safe**，非已知 Red 能力 |
| Contract v1 分级过严（explicit Red） | **否** — Contract **未**将 `font-variant-numeric` 标为 Red；是 **catalog 缺口** |
| Copy 结构存在实机风险但暂时 PASS | **低** — 结构与 S7 heading publish 8 款一致；badge 样式为产品审美刻意选择 |
| Preview/Copy 分叉 | **否** — 见 §3 |
| 需要 S8 paste-pass waiver 机制 | **登记建议** — 类似 `heading_highlight_marker` 的 per-variant evidence，但 **本轮不实现** |
| S9 Style Management 承接 | **是** — compatibility metadata · lifecycle · QA evidence 挂在 variant 资产上 |

**主结论：** **VALIDATOR_FALSE_POSITIVE_WITH_PASTE_EVIDENCE** + **REQUIRES_FUTURE_VALIDATOR_REFINEMENT**（编目 `font-variant-numeric` 或明确 unknown 处理策略）

---

## 5. S8 处理结论

**S8 不需要代码修复。**

| 决策项 | 选择 |
|--------|------|
| S8 Copy Renderer | **不改** — 移除 `font-variant-numeric` 仅为讨好 validator，无 Paste 证据支持 |
| S8 Preview Renderer | **不改** |
| Contract v1 | **不改** — 用户审查明确不以 Paste 为由降 Contract |
| Validator | **不改** — 不在 S8 为单 variant 开洞或降级 unknown→warning |
| Matrix | **更新口径** — contractAction / notes 反映 007 审计 |
| Drift | **不开** — 与 006 审查一致（非 renderer bug） |

**S8 可接受理由：**

1. PO 实机 PASS（2026-06-04）为终态裁判（DECISION-090）
2. FAIL 原因可解释且可复现（uncatalogued property fail-safe）
3. Preview/Copy 同源，无保真分叉
4. 放宽规则或改 HTML 属于 **后续 catalog/refinement**，不是 S8 fidelity reset 阻塞项

---

## 6. 后续动作

| 项 | 归属 | 说明 |
|----|------|------|
| S8-STORY-009 closeout | **可接受 HEAD-002 现状** | 作为已知 validator/catalog 遗留登记，不阻塞 S8 merge `release/1` |
| Validator catalog  refinement | Post-S8 / 独立 story | 将 `font-variant-numeric` 编入 Contract/profile（Green 或 Yellow）或调整 unknown 策略 |
| Paste-pass compatibility metadata | **S9-STORY-004 / 008** | variant 级 QA evidence · lifecycle · 可选 waiver 元数据（非 S8 实现） |
| 独立 Drift | **不需要** | D 类观察已足够 |
| DRIFT-003 | **不处理** | 仍 observation · 产品澄清 |
| Release 1 关闭 | **不单独阻塞** | HEAD-002 为 heading 发布池一员 · 实机 PASS |

---

## 7. 证据索引

| 材料 | 路径 |
|------|------|
| Paste QA Session | [`wechat-paste-qa-session-2026-06-04-s8-story-006.md`](../../agile/paste-qa/wechat-paste-qa-session-2026-06-04-s8-story-006.md) §4 Risk Set |
| Copy snapshot | [`tests/snapshots/wechat-paste-qa/s8-heading-numbered.html`](../../../tests/snapshots/wechat-paste-qa/s8-heading-numbered.html) |
| Matrix row | [`wechat-fidelity-matrix.md`](../../agile/paste-qa/wechat-fidelity-matrix.md) · S8M-HEAD-002 |
| Drift triage D 类 | [`s8-drift-triage-2026-06-04.md`](../../agile/paste-qa/drift/s8-drift-triage-2026-06-04.md) §5 |
| Triage 路由 | 006C 可选结构微调（**未做**）· 007 主审（**本轮完成**） |

---

## 8. 变更记录

| 日期 | 变更 |
|------|------|
| 2026-06-05 | 初版审计 · S8-STORY-007 |
