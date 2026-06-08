# WeChat Compatibility Spec

> 轻篇公众号排版 · qingpian-wechat-editor  
> **Sprint 10 · S10-STORY-011A**  
> **代码：** `src/core/wechat-compatibility/`  
> **关联：** [`wechat-safe-html-css-contract.md`](wechat-safe-html-css-contract.md) · [`article-variant-dsl-runtime.md`](article-variant-dsl-runtime.md)

---

## 1. 定位

公众号样式规范是**独立中心约束层**，被以下路径复用：

- HTML → DSL Encoder
- Variant DSL schema 校验
- DSL → HTML Decoder 输出校验
- Copy HTML validator
- Admin inspection
- Promote eligibility（011 收口）

---

## 2. 模块结构

```text
src/core/wechat-compatibility/
  wechat-compatibility-spec.ts   # 聚合 API · prompt rules 导出
  allowed-tags.ts
  allowed-style-properties.ts
  style-normalizer.ts
  compatibility-validator.ts
  compatibility-transformer.ts
  index.ts
```

复用既有 `src/core/wechat-compat/copy-html-validator.ts` 作为 copy 路径校验。

---

## 3. 约束范围

### 3.1 HTML

- 允许标签白名单（覆盖 Release 1 十一 blockType 所需标签）
- 禁止标签：`script` · `iframe` · `object` 等
- 移除 event handler 属性
- 移除 `script` 内容与不安全 URL

### 3.2 CSS

- 允许属性白名单（inline style）
- 禁止属性（如 `position: fixed` 等高风险项）
- style value normalize（单位、颜色格式）
- 不兼容样式降级并产出 `issues`

### 3.3 Validator Issue 结构

```typescript
{
  code: string;
  message: string;
  level: "error" | "warning" | "info";
  path?: string;
}
```

---

## 4. 全局 Compatibility Mode（DECISION-109）

**环境变量（优先级高 → 低）：**

1. `QINGPIAN_WECHAT_COMPATIBILITY_MODE`（server）
2. `NEXT_PUBLIC_QINGPIAN_WECHAT_COMPATIBILITY_MODE`（browser decode / Preview / Copy）
3. `STYLE_HARVEST_WECHAT_COMPATIBILITY_MODE`（legacy alias）
4. 默认：**`off`**

| 模式 | 行为 |
|------|------|
| `off` | **仅 sanitize**（Harvest）；跳过 Contract validator · Copy allowlist 过滤 · flex→block 整形 · `copy-safe-html` 规则 |
| `report` | 运行 compatibility analyzer / validator，生成 issues / warnings，**不主动降级样式** |
| `enforce` | 严格 transform / downgrade / blocking |

**永远开启：** `sanitizeHarvestHtml`（Harvest 入口）— sanitize 不可关闭。

**代码：**

- `src/core/wechat-compatibility/resolve-wechat-compatibility-mode.ts` — `getWechatCompatibilityMode`
- `src/core/wechat-compatibility/harvest-compat-mode.ts` — `applyWechatCompatibilityForHarvest`
- `src/server/style-admin/harvest/harvest-compatibility-mode.ts` — Harvest UI 描述

**已知债务（暂不处理）：** [`wechat-compatibility-known-debt.md`](wechat-compatibility-known-debt.md)

Trace / metadata 字段：`wechatCompatibilityMode`（`harvestMeta` · `compatibilityJson` · Harvest encoder trace）— **Harvest 历史审计**；有效 mode 暂仅来自全局 env。

Promote readiness：`compatibilityStatus` = `pass` | `failed` | `skipped` | `not_enforced`；global `off` 时为 `skipped`（不阻断 promote，UI 须标注 Paste QA 要求）。

---

## 5. 应用场景

### 5.1 HTML 粘贴 → Variant DSL

```text
公众号 HTML（大概率已兼容）
  → normalize
  → semantic extraction（heading: slots + layoutIntent + tokens）
  → encode to shallow Variant DSL

普通网页 HTML
  → sanitize
  → transform / downgrade
  → semantic extraction
  → encode to compatible DSL
  → issues + lossReport 说明被降级/丢弃项
```

**FIX-B Encoder fidelity：** 复杂 heading 不得原样深层 DOM 搬运。须提取语义 slot 并记录 loss：

| 降级/丢弃项 | lossReport 示例 |
|-------------|-----------------|
| `display:flex` | `display:flex downgraded` |
| `letter-spacing` 高风险 | `letter-spacing risky` |
| negative margin | `negative margin normalized` |
| `span[leaf]` | `leaf span unwrapped` |
| 空 `<br>` | `empty br removed` |
| 过深嵌套 | `deep nesting flattened` |

提取结果写入 Variant DSL `meta.extractedSlots` · `meta.layoutIntent` · `meta.decorators` · `tokens`，供 Decoder 与 Admin trace 展示。

### 5.2 AI 生成 DSL（预留）

本轮不实现 AI 生成，但 spec 可作为 future prompt / validator 约束：

```text
AI style requirement + getWechatCompatibilityPromptRules()
  → Variant DSL
  → Validator
```

---

## 6. 与 Decoder 集成

`decodeVariantDsl` 在产出 copy HTML 后调用 `validateHtmlStructureCompatibility`，失败则显式错误，**禁止 silent empty render**。

Decoder 须附带 `DecoderTrace`：

```typescript
{
  target: "preview" | "copy_wechat" | "admin_inspection" | "qa_snapshot";
  decoderPath: "tree" | "renderContract" | "none";
  rendered: boolean;
  outputLength: number;
  missingSlots: string[];
  unsupportedNodes: string[];
  unsupportedStyles: string[];
  issues: string[];  // e.g. DSL_SLOT_MISSING:title · DSL_RENDER_EMPTY
}
```

`rendered=true` 当且仅当输出含可见内容（html 或 preview output）；无效 DSL 返回 blocking issue，不返回空成功。
