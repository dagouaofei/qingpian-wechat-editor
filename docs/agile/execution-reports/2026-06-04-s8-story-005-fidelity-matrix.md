# Execution Report：S8-STORY-005 多控件 Fixture 与 Fidelity Matrix

## 1. 基本信息

- 日期：2026-06-04
- 当前分支：`feature/s8-story-005-fidelity-matrix`
- 来源分支：`sprint/s8-wechat-safe-css-contract`
- 目标合并分支：`sprint/s8-wechat-safe-css-contract`
- Sprint：S8
- 关联：S8-STORY-005 · DECISION-089 · DECISION-090
- 状态：**Done**（用户审查通过 · merge 前文档修正）

## 2. 本轮目标

建立 Contract v1 第一版 **Fidelity Matrix**：10 类控件 × 2–4 variant fixture → Copy HTML → `validateWechatCopyHtml()` → 结构化 Matrix 文档。

## 3. 执行范围

**做了：**

- 35 个 `S8_WECHAT_FIDELITY_FIXTURE_SPECS`（`tests/fixtures/fidelity/`）
- test-only preset `s8_fidelity_matrix_test`（probe 不进 defaultVariantByBlockType）
- `tests/support/wechat-fidelity-matrix-builder.ts`（render + validate + markdown）
- `docs/agile/paste-qa/wechat-fidelity-matrix.md`（与 builder 输出同步，CI 测试校验）
- `src/core/wechat-compat/fidelity-matrix-types.ts`（可复用行结构）
- `tests/core/wechat-compat/wechat-fidelity-matrix.test.ts`

**没做：**

- 公众号实机 Paste QA（STORY-006）
- Renderer / Contract v1 分级修改
- preset 扩充 · 视觉升级 · probe 入池

## 4. 新增文件

- `docs/agile/paste-qa/wechat-fidelity-matrix.md`
- `src/core/wechat-compat/fidelity-matrix-types.ts`
- `tests/fixtures/fidelity/s8-wechat-fidelity-spec.ts`
- `tests/fixtures/fidelity/s8-wechat-fidelity-registry.ts`
- `tests/fixtures/fidelity/s8-wechat-fidelity-articles.ts`
- `tests/support/wechat-fidelity-matrix-builder.ts`
- `tests/core/wechat-compat/wechat-fidelity-matrix.test.ts`
- 本 execution report

## 5. 修改文件

- `src/core/wechat-compat/index.ts`（导出 fidelity matrix 类型）
- `docs/architecture/wechat-safe-html-css-contract.md`（§10 STORY-005 链接）
- `docs/architecture/copy-drift-diagnostics.md`
- `docs/agile/sprint-backlog.md`、`changelog.md`、`sprint8-wechat-safe-css-contract.md`

## 6. Matrix 摘要

| 项 | 值 |
|----|-----|
| 行数 | 35 |
| 控件 | title(3) heading(4) paragraph(4) lead(3) list(3) quote(3) summary/highlight(4) info_card(4) cta(3) divider(4) |
| validator 汇总 | PASS 0 · WARNING 30 · FAIL 5（见 Matrix §5） |
| pasteStatus | 全部 **UNTESTED** |
| variantType | existing / **probe**×4 / **candidate**×1（`title_left_bar_classic`） |

**FAIL 行（未改 renderer，仅记录）：**  
`title_left_bar_classic`、`title_bottom_line_editorial`、`heading_numbered_section`、`heading_card_centered`、`lead_quote_intro` — Copy HTML 含 `WECHAT_COPY_RED_CSS`（如 `font-style` 等）。

**Probe 样本：** `paragraph_callout_soft`、`highlight_border_glow`、`info_card_soft_banner`、`divider_short_accent`。

## 7. variant 类型与 preset

- **probe：** 仅 `blockOverrides` + test registry；**不**写入 `s8_fidelity_matrix_test` 默认值。
- **candidate：** `title_left_bar_classic` 标记候选，不入默认池直至 Paste QA。
- AI 样式选择路径未改动；probe 未注册为 `release1_required` 默认项。

## 8. 与 Validator / Profile 关系

每行调用 `validateWechatCopyHtml({ html, blockType, variantId })`；`heading_highlight_marker` 有 waiver **note**（行状态仍为 WARNING，因 `section` 等 Yellow tag 警告）。

## 9. 验收标准

| AC | 结果 |
|----|------|
| AC-1 10 类控件 | PASS |
| AC-2 ≥2 variant/类 | PASS |
| AC-3 paste UNTESTED | PASS |
| AC-4 边界验证非视觉 | PASS |
| AC-5 merge sprint | PASS（用户确认） |

## 10. 运行检查

| 命令 | 结果 |
|------|------|
| npm run test | PASS · 840 tests |
| npm run lint | PASS · 0 errors |
| npm run build | PASS |

**更新 Matrix 文档：** `UPDATE_FIDELITY_MATRIX=1 npx vitest run tests/core/wechat-compat/wechat-fidelity-matrix.test.ts`

## 11. 未完成

- **S8-STORY-006** Paste QA：为 Matrix 填 `pasteStatus` / `pasteEvidence`（**不在 005 范围，未启动**）
- **5 条 validator FAIL 行**（见下）不在 S8-STORY-005 修 renderer；作为 006 / Copy Drift / 后续 Renderer 或 Contract 修正的输入

### 11.1 五条 FAIL 行处理口径（审查确认）

| variantId | 本轮 005 |
|-----------|----------|
| `title_left_bar_classic` | 仅 Matrix 记录；不修 renderer |
| `title_bottom_line_editorial` | 同上 |
| `heading_numbered_section` | 同上 |
| `heading_card_centered` | 同上 |
| `lead_quote_intro` | 同上 |

**后续闭环（STORY-006 及以后）：**

1. 公众号实机粘贴若也 FAIL → 填 **Drift** 记录（`copy-drift-diagnostics.md` 模板）
2. 据 Matrix + 实机证据决定：**fallback**、**waiver**、**移出候选池**，或 **修 renderer** / Contract 补丁（须 decisions + changelog）
3. 不在 005 为通过 Matrix 而改 Contract v1 分级或 Copy 输出结构

## 12. 风险

- 大量 WARNING（`section`/`div` Yellow）噪音高 — 与 STORY-004 结论一致，待 006 实机再判断是否 waiver
- Matrix doc 与 builder 强绑定；改 renderer 后须重跑 `UPDATE_FIDELITY_MATRIX=1`
- **5 条 FAIL** 可能被误读为「必须本 Story 修掉」— 已明确：**005 只建档**，修复决策在 Paste QA / Drift 闭环

## 13. 建议下一步

1. ~~merge → sprint~~（审查通过后执行）
2. **S8-STORY-006** Paste QA 流程 — **待用户确认启动**（本轮不自动开）
3. 实机 FAIL 时按 Drift 模板更新 Matrix `pasteStatus` / `contractAction`

## 14. Commit & Merge

- `68a32ef` — `feat: add wechat fidelity matrix fixtures`
- Merge：`feature/s8-story-005-fidelity-matrix` → `sprint/s8-wechat-safe-css-contract`（fast-forward）
- Sprint tip：`68a32ef`
- **未** merge `release/1` / `main`
- **S8-STORY-005：** **Done**
