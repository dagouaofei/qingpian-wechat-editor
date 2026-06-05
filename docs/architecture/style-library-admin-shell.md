# Style Library Admin Shell

> 轻篇公众号排版 · qingpian-wechat-editor  
> **Sprint 9 · S9-STORY-003 / FIX-A / FIX-B** · Operator-facing Style Management Workbench v0（只读）  
> **路由：** `/dev/style-library` · **DECISION-096** · **DECISION-097** · **DECISION-098**  
> **关联：** [`style-library-storage.md`](style-library-storage.md) · [`style-management-domain-model.md`](style-management-domain-model.md)

---

## 1. 定位

Style Library Admin Shell v0 是主项目内的**面向运营管理人员**的样式资产管理工作台雏形（只读），用于查看候选样式池、生命周期状态与 promote 前置信息。

| 是 | 不是 |
|----|------|
| 运营样式管理工作台 v0（只读） | manifest / patch / evidence 技术数据浏览器 |
| 候选样式池审查入口 | 工程师 debug 表格页 |
| `/dev/` 内部工具 | 正式 SaaS 权限后台 |
| S9 治理层 UI 骨架 | runtime StyleRegistry 编辑器 |

**Admin Shell v0 的目标不是 raw manifest browser（DECISION-097）。** 页面优先呈现 Workbench 视角；Diagnostics 仅作高级排查。

---

## 2. 为何使用 `/dev/style-library`（DECISION-096）

1. **无权限系统** — S9 v0 未实现 auth / RBAC
2. **开发期内部工具** — 与 [`/dev/style-fidelity`](../src/app/dev/style-fidelity/page.tsx) 同类定位
3. **只读** — 非正式产品面向用户的 admin 入口
4. **避免误解** — `/admin/` 暗示已具备权限与写操作能力

正式 `/admin/style-library` 可在权限与写操作就绪后另开 Story 评估。

---

## 3. 只读边界

**本轮不做：**

- 新增 / 编辑 / 删除 asset
- lifecycle 状态转换（→ S9-STORY-004）
- promote · 激活 registry patch（→ S9-STORY-007）
- Preview / Copy / Validator 集成（→ S9-STORY-006）
- 修改 `createFirstWaveRequiredVariantRegistry` · Gallery · Preview · Copy

Workbench Header 明确：**Not connected to runtime**；不影响 Gallery / Preview / Copy / default preset。

---

## 4. 页面信息架构

| 区块 | 角色 | 内容 |
|------|------|------|
| **Workbench Header** | 主视觉 | **Style Library Workbench** · **样式资产管理后台 v0** · libraryId · schemaVersion · updatedAt · Not connected to runtime · Read-only governance shell |
| **Status Summary Cards** | 主视觉 | Total assets · Seed candidates · **Candidate / Paste QA passed** · User selectable · Default eligible · Active patches · Validation issues |
| **Lifecycle Pipeline** | 主视觉 | draft → candidate → validator_pass → paste_qa_pass → user_selectable → default_eligible → deprecated |
| **Candidate Review** | 主视觉 | 006D seed 卡片 · lifecycle / seed badge · distribution · **当前结论** · disabled actions · 下一步提示 |
| **Diagnostics / Advanced** | 辅助 | Validation Panel · Asset List · Registry Patch List · Evidence List · Runtime Notice |

---

## 5. Candidate Review 卡片字段

每张 006D seed 卡片至少展示：

- label · runtimeVariantId · blockType · styleFamily
- lifecycle badge · seed badge · evidence count
- distribution flags（userSelectable / defaultEligible / release1Required）
- **当前结论：** Not user selectable / Not default eligible
- **下一步：** Needs lifecycle / promote review

---

## 6. Disabled Actions 与后续 Story

| Action | 标注 | 承接 Story |
|--------|------|------------|
| Validate | renderer / validator integration | **S9-STORY-006** |
| Review Evidence | lifecycle write | **S9-STORY-004** |
| Promote to User Selectable | promote | **S9-STORY-007** |
| Mark Default Eligible | promote | **S9-STORY-007** |

按钮均为 `disabled`；页面无 form submit / 写操作。

---

