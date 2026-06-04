# R1 Style Fidelity Stabilization · 代码路径审计

> **日期：** 2026-06-02  
> **Story：** S7-STORY-007A  
> **分支：** `feature/s7-story-007a-r1-style-fidelity`  
> **结论摘要：** 主链路已走 StyleSelection → Orchestrator → Resolver → Preview/Copy，但 **Preview 仍大量依赖 CSS 变量 fallback**、**Copy 存在 gradient 装饰**、**粘贴 QA 未对 golden 路径闭环**；registry 97 variants 仅子集进入默认生成。

---

## 1. 默认生成路径（实际）

```text
POST /api/generate/stream
  → run-generate-stream-flow.buildSuccessPayload
  → generateAndApplyStyleSelection(mode: deterministic)
  → validateStyleSelectionPipeline (orchestrator ON)
  → resolveArticleStyle
  → renderArticleBlocks(preview) + buildClipboardPayload(copy)
```

| 环节 | 实际值 | 备注 |
|------|--------|------|
| Safe preset | `business`（`SAFE_STYLE_PRESET_ID`） | `classic-news` 仅 alias → `business` |
| Safe theme | `businessBlue` | model prompt 仍写 `classic-news` 文案 |
| Variant 来源 | `buildStyleSelectionBlockHints` → diversity + preset default + RCARD 平衡 | 非 AI patch 时 deterministic |
| Orchestrator | `orchestrateArticleStyle` via pipeline | **作用于默认生成**（非仅 fixture） |
| Preview | `createRelease1RequiredVariantRegistry()` 全量 registry | 与 sprint 5 first-wave 子集不同 |
| Copy | `createRelease1FirstWaveCopyRendererRegistry()` | 需确认与 preview registry 范围一致 |

**误判风险：** Sprint 4/6 paste seed 仅覆盖 **33 first-wave** variants；DECISION-083 后 **97 variants** 多数 **无粘贴 QA 记录**。

---

## 2. Preview 路径

| 检查项 | 状态 | 证据 |
|--------|------|------|
| Tailwind 包裹 UI | 仅 **壳层**（`preview-page-client`、analysis panel） | 非 block 内容 |
| Block Preview CSS 变量 | **P1** | `preview-visual-styles.ts`、`title-heading-preview-block.tsx` 默认 `var(--preview-text-*)` |
| 硬编码 font-size/color | **P1** | `resolveTitleBlockTypography` 有 theme token，但 preview 壳与 fallback 仍 `#333` |
| 消费 ResolvedBlockStyle | **PASS** | `text-style.ts` / renderers 接收 `ResolvedBlockStyleView` |
| 与 Copy 同源 token | **部分** | 同源 resolver；Preview 可走 CSS 变量，Copy 必须 inline hex |

---

## 3. Copy 路径

| 检查项 | 状态 | 证据 |
|--------|------|------|
| 消费 ResolvedArticleStyle | **PASS** | `buildClipboardPayload` → per-block copy renderers |
| class / style tag | **PASS** | `copy-safe-html.ts` + renderer 内 assert |
| CSS variables in HTML | **PASS**（检测器） | 未发现 `var(--` 于 copy 输出测试 |
| flex/grid | ** guarded** | `copy-safe-html` 拒绝；部分 renderer 单独 throw |
| absolute / pseudo | ** guarded** | 同上 |
| **gradient** | **P0 FAIL** | `title-block-copy.ts` `linear-gradient` 于 left_bar / bottom_line |
| 嵌套深度 | **多数 ≤3** | title copy 使用 table 嵌套，需 snapshot 监控 |
| 文本 inline typography | **PASS** | `titleParagraphHtml`、text-first copy 写 font-size/family/color |

---

## 4. StyleOrchestrator

| 规则 | 实现 | 默认生成 |
|------|------|----------|
| R8 title/首个 heading | ✅ | ✅ |
| R4 iconDecor/cardTitle 连击 | ✅ | ✅ |
| RCARD 卡片化连击 ≤2 | ✅ | ✅ |
| R1 相邻 heading 不同 variant | ❌ 禁用 | —（同篇 heading 统一） |
| 强视觉块间必有 paragraph | ❌ → **007A 新增 RLAYOUT** | 本轮 |
| 强卡片比例 ≤25% | ❌ → **007A 新增** | 本轮 |
| 中部 CTA 轻样式 | ❌ → **007A 新增** | 本轮 |
| 连续 divider | ❌ → **007A 新增** | 本轮 |
| 标题后首屏 image | ❌ → **007A 新增** | 本轮 |

---

## 5. 默认 preset（`business` / classic-news）实际 default variants

| Block | defaultVariantId |
|-------|------------------|
| title | `title_bottom_line_editorial` |
| lead | `lead_business_brief` |
| heading | `heading_short_line` |
| paragraph | `paragraph_plain_body` |
| list | `list_plain_bullets` |
| quote | `quote_left_bar` |
| highlight | `highlight_flat_business` |
| info_card | `info_card_key_takeaway` |
| cta | `cta_summary_band` |
| divider | `divider_simple_line` |
| image_placeholder | `image_placeholder_simple` |

生成时 **diversity 可能覆盖** preset default（plain-first + RCARD），最终 assignment 以 pipeline + orchestrator 为准。

---

## 6. Registry vs 闭环

| 类别 | 数量 | Preview | Copy | Paste QA |
|------|------|---------|------|----------|
| release1_required（当前） | 97 | 全注册 | first-wave + expansion renderers | **Not Run**（除 33 seed） |
| 默认路径核心 10 类 | 10 | ✅ | ✅ | **未 golden 验收** |

**误标：** 多个 Story 标 Done 指 **代码/registry**，非 **微信公众号粘贴 QA Done**。

---

## 7. 现有 paste / snapshot 资产

| 路径 | 范围 |
|------|------|
| `docs/agile/paste-qa/release1-first-wave-33-plan.md` | 33 variants · Not Run |
| `docs/agile/paste-qa/s6-minimal-paste-qa.md` | 暖色手测 · 部分 PASS |
| `tests/core/copy/copy-html-snapshot.test.ts` | text-first 6 variants |
| `tests/core/copy/structured-copy-html-snapshot.test.ts` | structured 子集 |

**缺口（007A 已补 fixture + 自动化 snapshot）：** 微信公众号粘贴 QA 仍为 **Not Run**（见 `paste-qa/r1-golden-paste-qa.md`）。

---

## 8. 本轮最小修复优先级（007A）

1. **P0** Copy 去除 `linear-gradient`（改 border/background 实色）  
2. **P0** Golden fixtures + copy snapshot + paste QA 模板  
3. **P1** Orchestrator 整篇节奏 RLAYOUT 规则  
4. **P1** business 默认 variant 与 baseline 对齐（plain-first）  
5. **P1** Typography baseline（16px / 1.75 / #333）  
6. **P2** Preview CSS 变量 → 解析 theme hex（后续轮次可加深）  
7. **P2** `/dev/style-fidelity` 调试页  

---

## 9. 需要用户 / PO 手测项

- `r1-golden-default-article` 粘贴微信公众号编辑器：**待记录 PASS/FAIL**  
- 见 `docs/agile/paste-qa/r1-golden-paste-qa.md`
