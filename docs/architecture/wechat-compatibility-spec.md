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

## 4. 应用场景

### 4.1 HTML 粘贴 → Variant DSL

```text
公众号 HTML（大概率已兼容）
  → normalize
  → encode to DSL

普通网页 HTML
  → sanitize
  → transform / downgrade
  → encode to compatible DSL
  → issues 说明被降级项
```

### 4.2 AI 生成 DSL（预留）

本轮不实现 AI 生成，但 spec 可作为 future prompt / validator 约束：

```text
AI style requirement + getWechatCompatibilityPromptRules()
  → Variant DSL
  → Validator
```

---

## 5. 与 Decoder 集成

`decodeVariantDsl` 在产出 copy HTML 后调用 `validateHtmlStructureCompatibility`，失败则显式错误，**禁止 silent empty render**。