## 7. 运营验收场景（DECISION-097）

| 场景 | S9-STORY-003 / 004 覆盖 |
|------|-------------------------|
| 打开后台入口 | ✅ `/dev/style-library` |
| 看到候选样式池 | ✅ Candidate Review + Pipeline |
| 看懂候选样式状态 | ✅ 卡片结论 + lifecycle 看板 + **S9-STORY-004 proposal panel** |
| preview / copy / validator 结果 | ⏳ S9-STORY-006 |
| promote 路径 | ⏳ S9-STORY-007 |
| 区分 user_selectable / default_eligible | ⏳ 部分（只读展示 flags） |
| 支撑 S10 批量扩展 | ⏳ S9-STORY-008 · 009 |

---

## 8. Lifecycle Management（S9-STORY-004 · DECISION-099）

Workbench 集成 lifecycle transition engine 与 **Lifecycle Change Proposal** 预览：

- Candidate Review 卡片内 **生命周期管理** panel
- 允许 / 受阻流转列表 + proposal preview（`<details>` · 无 submit）
- Pipeline 列头展示业务含义与下一步动作

详见 [`style-library-lifecycle-management.md`](style-library-lifecycle-management.md)。

---

## 9. Preview / Copy / Validator（S9-STORY-006 · DECISION-100）

**inspection-only** 集成 — 复用 Preview / Copy Renderer 与 `validateWechatCopyHtml`：

- Status Summary：**检查概览**（自动校验通过 · 需要粘贴 QA · 可进入上线审核 · 阻塞候选样式 · **有兼容性提醒**）
- Candidate Review：**Preview / Copy / Validator / Promote readiness** 面板
- Diagnostics / Advanced：raw Copy HTML · raw validator issues

独立 registry：`createStyleLibraryInspectionStyleRegistry()` · preset `style_library_inspection_v0` — **不**接入 runtime 默认路径。

详见 [`style-library-preview-copy-validator-integration.md`](style-library-preview-copy-validator-integration.md)。

---

## 10. 双语切换（DECISION-098 · S9-STORY-003-FIX-B）

| 项 | 内容 |
|----|------|
| **默认语言** | 中文（`zh`） |
| **支持语言** | 中文 · English（`en`） |
| **切换方式** | URL query：`/dev/style-library?lang=zh` · `?lang=en`；页面 Header 语言切换链接 |
| **实现** | [`style-library-i18n.ts`](../src/app/dev/style-library/style-library-i18n.ts) 轻量 dictionary · **无**全站 i18n 框架 |
| **范围** | **仅** `/dev/style-library` · 不影响 manifest / runtime / StyleRegistry |
| **不翻译** | assetId · runtimeVariantId · patchId · evidenceId · matrixRowId · diagnostics 表头技术字段 |
| **lifecycle** | UI 显示中文/英文 label；raw key（如 `paste_qa_pass`）保留在看板小字 / tooltip |

---

## 11. 代码结构

```text
src/app/dev/style-library/
  page.tsx
  style-library-i18n.ts
  style-library-view-model.ts
  style-library-lifecycle-view-model.ts
  style-library-inspection-view-model.ts
  style-library-inspection-preview.tsx
  style-library-admin-shell.tsx
```

---

## 12. 测试

- `tests/core/style-library/style-library-lifecycle.test.ts`
- `tests/core/style-library/style-library-inspection.test.ts`
- `tests/app/dev/style-library/style-library-lifecycle-view-model.test.ts`
- `tests/app/dev/style-library/style-library-inspection-view-model.test.ts`
- `tests/app/dev/style-library/style-library-i18n.test.ts`
- `tests/app/dev/style-library/style-library-view-model.test.ts`
- `tests/app/dev/style-library/style-library-page.test.tsx`

---

## 13. 参考

- **DECISION-100** · **DECISION-099** · **DECISION-098** · **DECISION-097** · DECISION-096
- [`style-library-lifecycle-management.md`](style-library-lifecycle-management.md)
- [`style-library-preview-copy-validator-integration.md`](style-library-preview-copy-validator-integration.md)
- [`sprint9-style-management-system-v0.md`](../agile/sprint9-style-management-system-v0.md)
