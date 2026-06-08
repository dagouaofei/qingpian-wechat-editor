# Execution Report：S10-STORY-011 html_paste Fidelity Variant 配色跟随修复

## 1. 基本信息

- 日期：2026-06-08
- 当前分支：`feature/s10-story-011-html-paste-fidelity-theme-tokens`
- 来源分支：`feature/s10-story-011-promote-user-selectable-final`
- 目标合并分支：`feature/s10-story-011-promote-user-selectable-final`（或当前 sprint 分支，待用户确认）
- Sprint：S10
- 关联 Story / Bug / Decision：S10-STORY-011 · 对齐 S9-STORY-007C-FIX-B theme token 策略
- 执行者：Cursor
- 状态：Done（用户验收通过）

## 2. 任务背景

用户侧选择 html_paste fidelity tree heading variant 后，切换文章配色时标题色、accent bar 等仍输出 encode 时写入的源 HTML 硬编码色（如 `#E60012`、`#111`），未跟随 `themeId` 变化。Registry 系 html paste variant（007C section label）已正确 theme 化，fidelity tree decode 路径缺失同等逻辑。

## 3. 本轮目标

在 fidelity tree DSL decode 阶段，当用户 Preview/Copy 传入 theme palette 时，按 `semanticBindings` / `decorators` 将 inline 色 remap 到 theme token；Admin inspection 不传 theme，保留源色。

## 4. 执行范围

**做了：**

- 新增 decode 阶段 theme token remap 模块
- 扩展 decode 链路与 `renderUserPreviewBlock` 传参
- 新增 palette 切换单测；更新 fidelity user preview 测试中的色值期望
- Admin / 裸 decode 无 `themePalette` 时行为不变

**未做：**

- merge 到 sprint
- border-top 等次要装饰色 theme 化
- 修复无关 pre-existing build 错误（`harvest-form.tsx` TypeScript）

## 5. 修改文件

- `src/core/dsl/decoder/dsl-decoder-types.ts`
- `src/core/dsl/decoder/decode-tree.ts`
- `src/core/dsl/decoder/decode-variant-dsl.ts`
- `src/lib/dsl-runtime/render-dsl-block.ts`
- `src/lib/user-preview-render.ts`
- `tests/lib/dsl-runtime-fidelity-heading-substitution.test.ts`

## 6. 新增文件

- `src/core/dsl/decoder/fidelity-tree-theme-tokens.ts`
- `tests/lib/html-paste-fidelity-theme-tokens.test.ts`

## 7. 阅读但未修改的关键文件

- `src/core/renderer/html-paste-teal-section-label-shared.ts`（007C 参考）
- `src/core/dsl/encoder/heading-semantic-extractor.ts`
- `src/core/dsl/decoder/fidelity-tree-substitution.ts`
- `tests/lib/html-paste-section-label-fix-b.test.ts`

## 8. 关键决策

1. **Decode 时 remap，非 encode 扫色** — 源色保留在 DSL 作 evidence；用户路径 decode 时替换。
2. **显式 opt-in** — 仅当 `themePalette` 传入且 `target !== admin_inspection` 时生效。
3. **角色映射** — title→`textDefault`，eyebrow→`textMuted`，subtitle→`textAccent`，number→`bgBand`，accent_bar→`textAccent`（bar 形态 + 源 accent 色匹配）。

## 9. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| 用户 Preview 切换配色后 fidelity heading 色变化 | PASS | businessBlue ↔ creamOrange 单测 |
| Copy 与 Preview 同色且随配色变化 | PASS | clipboard 含 theme accent，不含 `#E60012` |
| Admin inspection 保留源 HTML 色 | PASS | 无 themePalette / admin_inspection gate 单测 |
| 不破坏 number/eyebrow ordinal substitution | PASS | fidelity substitution 测试通过（色值期望已更新为 theme） |

## 10. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| npm run lint | PASS | 0 errors（既有 warnings） |
| vitest（本轮相关） | PASS | `html-paste-fidelity-theme-tokens`、`dsl-runtime-fidelity-heading-substitution`、`copy-background-number-heading-diag` |
| vitest fidelity-encoder | FAIL（既有） | `decoder preview preserves fidelity styles` 期望源数字 `03`，ordinal 替换后为 `01` — 与本轮 theme 无关，属 prior ordinal 行为 |
| npm run build | FAIL（既有） | `harvest-form.tsx` TypeScript 错误，非本轮引入 |

## 11. 未完成事项

- merge 到 sprint（待用户确认；用户已要求本轮不 merge）

## 12. 风险与阻塞

- 装饰性大数字由源浅色改为 `bgBand` solid 色，rgba 半透明数字会失去透明度（可接受，与 007C「源色不作最终 render」一致）

## 13. 需要用户 / ChatGPT 审查的问题

- `fidelity-encoder.test.ts` 中 complex heading 测试仍期望源数字 `03`，是否与 ordinal 替换策略一并更新？
- merge 目标：直接合入 `feature/s10-story-011-promote-user-selectable-final` 还是 sprint 分支？

## 14. 建议下一步

1. 人工验收 `/preview` 切换商务蓝 / 奶油橙
2. 审查通过后 commit + merge 工作分支
3. 可选：修正 `fidelity-encoder.test.ts` ordinal 期望（独立小 commit）

## 15. Commit

- Commit hash：`ba8816b` — fix: apply theme palette tokens to html_paste fidelity tree decode
- Merge：未 merge（待用户确认）
