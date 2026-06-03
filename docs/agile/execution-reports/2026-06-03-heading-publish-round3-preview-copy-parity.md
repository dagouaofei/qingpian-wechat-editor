# Execution Report：Heading Publish 第三轮 + Preview/Copy 共性对齐

## 1. 基本信息

- 日期：2026-06-03
- 当前分支：`feature/s7-story-007a-r1-style-fidelity`
- 目标合并分支：`sprint/7`
- 关联：S7-STORY-008、`heading-publish-8.md` 第三轮测试列
- 状态：In Review（待 PO 第四轮粘贴）

## 2. 本轮目标

- 修复第三轮 6 款 FAIL（含 Preview-only / Copy-only）
- 提炼并修复 **Preview 与 Copy 共性不一致**（palette 分叉、table 粘贴退化、装饰宽度）

## 3. 共性修复（核心）

| 共性问题 | 根因 | 统一方案 |
|----------|------|----------|
| Preview 边框色与 Copy 不一致 | Preview 用 `resolveTitleHeadingPaletteFromTypography` 把 muted 映射成 `borderSoft` | `title-block-preview` 输出 **`themePalette`**（`resolveThemePaletteTokens`，与 Copy 相同） |
| 杂志竖线 Copy 变 50% 横条 | 微信破坏 `<table>`+`td` 背景 | 全池改用 **嵌套 `section` + 双 `border-left`**，禁止竖线 table |
| 短线固定 200px | token 写死宽度 | **`inline-block` wrap + `width:100%` 底线**，随标题字宽 |
| 编号圆章灰底/边框色不对 | `bgBandBlue` + `borderSoft` | 透明底 + **`border`/`color` = `textAccent`** |
| 错位卡片描边色弱于左条 | `borderSoft` vs `textAccent` | 四边描边统一 **`textAccent`** |
| 图标 Copy 未对齐 | span `vertical-align` 不可靠 | **窄 table + `vertical-align:middle`**；**`iconGlyph` 优先** |

## 4. 第三轮 FAIL 映射

| Variant | 第三轮 PO | 处理 |
|---------|-----------|------|
| `heading_short_line` | 短线应与文字等宽 | 随字宽 wrap |
| `heading_highlight_marker` | 线更粗、字压住线 | 6px 条 + `padding` 叠压 |
| `heading_magazine_left_bar` | copy 边框/横条 | 去 table，border-left 双轨 |
| `heading_magazine_offset` | preview 边框色 | `themePalette` + accent 描边 |
| `heading_numbered_section` | 灰底/边框色 | 透明圆章 + accent 描边 |
| `heading_icon_prefix` | copy 对齐/字形 | table 居中 + glyph 统一 |

**PASS 保持：** `heading_top_badge_topic`、`heading_minimal_number`

## 5. 修改文件（摘要）

- `heading-publish-decoration.ts` — token/contract/ palette helper
- `heading-publish-copy-html.ts` — Copy 结构重写
- `heading-publish-visual.ts`、`title-heading-preview-block.tsx`
- `title-block-preview.ts`、`types.ts`
- `docs/architecture/heading-publish-copy-contract.md`
- `docs/agile/paste-qa/heading-publish-8.md`

## 6. 检查

| 命令 | 结果 |
|------|------|
| npm run test | PASS（814） |
| npm run build | PASS |

## 7. Commit

- 未提交 / not committed
