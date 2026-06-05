# Style Library Storage

> 轻篇公众号排版 · qingpian-wechat-editor  
> **Sprint 9 · S9-STORY-002** · File-backed / Code-backed Style Library Storage  
> **状态：** v0 实现 · **DECISION-095**  
> **关联：** [`style-management-domain-model.md`](style-management-domain-model.md) · [`style-system.md`](style-system.md) · **DECISION-092** · **DECISION-094**

---

## 1. 存储定位

Style Library v0 是 S9 **治理层** file-backed / code-backed 资产目录，与运行时 `StyleRegistry` **并列、不替换**。

| 维度 | Style Library（S9） | StyleRegistry（运行时） |
|------|---------------------|-------------------------|
| 职责 | metadata · lifecycle · evidence · registry patch 定义 | themes · presets · variants 解析与渲染 |
| v0 形式 | TypeScript manifest + assets（Git 可审查） | 现有 TS variant 模块 |
| 加载 | `@/core/style-library` 独立 barrel | `@/core/styles` · `createFirstWaveRequiredVariantRegistry()` |
| S9-STORY-002 | **已建立** | **未修改默认路径** |

### 1.1 为何 v0 采用 code-backed TS manifest（DECISION-095）

- 与现有 `VisualAssetRegistry`、harvest candidate 模块惯例一致
- 资产量小（2 seed + sample patch）；Zod + TS 类型安全
- Git review / rollback 与 JSON 等价（revert TS 文件）
- manifest 保留 `sourceType: "json" | "external"` 预留；S10+ 可迁移 JSON / CMS / DB

**S9-STORY-002 约束：**

- `manifest.ts` **无 import-time assert**；一致性由 `validateStyleLibraryManifest` 与测试覆盖
- seed asset **不得**经 registry patch 进入 user-selectable / default（promote → **S9-STORY-007**）
- **不**修改 `createFirstWaveRequiredVariantRegistry`、`src/core/styles/index.ts`
- **不**将 `@/core/style-library` re-export 到 `@/core/styles`

---

## 2. 目录结构

```text
src/core/style-library/
  index.ts                 # 独立公共 API（@/core/style-library）
  tokens.ts                # STYLE_LIBRARY_SCHEMA_VERSION
  types.ts                 # 治理层类型
  schemas.ts               # Zod schema
  manifest.ts              # STYLE_LIBRARY_MANIFEST（无 assert）
  validation.ts            # parse / validate / query helpers
  registry-patch.ts        # patch 语义校验
  assets/
    seed-variant-assets.ts   # 006D seed metadata
    evidence-refs.ts         # QA evidence 引用
    sample-registry-patch.ts # inactive sample patch
```

---

## 3. Manifest 格式

```typescript
StyleLibraryManifest {
  schemaVersion: 1,
  libraryId: "qingpian-style-library-v0",
  updatedAt: "YYYY-MM-DD",
  assets: StyleLibraryAsset[],
  seedAssetIds: string[],
  registryPatches: StyleLibraryRegistryPatch[],
  evidenceRefs: StyleLibraryEvidenceRef[],
  lifecycleRefs: StyleLibraryLifecycleRef[],
}
```

JSON 等价示例（未来迁移参考）：

```json
{
  "schemaVersion": 1,
  "libraryId": "qingpian-style-library-v0",
  "updatedAt": "2026-06-05",
  "seedAssetIds": ["seed-variant-heading-purple-chapter-label"],
  "assets": [],
  "registryPatches": [],
  "evidenceRefs": [],
  "lifecycleRefs": []
}
```

---

## 4. Asset Metadata 格式

### 4.1 Variant asset（治理 metadata）

```typescript
{
  assetId: "seed-variant-heading-purple-chapter-label",
  assetType: "variant",
  runtimeVariantId: "heading_purple_chapter_label_candidate",
  blockType: "heading",
  styleFamily: "harvestCandidate",
  lifecycle: "paste_qa_pass",
  distribution: {
    userSelectable: false,
    defaultEligible: false,
    release1Required: false
  },
  isSeedAsset: true,
  evidenceIds: ["WX-HARVEST-EVIDENCE-001", "S8M-HARVEST-001", ...]
}
```

**不内嵌** `VariantDefinition`；运行时定义仍在 [`harvest-candidate-variants.ts`](../../src/core/styles/variants/harvest-candidate-variants.ts)。

### 4.2 其他 asset 类型（v0 预留）

