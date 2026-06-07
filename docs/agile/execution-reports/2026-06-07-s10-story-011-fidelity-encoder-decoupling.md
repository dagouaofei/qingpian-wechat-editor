# Execution Report：S10-STORY-011 Fidelity Encoder / Decoder + Compatibility Decoupling

## 1. 基本信息

- 日期：2026-06-07
- 当前分支：`feature/s10-story-011-promote-user-selectable-final`
- 来源分支：`sprint/s10-db-backed-style-admin-v1`
- 目标合并分支：`sprint/s10-db-backed-style-admin-v1`
- Sprint：Sprint 10
- 关联 Story / Bug / Decision：S10-STORY-011（In Review / checkpoint）
- 执行者：Cursor
- 状态：In Review

## 2. 本轮目标

将 Encoder / Decoder 改为 fidelity-first，把 WeChat Compatibility 分析 / 转换从编码主链路解耦；`mode=off` 仅 sanitize + 保真 encode，不再产出 compatibility downgrade loss。

## 3. 执行范围

**做了：**

- 新增 fidelity DOM→DSL tree encoder（`fidelity-html-tree.ts`）
- `html-to-variant-dsl.ts` 重构为 v4 fidelity encoder，移除 semantic normalized tree / compatibility 混入
- `heading-semantic-extractor` 增加 metadata-only 路径（不产出 structural downgrade loss）
- 新增 `compatibility-analyzer.ts`（仅分析）
- Harvest pipeline：`definitionJson` 保持干净；loss / issues 写入 `compatibilityJson` 与 preview 分层字段
- Decoder：preview 目标 fidelity 输出全部 inline style；移除 decode 阶段的 compatibility 阻断
- Harvest UI：区分 Sanitize loss / Encoder loss / Compatibility transform loss / Compatibility issues
- 定向测试：fidelity encoder、harvest compatibility mode、bordered heading、全 harvest 目录

**没做：**

- 不 merge sprint / release / main
- 不关闭 Sprint 10
- 不重写完整 WeChat Compatibility Spec
- 未跑全量 lint / build（按指令仅定向 test）

## 4. 修改文件

- `src/core/dsl/encoder/html-to-variant-dsl.ts`
- `src/core/dsl/encoder/heading-semantic-extractor.ts`
- `src/core/dsl/encoder/encoder-types.ts`
- `src/core/dsl/decoder/decode-variant-dsl.ts`
- `src/core/dsl/decoder/render-style.ts`
- `src/core/dsl/decoder/render-tree.ts`
- `src/core/wechat-compatibility/harvest-compat-mode.ts`
- `src/core/wechat-compatibility/index.ts`
- `src/server/style-admin/harvest/extract-harvest-candidate-shared.ts`
- `src/server/style-admin/harvest/build-candidate-variant.ts`
- `src/server/style-admin/harvest/create-html-harvest-candidate.ts`
- `src/server/style-admin/harvest/html-harvest-types.ts`
- `src/app/admin/(protected)/style-library/harvest/harvest-form.tsx`
- `src/lib/dsl-runtime/read-harvest-compatibility-mode.ts`
- `tests/core/dsl/bordered-heading-fix-a.test.ts`
- `tests/server/style-admin/harvest/harvest-compatibility-mode.test.ts`

## 5. 新增文件

- `src/core/dsl/encoder/fidelity-html-tree.ts`
- `src/core/wechat-compatibility/compatibility-analyzer.ts`
- `tests/core/dsl/encoder/fidelity-encoder.test.ts`

## 6. 阅读但未修改的关键文件

- `src/core/wechat-compatibility/compatibility-transformer.ts`
- `src/core/wechat-compatibility/compatibility-validator.ts`
- `src/server/style-admin/harvest/harvest-trace.ts`
- `src/core/dsl/encoder/bordered-heading-extractor.ts`
- `docs/architecture/wechat-compatibility-spec.md`

## 7. 关键变更说明

1. **Encoder 主链路**：`rawHtml → sanitize（harvest 层）→ fidelity encode`；不再在 encoder 内调用 compatibility transform，也不再使用 `buildSemanticHeadingTree` 改写 tree。
2. **Variant DSL 清洁**：`definitionJson` 不再嵌入 `harvestMeta` / `encoderTrace` / `lossReport`；`meta` 仅保留 `encoderVersion`、`traceId`、`compatibilityMode`、语义 metadata。
3. **Compatibility 分层**：`off` 跳过 analyze；`report` 仅产出 `compatibilityIssues`；`enforce` 的 transform loss 单独记入 `compatibilityTransformLossReport`，不污染 fidelity DSL。
4. **Decoder**：`preview` / `admin_inspection` / `qa_snapshot` 输出全部 DSL style；不再因 flex / letter-spacing / negative margin 在 decode 阶段 fail。
5. **Slot 绑定修复**：含 `<section>` 子节点的容器不再被误判为 text slot（修复 flex 行被标成 eyebrow 的问题）。

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| mode=off 不产生 downgrade loss codes | PASS | 定向测试覆盖 |
| mode=off 保留 flex / letter-spacing / negative margin / font-size | PASS | Case A fixture |
| DSL 主体不含大量 issues / lossReport | PASS | fidelity-encoder.test |
| report 模式 DSL 与 off 一致 | PASS | harvest-compatibility-mode.test |
| enforce 才允许 transform downgrade | PASS | compatibilityTransformLossReport |
| bordered heading 保留 border 等样式 | PASS | Case B + bordered tests |
| Decoder preview 保真输出 | PASS | fidelity-encoder.test |
| Harvest UI 区分 loss 类型 | PASS | harvest-form 分区 + preview 字段 |
| sanitize 仍移除 script / onclick | PASS | 既有 harvest test |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `vitest run tests/core/dsl/encoder/fidelity-encoder.test.ts` | PASS | 6 tests |
| `vitest run tests/server/style-admin/harvest/` | PASS | 33 tests |
| `vitest run tests/core/dsl/encoder/html-to-variant-dsl.test.ts` | PASS | 2 tests |
| `vitest run tests/core/wechat-compatibility/` | PASS | 3 tests |
| `vitest run tests/core/dsl/bordered-heading-fix-a.test.ts` | PASS | 含于上面批次 |
| `pnpm lint` | 未运行 | 按指令仅定向 test |
| `pnpm build` | 未运行 | 提交前建议全量检查 |

## 10. 未完成事项

- 全量 lint / build 未在本轮执行
- `enforce` 模式 derived DSL（独立 transform result）尚未单独持久化为第二份 DSL，当前仅 transform loss 分层
- 未 commit（按用户要求）

## 11. 风险与阻塞

- `copy_wechat` decode 仍会通过 `filterAllowedInlineStyles` 过滤部分属性；与 preview 保真路径 intentionally 分离
- 旧 candidate 若 `definitionJson` 含 `harvestMeta`，read path 仍兼容；新 harvest 不再写入

## 12. 需要用户 / ChatGPT 审查的问题

- `enforce` 是否需要在 `compatibilityJson` 中额外持久化 transformed HTML / derived DSL ref（本轮仅 loss 分层）
- bordered heading `font_family_stripped` 仍记入 encoder loss（fidelity 限制），是否接受

## 13. 建议下一步

1. 本地按 Case A / B 人工验收（见用户指令第十节）
2. 全量 `pnpm lint && pnpm test && pnpm build`
3. 用户确认后 commit + 合并回 sprint 分支审查

## 14. Commit

- Commit hash：未提交 / not committed
