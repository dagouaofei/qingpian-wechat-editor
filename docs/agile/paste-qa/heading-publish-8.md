# Heading Publish · 8 款微信公众号粘贴 QA

> **Story：** S7-STORY-008 · **Catalog：** `[heading-publish-catalog.md](../../product/heading-publish-catalog.md)`  
> **日期：** 2026-06-03  
> **状态：** **In Progress**（2026-06-03 代码修复待 PO 重测粘贴 · 自动化 PASS）

## 手测步骤

1. `npm run dev` → 打开 `/gallery` 或 `/dev/style-fidelity`（需 `STYLE_FIDELITY_DEBUG=1` 时）
2. 对每一款 `heading_`*：将样例中所有 heading 设为该 variant（Gallery 小标题下拉或 block 切换）
3. 点击「复制到公众号」或 Copy 对照区复制 HTML
4. 粘贴至 **微信公众号编辑器** 正文区
5. 对照下表：装饰（底线/左条/编号/胶囊/图标）是否与 Preview 一致

## 分项记录


| Variant ID                                           | 中文名   | 第一轮测试                                                                    | 第二轮测试                                                               | 第三轮测试                                                                                                    | 结果   | 第四轮测试                                                     | 第五轮测试                                      |
| ---------------------------------------------------- | ----- | ------------------------------------------------------------------------ | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ---- | --------------------------------------------------------- | ------------------------------------------ |
| `heading_short_line`                                 | 短线标题  | copy显示错误，短线显示错误，变成了左右顶到头的长方形                                             | pass                                                                | 错误当前：短线固定长度期望：短线的长短应该和文字的长短一致。                                                                         | pass | pass                                                      | pass                                       |
| `heading_highlight_marker`                           | 荧光笔强调 | preview显示错误，文字下面有背景色，没有荧光笔的渐变效果copy显示错误，显示为文字下方一条横线，文字背后有背景色；没有显示成荧光笔效果 | 预期是在文字的下方有一条高度像荧光笔粗细的一条横线，文字的下侧盖住横线的一部分，不需要渐变色                      | 错误：线不够粗，文字也没有压住线                                                                                         | fail | fail现在：文字下方没有盖住横线期望：1横线再加粗一些2文字盖住部分横线，文字下边覆盖横线的一半     | fail文字仍然没有盖住横线。请参考miaopian-demo的代码和文档实现  |
| `heading_magazine_left_bar`                          | 杂志竖线  | preview和copy都错误，没有做到miaopian-demo的样式：左侧先一条浅竖线，再一条深竖线，右侧3行分别是编号、固定文字、标题文字 | preview显示错误，左侧的竖线高度应该和右侧的3行文字总高度相同copy后整个区域多了边框，左边的线占了一半的位置，变成了非常粗 | preview通过copy不通过： 1、整体区域仍然有边框2、左侧的竖线显示成了一条占50%宽度的横线3、文字因为横线被挤到了右半边                                    | pass | pass                                                      | pass                                       |
| `heading_magazine_offset`                            | 杂志错位  | preview显示错误，文字背后多了背景色copy显示错误，样式没有显示，只有文字                               | preview错误，文字后面不应该有背景色；另外，整个卡片应设置一定的圆角                              | preview错误：整个卡片的边框颜色和左侧加粗的竖线的颜色不一致，应该跟竖线颜色一致copy正确。为什么preview反而不正确？preview和copy用了规则不同的render吗？识别共性错误和风险 | pass | pass                                                      | pass                                       |
| `heading_numbered_section`                           | 编号小节  | copy显示错误，变成了有外边框，左侧图标宽度很大，文字没有左对齐紧挨着图标编号没有自动增加，所有编号小节都显示1。应该自动增加        | 错误，当前和极简数字样式一样，应该装饰编号，变得不一样                                         | preview错误，编号后面多出了灰色背景，边框颜色需要和编号文字颜色一致copy：边框颜色需要和编号文字颜色一致                                               | pass | 当前一致性没有问题。preview和copy显示一致。但样式不好看，需要修改成更好看的编号            | fail不要再使用圆形编号，换成其它的更有美感的样式                |
| `heading_card_centered`（原 `heading_top_badge_topic`） | 卡片居中  | preview显示错误，卡片多了背景色copy显示正确                                             | preview显示错误，话题两个字后面不应该有背景色。我发现很多个卡片样式都多了一个灰色的背景色，需要检查是否是共性问题       | pass                                                                                                     | pass | pass                                                      | 第五轮代码已替换为卡片居中（透明外框+居中序号/标题）；**待 PO 第六轮粘贴** |
| `heading_icon_prefix`                                | 图标前缀  | preview显示错误，图标左边多了一条竖线copy显示错误，变成了有外边框，左侧图标宽度很大，文字没有左对齐紧挨着图标            | preview显示错误，图标多了灰色的背景色，里面的图形太小                                      | preview正确copy错误：图标和文字没有居中对齐，图标的三角形和preview的三角形形状不一样                                                     | pass | preview正确copy错误：1、文字没有左对齐，紧挨着左侧图标2、图标的三角形和preview显示的不一样 | pass                                       |
| `heading_minimal_number`                             | 极简数字  | preview显示错误，没有显示数字copy显示错误，没有显示数字                                       | pass                                                                | pass                                                                                                     | pass | pass                                                      | pass                                       |


## 汇总


| 指标      | 目标           | 当前          |
| ------- | ------------ | ----------- |
| PASS 款数 | ≥6/8         | 7（待 PO 第六轮） |
| FAIL 登记 | 须写 `bugs.md` | 1（待重测）      |


## 判定规则

- **PASS：** 与 Preview 核心装饰一致，无整段变纯文本、无 `style` 截断
- **FAIL：** 登记 Bug；不得在无真实粘贴时标 PASS
- **边界：** 不宣称 Release 1 / Sprint 8 全量粘贴完成；全文 golden 仍见 `[r1-golden-paste-qa.md](r1-golden-paste-qa.md)`

## 代码侧预检（Cursor）

- `heading-publish-parity.test.ts`：8× copy-safe + `**HEADING_PUBLISH_COPY_CONTRACT`**（装饰结构/禁止项，非肉眼逐款）
- `heading-ordinal.test.ts`：多 heading 自动 01/02；numbered 与 minimal 结构可区分
- 同源 token：`src/core/renderer/heading-publish-decoration.ts`（Preview/Copy 共用；禁止无灰底填充见 `HEADING_PUBLISH_NO_FILL_ON_LABEL`）
- Copy HTML 无 `linear-gradient` / `var(--` / `class`（heading 路径）
- **2026-06-03 第二轮修复：** 荧光笔=字下 4px 色条（字无底色）；杂志竖线=窄双条+无 section 边框；错位=透明底+8px 圆角；编号=26px 圆章≠极简序号；胶囊/图标=透明底
- **2026-06-03 第三轮修复：** Preview 注入 `themePalette` 与 Copy 同源；短线随字宽；荧光笔 6px 叠压；杂志竖线改 border-left 双轨（禁 table）；错位/编号边框色=accent；图标 table 垂直居中 + 统一 glyph
- **2026-06-03 第四轮修复：** 荧光笔改为同 span `border-bottom:8px`（禁负 margin 分离条）；编号 28px 浅底圆章；图标行改 inline 紧贴 + 固定 `▸` 字形
- **2026-06-03 第五轮修复：** 荧光笔改窄 table 双行（12px 色条）；编号改 accent 方牌（禁圆章）；`heading_top_badge_topic` 替换为 `heading_card_centered`（透明外框 + 居中序号/标题）

