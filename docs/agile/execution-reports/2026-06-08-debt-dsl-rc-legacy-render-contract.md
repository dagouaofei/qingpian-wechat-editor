# Execution Report：DEBT-DSL-RC Legacy renderContract 双轨渲染归档

## 1. 基本信息

- **日期：** 2026-06-08
- **当前分支：** `feature/s10-story-011-integration-readiness`
- **关联：** DECISION-110 · S10-STORY-013 · DEBT-DSL-RC-001~006
- **状态：** Done（仅文档 · 无代码修复）

## 2. 本轮目标

将 Registry `title_block_v1` Preview/Copy 双轨（React vs `renderPublish*`）记录为历史架构债务，**本轮不解决**。

## 3. 审计结论

- **是**，仍存在大量类似路径：11 个 first-wave title/heading release1 variant + 8 个 `renderPublish*` copy builder
- html_paste / Harvest **`tree` 路径为目标形态**，与 registry renderContract 路径并存
- 用户侧虽统一经 DSL Decoder，但 DB DSL 无 tree 时仍落入 legacy 双轨

## 4. 新增/修改文档

- **新增** `docs/architecture/variant-dsl-legacy-render-contract-debt.md`
- **更新** `decisions.md`（DECISION-110）· `bugs.md` · `changelog.md` · `sprint-backlog.md`（S10-STORY-013）· `article-variant-dsl-runtime.md`

## 5. commit hash

未提交 / not committed（提交后更新）
