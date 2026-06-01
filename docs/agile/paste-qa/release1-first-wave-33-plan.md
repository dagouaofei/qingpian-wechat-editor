# Release 1 First-Wave 33 Variants Minimal Paste QA Plan

> 状态：Not Run。本文件是 first-wave 33 variants 的最小 Paste QA 计划，不代表已完成微信公众号真实粘贴验证。

## 范围

- Release：Release 1
- 覆盖 blocks：11 个
- 覆盖 variants：33 个 first-wave required variants（11 block × 3 variants）
- Renderer coverage：text-first + structured Copy Renderer 已纳入计划
- Paste QA 状态：全部 `Not Run`
- 后续归属：真实微信公众号 Paste QA 回归进入 Sprint 6-B

## 明确不做

- 不执行真实微信公众号 Paste QA
- 不调用浏览器 Clipboard API
- 不新增业务页面 / Copy 按钮
- 不测试真实 QR、真实链接跳转、小程序卡片、图片上传、图片托管、AI 生图或图库搜索
- 不把任何条目标记为人工粘贴已通过

## Plan Records

| # | Scope | Block | Variant | copySafety | Renderer Coverage | Paste QA 状态 | 后续人工验证重点 |
|---|-------|-------|---------|------------|-------------------|---------------|------------------|
| 1 | text-first | title | `title_plain_minimal` | strict | Copy renderer covered | Not Run | 标题文本、字号、字重 |
| 2 | text-first | title | `title_left_bar_classic` | strict | Copy renderer covered | Not Run | 左侧强调边框 |
| 3 | text-first | title | `title_bottom_line_editorial` | balanced | Copy renderer covered | Not Run | 底部分隔线与间距 |
| 4 | text-first | heading | `heading_plain_minimal` | strict | Copy renderer covered | Not Run | 标题层级文本 |
| 5 | text-first | heading | `heading_numbered_section` | balanced | Copy renderer covered | Not Run | 编号文本与标题结构 |
| 6 | text-first | heading | `heading_top_badge_topic` | balanced | Copy renderer covered | Not Run | 顶部 badge 表达 |
| 7 | text-first | lead | `lead_plain_intro` | strict | Copy renderer covered | Not Run | 导语正文 |
| 8 | text-first | lead | `lead_accent_band` | balanced | Copy renderer covered | Not Run | 强调带背景 / 边框 |
| 9 | text-first | lead | `lead_quote_intro` | balanced | Copy renderer covered | Not Run | quote-like 导语结构 |
| 10 | text-first | paragraph | `paragraph_plain_body` | strict | Copy renderer covered | Not Run | 正文与 inline marks |
| 11 | text-first | paragraph | `paragraph_accent_left` | balanced | Copy renderer covered | Not Run | 左侧强调与正文 |
| 12 | text-first | paragraph | `paragraph_soft_card` | balanced | Copy renderer covered | Not Run | 卡片背景 / 边框 |
| 13 | text-first | divider | `divider_simple_line` | strict | Copy renderer covered | Not Run | 实线分隔符 |
| 14 | text-first | divider | `divider_dotted_line` | balanced | Copy renderer covered | Not Run | 虚线分隔符 |
| 15 | text-first | divider | `divider_section_space` | strict | Copy renderer covered | Not Run | 空间分隔 |
| 16 | structured | list | `list_plain_bullets` | strict | Copy renderer covered | Not Run | bullet 文本结构 |
| 17 | structured | list | `list_numbered_steps` | balanced | Copy renderer covered | Not Run | 编号顺序与缩进 |
| 18 | structured | list | `list_checklist_cards` | balanced | Copy renderer covered | Not Run | checklist 轻量卡片 |
| 19 | structured | quote | `quote_plain` | strict | Copy renderer covered | Not Run | quote 文本 |
| 20 | structured | quote | `quote_left_bar` | balanced | Copy renderer covered | Not Run | left border 保真 |
| 21 | structured | quote | `quote_card` | balanced | Copy renderer covered | Not Run | quote card 边框 / 背景 |
| 22 | structured | highlight | `highlight_inline_emphasis` | strict | Copy renderer covered | Not Run | inline emphasis 轻量表达 |
| 23 | structured | highlight | `highlight_accent_band` | balanced | Copy renderer covered | Not Run | accent band 保真 |
| 24 | structured | highlight | `highlight_soft_card` | balanced | Copy renderer covered | Not Run | soft card 背景 / 边框 |
| 25 | structured | info_card | `info_card_key_takeaway` | balanced | Copy renderer covered | Not Run | title / body 信息卡结构 |
| 26 | structured | info_card | `info_card_steps` | balanced | Copy renderer covered | Not Run | steps 稳定文本结构 |
| 27 | structured | info_card | `info_card_warning_note` | balanced | Copy renderer covered | Not Run | warning 背景 / 左边框 |
| 28 | structured | cta | `cta_plain_text` | strict | Copy renderer covered | Not Run | Release 1 占位文案，不测真实链接 |
| 29 | structured | cta | `cta_button_like` | balanced | Copy renderer covered | Not Run | 按钮视觉占位，不测真实点击 |
| 30 | structured | cta | `cta_qr_placeholder` | balanced | Copy renderer covered | Not Run | QR 占位盒，不测真实二维码 |
| 31 | structured | image_placeholder | `image_placeholder_simple` | strict | Copy renderer covered | Not Run | 图片占位框，不测真实图片 |
| 32 | structured | image_placeholder | `image_placeholder_caption` | balanced | Copy renderer covered | Not Run | caption / suggestion 文本，不测图片能力 |
| 33 | structured | image_placeholder | `image_placeholder_card` | balanced | Copy renderer covered | Not Run | 轻量图片卡片占位，不测真实图片 |

## copySafety 说明

- `strict`：已纳入 copy-safe snapshot / renderer coverage，但真实微信公众号粘贴验证仍未执行。
- `balanced`：已纳入 copy-safe snapshot / renderer coverage，且必须在 Sprint 6-B 真实微信公众号 Paste QA 中重点验证边距、边框、背景、badge、卡片感等保真细节。

## Release 1 占位契约说明

- cta：只验证占位文本与占位视觉结构；不验证真实二维码、真实外链跳转、小程序卡片或 JS 行为。
- image_placeholder：只验证占位框、caption、suggestion 文本；不验证图片上传、图片托管、AI 生图、图库搜索或真实 `<img>` 输出。

## 后续归属

- Sprint 4-B：建立 structured snapshot seed 与 first-wave 33 variants 最小 Paste QA 计划。
- Sprint 6-B：执行真实微信公众号 Paste QA 回归，并在真实结果产生后记录人工验证状态。
