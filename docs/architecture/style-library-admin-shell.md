# Style Library Admin Shell

> 轻篇公众号排版 · qingpian-wechat-editor  
> **Sprint 9 · S9-STORY-003 / S9-STORY-003-FIX-A** · Read-only Style Library Admin Shell v0  
> **路由：** `/dev/style-library` · **DECISION-096**  
> **关联：** [`style-library-storage.md`](style-library-storage.md) · [`style-management-domain-model.md`](style-management-domain-model.md)

---

## 1. 定位

Style Library Admin Shell v0 是主项目内的**只读、内部样式资产管理工作台雏形**，用于开发者 / PO 查看 Style Library v0 资产状态与治理进度。

| 是 | 不是 |
|----|------|
| 样式资产管理工作台 v0（只读） | raw manifest 数据浏览器 |
| `/dev/` 内部工具 | 正式 SaaS 运营后台 |
| S9 治理层 UI 骨架 | runtime StyleRegistry 编辑器 |

**Admin Shell v0 的目标不是 raw manifest browser。** 页面优先呈现 Workbench 视角（状态摘要、生命周期管道、候选审查），manifest 表格仅作为 Diagnostics 辅助区块。

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
- lifecycle 状态转换
- promote · 激活 registry patch
- API 写 route · 数据库
- 修改 `createFirstWaveRequiredVariantRegistry` · Gallery · Preview · Copy
- Preview / Copy / Validator runtime 集成（S9-STORY-006）

页面 Workbench Header 明确：**Not connected to runtime**；registry patch **未接入** runtime，不影响 Gallery / Preview / Copy / default preset。

---

## 4. 页面信息架构

| 区块 | 角色 | 内容 |
|------|------|------|
| **Workbench Header** | 主视觉 | Style Library v0 · libraryId · schemaVersion · updatedAt · runtime status · Sprint S9 · Read-only governance shell |
| **Status Summary Cards** | 主视觉 | Total assets · Seed candidates · Paste QA passed · User selectable · Default eligible · Active patches · Validation issues |
| **Lifecycle Pipeline** | 主视觉 | 按 lifecycle 分栏：draft → candidate → validator_pass → paste_qa_pass → user_selectable → default_eligible → deprecated |
| **Candidate Review** | 主视觉 | 006D seed asset 卡片 · lifecycle / seed badge · distribution flags · disabled actions |
| **Details / Diagnostics** | 辅助 | Validation Panel · Asset List · Registry Patch List · Evidence List · Runtime Notice |

Diagnostics 区块使用 dashed 边框与次级标题，**不应是页面第一视觉重点**。

---

## 5. Disabled Actions 与后续 Story

Candidate Review 卡片展示 disabled 操作按钮，明确后续 Story 承接：

| Action | 禁用原因 | 承接 Story |
|--------|----------|------------|
| Validate | renderer / validator 未接入 | **S9-STORY-006** |
| Review Evidence | lifecycle 写操作不可用 | **S9-STORY-004** |
| Promote to User Selectable | promote 流程不可用 | **S9-STORY-007** |
| Mark Default Eligible | promote 流程不可用 | **S9-STORY-007** |

按钮均为 `disabled`，页面无 form submit / 写操作。

---

## 6. 代码结构

```text
src/app/dev/style-library/
  page.tsx                      # 薄页面 · 组装 view model
  style-library-view-model.ts   # manifest → workbench view model
  style-library-admin-shell.tsx # Workbench + Diagnostics UI
```

**原则：**

- 页面组件薄；校验与聚合在 view model
- UI 不直接修改 manifest
- 数据**仅**来自 `@/core/style-library`

---

## 7. 数据来源

```typescript
import {
  STYLE_LIBRARY_MANIFEST,
  validateStyleLibraryManifest,
  getStyleLibraryVariantAssets,
  getStyleLibrarySeedAssets,
  validateStyleLibraryRegistryPatch,
} from "@/core/style-library";
```

**禁止**从 `@/core/styles` 读取或重组 runtime registry。

---

## 8. 与 S9-STORY-002 Storage 的关系

| S9-STORY-002 | S9-STORY-003 |
|--------------|--------------|
| `STYLE_LIBRARY_MANIFEST` 定义 | 页面读取并展示 manifest |
| validation helpers | Diagnostics Validation Panel 调用 |
| seed / patch / evidence 资产 | Pipeline / Candidate Review / Diagnostics 展示 |

Storage 仍是 source of truth；Admin Shell 不复制或改写资产。

---

## 9. 与后续 Story 关系

| Story | Admin Shell 承接 |
|-------|------------------|
| **S9-STORY-004 Lifecycle** | Review Evidence · lifecycle 转换 UI |
| **S9-STORY-005 Harvest** | 新 harvest candidate 进入 Pipeline / Candidate Review |
| **S9-STORY-006 Validator** | Validate 按钮 · renderer / validator 集成 |
| **S9-STORY-007 Promote** | Promote / Mark Default Eligible · active patch |

---

## 10. 006D Seed 展示要求

两个 seed asset 必须出现在 **paste_qa_pass** Pipeline 列与 **Candidate Review** 卡片：

- `heading_purple_chapter_label_candidate`
- `info_card_reading_path_candidate`

显示为 **seed · candidate · paste_qa_pass**；`userSelectable` / `defaultEligible` / `release1Required` 均为 **false**；下一步提示 **Needs lifecycle / promote review**。

---

## 11. 测试

- `tests/app/dev/style-library/style-library-view-model.test.ts` — workbench · status summary · lifecycle groups · candidate cards · disabled actions
- `tests/app/dev/style-library/style-library-page.test.tsx` — shell 静态渲染 · workbench 结构 · 无 form/submit

---

## 12. 参考

- DECISION-095 · **DECISION-096**
- [`style-library-storage.md`](style-library-storage.md)
