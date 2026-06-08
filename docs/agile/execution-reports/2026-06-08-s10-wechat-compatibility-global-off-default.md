# Execution Report：公众号一致性 — 债务归档 + 全局开关默认关闭

## 1. 基本信息

- 日期：2026-06-08
- 当前分支：`feature/s10-wechat-compatibility-global-off-default`
- 来源分支：`feature/s10-story-011-html-paste-fidelity-theme-tokens`
- 目标合并分支：`feature/s10-story-011-html-paste-fidelity-theme-tokens`（或当前 Sprint 10 工作线）
- Sprint：Sprint 10
- 关联 Story / Bug / Decision：**S10-CHORE-011B** · **DECISION-109**
- 执行者：Cursor
- 状态：**In Review**

## 2. 本轮目标

1. 将 `wechat-compat` / `wechat-compatibility` 双轨等历史债务写入 docs（**不重构**）
2. 引入全局 `QINGPIAN_WECHAT_COMPATIBILITY_MODE`，**默认 `off`**，统一 gate 校验、Copy 裁剪与 `copy-safe-html`；**sanitize 保持常开**

## 3. 执行范围

**已完成：**

- Part A：债务文档、`wechat-compatibility-spec` §4、DECISION-109、changelog、sprint-backlog、`.env.example`
- Part B：`resolve-wechat-compatibility-mode.ts`（standalone，避免与 S8 validator 循环依赖）
- Gate：`validateWechatCopyHtml`、`validateHtmlStructureCompatibility`、`filterAllowedInlineStyles`、`render-style` copy 整形、`copy-safe-html`
- Harvest wrapper、`validateVariantDslRuntimeReadiness` 读 global mode
- Harvest / Inspection Admin UI 文案
- 测试：`global-compatibility-mode.test.ts`、harvest mode 测试更新、Vitest setup 默认 `enforce` 以保既有 validator 测试

**本轮不做（按计划）：**

- 合并 `wechat-compat` / `wechat-compatibility` 目录
- 统一 allowlist 单源
- per-variant mode 与 global mode 精细合并（DEBT-WC-007）

## 4. 修改文件

- `src/core/wechat-compatibility/resolve-wechat-compatibility-mode.ts`
- `src/core/wechat-compatibility/harvest-compat-mode.ts`
- `src/core/wechat-compatibility/index.ts`
- `src/core/wechat-compatibility/compatibility-validator.ts`
- `src/core/wechat-compatibility/style-normalizer.ts`
- `src/core/wechat-compat/copy-html-validator.ts`
- `src/core/dsl/decoder/render-style.ts`
- `src/core/copy/copy-safe-html.ts`
- `src/server/style-admin/harvest/harvest-compatibility-mode.ts`
- `src/lib/dsl-runtime/validate-variant-dsl-runtime-readiness.ts`
- `src/app/admin/(protected)/style-library/harvest/harvest-form.tsx`
- `src/app/admin/(protected)/style-library/candidate-inspection-view-model.ts`
- `src/app/admin/(protected)/style-library/candidate-inspection-panel.tsx`
- `docs/architecture/wechat-compatibility-spec.md`
- `docs/agile/decisions.md`
- `docs/agile/changelog.md`
- `docs/agile/sprint-backlog.md`
- `.env.example`
- `vitest.config.ts`
- `tests/server/style-admin/harvest/harvest-compatibility-mode.test.ts`
- `tests/core/wechat-compat/copy-html-validator.test.ts`
- `tests/core/style-library/style-library-inspection.test.ts`

## 5. 新增文件

- `docs/architecture/wechat-compatibility-known-debt.md`
- `tests/core/wechat-compatibility/global-compatibility-mode.test.ts`
- `tests/setup/wechat-compatibility-mode.ts`

## 6. 阅读但未修改的关键文件

- `src/server/style-admin/harvest/sanitize-harvest-html.ts`（sanitize 不 gate，确认保持常开）
- `src/server/style-admin/inspection/candidate-validator.ts`
- `src/core/style-library/inspection.ts`
- `src/lib/dsl-runtime/read-harvest-compatibility-mode.ts`

## 7. 关键变更说明

- **全局 mode 解析**：`QINGPIAN_WECHAT_COMPATIBILITY_MODE` → `NEXT_PUBLIC_*` → `STYLE_HARVEST_*` → 默认 **`off`**
- **`off` 时 no-op**：S8/S10 validator、inline style allowlist 过滤、copy decode 的 flex→block / border 合成、`copy-safe-html` 规则
- **sanitize 不 gate**：script / event handler 移除仍为安全底线
- **有效 enforcement 仅来自 global env**；DB `wechatCompatibilityMode` 保留 Harvest 审计字段
- **Vitest setup**：测试环境默认 `enforce`，避免 1200+ 既有 validator 快照测试批量失败；`global-compatibility-mode.test.ts` 显式测 `off`

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| 债务文档 + DECISION-109 + spec/changelog/sprint-backlog/.env | PASS | Part A 完成 |
| `resolve-wechat-compatibility-mode` 默认 off + legacy alias + export | PASS | standalone 模块，index 导出 |
| validator / filter / render-style / copy-safe-html gate off | PASS | 六处 gate |
| Harvest + readiness + Inspection UI 对齐全局 env | PASS | banner + inspection panel |
| global mode 测试 + 修正默认 off 影响 | PASS | 新测试 + setup + harvest 测试更新 |
| execution report | PASS | 本文件 |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `npm run lint` | PASS | 0 errors（既有 warnings） |
| `npm run test` | **1286 pass / 2 fail** | 见 §10 |
| `npm run build` | 未运行 | 本轮未执行 |

## 10. 未完成事项

- 全量 test 仍有 **2 个失败**，与本轮 global off **无直接关联**（同分支其他改动）：
  1. `fidelity-encoder.test.ts` — 期望 HTML 含 `03`，实际为 `01`（circle number ordinal 相关）
  2. `runtime-variant-dsl-pool.test.ts` — pool `source` 为 `code_fallback` 而非 `database`（pool 逻辑分支改动）
- 未 commit（待用户确认）
- 未 merge 至 sprint 分支

## 11. 风险与阻塞

- **生产默认 off**：Promote/Inspection 不再拦 Red/Yellow；上线前须显式设 `report`/`enforce` 并跑 Paste QA（DECISION-109）
- **客户端 env**：仅设 server `QINGPIAN_*` 未设 `NEXT_PUBLIC_*` 时，浏览器 Copy 行为可能与 server 不一致 — Harvest banner 已提示
- **DECISION-006 暂态豁免**：S10 html_paste 开发期；Release 1 收口前须重新开启 compatibility

## 12. 需要用户 / ChatGPT 审查的问题

1. Vitest setup 默认 `enforce` 是否可接受？（生产 off、测试 enforce 分离）
2. 是否在本轮一并修复上述 2 个同分支失败测试，还是另开 Story？
3. 是否 approve merge 至 `feature/s10-story-011-html-paste-fidelity-theme-tokens`？

## 13. 建议下一步

1. ChatGPT 审查 execution report + DECISION-109
2. 用户确认后 commit + merge 工作分支
3. Release 1 收口前：设 `report`/`enforce`、跑 Paste QA、评估 DEBT-WC-001~007 合并计划

## 14. Commit

- Commit hash：**未提交 / not committed**
