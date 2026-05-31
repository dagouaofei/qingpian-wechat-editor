# S1-STORY-026：Release 1 样式范围与 AI Style Selection 二次审计

> 审计日期：2026-05-30  
> 审计分支：`docs/s1b-style-system-readiness-audit`  
> 审计对象：S1-STORY-025 修正后的 Style System / Sprint 计划 / AI Style Selection 边界  
> 方法：只读文档审计，**不修改** S1-STORY-025 方案正文

---

## 1. 审计结论摘要

**总体结论：**

| 项 | 结论 |
|----|------|
| **S1-STORY-025 是否可以 merge** | **有条件可以** |
| **是否可以进入 Sprint 2** | **可以**（与样式范围扩大无直接冲突；Sprint 2 仍仅 Article/Block/InlineContent） |
| **是否影响 Sprint 3** | **是** — 工作量显著扩大，**强烈建议**拆分子 Story / 子 Sprint |
| **最大风险** | 11×3~5 required variants（33~55 个）× Preview/Copy 成对 × 全量 Paste QA，在 Sprint 3/4/6 单 Sprint 叙事下**可执行性不足** |
| **必须先修的问题（P0）** | **0 项**（无架构污染、无 Article/Block 主模型破坏） |
| **可以登记到后续 Sprint 的问题** | Sprint 拆分、variant 分层明细、magazine_left_bar_title 归类、分阶段 QA（P1/P2） |

**审计最终分级：B — 可以 merge S1-STORY-025 至 sprint 分支，但须登记 Sprint 3/4/6 拆分建议与 P1 跟踪项；**不得**在未拆分计划的情况下按单 Sprint 3 启动全量 33~55 variant 实现。

---

## 2. Release 1 variant 范围可执行性审查

| 维度 | 当前方案 | 结论 | 风险 | 建议动作 |
|------|----------|------|------|----------|
| 产品目标契合 | 11×3~5 + assets 支撑 135 式丰富度 | **符合**产品升级方向 | P2 | — |
| vs 原 11×1 | 显著提升样式丰富度 | **是** | 无 | — |
| Sprint 3/4/6 工作量 | 33~55 registry + 33~55 成对 renderer + 全量 QA | **显著扩大** | **P1** | 正式拆分 Sprint 3-A/B/C、4-A/B、6-A/B |
| required/candidate/experimental 分层 | §10.3 有三层定义；§10.4 表格**未标注** tier | **PARTIAL** | **P1** | merge 后补 variant 级 tier 登记表（不必阻塞 merge） |
| copySafety strict/balanced | §10.3 原则有；各 variant **无逐项**声明 | **PARTIAL** | P1 | Sprint 3 注册时逐 variant 标注 |
| Preview+Copy 成对 | 文档要求明确 | **PASS** | 无 | Sprint 4 按 block 分组交付 |
| 全量 Paste QA | 每个 required 须 QA | **原则 PASS**；**规模 P1** | P1 | 分阶段 QA：Sprint 4 最小子集，Sprint 6 全量 |
| 按 block 拆 Story | sprint-plan 提示可拆，**无正式 Story** | **PARTIAL** | P1 | product-backlog 登记子 Story |

**量化估算（文档层）：**

- required variants：**33~55**（11 block × 3~5，上限未固定）
- VisualAssetRegistry：**15~30** assets
- Sprint 4 成对 renderer：**33~55** 对
- Sprint 6 golden + paste：**33~55** 条

> 对比原 11×1=11 variants，Release 1 样式实现与 QA 规模约为 **3~5 倍**，Sprint 3/4/6 单 Sprint 叙事**不可执行**，但**产品方向可执行**（需拆分）。

---

## 3. 11 block × 3~5 variants 覆盖审查

| block type | required 数量 | 清晰度 | copy 风险 | 是否建议拆分 | 结论 |
|------------|---------------|--------|-----------|--------------|------|
| `title` | 3~5（示例 5） | 中 — titleBlock 与 legacy 名混用 | 中（cardTitle） | 是 — Sprint 3-B | **PASS** 方向；须固定 tier |
| `lead` | 3~5 | 中 | 低~中 | Sprint 3-C | **PASS** |
| `heading` | 3~5（示例 5，无 magazine） | 中 — 与 §11.4 五件套不一致 | 中 | Sprint 3-B | **PARTIAL** |
| `paragraph` | 3~5 | 高 | 低 | Sprint 4-A | **PASS** |
| `list` | 3~5 | 中 — list-card/step copy 未细化 | **中~高** | Sprint 4-B | **PARTIAL**（沿用 P1-005） |
| `quote` | 3~5 | 高 | 低~中 | Sprint 4-A | **PASS** |
| `highlight` | 3~5 | 高 | 低~中 | Sprint 4-A | **PASS** |
| `info_card` | 3~5 | 中 | **中~高** | Sprint 4-B | **PARTIAL**（沿用 P1-005） |
| `cta` | 3~5 | 中 — cta-button copy | 中 | Sprint 4-B | **PASS** |
| `divider` | 3~5 | 高 | 低 | Sprint 4-A | **PASS** |
| `image_placeholder` | 3~5 | 高 | 低（非真实图） | Sprint 4-B | **PASS** |

