# Product Backlog

> 轻篇公众号排版 · qingpian-wechat-editor

## Release 规划

### Release 1：公众号文章生成、样式排版、流式预览与复制一致性闭环

**目标：** 跑通正式主链路，并建立样式系统、复制一致性、多输入和流式展示地基。

**Epic 列表：**

| Epic ID | 名称 | 说明 |
|---------|------|------|
| EPIC-001 | 多输入内容准备 | 主题、资料、草稿三类输入的标准化与入口 |
| EPIC-002 | 文章生成与结构化 | AI 生成与结构化输出，结果进入 Article Schema |
| EPIC-003 | Article / Block 核心模型 | 统一 Article Schema 与 Block 语义定义 |
| EPIC-004 | 样式系统基础架构 | theme、preset、variant、registry、assignment |
| EPIC-005 | 公众号预览渲染 | Preview Renderer，页面预览 |
| EPIC-006 | 复制到公众号与样式一致性 | Copy Renderer，微信兼容 HTML，粘贴一致性 P0 |
| EPIC-007 | 流式生成与打字机式展示 | SSE + block 增量 + 最终 Article 归一 |
| EPIC-008 | 配图位置与图片占位 | image_placeholder 语义与展示 |
| EPIC-009 | 基础重生成与反馈 | 段落/区块级重生成与反馈入口 |
| EPIC-010 | 测试 Fixture 与质量保障 | fixture、人工粘贴测试、复制一致性验证 |

---

### Release 2：样式增强、轻编辑与手动配图

**目标：** 支持更多样式、基础编辑、整篇风格切换、手动上传 / 替换图片。

---

### Release 3：资料增强、智能配图与内容质量提升

**目标：** 支持文件、链接、知识库、联网搜索、图库搜索、AI 生图、引用来源。

---

### Release 4：样式导入与品牌样式库

**目标：** 支持 135 / 秀米样式导入、用户自定义样式、品牌样式沉淀。

---

### Release 5：运营工作台与团队能力

**目标：** 支持多篇管理、团队协作、审批、素材库、多账号与数据分析。

## 优先级说明

- P0：Release 1 主链路必需
- P1：Release 1 增强或 Release 2 前置
- P2：后续 Release

## 历史经验参考

旧一键成稿项目的可继承经验已沉淀至：

- `docs/architecture/prototype-lessons.md`
- `docs/agile/migration-reference.md`

样式系统、复制一致性、流式生成等方向已在 Release 1 Epic 中前置，不后置预留。

---

## Release 1 Technical Enablers（架构契约）

| ID | 名称 | 归属 Epic | 说明 |
|----|------|-----------|------|
| TECH-ARCH-001 | Release 1 整体技术架构定稿 | 全链路 | 唯一 architecture-overview（S1-STORY-020） |
| TECH-ARCH-002 | InlineContent / InlineMark 文本协议 | EPIC-003 | 段内富文本语义；paragraph/lead Release 1 必须支持 |
| TECH-ARCH-003 | StyleDefinition 命名边界与 ResolvedStyle 契约 | EPIC-004 | VariantDefinition vs ResolvedBlockStyle / ResolvedArticleStyle |
| TECH-ARCH-004 | SlotRenderSpec copy-safe 边界 | EPIC-004 / EPIC-006 | slot fallback、copySafety、preview_only 限制 |
| TECH-ARCH-005 | WeChatCompatibilityProfile 可执行兼容规则 | EPIC-006 | Allowed/Risky/Forbidden CSS + FallbackPolicy |
| TECH-ARCH-006 | Sprint 2 readiness contract closure | EPIC-003 / EPIC-004 / EPIC-006 | 统一 content.text；登记 audit P1/P2 |
| TECH-ARCH-007 | ComponentProtocol / BlockVisualProtocol | EPIC-004 | 控件协议层 |
| TECH-ARCH-008 | titleBlock family / variant catalog | EPIC-004 | 5 family + 15 variant catalog |
| TECH-ARCH-009 | titleBlock slot protocol | EPIC-004 / EPIC-006 | 7 类 slot + fallback |
| TECH-ARCH-010 | VisualAssetRegistry / icon asset pool | EPIC-004 | 系统内置 asset |
| TECH-ARCH-011 | StyleOrchestrator / ArticleRhythmPolicy | EPIC-004 | 文章级去重/节奏 |
| TECH-ARCH-012 | AI Style Selection Guardrails | EPIC-002 / EPIC-004 | AI 不得输出 HTML/CSS；须 registry 校验 |
| TECH-ARCH-013 | Release 1 Variant Coverage Plan | EPIC-004 / EPIC-006 | first-wave 11×3 + expansion to 11×5 |
| TECH-ARCH-014 | SlotContentBinding | EPIC-004 | titleBlock slot 内容来源；禁止 Style 生成正文 |
| TECH-ARCH-015 | TitleBlockLayoutCompatibility | EPIC-004 / EPIC-006 | layoutMode 微信 copy 可执行约束 |
| TECH-ARCH-016 | AI Style Selection in Release 1 | EPIC-002 / EPIC-004 | Release 1 启用受控 AI 样式选择 |
| TECH-ARCH-017 | StyleSelection Validation Pipeline | EPIC-004 | Protocol/Registry/Profile/Orchestrator 串联校验 |
| TECH-ARCH-018 | First-wave Required Variant Registry | EPIC-004 | 11×3=33 first-wave required variants · **Sprint 3-B 执行入口** |
| TECH-ARCH-019 | Expansion Variant Coverage | EPIC-004 | 每 block 第 4/5 variant；不阻塞 first-wave closure |
| TECH-ARCH-020 | Sprint 3-A/B/C Style System Delivery Split | EPIC-004 | infrastructure / first-wave registry / AI validation · **3-B = first-wave registry** |
| TECH-ARCH-021 | Sprint 4-A/B Renderer Delivery Split | EPIC-004 / EPIC-006 | text-first vs structured blocks · **Sprint 4-A text-first 已完成**（DECISION-061）；**Sprint 4-B structured renderer 已完成 audit / close readiness**（S4B-STORY-007；Grade A；P0=0） |
| TECH-ARCH-022 | Sprint 6-A/B Paste QA Regression Split | EPIC-010 | fixture 三联 vs first-wave 33 variants QA；**Release 1 33 variants 最小 Paste QA plan 已建立，真实 Paste QA 仍未执行，归 Sprint 6-B** |
| TECH-ARCH-023 | Release 1 Style Quality Gate | EPIC-004 / EPIC-006 | Style Quality Review / Gallery / 样式效果验收；Sprint 3-B registry Done；Sprint 4-A text-first renderer Done；Sprint 4-B structured renderer Close Readiness；Paste QA / Style Gallery 仍待后续 Sprint |

