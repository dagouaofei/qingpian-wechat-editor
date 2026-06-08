# Article / Variant DSL Runtime

> 轻篇公众号排版 · qingpian-wechat-editor  
> **Sprint 10 · S10-STORY-011A** · Article / Variant DSL Runtime + Encoder / Decoder Core  
> **状态：** In Review  
> **关联：** [`wechat-compatibility-spec.md`](wechat-compatibility-spec.md) · [`style-management-admin-v1.md`](style-management-admin-v1.md)

---

## 1. 运行时事实源

S10-STORY-011A 起，**DB 可用时**样式运行时事实源为：

```text
Article JSON / styleAssignment（现有 Article Schema）
+ Variant DSL（DB `definitionJson` = `s10.variant-dsl.v1`）
+ distribution / qualityStatus（DB 元数据）
```

**不再**以 code registry、`runtimeVariantId` 硬编码映射、或 admin-only fallback renderer 作为 DB 可用时的主路径。

| 场景 | 事实源 |
|------|--------|
| DB 可用 · user-selectable pool | `definitionJson` Variant DSL + Decoder Core |
| DB 不可用 | `source=code_fallback` · registry seed 编码为 DSL 后解码 |
| HTML Harvest | rawHtml 仅作 evidence · runtime 用 Encoder 产出的 DSL |
| Admin Inspection | 与用户 Preview / Copy **同一** Decoder Core |

---

## 2. 架构总览

```text
外部 HTML / DOM / AI / 手工配置 / Registry seed
  → Encoder（src/core/dsl/encoder/）
  → Article DSL + Variant DSL
  → WeChat Compatibility Spec 约束
  → Decoder Core（src/core/dsl/decoder/）
  → Preview HTML / Copy HTML / Admin Inspection / QA Snapshot
```

### 2.1 模块职责

| 模块 | 路径 | 职责 |
|------|------|------|
| WeChat Compatibility Spec | `src/core/wechat-compatibility/` | 允许/禁止标签与样式 · sanitize · normalize · 降级 · validator issues |
| DSL Runtime Contract | `src/core/dsl/runtime/` | `ArticleDslV1` · `VariantDslV1` · schema 校验 |
| Encoder | `src/core/dsl/encoder/` | HTML → Variant DSL · Registry → Variant DSL · legacy definition 适配 |
| Decoder Core | `src/core/dsl/decoder/` | `tree` 与 `renderContract` 双路径 · 四 target 共用 |
| Runtime Bridge | `src/lib/dsl-runtime/` | `parseDefinitionJsonToVariantDsl` · `renderDslBlock` |

---

## 3. Variant DSL v1

版本：`s10.variant-dsl.v1`

### 3.1 两种渲染形态

1. **`tree`** — HTML Harvest / 粘贴 HTML 编码产物；由 `decodeTreeToOutput` 渲染。**目标形态：Preview / Copy / admin_inspection 同源。**
2. **`renderContract`** — Registry import 产物；映射到既有 block renderer（`title_block_v1`、`info_card_v1` 等）。**过渡形态 · 已废弃方向 · 见 [`variant-dsl-legacy-render-contract-debt.md`](variant-dsl-legacy-render-contract-debt.md)（DEBT-DSL-RC-001~006 · DECISION-110）。**

Registry 编码时 `meta.legacySlots` 保留完整 slot 定义，供 `renderContract` 路径复用。

### 3.2 示例（tree · heading）

```json
{
  "version": "s10.variant-dsl.v1",
  "id": "heading_html_paste_9776cdde_candidate",
  "blockType": "heading",
  "family": "htmlPaste",
  "copySafety": "strict",
  "tree": {
    "type": "element",
    "tag": "section",
    "style": { "paddingTop": "8px", "borderLeftWidth": "4px", "borderLeftColor": "#1677ff" },
    "children": [
      { "type": "slot", "slot": "title", "tag": "span", "style": { "fontSize": "18px", "fontWeight": 700 } }
    ]
  }
}
```

### 3.3 11 个 blockType

全部支持 `renderContract` 默认值（import 路径）：

`title` · `heading` · `lead` · `paragraph` · `divider` · `list` · `quote` · `highlight` · `info_card` · `cta` · `image_placeholder`

`tree` 路径本轮重点覆盖：`heading` · `info_card` · `lead` · `paragraph`。

