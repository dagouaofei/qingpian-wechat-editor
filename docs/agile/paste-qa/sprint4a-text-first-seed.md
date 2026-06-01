# Sprint 4-A Text-first Paste QA Seed

> 状态：Not Run。本文件只建立最小 Paste QA seed，不代表已完成人工微信公众号粘贴验证。

## 范围

- Sprint：Sprint 4-A
- 对象：text-first Copy HTML snapshot seed
- 覆盖 block：title / heading / lead / paragraph / divider
- 不覆盖：list / quote / highlight / info_card / cta / image_placeholder
- 不执行：真实 Clipboard API / 微信公众号后台人工粘贴

## Seed Records

| Test ID | Block | Variant | copySafety | 检查点 | 需要人工验证 | 状态 |
|---------|-------|---------|------------|--------|--------------|------|
| S4A-PASTE-title-plain-minimal | title | `title_plain_minimal` | strict | 标题字号与字重保留；居中对齐保留 | Yes | Not Run |
| S4A-PASTE-heading-numbered-section | heading | `heading_numbered_section` | balanced | 章节标题字号保留；编号文本保留 | Yes | Not Run |
| S4A-PASTE-lead-accent-band | lead | `lead_accent_band` | balanced | 导语文本保留；背景色和左侧强调带基本保留 | Yes | Not Run |
| S4A-PASTE-paragraph-soft-card | paragraph | `paragraph_soft_card` | balanced | 正文文本保留；卡片背景、边框和圆角基本保留 | Yes | Not Run |
| S4A-PASTE-divider-simple-line | divider | `divider_simple_line` | strict | 实线分隔符可见；上下间距基本保留 | Yes | Not Run |
| S4A-PASTE-divider-dotted-line | divider | `divider_dotted_line` | balanced | 虚线分隔符可见；无 class 或 style tag 依赖 | Yes | Not Run |

## 说明

- 本轮仅生成 seed，不填写 PASS / FAIL。
- `balanced` variant 需要在后续真实 Paste QA 中重点观察微信编辑器是否保留装饰细节。
- 后续如执行真实 QA，应将结果记录到正式 Paste QA 记录或 bugs backlog。
