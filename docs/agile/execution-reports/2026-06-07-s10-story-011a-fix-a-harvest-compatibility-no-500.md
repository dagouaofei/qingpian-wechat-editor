# Execution Report：S10-STORY-011A FIX-A Harvest Compatibility No 500

## 1. 基本信息

- 日期：2026-06-07
- 当前分支：`feature/s10-story-011a-dsl-runtime-encoder-decoder`
- 来源分支：`sprint/s10-db-backed-style-admin-v1`
- 目标合并分支：`sprint/s10-db-backed-style-admin-v1`
- Sprint：Sprint 10 — Database-backed Style Admin v1
- 关联 Story / Bug / Decision：S10-STORY-011A · FIX-A（Harvest Detect / Encoder 不应因 WeChat Compatibility issues 直接 500）
- 执行者：Cursor
- 状态：In Review

## 2. 本轮目标

修复 `/admin/style-library/harvest` Detect / Preview Candidate 将 WeChat compatibility Yellow/Red issues 当作 hard failure 导致 500 的问题；改为返回结构化 `issues` / `warnings` / `lossReport` / `canCreateCandidate`，页面展示风险而非抛错。

## 3. 执行范围

**做了：**

- Encoder：`encodeHtmlToVariantDsl` 仅在 `no_extractable_text` 时 `ok: false`；Yellow/Red compatibility 进入 issues，不阻断 DSL 生成
- Harvest extract 共享层：`extract-harvest-candidate-shared.ts` · `harvest-compatibility.ts` severity 映射
- `extract-heading-candidate` / `extract-info-card-candidate` 不再 throw
- `build-candidate-variant` / `previewHtmlHarvestCandidate` / `createHtmlHarvestCandidate` 结构化返回
- `previewHtmlHarvestAction` try/catch 安全兜底
- Harvest UI：compatibility issues · loss report · guidance · canCreateCandidate
- 回归测试（含用户复杂 heading HTML fixture）
- lint / test / build

**没做：**

- Promote candidate · 自动 userSelectable
- 修复所有 compatibility risk 本身
- OSS 截图对比 · AI 生成 DSL · DOM 反向编码
- merge sprint / release / main
- commit（待用户确认）

## 4. 修改文件

- `src/core/dsl/encoder/html-to-variant-dsl.ts`
- `src/server/style-admin/harvest/extract-heading-candidate.ts`
- `src/server/style-admin/harvest/extract-info-card-candidate.ts`
- `src/server/style-admin/harvest/build-candidate-variant.ts`
- `src/server/style-admin/harvest/html-harvest-types.ts`
- `src/server/style-admin/harvest/sanitize-harvest-html.ts`
- `src/server/style-admin/harvest/create-html-harvest-candidate.ts`
- `src/server/style-admin/harvest/index.ts`
- `src/server/style-admin/actions/html-harvest-candidate.ts`
- `src/app/admin/(protected)/style-library/harvest/harvest-form.tsx`
- `docs/agile/sprint-backlog.md`
- `docs/agile/changelog.md`

## 5. 新增文件

- `src/server/style-admin/harvest/extract-harvest-candidate-shared.ts`
- `src/server/style-admin/harvest/harvest-compatibility.ts`
- `tests/server/style-admin/harvest/harvest-compatibility-no-500.test.ts`
- `docs/agile/execution-reports/2026-06-07-s10-story-011a-fix-a-harvest-compatibility-no-500.md`

## 6. 阅读但未修改的关键文件

- `src/core/wechat-compatibility/wechat-compatibility-spec.ts`
- `src/core/wechat-compatibility/compatibility-transformer.ts`
- `src/core/wechat-compatibility/compatibility-validator.ts`
- `src/app/admin/(protected)/style-library/harvest/actions.ts`
- `tests/server/style-admin/harvest/build-candidate-variant.test.ts`
- `tests/server/style-admin/harvest/create-html-harvest-candidate.test.ts`

## 7. 关键变更说明

1. **分离 blockType detection / DSL encoding / compatibility validation**：Harvest Detect 阶段尽量编码结构保真 DSL，compatibility 作为风险报告而非早期硬拒绝器。
2. **`HarvestIssueSeverity`**：`info` · `warning` · `risk` · `blocking`；仅 `blocking`（如 `no_extractable_text`）阻止创建 candidate，但页面仍返回可读错误，不 500。
3. **security sanitize**：`buildSanitizeLossReport` 记录 script / onclick 移除至 `lossReport`（`security_removed`）。
4. **Create candidate**：warning/risk 允许创建 · `qualityStatus=not_checked` · distribution 全 false · `compatibilityJson.harvestCompatibility` 持久化。

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| 复杂 heading HTML detect 不 500 | PASS | 回归测试 + 结构化 preview |
| detectedBlockType=heading | PASS | 用户 fixture |
| flex/section/letter-spacing/nesting/span issues | PASS | issues 非空且含 risk/warning |
| candidate draft 可生成 | PASS | `canCreateCandidate=true` |
| qualityStatus 初始 not_checked | PASS | persist 路径未改 |
| userSelectable=false | PASS | distribution 全 false |
| script/onclick → lossReport | PASS | `security_removed` |
| 无有效内容 → blocking 不 throw | PASS | `encode_blocked` 结构化 |
| previewHtmlHarvestAction 安全返回 | PASS | try/catch + 测试 |
| harvest 页面展示 issues | PASS | UI sections 已加 |
| lint / test / build | PASS | 1179 tests · build OK |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `corepack pnpm test` | PASS | 1179 passed |
| `corepack pnpm lint` | PASS | 0 errors · 28 pre-existing warnings |
| `corepack pnpm build` | PASS | Next.js production build OK |

## 10. 本地回归验收路径

1. 打开 `http://localhost:3000/admin/style-library/harvest`
2. 粘贴用户复杂 heading HTML（见 `COMPLEX_HEADING_HTML` fixture）
3. 点击 **Detect blockType**
4. 预期：
   - 页面不 500
   - `detectedBlockType=heading`
   - Compatibility issues / loss report 可见
   - Candidate draft summary 可见
   - `canCreateCandidate=true` · `qualityStatus=not_checked` · `userSelectable=false`
   - 可继续创建 candidate（需 admin write enabled + sourceLabel）

## 11. 未完成事项

- 本地浏览器 E2E 未在本轮自动执行（需用户手动验收上述路径）
- S10-STORY-011A AC-8 Promote eligibility DSL renderability check（依赖 011）
- 未 commit / 未 merge

## 12. 风险与阻塞

- compatibility issues 数量可能较多，运营需依赖 S10-STORY-010 Preview/Copy/Validator 后续 gate
- 复杂 flex layout 仍保留在 DSL 中（记录 risk），Paste QA 前不应 promote

## 13. 需要用户 / ChatGPT 审查的问题

- Harvest UI issues 列表是否需要按 severity 分组或折叠？
- `blocking` 与 `risk` 的边界是否符合运营预期（当前 Contract Red 多为 `risk`）？
- 是否在本轮或下一轮单独 commit FIX-A Harvest，或与 011A 主体一并提交？

## 14. 建议下一步

1. 用户本地验收 harvest 页面（复杂 heading HTML）
2. ChatGPT 审查本 execution report
3. 用户确认后 commit → merge 至 `sprint/s10-db-backed-style-admin-v1`
4. 继续 S10-STORY-011A 剩余 AC-8 或 S10-STORY-011 Promote 收口

## 15. Commit

- Commit hash：未提交 / not committed
