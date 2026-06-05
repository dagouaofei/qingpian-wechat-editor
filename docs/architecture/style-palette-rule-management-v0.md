# Style / Palette / Rule Management v0

> 轻篇公众号排版 · qingpian-wechat-editor  
> **Sprint 9 · S9-STORY-008** · Operator-facing metadata management  
> **DECISION-102** · **关联：** [`style-library-storage.md`](style-library-storage.md) · [`style-library-promote-user-selectable.md`](style-library-promote-user-selectable.md)

---

## 1. 定位

S9-STORY-008 将 `/dev/style-library` 从「候选 variant 工作台」扩展为样式管理后台 v0 雏形，让运营人员读懂：

```text
Style 风格 → Palette 配色 → Variant / Candidate → Copy-safe / Selection Rules → S10 批量扩展
```

| 是 | 不是 |
|----|------|
| 运营可读 Style / Palette / Rule 列表与关联 | 复杂在线主题编辑器 |
| code-backed metadata · manifest 登记 | 数据库 · 浏览器写 TS |
| S10 扩展规划入口 | runtime StyleRegistry 编辑器 |
| 只读 / disabled 管理动作 | Gallery / Preview / Copy 默认行为修改 |

---

## 2. 管理对象定义

### Style（风格）

运营语义中的视觉方向，非单个 variant。定义于 `style-assets.ts`（code-backed metadata，非 manifest assetType）。

字段：styleId · name zh/en · description · intendedUseCases · targetArticleTypes · tone · density · linkedPaletteIds · linkedVariantAssetIds · linkedRuleIds · lifecycle · operatorNotes · s10ExpansionHints · readyForExpansion

### Palette（配色）

manifest `assetType: palette` + `palette-assets.ts` 扩展 metadata（颜色 · copy-safe · contrast · 兼容风格）。

### Rule（规则）

manifest `assetType: rule` + `rule-assets.ts` 扩展 metadata。

| ruleType | 说明 |
|----------|------|
| **copy_safe** | WeChat 复制安全 / Paste QA / promote 相关约束 |
| **selection** | 样式选择 / distribution / release1 相关约束 |

---

## 3. 与 Variant / Candidate 的关系

- 006D seed variant 通过 `style-palette-rule.ts` 关联 style / palette / rule
- Candidate Review 卡片展示 linked style / palette / rules
- 无关联时显示「未关联风格 / 配色 / 规则」

---

## 4. 与 Style Library Manifest 的关系

`STYLE_LIBRARY_MANIFEST.assets` 包含：

- variant（006D seeds）
- palette（2 个 seed）
- rule（4 个 seed）

Style definitions 为 parallel metadata，通过 linked IDs 关联 manifest assets。

---

## 5. 与 runtime StyleRegistry 的边界

- palette metadata **不**接入 runtime theme
- **不**修改 `createFirstWaveRequiredVariantRegistry`
- **不**激活 registry patch
- **不**进入 Gallery / Preview / Copy 默认路径

---

## 6. 与 copy-safe contract 的关系

copy_safe rules 引用 promote / Paste QA / WARNING 运营约束，与 S9-STORY-006 inspection 及 S9-STORY-007 promote 一致。

---

## 7. 与 style selection rule 的关系

selection rules 明确 user_selectable ≠ default_eligible、harvest candidate 不得直接进入 release1_required。

---

## 8. 为什么不做在线编辑

S9 v0 为 file-backed 治理层；metadata 变更需 code review / PR，与 lifecycle proposal · promote proposal 一致。

---

## 9. 为什么不用数据库

Style Library v0 以 code-backed manifest + metadata 为事实源，避免引入平行存储与 sync 复杂度。

---

## 10. 与其他 Story 的关系

| Story | 关系 |
|-------|------|
| **S9-STORY-005** harvest | 未来 harvest 候选可关联 style / palette；本轮不做 harvest 向导 |
| **S9-STORY-007** promote | promote 仍仅 user_selectable；rules 约束 default / release1 |
| **S10** expansion | style.s10ExpansionHints · readyForExpansion 承接批量扩展规划 |

---

## 11. 代码结构

```text
src/core/style-library/
  style-assets.ts
  palette-assets.ts
  rule-assets.ts
  style-palette-rule.ts
src/app/dev/style-library/
  style-library-style-rule-view-model.ts
```

---

## 12. 测试

- `tests/core/style-library/style-palette-rule-management.test.ts`
- `tests/app/dev/style-library/style-library-style-rule-view-model.test.ts`

---

## 13. 参考

- **DECISION-102** · DECISION-101 · DECISION-095 · DECISION-097
- [`style-library-admin-shell.md`](style-library-admin-shell.md)
