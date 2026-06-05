# Execution Report：S8-STORY-004 Copy HTML Validator

## 1. 基本信息

- 日期：2026-06-04
- 当前分支：`feature/s8-story-004-copy-html-validator`
- 来源分支：`sprint/s8-wechat-safe-css-contract`
- 目标合并分支：`sprint/s8-wechat-safe-css-contract`
- Sprint：S8
- 关联：S8-STORY-004 · DECISION-089 · DECISION-090
- 执行者：Cursor
- 状态：**Done**（用户审查通过 · 2026-06-04 · 已 merge sprint）

## 2. 本轮目标

在 Contract v1 Compatibility Profile 之上实现 **Copy HTML Validator**，校验 Clipboard HTML 是否符合 `wechat-safe-contract-v1`，为后续 Fidelity Matrix 提供结构化结果；不修改 Renderer、不建 Matrix、不做实机 QA。

## 3. 执行范围

**做了：**

- `validateWechatCopyHtml()` + issue codes + `WechatCopyValidationResult`
- HTML 标签分级（Green / Yellow warning / Red error）
- 禁止 `class`、`<style>`、`<link>`；inline style 解析与 CSS declaration 校验
- Yellow waiver（`blockType` + `variantId`）→ note；无 waiver → warning
- `maxNestingDepth: 3` 超限 warning
- DOMParser（jsdom）+ 轻量 tag 栈 fallback（Node）
- 测试 `tests/core/wechat-compat/copy-html-validator.test.ts`（12 cases）
- 修正 `validateCssDeclarationCompatibility` 值级 Green（如 `display:inline-block`）
- 收紧 `nonTransferable` waiver 匹配（不得无 context 全局放行）
- 文档：contract §10.1、copy-drift §6、sprint-backlog、changelog、DECISION-090 注记

**没做：**

- Fidelity Matrix（S8-STORY-005）
- 公众号实机粘贴 QA
- Copy / Preview Renderer 输出结构变更
- 新 variant / block

## 4. 新增文件

- `src/core/wechat-compat/copy-html-validator.ts`
- `tests/core/wechat-compat/copy-html-validator.test.ts`
- 本 execution report

## 5. 修改文件

- `src/core/wechat-compat/index.ts`（导出 validator API）
- `src/core/wechat-compat/wechat-html-classification.ts`（`isListedHtmlTag`）
- `src/core/wechat-compat/wechat-yellow-waivers.ts`（nonTransferable 精确匹配）
- `src/core/copy/index.ts`（re-export `validateWechatCopyHtml`）
- `src/core/styles/compatibility.ts`（值级 allowed + pvLevel 优先）
- `docs/architecture/wechat-safe-html-css-contract.md`
- `docs/architecture/copy-drift-diagnostics.md`
- `docs/agile/sprint-backlog.md`、`changelog.md`、`decisions.md`

## 6. 阅读未改关键文件

- `docs/architecture/wechat-copy-style-rules.md`
- `src/core/copy/copy-safe-html.ts`
- `src/core/copy/wechat-profile-bridge.ts`
- `docs/agile/execution-reports/2026-06-04-s8-story-003-compatibility-profile.md`

## 7. Validator API 摘要

```ts
validateWechatCopyHtml(input: ValidateWechatCopyHtmlInput): WechatCopyValidationResult
```

- `valid = errors.length === 0`
- `hasWarning` / `hasError` 分桶
- `errors` | `warnings` | `notes` | `issues`（全量）
- 默认 `contractVersionId`: `wechat-safe-contract-v1`，Profile：`WECHAT_SAFE_CONTRACT_V1_PROFILE`

## 8. Red / Yellow / Green 规则

| 级别 | 标签 | CSS declaration |
|------|------|-----------------|
| Green | pass | pass |
| Yellow | warning（`WECHAT_COPY_YELLOW_TAG`） | 无 waiver → warning；有 waiver → note |
| Red | error | error（含 unknown property / value Red pattern） |