**建议：** Release 1 可先 **每 block 3 个 required**（共 33），Sprint 6 前扩展到 5 个（共 55）；文档应固定最小 required 数，避免「3~5」双轨歧义。

---

## 4. titleBlock variants 与 magazine_left_bar_title 审查

| 问题 | 结论 |
|------|------|
| copy-safe？ | **有条件** — §11.10 允许 `left-bar` + 真实 DOM line；**不必然**需 absolute |
| absolute/overlay？ | 文档要求禁止 absolute；left-bar 可用 block + border-left inline 实现 |
| 真实 DOM 可行？ | **是** — 左竖线 + 标题文本，嵌套 ≤3 可设计 |
| 进入 release1RequiredVariants？ | **不建议** |

**明确建议：**

```text
magazine_left_bar_title：降为 release1CandidateVariants
```

**理由：**

1. `magazine` family + `medium` riskLevel；与 §10.4 heading required 示例列表**不一致**（示例未包含该 variant）
2. §11.4「Sprint 3 五件套」包含它，与 §10.4 Coverage Plan **内部矛盾**
3. Paste QA 成本高于 simple/inline 类 variant
4. 技术上可实现，但不应与 `title_with_bottom_line` 等 **同级 required**

**需要修改的文档（merge 后修复 Story，非本轮）：**

- `style-system.md` §11.4 五件套 — 移除或标注 candidate
- `style-system.md` §10.4 — 若保留 heading 5 示例，明确 tier 列
- `sprint-plan.md` — Sprint 3-B 范围注明 magazine 为 candidate

---

## 5. release1Required / candidate / experimental 三层边界审查

| 检查项 | 结论 |
|--------|------|
| required 定义足够严格？ | **PARTIAL** — 原则清晰，Coverage Plan 未逐 variant 标注 |
| candidate 会被误认为 R1 必做？ | **有风险** — 示例表格全部像 required |
| experimental 允许 preview_only？ | **PASS** — §10.3 明确 |
| Paste QA 覆盖范围？ | **PASS** — 仅 required（§10.3、wechat-copy §10） |
| Copy Fidelity Done 范围？ | **PASS** — 仅 required |
| sprint-plan 同步三层？ | **PARTIAL** — 只提 required，未列 candidate/experimental 工作流 |

**总评：PARTIAL**

**需修正（P1，merge 后）：** 增加 `release1-variant-tier-registry.md` 或在 style-system 附录逐 variant 标注 tier；sprint-plan 增加 candidate 不阻塞 Done 的显式说明。

---

## 6. Sprint 3 / 4 / 6 工作量审查

| Sprint | 是否过大？ | 结论 |
|--------|------------|------|
| **Sprint 3** | **是** | registry 33~55 + Protocol + Assets + Orchestrator + Validation + LayoutCompatibility |
| **Sprint 4** | **是** | 33~55 Preview/Copy 对 + Paste QA 启动 |
| **Sprint 6** | **是** | 33~55 fixture 三联全量回归 |

**是否拆分 Sprint 3？** **是，强烈建议**

**推荐拆分（建议登记 backlog，本轮不修改 sprint-plan）：**

| 子 Sprint | 范围 |
|-----------|------|
| **Sprint 3-A** | Theme/Preset/Registry 基础设施、ComponentProtocol、Validation 框架、WeChatCompatibilityProfile、TitleBlockLayoutCompatibility |
| **Sprint 3-B** | title/heading/titleBlock variants（**required 子集**）+ VisualAssetRegistry 最小集 |
| **Sprint 3-C** | 其余 9 block × 3 required variants registry + StyleOrchestrator 最小规则 |
| **Sprint 4-A** | Preview/Copy：paragraph/lead/heading/title/list/quote/highlight/divider |
| **Sprint 4-B** | Preview/Copy：info_card/cta/image_placeholder + 高风险 block Paste QA |
| **Sprint 6-A** | Article JSON fixture + copy HTML snapshot 基础设施 |
| **Sprint 6-B** | PasteTestRecord 执行 + required variants 全量回归 + bug 流程 |

**11 block 分组建议：** 文本型（A）vs 卡片/CTA/占位（B）；title/heading 优先（3-B）。

