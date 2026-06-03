# R1 Style Quality Baseline · 公众号默认排版基准

> **Release 1** 默认成稿样式审美与微信粘贴约束。  
> **关联：** S7-STORY-007A · DECISION-085 · US-R1-013

---

## 1. 整篇视觉基准

- 默认方向：**清爽、现代、微信安全、内容优先**。
- **正文不得卡片化**（`paragraph` 默认 `paragraph_plain_body`）。
- **卡片**仅用于强语义块：`info_card`、`highlight`、`quote`（适度）、尾部 `cta`。
- **强视觉 block 不得连续 ≥3**；连续卡片化强调 ≤2（RCARD）。
- **小标题**层级稳定；同篇 heading **统一 variant**（miaopian 对齐）。
- **CTA** 默认在文末；中部仅用 `cta_plain_text` 或省略。
- **divider** 仅大段切换；不连续出现；默认少用。

---

## 2. Typography baseline

| 元素 | 基准 |
|------|------|
| 正文 | 16px（可选 15px 仅小屏微调） |
| 正文 line-height | 1.75 |
| 正文 color | `#333333` / `#374151` |
| 次级文本 | `#666666` / `#6B7280` |
| 标题 | 22–25px |
| 小标题 | 17–18px |
| 字体栈 | PingFang SC, Microsoft YaHei, sans-serif |

**Copy 要求：** 每个文本节点 `inline`：`font-size`、`font-family`、`color`、`line-height`。

**代码落点：** `miaopian-typography.ts`（business preset）、theme tokens `text.default` / `text.muted`。

---

## 3. Spacing baseline

| 区域 | 基准 |
|------|------|
| 段落下间距 | 14–18px |
| section heading 上间距 | 28–32px |
| heading 下间距 | 10–14px |
| card padding | 14–18px |
| card margin | 16–20px |
| 首尾留白 | 稳定、不过紧 |

---

## 4. Decoration baseline

- 优先 **border / background-color / 真实 DOM 线**。
- 避免：**box-shadow、gradient、absolute、复杂 flex/grid**。
- slot 装饰必须 **copy-safe**。
- title / heading 装饰线须 **Copy 可还原**（table + border，无 pseudo）。
- info_card / highlight / cta：**inline** border、background、padding、border-radius。

---

## 5. Golden 验收锚点

| Fixture | 用途 |
|---------|------|
| `r1-golden-default-article` | 默认路径 · 全 block 类型 · 粘贴主锚点 |
| `r1-golden-structured-article` | 结构化块密度 · RCARD / 强视觉间距 |
| `r1-golden-longform-article` | 长文节奏 · heading 稳定 · 尾部 CTA |

**Preset / theme：** `presetId=business`（`classic-news` alias）、`themeId=businessBlue`。

---

## 6. 非目标

- 不新增 variant 数量为本轮目标。
- 不引入 Visual Layer / Space Style 旧方案。
- 不建立平行 Article / Renderer 结构。
