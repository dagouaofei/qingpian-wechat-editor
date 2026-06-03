# Execution Report：Heading Publish 第二轮粘贴 QA + Copy 契约

## 1. 基本信息

- 日期：2026-06-03
- 当前分支：`feature/s7-story-007a-r1-style-fidelity`
- 来源分支：`sprint/7`
- 目标合并分支：`sprint/7`
- Sprint：Sprint 7
- 关联：S7-STORY-008、`docs/agile/paste-qa/heading-publish-8.md`（第二轮测试列）
- 执行者：Cursor
- 状态：In Review（待 PO 第三轮粘贴）

## 2. 本轮目标

1. 按 PO **第二轮测试** FAIL 描述修复 6 款 Preview/Copy
2. 提炼 **Copy 一致性共性问题**，用契约 + 同源实现替代「肉眼测一款改一款」

## 3. 执行范围

- **做了：** `heading-publish-decoration.ts`（token + contract）、`heading-publish-copy-html.ts`（8 款 Copy 唯一实现）、Preview 对齐、parity 测试挂 contract、架构说明文档
- **没做：** 未代 PO 粘贴公众号；未改 Sprint/Story 状态为 Done

## 4. 修改文件

- `src/core/renderer/heading-publish-decoration.ts`（新增）
- `src/core/renderer/heading-publish-copy-html.ts`（新增）
- `src/core/renderer/heading-publish-visual.ts`
- `src/core/copy/title-heading-copy-styles.ts`
- `src/core/copy/title-block-copy.ts`
- `src/core/renderer/title-heading-visual.ts`
- `src/components/preview/title-heading-preview-block.tsx`
- `tests/core/styles/heading-publish-parity.test.ts`
- `tests/core/renderer/heading-ordinal.test.ts`
- `docs/agile/paste-qa/heading-publish-8.md`
- `docs/product/heading-publish-catalog.md`
- `docs/architecture/heading-publish-copy-contract.md`（新增）

## 5. 新增文件

- `src/core/renderer/heading-publish-decoration.ts`
- `src/core/renderer/heading-publish-copy-html.ts`
- `docs/architecture/heading-publish-copy-contract.md`

## 6. 第二轮 FAIL → 修复映射

| Variant | PO 第二轮 | 修复 |
|---------|-----------|------|
| `heading_highlight_marker` | 字下荧光笔粗细横线，字压住条，不要字底灰 | 字 `transparent` + 独立 4px 色条 `margin-top:-3px` |
| `heading_magazine_left_bar` | 竖线等高三行；copy 勿粗线/外框 | Preview `stretch`；Copy `width:auto` 窄表、无 section 边框 |
| `heading_magazine_offset` | 字后无背景；卡片圆角 | `background-color:transparent` + `border-radius:8px` |
| `heading_numbered_section` | 应与极简数字不同 | 26px 圆章 badge（Copy/Preview） |
| `heading_top_badge_topic` | 胶囊无灰底（共性） | `copySafeTopicPillStyle` 透明底 |
| `heading_icon_prefix` | 无灰底、字更大 | `copySafeIconPrefixGlyphStyle` 20px 无盒 |

**已通过（第二轮）：** `heading_short_line`、`heading_minimal_number`

## 7. Copy 一致性机制

- **共性：** `HEADING_PUBLISH_NO_FILL_ON_LABEL`、contract 禁止满宽竖线表、numbered/minimal 互斥结构
- **验收：** `assertHeadingPublishCopyContract()` 在 CI；手测 FAIL 时应先扩展 contract 再改 token
- 文档：`docs/architecture/heading-publish-copy-contract.md`

## 8. 验收标准

| 检查 | 结果 |
|------|------|
| npm run test | PASS（814） |
| npm run build | 见 §9 |
| PO 粘贴第三轮 | 待填 `heading-publish-8.md` |

## 9. 运行检查

| 命令 | 结果 |
|------|------|
| npm run test | PASS |
| npm run build | PASS |

## 10. 未完成事项

- PO 第三轮粘贴填表；若 Contract PASS 仍 FAIL，补充 contract 规则

## 11. 风险

- 微信对 `margin:-3px` 荧光笔叠压可能不稳定；若 FAIL 可改 table 两行结构

## 12. Commit

- 未提交 / not committed
