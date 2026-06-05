# Style Library Admin Shell

> 轻篇公众号排版 · qingpian-wechat-editor  
> **Sprint 9 · S9-STORY-003** · Read-only Style Library Admin Shell v0  
> **路由：** `/dev/style-library` · **DECISION-096**  
> **关联：** [`style-library-storage.md`](style-library-storage.md) · [`style-management-domain-model.md`](style-management-domain-model.md)

---

## 1. 定位

Style Library Admin Shell v0 是主项目内的**只读、内部治理浏览页**，用于开发者 / PO 查看 Style Library v0 资产状态。

| 是 | 不是 |
|----|------|
| 只读 manifest 浏览器 | 正式 SaaS 运营后台 |
| `/dev/` 内部工具 | `/admin/` 权限后台 |
| S9 治理层 UI 骨架 | runtime StyleRegistry 编辑器 |

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

页面顶部 **Runtime Notice** 明确：registry patch **未接入** runtime，不影响 Gallery / Preview / Copy / default preset。

---

## 4. 页面信息架构

| 区块 | 内容 |
|------|------|
| **Overview** | libraryId · schemaVersion · updatedAt · asset/patch/evidence 计数 · lifecycle 分布 |
| **Validation Panel** | `validateStyleLibraryManifest` 结果 · issue 列表 |
| **Asset List** | 全部 assets · seed badge · distribution flags |
| **Registry Patch List** | patchId · operation · active · evidence/lifecycle 要求 · per-patch validation issue count |
| **Evidence List** | evidenceId · kind · refPath · matrixRowId · sessionId |

---

## 5. 代码结构

```text
src/app/dev/style-library/
  page.tsx                      # 薄页面 · 组装 view model
  style-library-view-model.ts   # manifest → view model（业务逻辑）
  style-library-admin-shell.tsx # 只读 UI  presentation
```

**原则：**

- 页面组件薄；校验与聚合在 view model
- UI 不直接修改 manifest
- 数据**仅**来自 `@/core/style-library`

---

## 6. 数据来源

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

## 7. 与 S9-STORY-002 Storage 的关系

| S9-STORY-002 | S9-STORY-003 |
|--------------|--------------|
| `STYLE_LIBRARY_MANIFEST` 定义 | 页面读取并展示 manifest |
| validation helpers | Validation Panel 调用 |
| seed / patch / evidence 资产 | 对应列表区块 |

Storage 仍是 source of truth；Admin Shell 不复制或改写资产。

---

## 8. 与后续 Story 关系

| Story | Admin Shell 承接 |
|-------|------------------|
| **S9-STORY-004 Lifecycle** | 可扩展 lifecycle 状态展示与（未来）转换 UI |
| **S9-STORY-005 Harvest** | 可展示新 harvest candidate assets |
| **S9-STORY-007 Promote** | 可展示 active patch · promote 操作（本轮不做） |

---

## 9. 006D Seed 展示要求

两个 seed asset 必须在 Asset List 可见：

- `heading_purple_chapter_label_candidate`
- `info_card_reading_path_candidate`

显示为 **seed · candidate · paste_qa_pass**；`userSelectable` / `defaultEligible` / `release1Required` 均为 **false**。

---

## 10. 测试

- `tests/app/dev/style-library/style-library-view-model.test.ts` — overview · seed · patch · validation
- `tests/app/dev/style-library/style-library-page.test.tsx` — shell 静态渲染 · 无 form/submit

---

## 11. 参考

- DECISION-095 · **DECISION-096**
- [`style-library-storage.md`](style-library-storage.md)