额外：duplicate property、`var(--*)`、`calc()`、`!important` → error；嵌套 > 3 → warning。

## 9. 与 Compatibility Profile 的关系

- 标签/CSS 分级复用 S8-STORY-003：`classifyHtmlTag`、`validateCssDeclarationCompatibility`、`findYellowWaiverForCapability`
- DOM `maxNestingDepth` 取自 Profile
- waiver 种子：`heading` + `heading_highlight_marker`（linear-gradient、box-decoration-break）

## 10. 与旧 copy-safe 检查的关系

- **`copy-safe-html.ts`**：保留既有正则/模式快检（S7 heading 等测试不动）
- **新 Validator**：Contract v1 完整分级 + 结构化 `WechatCopyValidationResult`；建议后续 snapshot 叠加调用
- **未删除、未大重构** legacy 路径；`wechat-profile-bridge` 未改行为

## 11. 解析边界（轻量 fallback）

- 面向轻篇 Copy HTML 常见 `section` / `div` / `p` / `table` 片段
- 非通用 HTML sanitizer；标准 parser 增强可留 S8-STORY-004B

## 12. 验收标准

| AC | 结果 | 说明 |
|----|------|------|
| Validator 实现 | PASS | `copy-html-validator.ts` |
| 使用 Contract v1 Profile | PASS | 默认 v1 profile |
| Red tag/CSS → error | PASS | 含 script/style/svg/flex 等 |
| class/style/link → error | PASS | |
| Yellow tag/CSS 无 waiver → warning | PASS | section/table 等 |
| Yellow + waiver → note | PASS | heading_highlight_marker |
| Green CSS pass | PASS | 含 display:inline-block 修复 |
| 嵌套 > 3 warning | PASS | |
| duplicate/var/calc/!important | PASS | |
| waiver 不外推 | PASS | quote+any 仍 warning |
| 不改 renderer / 无 Matrix | PASS | |
| lint/test/build | PASS | 835 tests |

## 13. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| npm run test | PASS | 835 tests |
| npm run lint | PASS | 0 errors（项目既有 unused-vars warnings） |
| npm run build | PASS | |

## 14. 未完成

- S8-STORY-005 Fidelity Matrix（**等待用户确认启动**，不在本 Story 范围）
- CI 集成 validator（可选后续）

## 15. 风险

- `section`/`div` 大量 Yellow warning 可能噪音高；**本轮不放宽**；待 Matrix/实机（005/006）再判断
- 轻量 parser 对畸形 HTML 可能误报 `PARSE_ERROR` warning

## 16. 审查收口（用户确认）

| 结论 | 状态 |
|------|------|
| `valid = errors.length === 0`（`valid = no errors`） | **接受** |
| 仅有 warning 时 `valid: true`，**不代表** Paste QA PASS | **接受** |
| warning 须进入 Matrix / Paste QA 闭环 | **接受** |
| `section` / `div` Yellow warning 暂不放宽 | **留待 S8-STORY-005 / 006** |
| 不修改 renderer · 不新增 Matrix · 不新增 variant | **确认** |

## 17. 建议下一步

1. ~~merge → sprint~~ **已完成**
2. **S8-STORY-005** Fidelity Matrix — 待用户明确启动指令
3. 后续 snapshot 可叠加 `validateWechatCopyHtml`

## 18. Commit & Merge

- `16b2b3d` — `feat: add wechat copy html validator`
- Merge：`feature/s8-story-004-copy-html-validator` → `sprint/s8-wechat-safe-css-contract`（见 §19 merge commit）
- **未** merge `release/1` / `main`

## 19. Merge 后检查（sprint 分支）

| 项 | 结果 |
|----|------|
| Sprint 分支 | `sprint/s8-wechat-safe-css-contract` @ `c661495`（fast-forward merge） |
| S8-STORY-004 | **Done** |
| `npm run test` | PASS · 835 tests（收口轮次；首次 run 遇 vitest worker 超时后重试通过） |
| `npm run lint` | PASS · 0 errors |
| `npm run build` | PASS |
