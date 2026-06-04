# Execution Report：S7-STORY-007B · R1 Golden Paste QA 与默认路径二次修复

## 1. 基本信息

- 日期：2026-06-02
- 当前分支：`feature/s7-story-007a-r1-style-fidelity`
- 来源分支：`sprint/s7-wechat-article-experience`
- 目标合并分支：`sprint/s7-wechat-article-experience`
- Sprint：Sprint 7
- 关联：S7-STORY-007B · DECISION-086 · BUG-001 · S7-STORY-007A（In Review）
- 状态：**In Progress**（粘贴 QA 待 PO）

## 2. 本轮目标

完成 `r1-golden-default-article` 粘贴 QA 流程登记，并修复已识别的默认路径 Copy FAIL（不新增 variant）。

## 3. 默认 preset 审计结论

| 问题 | 结论 |
|------|------|
| 真实默认成稿用 `business` 还是 `classic-news`？ | **Canonical = `business`**（`SAFE_STYLE_PRESET_ID`、`DEFAULT_PREVIEW_STYLE_CONTROL`、空首页表单 → `resolveMiaopianPresetId` → `business`） |
| `classic-news` 角色 | **Legacy alias only**（`LEGACY_PRESET_ID_ALIASES` → `business`） |
| 是否已有 Decision？ | DECISION-083 已替换旧 id；本轮补 **DECISION-086** 明确禁止文档/代码/fixture 三套 preset 分裂 |
| Golden fixture | `presetId: business`, `themeId: businessBlue` — 与生成一致 |

## 4. `/dev/style-fidelity` Preview 验收入口修复（007B 续）

### 为何 007B report 写「有 Preview」但 PO 看不到

| 原因 | 说明 |
|------|------|
| **错误实现** | `StyleFidelityDebugClient` 为 `"use client"`，在浏览器内调用 `buildGoldenPreviewReport` → `renderGoldenPreviewHtml(**未走 style 管线**的 raw fixture)`，输出 raw HTML 字符串 + `dangerouslySetInnerHTML` + `prose` class，**不是** `ArticlePreviewPanel` |
| **与 Copy 不一致** | Copy 走 `generateDeterministicStyleSelection`；旧 Preview 仅 `resolveArticleStyle(raw article)`，variant/装饰与真实生成页不一致 |
| **可能整页 404** | `NODE_ENV === "production"` 时 `notFound()`；若用 `npm start`（非 dev）且未设 `STYLE_FIDELITY_DEBUG=1`，路由直接 404 |
| **错误 dev 端口** | 本机 3000 可能是其它 Next 项目；本项目 dev 常为 **3001**（3000 占用时） |

### 本轮修复

1. **Server Component** `page.tsx`：`buildStyleFidelityPageData(fixture)` 在服务端执行  
2. **同一管线**：`renderArticlePreviewClient`（与 `/preview`、`/gallery` 相同）+ `business` / `businessBlue`  
3. **左栏 Preview**：`ArticlePreviewPanel` + `data-testid="style-fidelity-preview-panel"`  
4. **右栏**：preset/theme、block 表、Copy safe、Copy HTML 摘要、复制按钮  
5. **fixture 切换**：`?fixture=` + `force-dynamic`  
6. **生产本地调试**：`STYLE_FIDELITY_DEBUG=1 npm start`（默认 `npm start` 仍 404）

**复现验证（2026-06-02）：** `http://localhost:3001/dev/style-fidelity?fixture=r1-golden-default-article` → 可见 title/lead/heading/paragraph/list/quote/highlight/info_card/divider/image_placeholder/cta。

## 5. 粘贴 QA 状态

| 轨道 | 状态 |
|------|------|
| **Done（代码）** | BUG-001 修复；812 tests + build PASS；paste-qa / bugs 已登记 |
| **Done（粘贴 QA）** | **未完成** — 汇总 **In Progress**，分项 **Pending PO**（见 `paste-qa/r1-golden-paste-qa.md`） |

**说明：** Cursor 无法登录微信公众号后台完成真实粘贴；已修复 P0 代码缺陷（字体栈截断），需 PO 按文档手测后将 Pending PO → PASS/FAIL。

## 6. FAIL 项与修复

| ID | 问题 | 修复 |
|----|------|------|
| BUG-001 | `font-family` 双引号截断 `style=""` | `copy-typography.ts` + `inline-style.ts`；正文/列表/卡片/quote/cta/highlight Copy 补 `fontFamily` |

## 7. 修改摘要

- `src/core/copy/copy-typography.ts`（新）
- `src/core/copy/inline-style.ts`
- `src/core/copy/text-block-copy.ts` + list/info-card/highlight/quote/cta
- `src/core/renderer/*-typography`（text/list/info-card/highlight/quote/cta）
- `/dev/style-fidelity` 双栏 Preview（`ArticlePreviewPanel` + 与 /preview 同管线）
- `docs/agile/paste-qa/r1-golden-paste-qa.md`、`bugs.md`、DECISION-086、sprint-backlog 007B
- 测试：`copy-typography.test.ts`、`r1-golden-copy-inline-typography.test.ts`、snapshot 断言增强

- `src/app/dev/style-fidelity/page.tsx` — Server 构建 data + `force-dynamic`
- `src/app/dev/style-fidelity/style-fidelity-debug-client.tsx` — 双栏 + `ArticlePreviewPanel`
- `src/lib/style-fidelity-env.ts` — dev / `STYLE_FIDELITY_DEBUG=1` 开关
- `tests/lib/style-fidelity-debug.test.ts`

## 8. 运行检查

| 命令 | 结果 |
|------|------|
| `npm run test` | PASS（813） |
| `npm run build` | PASS |

## 9. 未完成 / 风险

- PO 公众号粘贴复验（AC-3）

## 10. 建议下一步

1. PO：确认使用 **`npm run dev`**（见终端 Local URL，常为 3001）打开 `/dev/style-fidelity`
2. PO：左侧确认 Preview 完整 → 右侧复制 → 粘贴公众号 → 更新 `r1-golden-paste-qa.md`
3. 若全部 PASS：007B AC-3 关闭，007A/007B 可建议 merge sprint（仍不自动 merge）
4. 若 FAIL：在 `bugs.md` 追加条目，继续本分支最小修复

## 11. Commit

- 未提交 / not committed（待用户确认后 commit）
