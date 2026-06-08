# Execution Report：heading_html_paste 短横线 copy height 丢失定位与修复

## 1. 基本信息

- 日期：2026-06-08
- 当前分支：`feature/s10-story-011-promote-user-selectable-final`
- 来源分支：`feature/s10-story-011-promote-user-selectable-final`（工作区延续）
- 目标合并分支：当前 sprint 分支（待用户确认）
- Sprint：Sprint 10
- 关联 Story / Bug / Decision：S10-STORY-011
- 执行者：Cursor
- 状态：Done

## 2. 本轮目标

定位 `heading_html_paste_4933bb91_candidate` 短横线（40×4px 红色 section）在 preview / copy / 原始 HTML 三处不一致的原因，并修复 copy 丢失 `height: 4px` 的问题。

## 3. 执行范围

- 做了：代码路径分析、运行时脚本验证、debug instrumentation、允许 copy 输出 `height`、`copy-background-number-heading-diag` 回归测试
- 未做：encoder 层恢复 `leaf=""` / `<br>`（preview 与 source 的结构差异属 encoder 设计，本轮仅解释）；未移除 debug logs（待用户复测确认）

## 4. 修改文件

- `src/core/wechat-compatibility/allowed-style-properties.ts`
- `src/core/dsl/decoder/render-style.ts`（debug log）
- `src/core/dsl/decoder/decode-tree.ts`（debug log）
- `tests/lib/copy-background-number-heading-diag.test.ts`

## 5. 新增文件

- `docs/agile/execution-reports/2026-06-08-s10-story-011-red-bar-copy-height-fix.md`

## 6. 阅读但未修改的关键文件

- `src/core/dsl/encoder/fidelity-html-tree.ts`
- `src/core/dsl/decoder/render-tree.ts`
- `src/lib/user-preview-render.ts`
- `src/lib/dsl-runtime/resolve-fidelity-variant-dsl.ts`
- `docs/architecture/wechat-safe-html-css-contract.md`

## 7. 关键变更说明

### 根因（三问）

1. **Preview 与原始 HTML 为何少了 `leaf=""` 和 `<br>`**  
   `buildFidelityTreeFromHtml` 只保留 fidelity tag（section/span/h*…）和 inline style；`<br>` 非 fidelity tag 被丢弃，`leaf` 属性不进入 DSL tree。空装饰 span 渲染为 `<span></span>`。

2. **Preview 与 copy 是否同一 decoder**  
   是。均走 `decodeTreeToOutput` → `renderDslTreeToHtml`。差异在 `target`：  
   - `preview`：不过滤 style  
   - `copy_wechat`：`filterAllowedInlineStyles` 过滤不允许属性 + `wrapCopySafeMarginSection` 外包 margin + flex→block 归一化

3. **Copy 丢失 `height: 4px`**  
   `height` 不在 `WECHAT_ALLOWED_STYLE_PROPERTIES`，copy 路径被 `filterAllowedInlineStyles` 剥离。无高度时空 span 无法撑开，短横线消失。

### 修复

- 将 `height` 加入 `WECHAT_ALLOWED_STYLE_PROPERTIES`，使 copy 与 preview 对该装饰条一致保留 `height: 4px`。

### 关于用户观测到的 copy 含 `leaf` / `ProseMirror-trailingBreak`

代码库无 ProseMirror；DSL copy 路径实测输出为 `<span></span>`（无 leaf/br）。该形态更可能来自 **admin 原始 sourceHtml** 或 **粘贴进微信编辑器后再复制** 的 DOM，而非 `renderUserPreviewBlock` / `inspectCandidateCopy` 产出。

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| 定位 preview/copy/source 差异原因 | Pass | 见 §7 |
| copy 保留短横线 height | Pass | 单测 + tsx 脚本验证 |
| 用户侧 E2E 复测 | Pending | 需用户按 reproduction steps 确认 |

## 9. 运行的检查命令

```bash
npx vitest run tests/lib/copy-background-number-heading-diag.test.ts
npx tsx -e "… decodeVariantDsl preview vs copy_wechat …"
```

## 10. 检查结果

- Vitest：4 passed
- tsx：`copy_wechat height: true leaf: false`

## 11. 未完成事项

- 用户复测 `/preview` 或 admin inspection copy 后确认短横线可见
- ~~确认后移除 debug instrumentation~~（2026-06-08 用户确认已修复，instrumentation 已移除）

## 12. 风险与阻塞

- Contract v1 将 `height` 标为 Yellow；本次为装饰条保真加入 allowlist，后续若 Matrix 实机 FAIL 需 per-variant waiver

## 13. 需要用户 / ChatGPT 继续审查的问题

- 用户观测到的 copy HTML 含 `ProseMirror-trailingBreak`：请确认复制来源是「一键复制」clipboard 还是微信编辑器内再复制
- 是否需要在 encoder 层保留装饰性 `<br>`/leaf span（提升 preview 与 source 结构一致）

## 14. 建议下一步

1. 用户复测 copy 短横线
2. 通过后移除 debug logs 并 commit
3. ChatGPT 审查是否合并回 sprint 分支

## 15. commit hash

`58e58cb041db4f706b25f58672138e26be910b29`