---

## 7. Release 1 AI Style Selection 审查

| 检查项 | 结论 |
|--------|------|
| Generation 只负责内容 + 样式建议？ | **PASS** |
| 禁止 HTML/CSS/inline style？ | **PASS** — generation §8.1、architecture §5 |
| 禁止未注册 variant/assetId？ | **PASS** |
| StyleSelectionRequest/Patch 仅为 Style 输入建议？ | **PASS** |
| 校验链路完整？ | **PASS**（文档）— style-system §11.8.3 六层 + Orchestrator |
| Renderer 只消费 ResolvedArticleStyle？ | **PASS** — rendering §7.4 |
| Article/Block 无 visual 字段？ | **PASS** |
| Generation 直接影响 Preview/Copy？ | **PASS** — 禁止项明确 |

**总评：PASS**（架构边界清晰）

**PARTIAL 项（P2）：** Sprint 5 才实现 Generation 侧产出，Sprint 3 须先实现 validation **stub/fixture** 以便独立测试；文档已暗示但未写验收路径。

**风险等级：** **P2**（不阻塞 merge；Sprint 3 需 validation 入口可测）

---

## 8. Article / Block 主模型污染检查

| 检查项 | 结果 |
|--------|------|
| visualArticle / componentArticle | **未发现** — PASS |
| visualBlock / componentBlock | **未发现** — PASS |
| Block 内 familyId/variantId/assetId | **未发现** — PASS（variant 在 styleAssignment.blockOverrides） |
| Block 内 inline style/CSS | **禁止** — PASS |
| Generation 输出 HTML/CSS | **禁止** — PASS |

**总评：PASS — 无 P0 架构污染**

---

## 9. S1-STORY-025 merge 判断

| 选项 | 判定 |
|------|------|
| **A.** 可以 merge | 部分 — 无 P0 |
| **B.** 可以 merge，但须登记拆分建议 | **是 — 主结论** |
| **C.** 必须先修 P0/P1 再 merge | 否 — 无 P0；P1 可 merge 后跟踪 |
| **D.** 暂不建议 merge | 否 |

**Sprint 2 是否仍可启动？** **可以** — Sprint 2 范围未变；须在 Sprint 3 启动前完成 Sprint 拆分决策。

**Sprint 3 前前置修复建议（P1，非 merge 阻塞）：**

1. 固定 Release 1 最小 required 数（建议先 **11×3=33**）
2. `magazine_left_bar_title` 降为 candidate 并消除 §11.4/§10.4 矛盾
3. 正式登记 Sprint 3-A/B/C 至 product-backlog
4. variant 级 tier 登记表

---

## 10. P0 / P1 / P2 问题清单

### P0（0）

无。无架构错误、无主模型污染、无 merge 硬阻塞项。

### P1（7）

| ID | 问题 | 建议 |
|----|------|------|
| P1-001 | Coverage Plan 未逐 variant 标注 required/candidate/experimental | merge 后补 tier 登记表 |
| P1-002 | 「3~5」未固定最小 required（33 vs 55 歧义） | Decision 或文档固定先 11×3 |
| P1-003 | `magazine_left_bar_title` §11.4 五件套 vs §10.4 heading 列表矛盾 | 降为 candidate |
| P1-004 | Sprint 3/4/6 单 Sprint 叙事 vs 33~55 规模不可执行 | 登记 3-A/B/C 等拆分 |
| P1-005 | 55 个 variant 仅名称，缺 VariantDefinition 骨架 | Sprint 3 按 block 分批补 |
| P1-006 | VisualAssetRegistry 15~30 无 asset 清单 | Sprint 3-B 前补 asset catalog |
| P1-007 | Sprint 4 全量 QA 33~55 无分阶段计划 | Sprint 4 最小子集 QA，Sprint 6 全量 |

### P2（4）

| ID | 问题 | 建议 |
|----|------|------|
| P2-001 | candidate tier 升级/降级工作流未定义 | Sprint 3 治理文档 |
| P2-002 | AI validation Sprint 3 vs Generation Sprint 5 跨 Sprint 测试路径 | validation fixture |
| P2-003 | list/info_card copy 结构规则仍弱（历史 P1-005） | Sprint 4-B |
| P2-004 | 每 block 从 3 扩展到 5 的里程碑未定义 | Release 1 中期 checkpoint |

---

## 11. 相关文档

- [S1-STORY-025 execution report](../../agile/execution-reports/2026-05-30-s1b-component-dsl-style-system-readiness.md)
- [style-system.md](../style-system.md) §10~§11
- [s1b-pre-implementation-contract-audit.md](./s1b-pre-implementation-contract-audit.md)
