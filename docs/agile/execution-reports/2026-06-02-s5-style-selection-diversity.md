# Execution Report：Article-aware 样式多样性 + Heuristic 修复

## 1. 基本信息

- 日期：2026-06-02
- 当前分支：`feature/s5-generate-ui-main-flow`
- 关联 Story：S5-STORY-007 follow-up
- 状态：In Review

## 2. 问题

用户反馈 Preview 视觉层补全后仍样式单一：除标题字号外几乎无颜色/布局/装饰差异。

## 3. 根因

1. **样式选择**：`pickRegisteredVariantForBlock` 几乎总落到 preset plain variant（`paragraph_plain_body` 等），因 `resolveHeuristicVariantId` 在无 tone 匹配时仍 `return heuristics.default`，阻断 article-aware 多样性逻辑。
2. **Preview 已按 layout 映射**，但 plain layout 本身装饰极少；需从 Style Selection 分配装饰性 variant。

## 4. 修复

- 新增 `style-selection-diversity.ts`：按 block 类型 + 文内序号轮换 Release 1 装饰 variant；首段 title/lead 强制 editorial/accent band；density light/strong 分支。
- 修复 `resolveHeuristicVariantId`：无显式 tone/density 命中时返回 `undefined`，交给 diversity / preset。
- 更新 `buildStyleSelectionBlockHints` 传入 `indexWithinType`。
- 新增测试 `style-selection-diversity.test.ts` + 扩展 `style-selection.test.ts`。

## 5. 验证

- test：739 PASS
- lint / build：PASS

## 6. Commit

- 未提交 / not committed
