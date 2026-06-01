# Sprint 4-B Structured Blocks Copy HTML Snapshot Seed

> 状态：Not Run。本文件只记录 structured blocks Copy HTML snapshot seed 与后续人工粘贴检查点，不代表已完成微信公众号真实粘贴验证。

## 范围

- Sprint：Sprint 4-B
- Story：S4B-STORY-006
- 对象：structured blocks Copy HTML snapshot seed
- 覆盖 block：list / quote / highlight / info_card / cta / image_placeholder
- 覆盖 variants：18 个 first-wave structured variants
- Snapshot 来源：真实 Copy Renderer 输出（`buildCopyHtmlSnapshot` + `createSprint4BStructuredCopyRendererRegistry`）
- 不执行：真实 Clipboard API / 微信公众号后台人工粘贴 / 业务页面 Copy 按钮

## Copy-Safe Seed Checks

本轮 snapshot seed 的单元测试检查：

- 无 Tailwind `class` / `className`
- 无 `<style>` / `<script>` / external stylesheet
- 无事件处理属性
- 无 CSS variables
- 无 `position:absolute`
- 无 `transform`
- 无 pseudo element 依赖
- 无 `display:flex` / `display:grid`
- cta 不输出真实 `<button>` / `<a href>` / QR image
- image_placeholder 不输出真实 `<img>`

## Seed Records

| Test ID | Block | Variant | copySafety | Renderer Coverage | 需要人工验证 | Paste QA 状态 |
|---------|-------|---------|------------|-------------------|--------------|---------------|
| S4B-STRUCTURED-list-plain-bullets | list | `list_plain_bullets` | strict | Copy snapshot covered | Yes | Not Run |
| S4B-STRUCTURED-list-numbered-steps | list | `list_numbered_steps` | balanced | Copy snapshot covered | Yes，重点看编号与缩进 | Not Run |
| S4B-STRUCTURED-list-checklist-cards | list | `list_checklist_cards` | balanced | Copy snapshot covered | Yes，重点看轻量卡片感 | Not Run |
| S4B-STRUCTURED-quote-plain | quote | `quote_plain` | strict | Copy snapshot covered | Yes | Not Run |
| S4B-STRUCTURED-quote-left-bar | quote | `quote_left_bar` | balanced | Copy snapshot covered | Yes，重点看 left border 保真 | Not Run |
| S4B-STRUCTURED-quote-card | quote | `quote_card` | balanced | Copy snapshot covered | Yes，重点看边框 / 背景保真 | Not Run |
| S4B-STRUCTURED-highlight-inline-emphasis | highlight | `highlight_inline_emphasis` | strict | Copy snapshot covered | Yes | Not Run |
| S4B-STRUCTURED-highlight-accent-band | highlight | `highlight_accent_band` | balanced | Copy snapshot covered | Yes，重点看强调条保真 | Not Run |
| S4B-STRUCTURED-highlight-soft-card | highlight | `highlight_soft_card` | balanced | Copy snapshot covered | Yes，重点看轻量卡片保真 | Not Run |
| S4B-STRUCTURED-info-card-key-takeaway | info_card | `info_card_key_takeaway` | balanced | Copy snapshot covered | Yes，重点看信息卡边框 / 标题 | Not Run |
| S4B-STRUCTURED-info-card-steps | info_card | `info_card_steps` | balanced | Copy snapshot covered | Yes，重点看步骤文本结构 | Not Run |
| S4B-STRUCTURED-info-card-warning-note | info_card | `info_card_warning_note` | balanced | Copy snapshot covered | Yes，重点看 warning 左边框 / 背景 | Not Run |
| S4B-STRUCTURED-cta-plain-text | cta | `cta_plain_text` | strict | Copy snapshot covered | Yes，仅验证占位文案 | Not Run |
| S4B-STRUCTURED-cta-button-like | cta | `cta_button_like` | balanced | Copy snapshot covered | Yes，仅验证按钮视觉占位，不测真实跳转 | Not Run |
| S4B-STRUCTURED-cta-qr-placeholder | cta | `cta_qr_placeholder` | balanced | Copy snapshot covered | Yes，仅验证 QR 占位盒，不测真实二维码 | Not Run |
| S4B-STRUCTURED-image-placeholder-simple | image_placeholder | `image_placeholder_simple` | strict | Copy snapshot covered | Yes，仅验证图片占位框 | Not Run |
| S4B-STRUCTURED-image-placeholder-caption | image_placeholder | `image_placeholder_caption` | balanced | Copy snapshot covered | Yes，重点看 caption / suggestion 文本 | Not Run |
| S4B-STRUCTURED-image-placeholder-card | image_placeholder | `image_placeholder_card` | balanced | Copy snapshot covered | Yes，重点看轻量卡片占位 | Not Run |

## Release 1 占位契约

- cta 仅验证占位文本和视觉结构，不验证真实 QR、真实链接跳转、小程序卡片或 JS 行为。
- image_placeholder 仅验证占位框、caption、suggestion 文本，不验证图片上传、图片托管、AI 生图、图库搜索或真实图片输出。

## 后续归属

- 真实微信公众号 Paste QA 回归归属 Sprint 6-B。
- 本文件不记录人工粘贴结果；执行真实 QA 后应另建正式 QA 记录或更新对应 QA 文档。
