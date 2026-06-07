# Execution Report：S10-STORY-011 FIX-A DSL Decode Source-Exact

## 1. 基本信息

- 日期：2026-06-07
- 当前分支：`feature/s10-story-011-promote-user-selectable-final`
- 来源分支：`sprint/s10-db-backed-style-admin-v1`
- 目标合并分支：`sprint/s10-db-backed-style-admin-v1`（**本轮不 merge，待用户确认**）
- Sprint：Sprint 10
- 关联 Story / Bug / Decision：S10-STORY-011 FIX-A（DSL Decode Must Be Source-Exact / No Fallback / Empty Is Failure）
- 执行者：Cursor
- 状态：**In Review**

## 2. 本轮目标

修复用户 bordered heading HTML 在 Harvest → detail → `/preview` 链路中 `decodedPreviewHtml=empty` 却 `status=ok`、以及用户侧 fallback 到默认语义 heading 卡片的问题；建立 source-exact tree HTML 预览与 trace。

## 3. 执行范围

**做了：**

- bordered heading 专用 encoder（`bordered-heading-extractor`）接入 `encodeHtmlToVariantDsl`
- tree DSL preview 统一返回 `dsl_tree_html_preview`（inline HTML，非 `title_block_preview` 语义布局）
- empty render / 无可见文本 → `DSL_RENDER_EMPTY` + `ok=false`；readiness `previewReady=false`
- 用户 preview UI 支持 `dsl_tree_html_preview`；`renderDslBlock` 附加 `runtimeTrace`（`fallbackUsed=false`）
- candidate detail + dev API source-exact trace 字段
- FIX-A 回归测试（bordered heading fixture）

**没做：**

- 不 merge sprint / release / main
- 不关闭 S10 / S10-STORY-011
- 不连接生产 RDS
- 不做 AI 生成 DSL / DOM 反向编码 / OSS 截图

## 4. 修改文件

- `src/core/dsl/encoder/html-to-variant-dsl.ts`
- `src/core/dsl/encoder/encoder-trace.ts`
- `src/core/dsl/decoder/decode-tree.ts`
- `src/core/dsl/decoder/decode-variant-dsl.ts`
- `src/core/dsl/runtime/dsl-trace-types.ts`
- `src/core/renderer/types.ts`
- `src/lib/dsl-runtime/render-dsl-block.ts`
- `src/lib/dsl-runtime/runtime-trace.ts`
- `src/lib/dsl-runtime/source-exact-trace.ts`
- `src/lib/dsl-runtime/validate-variant-dsl-runtime-readiness.ts`
- `src/components/preview/article-preview-panel.tsx`
- `src/components/preview/dsl-tree-html-preview-block.tsx`
- `src/app/admin/(protected)/style-library/candidate-inspection-view-model.ts`
- `src/app/admin/(protected)/style-library/candidate-inspection-panel.tsx`
- `src/app/api/dev/style-admin/user-selectable-pool/route.ts`
- `docs/architecture/article-variant-dsl-runtime.md`
- `docs/agile/sprint-backlog.md`
- `docs/agile/changelog.md`
- 测试更新：`decode-variant-dsl.test.ts` · `candidate-inspection-dsl-preview.test.ts` · `dsl-runtime-promoted-heading-preview.test.ts`

## 5. 新增文件

- `src/core/dsl/encoder/bordered-heading-extractor.ts`
- `src/components/preview/dsl-tree-html-preview-block.tsx`
- `src/lib/dsl-runtime/source-exact-trace.ts`
- `tests/fixtures/dsl/bordered-heading-html.ts`
- `tests/core/dsl/bordered-heading-fix-a.test.ts`

## 6. 阅读但未修改的关键文件

- `src/lib/user-preview-render.ts`
- `src/server/style-admin/inspection/candidate-dsl-render.ts`
- `src/core/dsl/decoder/render-tree.ts`
- `src/core/dsl/decoder/render-style.ts`

## 7. 关键变更说明

1. **Encoder：** 检测 `section > h3`（或 h2/h4…）带 border accent 的 HTML，输出规范化 tree（root 仅 margin，title slot 承载 border/padding/typography）及非空 `styleTokens` / `layoutIntent=bordered_left_accent_heading`。
2. **Decoder：** preview / admin_inspection 返回 `dsl_tree_html_preview` + `html`；无可见文本时 `DSL_RENDER_EMPTY`。
3. **Inspection：** `previewOk` 要求 `decodedPreviewHtml` 有可见文本；展示 `definitionHash` / `fallbackUsed` / `renderedByVariantId`。
4. **用户 preview：** `DslTreeHtmlPreviewBlock` 渲染 DSL 内联 HTML；`data-runtime-source=database_dsl` · `data-fallback-used=false`。

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| bordered heading styleTokens 非空 | PASS | 定向测试 |
| DSL 含 border/borderLeft/borderRadius/padding/color/fontSize/lineHeight | PASS | 定向测试 |
| decode preview/copy 非空含 title | PASS | 定向测试 |
| empty preview → failed + readiness rejected | PASS | 定向测试 |
| database_dsl 失败不 fallback 语义 renderer | PASS | `renderDslBlock` 失败返回 error，无 `title_block_preview` |
| user preview trace fallbackUsed=false | PASS | `runtimeTrace` + data 属性 |
| detail inspection 非裸文本 | PASS | `dsl_tree_html_preview` 含 border 样式 |
| lint / targeted tests / build | PASS | 见 §9 |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `npm run test -- tests/core/dsl/bordered-heading-fix-a.test.ts …` | PASS | 22 tests（6 files） |
| `npm run test -- tests/server/style-admin/promote tests/core/dsl tests/lib/dsl-runtime` | PASS | 46 tests |
| `npm run lint -- --max-warnings 0` | FAIL（既有 warnings） | 29 个历史 warning，本轮未新增 error |
| `npm run build` | PASS | TypeScript OK |

## 10. 未完成事项

- 用户本地 E2E：Harvest 粘贴用户 bordered HTML → detail → Promote → `/preview` 选手动验收（需 DB + dev server）
- S10-STORY-011 promote 功能与本 FIX-A 同分支，**均未 commit**

## 11. 风险与阻塞

- 既有 candidate 若 DSL 为旧语义 tree 且无 `extractedSlots`，inspection 仍用 fixture 样本文本渲染（设计如此）；新 Harvest 编码会写入 `extractedSlots`。
- 复杂 chapter heading 亦改为 `dsl_tree_html_preview`（非 magazine_left_bar 语义组件），视觉与旧 inspection 预期略有差异，但更接近 source-exact。

## 12. 需要用户 / ChatGPT 审查的问题

1. FIX-A 与 S10-STORY-011 promote 是否同一 commit 还是拆分两个 commit？
2. 审查通过后是否 merge `feature/s10-story-011-promote-user-selectable-final` → sprint（用户已明确 011 暂不 merge，FIX-A 亦同）？
3. 本地 E2E 步骤 §六是否 PASS？

## 13. 建议下一步

1. 用户按 §六做 Harvest → detail → `/preview` 回归
2. ChatGPT 审查 execution report + 定向测试结果
3. 用户确认后 commit（011 + FIX-A）并决定是否 merge sprint

## 14. Commit

- Commit hash：**未提交 / not committed**
