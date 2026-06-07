# Execution Report：S10-STORY-011 Harvest WeChat Compatibility Spec Mode

## 1. 基本信息

- 日期：2026-06-07
- 当前分支：`feature/s10-story-011-promote-user-selectable-final`
- 来源分支：`sprint/s10-db-backed-style-admin-v1`
- 目标合并分支：`sprint/s10-db-backed-style-admin-v1`（**本轮不 merge**）
- Sprint：Sprint 10
- 关联 Story：S10-STORY-011（Harvest 诊断开关）
- 执行者：Cursor
- 状态：**In Review**

## 2. 本轮目标

新增 `STYLE_HARVEST_WECHAT_COMPATIBILITY_MODE`（off / report / enforce），用于诊断 WeChat Compatibility Spec 是否过度保守导致 Harvest DSL 保真损失。

## 3. 执行范围

**做了：**

- `getHarvestWechatCompatibilityMode()` · 默认 `report` · 非法值 fallback
- `applyWechatCompatibilityForHarvest()` 接入 Encoder + Harvest extract
- Harvest 页 banner 展示当前 mode 与说明
- `wechatCompatibilityMode` 写入 harvestMeta / compatibilityJson / trace
- Promote readiness `compatibilityStatus`（pass / failed / skipped / not_enforced）
- Candidate detail 展示 `wechatCompatibilityMode`
- 定向测试 10 项 + build

**没做：**

- 不重写 WeChat Compatibility Spec
- 不 merge sprint / release / main
- 不接生产 RDS

## 4. 修改文件

- `src/core/wechat-compatibility/harvest-compat-mode.ts`（新增）
- `src/core/wechat-compatibility/index.ts`
- `src/core/dsl/encoder/encoder-types.ts`
- `src/core/dsl/encoder/html-to-variant-dsl.ts`
- `src/core/dsl/runtime/dsl-trace-types.ts`
- `src/server/style-admin/harvest/harvest-compatibility-mode.ts`（新增）
- `src/server/style-admin/harvest/extract-harvest-candidate-shared.ts`
- `src/server/style-admin/harvest/create-html-harvest-candidate.ts`
- `src/server/style-admin/harvest/harvest-trace.ts`
- `src/server/style-admin/harvest/html-harvest-types.ts`
- `src/server/style-admin/harvest/index.ts`
- `src/lib/dsl-runtime/read-harvest-compatibility-mode.ts`（新增）
- `src/lib/dsl-runtime/validate-variant-dsl-runtime-readiness.ts`
- `src/server/style-admin/promote/candidate-promote-runtime-readiness.ts`
- `src/app/admin/(protected)/style-library/harvest/page.tsx`
- `src/app/admin/(protected)/style-library/harvest/harvest-form.tsx`
- `src/app/admin/(protected)/style-library/candidate-inspection-*`
- `src/app/admin/(protected)/style-library/candidate-promote-*`
- `.env.example`
- 文档：`wechat-compatibility-spec.md` · `article-variant-dsl-runtime.md` · sprint10 · changelog · sprint-backlog

## 5. 新增文件

- `src/core/wechat-compatibility/harvest-compat-mode.ts`
- `src/server/style-admin/harvest/harvest-compatibility-mode.ts`
- `src/lib/dsl-runtime/read-harvest-compatibility-mode.ts`
- `tests/server/style-admin/harvest/harvest-compatibility-mode.test.ts`

## 6. 关键决策

1. **sanitize 与 spec 分离：** `sanitizeHarvestHtml` 始终在 Harvest 入口执行；mode 仅控制 compatibility transform / analyzer。
2. **默认 report：** 开发阶段报告 issues 但不降级；用户可设 `off` 做保真对比实验。
3. **Promote gate：** `mode=off` → `compatibilityStatus=skipped`，不阻断 promote；UI 显示 warning「Paste QA required」。

## 7. 验收标准

| AC | 结果 |
|----|------|
| mode 默认 report | PASS |
| off 仍 sanitize script/onclick | PASS |
| off 无 spec transform loss | PASS |
| report 有 issues 无 downgrade loss | PASS |
| enforce 有 tag downgrade | PASS |
| trace/metadata 含 mode | PASS |
| Harvest UI 展示 mode | PASS（需 dev 目视） |
| 定向测试 + build | PASS |

## 8. 运行检查

| 命令 | 结果 |
|------|------|
| `npm run test -- tests/server/style-admin/harvest …` | PASS（50 tests） |
| `npm run build` | PASS |

## 9. 本地验收步骤

```bash
export STYLE_HARVEST_WECHAT_COMPATIBILITY_MODE=off
# 重启 dev → /admin/style-library/harvest
# 粘贴 complex + bordered HTML → 确认 mode=off · DSL 更接近原 HTML

export STYLE_HARVEST_WECHAT_COMPATIBILITY_MODE=report
# 重启 dev → 确认 issues 展示但不硬降级
```

## 10. Commit

- **未提交 / not committed**

## 11. 建议下一步

1. 用户本地 off vs report 对比 complex heading 保真
2. 与 FIX-A 一并审查后 commit
3. 根据诊断结果决定是否调整 Spec（另开 Story）
