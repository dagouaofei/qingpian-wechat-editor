# Execution Report：S7-STORY-007A · R1 Style Fidelity Stabilization

## 1. 基本信息

- 日期：2026-06-02
- 当前分支：`feature/s7-story-007a-r1-style-fidelity`
- 来源分支：`sprint/s7-wechat-article-experience`
- 目标合并分支：`sprint/s7-wechat-article-experience`
- Sprint：Sprint 7
- 关联 Story / Bug / Decision：S7-STORY-007A · S7-STORY-007 Deferred · DECISION-085
- 执行者：Cursor
- 状态：**In Review**（代码 Done · 粘贴 QA Not Run）

## 2. 本轮目标

R1 默认成稿样式与微信公众号复制保真稳定化：审计 → baseline → golden fixtures → 默认路径 variant / Copy / Orchestrator → 调试页 → 自动化验收；**不**新增 variant 数量。

## 3. 执行范围

**做了：**

- 路径审计、产品审美基准、3 套 golden Article fixture
- `business` preset 默认 variant + 正文字号行高
- Orchestrator **RLAYOUT** 整篇节奏规则
- Title/heading Copy 去 gradient / flex / shadow，统一 `title-heading-copy-styles.ts`
- `copy-safe-html` 增 gradient / inline-flex / box-shadow 检测
- `/dev/style-fidelity` 调试页
- golden copy snapshot、preview-copy parity、orchestrator layout 单测

**没做：**

- S7-STORY-007 原 close-readiness 文档流
- 全量 97 variant 逐个 polish
- 微信公众号后台手工粘贴（PO）
- merge 至 sprint / release

## 4. 修改文件

- `src/config/miaopian-preset-bundles.ts`
- `src/config/miaopian-typography.ts`
- `src/core/copy/copy-safe-html.ts`
- `src/core/copy/title-block-copy.ts`
- `src/core/styles/style-orchestrator-rules.ts`
- `src/fixtures/r1-golden/index.ts`
- `src/lib/style-fidelity-debug.ts`
- `tests/core/copy/title-heading-copy-renderer.test.ts`
- `docs/agile/sprint-backlog.md`
- `docs/agile/decisions.md`
- `docs/agile/paste-qa/r1-golden-paste-qa.md`

## 5. 新增文件

- `docs/agile/audits/r1-style-fidelity-stabilization-audit.md`
- `docs/product/r1-style-quality-baseline.md`
- `tests/fixtures/articles/r1-golden-*.json`（3）
- `tests/fixtures/articles/r1-golden.ts`
- `src/core/copy/title-heading-copy-styles.ts`
- `src/core/styles/style-orchestrator-article-layout.ts`
- `src/app/dev/style-fidelity/*`
- `tests/fixtures/articles/r1-golden-copy-snapshot.test.ts`
- `tests/core/styles/preview-copy-token-parity.test.ts`
- `tests/core/styles/style-orchestrator-article-layout.test.ts`

## 6. 阅读但未修改的关键文件

- `src/core/renderer/preview-visual-styles.ts`
- `src/core/generation/style-selection.ts`
- `src/server/generation/run-generate-stream-flow.ts`
- `docs/agile/paste-qa/`（既有 33-variant 记录）

## 7. 关键变更说明

