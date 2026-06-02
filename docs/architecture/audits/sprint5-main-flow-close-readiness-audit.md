# Sprint 5 Main Flow Close Readiness Audit

## 1. Audit 结论

- **Grade：A-**
- **P0 数量：0**
- **P1 数量：4**
- **P2 数量：3**
- **是否建议进入 Sprint 5 Close Readiness：是**
- **是否建议关闭 Sprint 5：建议用户审查确认后关闭；Cursor 本轮不关闭**
- **是否需要用户确认：是**

结论：Sprint 5 已完成 Release 1 主链路从 InputRequest → GenerationEvent / Volcengine provider → `done.article` finalization → Style Selection validation → `/generate` Preview → Copy Renderer / Clipboard payload 的代码与最小 smoke 覆盖。用户已人工验收 `/generate` 可跑通；真实 Volcengine provider 已接入且 dev-only smoke 已通过（S5-STORY-005A / 005B）。**未执行**真实微信公众号 Paste QA；**不宣称** Release 1 完成或样式质量最终达标。

## 2. Sprint 5 目标回顾

Sprint 5 目标（DECISION-066、DECISION-067、DECISION-068）：

1. 建立 Generation / Streaming 输入与事件契约
2. 对接真实 Volcengine / Doubao model provider
3. 完成 `done.article` → Article Schema 归一
4. 受控 AI 样式选择 + Sprint 3-C validation pipeline 接入
5. 在**真实业务页面** `/generate` 跑通：输入 → 生成 → 预览 → 复制
6. Sprint 5 关闭前完成 smoke / e2e 梳理与 close readiness audit

**不在 Sprint 5 范围：** 微信公众号 Paste QA（Sprint 6-B）、Style Gallery、复杂编辑器、merge `main` / `release/1`。

## 3. S5-STORY-001~008 完成情况

| Story | 摘要 | 状态 |
|-------|------|------|
| S5-STORY-001 | Sprint 5 启动与 Backlog 拆分 | Done |
| S5-STORY-002 | InputRequest / NormalizedInput | Done |
| S5-STORY-003 | GenerationEvent / SSE Runtime | Done |
| S5-STORY-004 | done.article finalization | Done |
| S5-STORY-005 | Volcengine / Doubao Provider | Done |
| S5-STORY-005A | Dev-only Real API Smoke | Done |
| S5-STORY-005B | Model Article Candidate Enrichment | Done |
| S5-STORY-006 | 受控 AI Style Selection | Done |
| S5-STORY-007 | `/generate` 真实 UI 主流程 | **Done**（用户确认；merge @ `01318c4`） |
| S5-STORY-008 | Smoke / E2E / Close Readiness | **Done**（本轮 audit） |

## 4. 主链路覆盖情况

```text
InputRequest / NormalizedInput
  → GenerationEvent stream (Volcengine | deterministic fallback)
  → done.article + enrichModelArticleCandidate
  → finalizeGenerationEvents → Article
  → generateAndApplyStyleSelection (validation pipeline)
  → StyleResolver
  → Preview Renderer (/generate UI)
  → Copy Renderer → Clipboard payload (text/html + text/plain)
```

| 环节 | 覆盖 | 证据 |
|------|------|------|
| InputRequest | PASS | `src/core/generation/input*` · S5-STORY-002 tests |
| GenerationEvent runtime | PASS | `stream.ts` · generation-event/sse tests |
| Volcengine provider | PASS | `volcengine-provider.ts` · 005A smoke PASSED |
| Article finalization | PASS | `article-finalize.ts` · done-article tests |
| Style selection | PASS | `style-selection.ts` · diversity + validation tests |
| `/generate` UI | PASS | `src/app/generate/*` · server flow + Playwright |
| Preview Renderer | PASS | first-wave preview registry + visual styles |
| Copy Renderer | PASS | first-wave copy registry + clipboard payload tests |

## 5. 测试与 Smoke 梳理

### Unit / Integration（Vitest）

| 类别 | 路径 / 说明 | 数量（本轮） |
|------|-------------|--------------|
| Generation 契约 | `tests/core/generation/*` | Input / events / provider / style / enrichment |
| Server 主链路 | `tests/server/generation/run-generate-main-flow.test.ts` | 6 cases |
| Renderer / Copy | `tests/core/renderer/*` · `tests/core/copy/*` | Sprint 4-A / 4-B 回归 |
| Style selection diversity | `tests/core/generation/style-selection-diversity.test.ts` | 5 cases |
| Preview visual styles | `tests/core/renderer/preview-visual-styles.test.ts` | 3 cases |
| **合计** | `corepack pnpm test` | **743 tests · 65 files · PASS** |

### Playwright E2E

| 文件 | 场景 | 基线 |
|------|------|------|
| `tests/e2e/generate-page.spec.ts` | 页面渲染、提交生成、预览、copy payload | deterministic fallback（`VOLCENGINE_ENABLE_REAL_PROVIDER=false`） |

本轮：`VOLCENGINE_ENABLE_REAL_PROVIDER=false corepack pnpm test:e2e` → **3 passed**

### Dev-only Real Provider Smoke

| 命令 | 说明 |
|------|------|
| `corepack pnpm smoke:volcengine-provider` | 不接入 `pnpm test` / CI；2026-06-02 PASSED |

### Manual `/generate` 验收（用户确认）