---

## 4. Decoder Targets

| Target | 用途 |
|--------|------|
| `preview` | 用户 `/preview` · Admin Preview |
| `copy_wechat` | 复制到公众号 · Admin Copy |
| `admin_inspection` | Candidate 详情检查（与 preview 同 core，可扩展 debug） |
| `qa_snapshot` | Paste QA / Validator 快照 |

**禁止：** admin inspection 独立 fallback 成功而用户 runtime 失败。

---

## 5. 用户侧 Runtime 接线（单轨 · FIX-A）

**DB 可用时，/preview 用户侧 runtime 统一走 DSL Decoder Core。** 不允许 code registry / 旧 `renderBlock` 成为 runtime source of truth。

| 路径 | 行为 |
|------|------|
| `runtime-variant-dsl-pool` | 加载**全部** runtime-eligible variants 的 `definitionJsonByVariantId`（含 release1_required） |
| `user-selectable-variant-pool` | **仅** heading picker 候选；不驱动 block 渲染 |
| `render-article-preview-client` | 接收 `dslRuntime` snapshot；所有 block 经 `user-preview-render` → DSL Decoder |
| `user-preview-render` | **禁止**调用 `renderBlock`；database 仅用 DB DSL；不可用时代码 seed 编码为 DSL 后 decode（`source=code_fallback`） |
| `decode-contract` | `renderContract` 作为 Decoder Core 内部 DSL 形态；旧 block renderer 仅在此层封装调用 |
| `style-admin/import` | import 时 `encodeRegistryVariantToDsl` 写入 `definitionJson` |
| `style-admin/harvest` | `encodeHtmlToVariantDsl` 写入 `definitionJson` · 受 `STYLE_HARVEST_WECHAT_COMPATIBILITY_MODE`（off/report/enforce）控制 |

`htmlPasteCandidate` 族在 `renderContract` 路径走专用 section-label 渲染，主题色来自 `article.styleAssignment.themeId`。

### code registry 允许用途

- seed source（import / migration）
- test fixture
- **DB unavailable** 时 `code_fallback`（仍经 Encoder → Decoder，不直连旧 runtime）

---

## 6. DB 字段策略

| 字段 | 含义（011A 后） |
|------|----------------|
| `definitionJson` | **Variant DSL runtime source** |
| `componentProtocolJson` | component hints · `layoutMode` · `dslVersion` |
| `compatibilityJson` | WeChat 校验结果 / encoder issues 摘要 |

未新增 Prisma migration；`dslVersion` 写入 JSON 元数据。

---

## 7. Runtime Trace（FIX-B）

FIX-B 起，Encoder / Decoder / 用户 runtime 须产出可诊断 trace，回答「走哪条路径、为何失败」。

### 7.1 Trace 类型

| 模块 | 路径 | 职责 |
|------|------|------|
| Trace types | `src/core/dsl/runtime/dsl-trace-types.ts` | `DslRuntimeTrace` · `EncoderTrace` · `DecoderTrace` |
| Encoder trace | `src/core/dsl/encoder/encoder-trace.ts` | 输入种类 · extracted slots · style tokens · lossReport |
| Decoder trace | `src/core/dsl/decoder/decoder-trace.ts` | target · decoderPath · missingSlots · unsupportedNodes/Styles |
| Runtime bridge | `src/lib/dsl-runtime/runtime-trace.ts` | `buildRuntimeTraceForVariant` · pool source 映射 |
| Readiness gate | `src/lib/dsl-runtime/validate-variant-dsl-runtime-readiness.ts` | Promote 前置检查（011 后续调用） |

### 7.2 `runtimeSource` 定义

| 值 | 含义 |
|----|------|
| `database_dsl` | DB 可用且 `definitionJson` 经 Decoder Core 解码（**DB 可用时验收必须通过**） |
| `code_fallback` | DB 不可用时代码 registry seed 编码为 DSL 后解码 |
| `missing_dsl` | 无 `definitionJson` 或 parse 失败 |
| `unsupported` | blockType / DSL 形态当前 Decoder 不支持 |

`decoderPath`：`tree` · `renderContract` · `none`  
`definitionSource`：`db.definitionJson` · `code_fallback_encoded_registry` · `unknown`

### 7.3 诊断链路