状态：文档契约 S1-STORY-021~028；代码按 Sprint 2 + 3-A/B/C + 4-A/B + 5 + 6-A/B 拆分。**TECH-ARCH-023：** Sprint 4-A Done；Sprint 4-B structured Preview / Copy 已完成 audit / close readiness；真实 Paste QA / Style Gallery 待 Sprint 6 / Release 2。

---

## Sprint 3-A Audit 遗留（DECISION-057 登记）

> 来源：`docs/architecture/audits/sprint3a-contract-audit.md` §10；Sprint 3-B 启动时纳入 planning（DECISION-058）。

| ID | 问题 | 建议 Sprint | Sprint 3-B 处理 |
|----|------|-------------|-----------------|
| **P1-S3A-001** | `style-system.md` §11.4 titleBlock catalog 历史 layoutMode 命名映射 | Sprint 3-B | **已收口**（S3B-STORY-002） |
| P1-S3A-002 | `wechat-copy-style-rules.md` profile 字段名与代码结构略有差异 | Sprint 3-B 或 4-A 前 | 登记 · 不阻塞 S3B-STORY-001 |
| P1-S3A-003 | `validateStyleRegistrySchema` vs `validateStyleRegistry` 命名易混淆 | Sprint 3-B | 登记 · S3B-STORY-002 可选 |
| P1-S3A-004 | ResolvedBlockStyle 未展开 componentProtocol | Sprint 4-A | **已纳入** · S4A-STORY-002 / S4A-STORY-003 |
| P2-S3A-001 | Tailwind forbidden 检测有限 | Sprint 4-A / 6-B | 登记 |
| **P2-S3A-002** | slot 级 copySafety 未强制 | Sprint 3-B | **已收口**（S3B-STORY-002） |
| P2-S3A-003 | InlineMark color 与 Style ColorTokenRef 跨模块校验未打通 | Sprint 3-B / 4-A | 登记 · 不阻塞 S3B-STORY-001 |

---

## Sprint 3-B Audit 遗留（S3B-STORY-007 登记）

> 来源：`docs/architecture/audits/sprint3b-contract-audit.md` §11；不阻塞 Sprint 3-B Close Readiness。**与 Sprint 4-A 相关项已纳入 Sprint 4-A planning**（DECISION-060；见 `sprint-backlog.md` Sprint 4-A 前置遗留登记表）。