| assetType | 用途 | S9-STORY-002 |
|-----------|------|--------------|
| `palette` | 配色包 metadata | schema 已定义 · 无实例 |
| `preset` | 风格包 metadata | schema 已定义 · 无实例 |
| `rule` | copy-safe / selection rule 引用 | schema 已定义 · 无实例 |

---

## 5. Registry Patch 格式

```typescript
StyleLibraryRegistryPatch {
  patchId: string,
  operation: "add_variant_definition" | "add_to_variant_pool" | "set_default_variant",
  variantId: string,
  targetPresetId?: string,
  requiresLifecycle?: StyleLibraryLifecycleState,
  requiresEvidenceIds?: string[],
  active: boolean,
  notes?: string
}
```

### 5.1 v0 校验规则（`validateStyleLibraryRegistryPatch`）

| 规则 | 说明 |
|------|------|
| inactive patch | 仅 schema 校验，不产生 semantic issue |
| seed + active + pool/default | **禁止**（S9-STORY-002；promote → S9-STORY-007） |
| `add_to_variant_pool` | 须 `asset.distribution.userSelectable === true` |
| `set_default_variant` | 须 `asset.distribution.defaultEligible === true` |
| lifecycle | active patch 须满足 `requiresLifecycle` |
| evidence | `requiresEvidenceIds` 须存在于 `manifest.evidenceRefs` |

**S9-STORY-002：** 所有 shipped patch `active: false` — **不接入** runtime registry。

---

## 6. Seed Asset 规则（006D）

| assetId | runtimeVariantId | 角色 |
|---------|------------------|------|
| `seed-variant-heading-purple-chapter-label` | `heading_purple_chapter_label_candidate` | seed · paste_qa_pass |
| `seed-variant-info-card-reading-path` | `info_card_reading_path_candidate` | seed · paste_qa_pass |

**禁止：**

- `userSelectable` / `defaultEligible` / `release1Required`
- active registry patch 进入 pool 或 default preset
- 接入 Gallery / default preset / `createFirstWaveRequiredVariantRegistry()`

---

## 7. Git Review / Rollback

| 操作 | 方式 |
|------|------|
| 新增资产 | PR 修改 `assets/` + `manifest.ts` |
| 回滚定义 | Git revert TS 文件 |
| evidence 历史 | 保留 `evidenceRefs` / `lifecycleRefs` 记录，不删除 audit trail |
| promote | **S9-STORY-007** 才激活 patch 并写入 runtime pool |

---

## 8. 与 Domain Model 映射

| Domain Model | Style Library |
|--------------|---------------|
| Style / Preset / Palette / Rule | asset types + metadata |
| Variant lifecycle | `lifecycle` + `lifecycleRefs` |
| QA Evidence | `evidenceRefs` + variant `evidenceIds` |
| user_selectable / default_eligible | `distribution` flags |
| Registry patch | `registryPatches`（inactive until promote） |
| Harvest candidate | seed variant assets |

详见 [`style-management-domain-model.md`](style-management-domain-model.md)。

---

## 9. 与 StyleRegistry 边界

```text
StyleLibrary (S9 governance)
  ├── STYLE_LIBRARY_MANIFEST
  ├── seed metadata only
  └── registryPatches (inactive)

StyleRegistry (runtime · unchanged S9-002)
  ├── createFirstWaveRequiredVariantRegistry()
  └── harvest-candidate-variants.ts (NOT in default registry)
```

S9-STORY-007 promote 时才会将 active patch 应用到 runtime pool — **不在 S9-STORY-002 实现**。

---

## 10. 后续 Story 消费关系

| Story | 消费本存储 |
|-------|------------|
| S9-STORY-003 Admin Shell | 读取 manifest · assets 列表 |
| S9-STORY-004 Lifecycle | 更新 `lifecycleRefs` · 转换规则 |
| S9-STORY-005 Harvest | 新增 candidate variant assets |
| S9-STORY-007 Promote | 激活 registry patch · 写入 runtime pool |

---

## 11. 公共 API

```typescript
import {
  STYLE_LIBRARY_MANIFEST,
  parseStyleLibraryManifest,
  validateStyleLibraryManifest,
  getStyleLibraryAssetById,
  getStyleLibraryVariantAssets,
  getStyleLibrarySeedAssets,
  validateStyleLibraryRegistryPatch,
} from "@/core/style-library";
```

**注意：** 使用 `@/core/style-library`，**不要**从 `@/core/styles` 导入。

---

## 12. 参考

- [`style-management-domain-model.md`](style-management-domain-model.md)
- DECISION-092 · DECISION-094 · **DECISION-095**
- S8-STORY-006D · WX-HARVEST-EVIDENCE-001