```text
rawHtml
  → sanitizedHtml / normalizedDom
  → semanticExtraction（heading: eyebrow / number / title / subtitle / layoutIntent / tokens）
  → Variant DSL（浅层规范 tree，非原样深层 DOM）
  → decodedPreviewHtml / decodedCopyHtml
  → compatibilityIssues + lossReport
  → runtimeSource + renderTrace
```

### 7.4 可见性

| 入口 | 展示内容 |
|------|----------|
| `/admin/style-library/harvest` | extracted slots · tokens · DSL JSON · decoder preview/copy summary · issues · lossReport |
| Candidate detail | Runtime Trace：runtimeSource · decoderPath · dslValid · inspection decode summary |
| `GET /api/dev/style-admin/user-selectable-pool` | 每 variant：`runtimeSource` · `dslValid` · `decoderPath` · `previewReady` · `copyReady` · **source-exact trace**（`definitionHash` · `decodedPreviewHash` · `fallbackUsed` · `renderedByVariantId`） |
| 用户 `/preview`（tree DSL） | `dsl_tree_html_preview` 输出 · `data-runtime-source` · `data-fallback-used` · `data-rendered-by-variant-id` |

### 7.5 No silent empty render

Decoder 在 slot 缺失、unsupported node/style、或输出无可见文本时须返回明确 issue（如 `DSL_SLOT_MISSING:title` · `DSL_RENDER_EMPTY`），**禁止** `decodedPreviewHtml=empty` 且 `status=ok`。

Tree DSL 的 preview / admin_inspection 目标返回 `dsl_tree_html_preview`（source-exact inline HTML），**禁止** fallback 到 `title_block_preview` 语义布局（pill / left_bar 等）。

### 7.6 Heading semantic encoder（v2）

复杂公众号 heading HTML 经 `heading-semantic-extractor.ts` 提取语义 slot（`eyebrow` · `number` · `title` · `subtitle`）与 `layoutIntent` / `decorators` / style tokens，生成浅层规范 DSL tree；flex · negative margin · leaf span · 空 br 等进入 `lossReport` / compatibility issues，不原样塞进 tree。

Encoder 版本：`s10_html_encoder_v2_semantic` · `meta.extractedSlots` 供 Decoder `resolve-dsl-slots` 填充 block content。

---

## 8. 与 S10-STORY-011 Promote 关系

- **S10-STORY-011** 基于 011A 收口：DB candidate → `paste_qa_pass` + `validateVariantDslRuntimeReadiness` → Promote → `userSelectable=true`。
- Promote eligibility **必须**调用 `buildCandidatePromoteRuntimeReadiness` / `validateVariantDslRuntimeReadiness`：仅当 `ok=true`（DSL valid · `previewReady` · `copyReady` · `compatibilityReady` · DB 场景 `runtimeSource=database_dsl` · 无 blocking issues）才允许 promote。
- Promote 写入：`userSelectable=true` · `defaultEligible=false` · `release1Required=false` · promote record · lifecycle event · audit log · pool cache invalidate。
- Candidate detail **Preview inspection** 使用 DSL Decoder Core；`meta.extractedSlots` 优先于 fixture 样本文本；复杂 heading 映射 `layoutIntent=chapter_overlay_heading` → `magazine_left_bar` 等样式化 preview。
- Promote 后用户侧 `/preview` 与 Copy 共用同一 `definitionJson` / `runtimeVariantId`（011A 单轨 `database_dsl`）。

### 8.1 Integration 收口（2026-06-08 · S10-STORY-011）

- 工作分支：`feature/s10-story-011-integration-readiness`（自 `sprint/s10-db-backed-style-admin-v1` FF merge 今日 011 相关 feature 分支）。
- **DB 可用时** runtime pool / promote readiness **必须** `runtimeSource=database_dsl`（或 pool `source=database`）；`code_fallback` **仅** DB unavailable。
- html_paste fidelity refresh、theme token remap、ordinal substitution、copy parity 与用户 preview 同源；admin_inspection 保留 source 色。
- Compatibility recalibration、DSL schema cleanup、S10 closeout **不在 011 内继续散修** — 见 S10-STORY-012~014。

---

## 9. 明确不做（011A）

- DOM 编辑器完整反向编码
- AI 真实生成 DSL
- 删除旧 registry 文件
- OSS 截图对比