| ID | 问题 | 建议 Sprint | Sprint 4-A planning |
|----|------|-------------|---------------------|
| **P1-S3B-001** | 33 variants 尚未经过 Preview / Copy Renderer 实际保真验证 | Sprint 4-A / 4-B | **已纳入** · S4A-STORY-003~006（text-first 优先） |
| **P1-S3B-002** | `balanced` copySafety variants 可能在微信粘贴中出现边距、边框、badge 等细节差异 | Sprint 4-A / 4-B / 6-B | **已纳入** · S4A-STORY-006（最小 Paste QA seed） |
| P1-S3B-003 | cta / image_placeholder 当前为占位契约，不包含真实 QR、链接、小程序或图片能力 | Sprint 4-B / Release 2+ | 登记 · Sprint 4-B |
| **P1-S3B-004** | first-wave registry 缺少 style quality gallery / 人工视觉验收入口 | Sprint 4 / 6 | **已纳入 planning** · 后续 gallery / QA 支撑，不必 Sprint 4-A 实现 |
| P1-S3B-005 | `block.content.title` / `caption` 等 optional 字段需要 renderer 明确 disabled/fallback 行为 | Sprint 4-B | 登记 · Sprint 4-B |
| P2-S3B-001 | 33 variants 视觉方向偏保守 | Sprint 6 / Release 2 | 登记 |
| **P2-S3B-002** | WeChat profile 文档字段与代码结构仍有轻微命名差异 | Sprint 4-A 前 | **已纳入** · S4A-STORY-002 |
| **P2-S3B-003** | InlineMark color 与 Style ColorTokenRef 跨模块校验未打通 | Sprint 4-A / 6 | **已纳入** · S4A-STORY-004（同 P1-CODE-002） |

---

## Sprint 4-A Renderer Contract Audit 遗留（S4A-STORY-007 登记）

> 来源：`docs/architecture/audits/sprint4a-renderer-contract-audit.md` §9；不阻塞 Sprint 4-A Close Readiness。Sprint 4-A audit 结论：Grade A，P0=0，P1=4，P2=1。

| ID | 问题 | 建议 Sprint / 归属 | 说明 |
|----|------|-------------------|------|
| **P1-S4A-001** | 尚未执行真实微信公众号 Paste QA | Sprint 6-B / Paste QA 回归 | S4A 仅建立 Not Run seed，不冒充人工 QA 通过 |
| **P1-S4A-002** | `balanced` copySafety variants 仍需粘贴细节验证 | Sprint 4-B / 6-B | heading / lead / paragraph / divider balanced variants 需微信编辑器验证 |
| **P1-S4A-003** | Copy HTML snapshot seed 仅覆盖 6 个代表 variants，未覆盖全部 15 个已实现 text-first variants | Sprint 6-A / 6-B | 不阻塞 S4A 最小 seed，建议后续扩展为完整 text-first snapshot set |
| **P1-S4A-004** | InlineMark color 与 Style registry 完整 cross-registry 校验仍未完成 | Sprint 6 / Release 1 hardening | 当前已有安全 alias / fallback，不阻塞 Close Readiness |
| **P2-S4A-001** | Style Gallery / 人工视觉验收入口仍缺失 | Sprint 6 / Release 2 | 支撑视觉评审效率，不阻塞 S4A |
| Sprint 4-B Scope | structured blocks Renderer（list / quote / highlight / info_card / cta / image_placeholder） | Sprint 4-B | S4A 明确未覆盖，不计为 S4A 缺陷 |

---

## Sprint 4-B Planning 遗留（S4B-STORY-001 登记）

> 来源：Sprint 1-B / Sprint 3-B / Sprint 4-A audit 遗留；纳入 Sprint 4-B planning，不要求 S4B-STORY-001 解决代码问题。

| ID | 问题 | 建议 Sprint | Sprint 4-B planning |
|----|------|-------------|---------------------|
| **P1-005** | list / info_card copy 结构保真规则未细化 | Sprint 4-B | **已纳入** · S4B-STORY-002 / S4B-STORY-004 |
| **P1-S3B-003** | cta / image_placeholder 当前为占位契约，不包含真实 QR、链接、小程序或图片能力 | Sprint 4-B / Release 2+ | **已纳入** · S4B-STORY-005（占位 Renderer 边界） |
| **P1-S3B-005** | `block.content.title` / `caption` 等 optional 字段需要 renderer 明确 disabled / fallback 行为 | Sprint 4-B | **已纳入** · S4B-STORY-004 / S4B-STORY-005 |
| **P1-S4A-002** | `balanced` copySafety variants 仍需粘贴细节验证 | Sprint 4-B / 6-B | **已纳入** · S4B-STORY-006（33 variants Paste QA plan；真实 QA 仍归 Sprint 6-B） |
| **P1-S4A-003** | Copy HTML snapshot seed 覆盖不足 | Sprint 6-A / 6-B | **已纳入** · S4B-STORY-006（扩展 structured blocks snapshot；text-first 全量扩展仍归 Sprint 6-A/B） |
| **P2-S4A-001** | Style Gallery / 人工视觉验收入口仍缺失 | Sprint 6 / Release 2 | **已纳入 planning** · 不要求 Sprint 4-B 实现 |