| 区域 | 说明 |
|------|------|
| 审计 | Preview 仍有 CSS 变量/Tailwind 壳层；Copy 曾用 gradient；97 registry variants vs 有限 paste QA |
| 默认 preset | `business`：lead/highlight/cta 等偏 plain/inline；typography 16px / lh 1.75 |
| Copy | title/heading 装饰改 table + 实色 bar；badge/icon 用 inline-block |
| RLAYOUT | title≠首 heading 同族、强视觉不三连、卡片比例、尾部 CTA、divider 节制等 |
| Debug | `/dev/style-fidelity`；避免 `@/core/generation` barrel 拉入 `node:fs` |

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| 审计先行 | PASS | `docs/agile/audits/r1-style-fidelity-stabilization-audit.md` |
| R1 baseline | PASS | `docs/product/r1-style-quality-baseline.md` |
| Golden fixtures | PASS | `tests/fixtures/articles/r1-golden-*.json` |
| 默认 variant 闭环 | PASS（代码） | preset + title copy；非全 97 variant |
| Copy snapshot | PASS | 4/4 golden copy tests |
| Preview/Copy parity | PASS | `preview-copy-token-parity.test.ts` |
| Copy 违禁 CSS | PASS | 自动化扫描 |
| 809 tests + build | PASS | 本轮 |
| 微信粘贴 QA | **FAIL/N/A** | **Not Run** — Story 不得标 Done |

## 9. Variants / 完成度分轨

### 修了哪些（默认 `business` 路径 + Copy）

| Block | 默认 variant（preset） | Preview | Copy snapshot |
|-------|----------------------|---------|---------------|
| title | `title_bottom_line_editorial`（等 preset 默认） | 既有 | **Done** — copy-safe |
| lead | `lead_plain_intro` | 既有 | 随 golden |
| heading | `heading_plain_minimal` / 编排组合 | 既有 | **Done** — 无 gradient |
| paragraph | `paragraph_plain_body` | 既有 | 随 golden |
| info_card | plain 系默认 | 既有 | 随 golden |
| highlight | `highlight_inline_emphasis` | 既有 | 随 golden |
| quote | plain 系 | 既有 | 随 golden |
| list | plain 系 | 既有 | 随 golden |
| cta | `cta_plain_footer` | 既有 | 随 golden |
| divider / image_placeholder | preset 默认 | 既有 | 随 golden |

### Done（代码）

- RLAYOUT orchestrator、golden fixtures、copy-safe title/heading、copy-safe-html 规则、debug 页、相关单测

### Done（粘贴 QA）

- **无**（`r1-golden-paste-qa.md` 全部为 **Not Run**）

### 仍可能失败（待 PO 手测）

- 公众号编辑器对 table 装饰、字号、卡片背景的还原度
- Preview 与粘贴的「肉眼一致」未验证

### 下一轮最小剩余问题

1. PO 按 `r1-golden-paste-qa.md` 手测 `r1-golden-default-article` → PASS/FAIL
2. FAIL 项写入 `bugs.md` 并针对性修 Copy/Preview token（仍不扩 variant）
3. 若 PASS：007A 代码轨可建议合并 sprint；粘贴 QA 轨单独关闭 AC-8

## 10. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `npm run test` | PASS | 809 tests |
| `npm run build` | PASS | 含 `/dev/style-fidelity` |

## 11. 未完成事项

- 微信公众号粘贴 QA（AC-8）
- merge `feature/s7-story-007a-r1-style-fidelity` → sprint（待用户确认）
- 非默认 preset 的 Copy/粘贴矩阵（归 Sprint 8）

## 12. 风险与阻塞

- Preview 外层 Tailwind 与 Copy inline 仍可能「浏览器好看、粘贴略差」
- 仅修默认路径；Gallery 手选重装饰 variant 仍可能粘贴风险

## 13. 需要用户 / ChatGPT 审查的问题

- 007A 是否可在「粘贴 QA Not Run」下 merge sprint（建议：可 merge 代码，Story 保持 In Review 直至 AC-8）
- `business` 默认 variant 组合是否满足 PO 审美（需 `/gallery` 或 `/dev/style-fidelity` 肉眼）

## 14. 建议下一步

1. 手测粘贴并更新 `paste-qa/r1-golden-paste-qa.md`
2. 用户确认后 merge 工作分支至 `sprint/s7-wechat-article-experience`
3. Sprint 7 关闭前评估是否恢复轻量 S7-STORY-007 或并入 Sprint 8

## 15. Commit

- Commit hash：（见本轮 `git commit` 后更新）