| 项 | 结果 |
|----|------|
| `http://localhost:3000/generate` 完整流程 | **通过** |
| 真实 Volcengine provider 模式生成 | **通过**（用户确认） |
| 曾发现问题与修复 | JSON 解析、Copy supportedBlockTypes（cta 等）、Preview 视觉层、style diversity |
| 后续仍需观察 | 真实 provider 稳定性、输出结构丰富度、样式质量 |

## 6. S5-STORY-007 关闭事实（Done）

`/generate` 主流程可人工跑通。S5-STORY-007 期间修复/增强包括：

1. **Copy Renderer scope**：`RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES` 传入 clipboard builder，修复 structured block（如 `cta`）报错
2. **Preview visual layer**：`preview-visual-styles.ts` 按 layout 映射公众号风格，替代统一 Tailwind 卡片
3. **Style selection diversity**：`style-selection-diversity.ts` 轮换装饰 variant，修复 heuristic 总是 fallback plain
4. **Model JSON parser**：处理 markdown fence、wrapper、`article` 根、尾随逗号、reasoning 前缀

**明确不写入 Done 结论：**

- 微信公众号 Paste QA **未**通过
- 公众号粘贴最终一致 **未**验证
- 样式质量 **未**宣称最终达标
- 真实 provider **未**宣称所有场景稳定

更多测试、provider 稳定性、样式质量、Paste QA **留后续 Sprint / Sprint 6**。

## 7. Preview / Copy 情况

| 项 | 状态 |
|----|------|
| Preview | Release 1 first-wave registry + layout 视觉映射；非 DOM 手写 block UI |
| Copy | `buildClipboardPayload` · inline style HTML + plain text |
| Paste QA | **Not Run** · 归 Sprint 6-B |
| 33 variants Paste plan | Sprint 4-B 已建立 plan · 未执行真实粘贴 |

## 8. 不做范围确认

Sprint 5 **未做**且 **不应在关闭时宣称已完成**：

- 真实微信公众号 Paste QA
- Style Gallery / 复杂编辑器 / block 级编辑
- 文件上传 / URL 抓取 / 知识库 / web search
- 图片上传托管 / AI 生图
- merge `release/1` 或 `main`
- Sprint 6-A / 6-B 启动

## 9. 风险列表

### P0（0）

当前无「合法 Release 1 block 导致 Preview / Copy 主链路必失败」的已知阻塞项（`cta` scope 等问题已修复并经用户 retest）。

### P1（4）

| ID | 风险 | 说明 |
|----|------|------|
| S5-P1-001 | 真实 provider 输出长度/深度不足 | 模型可能生成较短或 block 类型单一的文章 |
| S5-P1-002 | 真实 provider 输出结构不够丰富 | quote / info_card / list 等 structured block 出现频率依赖模型 |
| S5-P1-003 | 预览样式已有改善但质量仍需优化 | layout 映射 + variant diversity 已落地；非最终视觉标准 |
| S5-P1-004 | 真实 provider UI 不宜默认 e2e | 应用 dev-only smoke + manual path；e2e 以 deterministic 为 CI 基线 |

### P2（3）

| ID | 风险 | 说明 |
|----|------|------|
| S5-P2-001 | Renderer optional_slot_disabled 等 warning 展示策略 | UI 可继续优化 warning 呈现 |
| S5-P2-002 | Playwright 环境需 `playwright install` + fallback env | 已默认 `VOLCENGINE_ENABLE_REAL_PROVIDER=false` 于 webServer |
| S5-P2-003 | TypeScript 5.0.2 低于 Next 推荐 5.1+ | build warning · 后续升级 |

## 10. Close Readiness 建议

| 条件 | 结果 |
|------|------|
| P0 = 0 | **是** |
| 主链路代码 + 最小 smoke 完成 | **是** |
| 真实 provider 已接入（非仅 deterministic） | **是**（005 / 005A / 005B + 用户 manual） |
| Paste QA | **否**（明确归 Sprint 6-B） |
| 建议进入 Close Readiness | **是** |
| 建议关闭 Sprint 5 | **待用户确认** |

## 11. 留待后续 Sprint / Sprint 6

| 主题 | 建议归属 |
|------|----------|
| 真实微信公众号 Paste QA | Sprint 6-B |
| Fixture Triple / PasteTestRecord | Sprint 6-A / 6-B |
| 真实 provider 稳定性与输出质量长期观察 | Sprint 6+ / 运维 |
| 样式丰富度与 model_assisted style selection | 后续迭代 |
| TypeScript / CI e2e 硬化 | Chore / Sprint 6 |
| Style Gallery / 复杂编辑器 | Release 2+ |

## 12. 本轮验证命令结果

| 命令 | 结果 | 说明 |
|------|------|------|
| `corepack pnpm lint` | PASS | 2026-06-02 |
| `corepack pnpm test` | PASS | 743 tests |
| `corepack pnpm build` | PASS | `/generate` · `/api/generate` |
| `VOLCENGINE_ENABLE_REAL_PROVIDER=false corepack pnpm test:e2e` | PASS | 3 tests（需 Playwright browser） |

## 13. 参考

- `docs/agile/sprint-backlog.md` · Sprint 5 Stories
- `docs/agile/smoke/s5-volcengine-provider-smoke.md`
- `docs/agile/execution-reports/2026-06-02-s5-generate-ui-main-flow.md`
- Execution reports：preview visual · clipboard cta · style diversity · volcengine JSON parse
