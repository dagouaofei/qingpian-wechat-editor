import { paragraph, sampleArticleBase, sampleBlockId } from "./shared";

const K = 1;
export const sampleKnowledgeArticleRaw = {
  ...sampleArticleBase(K, "公众号排版入门：让读者愿意读完的 5 个习惯", "fixture:sample-knowledge"),
  blocks: [
    { id: sampleBlockId(K, 1), type: "title" as const, content: { text: "公众号排版入门：让读者愿意读完的 5 个习惯" } },
    {
      id: sampleBlockId(K, 2),
      type: "lead" as const,
      content: {
        text: "同一篇文章，排版前后打开率与完读率可能相差一倍。本文用轻篇 Release 1 的 block 结构，示范一篇可读的科普干货。",
      },
    },
    { id: sampleBlockId(K, 3), type: "heading" as const, content: { text: "先给结论，再展开细节", level: 2 as const } },
    {
      id: sampleBlockId(K, 4),
      ...paragraph(
        "读者在手机上停留的时间以秒计。导语之后的第一段应直接回答「这篇文章对我有什么用」，避免空泛开场。",
      ),
    },
    { id: sampleBlockId(K, 5), type: "heading" as const, content: { text: "用层次帮眼睛休息", level: 2 as const } },
    {
      id: sampleBlockId(K, 6),
      ...paragraph(
        "小标题、列表与引用交替出现，可以打断大段文字的压迫感。Release 1 的 heading / list / quote 组合，正是为这种节奏而设计。",
      ),
    },
    {
      id: sampleBlockId(K, 7),
      type: "list" as const,
      content: {
        ordered: true,
        items: [
          { text: "标题区：一句话说清主题", subItems: [] },
          { text: "导语：交代背景与收益", subItems: [] },
          { text: "正文：2–3 个小节推进", subItems: [] },
        ],
      },
    },
    {
      id: sampleBlockId(K, 8),
      type: "highlight" as const,
      content: { text: "排版不是装饰，而是降低阅读成本。", label: "要点" },
    },
    {
      id: sampleBlockId(K, 9),
      type: "cta" as const,
      content: { text: "在轻篇生成你的第一篇排版成稿", action: "try_now" },
    },
  ],
};

const I = 2;
export const sampleIndustryArticleRaw = {
  ...sampleArticleBase(I, "2026 内容工具观察：从生成到排版的下一站", "fixture:sample-industry"),
  blocks: [
    { id: sampleBlockId(I, 1), type: "title" as const, content: { text: "2026 内容工具观察：从生成到排版的下一站" } },
    {
      id: sampleBlockId(I, 2),
      type: "lead" as const,
      content: {
        text: "大模型解决了「写什么」，但公众号发布仍卡在「怎么排」。行业正在从单次生成，走向结构化 Article + 样式系统。",
      },
    },
    { id: sampleBlockId(I, 3), type: "heading" as const, content: { text: "结构化成稿成为共识", level: 2 as const } },
    {
      id: sampleBlockId(I, 4),
      ...paragraph(
        "title、lead、heading、paragraph 等 block 不再是编辑器内部概念，而是生成链路的交付物。Preview 与 Copy 必须共享同一套样式定义。",
      ),
    },
    {
      id: sampleBlockId(I, 5),
      type: "quote" as const,
      content: {
        text: "生成只是起点，排版决定读者是否看完。",
        attribution: "轻篇产品组",
      },
    },
    { id: sampleBlockId(I, 6), type: "divider" as const, content: { style: "line" as const } },
    { id: sampleBlockId(I, 7), type: "heading" as const, content: { text: "对团队意味着什么", level: 2 as const } },
    {
      id: sampleBlockId(I, 8),
      type: "info_card" as const,
      content: {
        title: "三个可验证信号",
        body: "固定 fixture 样例 · Gallery 肉眼评审 · 粘贴 QA 归档",
        icon: "info",
      },
    },
    {
      id: sampleBlockId(I, 9),
      ...paragraph(
        "当样式改动能在 Gallery 的 8 套样例上即时可见，团队就不再依赖「感觉差不多」来验收 Release。",
      ),
    },
  ],
};

const P = 3;
export const sampleProductArticleRaw = {
  ...sampleArticleBase(P, "轻篇 Release 1：一键生成公众号排版成稿", "fixture:sample-product"),
  blocks: [
    { id: sampleBlockId(P, 1), type: "title" as const, content: { text: "轻篇 Release 1：一键生成公众号排版成稿" } },
    {
      id: sampleBlockId(P, 2),
      type: "lead" as const,
      content: {
        text: "输入主题即可走 SSE 流式预览，切换风格与配色后复制微信兼容 HTML——这是 Release 1 的主链路。",
      },
    },
    { id: sampleBlockId(P, 3), type: "heading" as const, content: { text: "核心能力一览", level: 2 as const } },
    {
      id: sampleBlockId(P, 4),
      type: "list" as const,
      content: {
        ordered: false,
        items: [
          { text: "真实 AI 生成结构化 Article", subItems: ["符合统一 Schema"] },
          { text: "Style 系统驱动 Preview / Copy", subItems: ["33 first-wave variants"] },
          { text: "流式预览与复制闭环", subItems: ["SSE block-aware stream"] },
        ],
      },
    },
    { id: sampleBlockId(P, 5), type: "heading" as const, content: { text: "典型使用场景", level: 2 as const } },
    {
      id: sampleBlockId(P, 6),
      type: "info_card" as const,
      content: {
        title: "运营同学的一天",
        body: "早会定题 → 首页输入 → 预览微调风格 → 复制到公众号后台",
        icon: "steps",
      },
    },
    {
      id: sampleBlockId(P, 7),
      type: "image_placeholder" as const,
      content: {
        caption: "产品界面示意（占位）",
        aspectRatio: "16:9" as const,
        position: "full",
        suggestion: "首页输入与预览工作台截图",
      },
    },
    {
      id: sampleBlockId(P, 8),
      type: "cta" as const,
      content: { text: "立即体验轻篇排版", action: "start" },
    },
  ],
};

const B = 4;
export const sampleBrandArticleRaw = {
  ...sampleArticleBase(B, "我们为什么做「轻篇」：让排版回到内容本身", "fixture:sample-brand"),
  blocks: [
    { id: sampleBlockId(B, 1), type: "title" as const, content: { text: "我们为什么做「轻篇」：让排版回到内容本身" } },
    {
      id: sampleBlockId(B, 2),
      type: "lead" as const,
      content: {
        text: "许多团队把时间耗在调间距、改颜色、对齐粘贴效果上。轻篇希望把排版变成生成链路的一部分，而不是事后补救。",
      },
    },
    { id: sampleBlockId(B, 3), type: "heading" as const, content: { text: "从实验到正式产品", level: 2 as const } },
    {
      id: sampleBlockId(B, 4),
      ...paragraph(
        "我们保留了 miaopian 协作中「Landing 即展台」的经验，但拒绝复制 demo 代码或引入第二套 Renderer。",
      ),
    },
    {
      id: sampleBlockId(B, 5),
      type: "quote" as const,
      content: {
        text: "好的排版应该像空气：读者感受得到清晰，却不会被样式抢戏。",
        attribution: "轻篇设计原则",
      },
    },
    { id: sampleBlockId(B, 6), type: "heading" as const, content: { text: "接下来", level: 2 as const } },
    {
      id: sampleBlockId(B, 7),
      type: "highlight" as const,
      content: { text: "Gallery 上的 8 套样例，是我们评审每一轮样式改动的共同语言。", label: "品牌" },
    },
    {
      id: sampleBlockId(B, 8),
      ...paragraph(
        "当你在这些样例上看到 variant 变好一点，Release 1 的样式体验就真的前进了。",
      ),
    },
  ],
};

const E = 5;
export const sampleEventArticleRaw = {
  ...sampleArticleBase(E, "线下沙龙招募：一起打磨公众号排版体验", "fixture:sample-event"),
  blocks: [
    { id: sampleBlockId(E, 1), type: "title" as const, content: { text: "线下沙龙招募：一起打磨公众号排版体验" } },
    {
      id: sampleBlockId(E, 2),
      type: "lead" as const,
      content: {
        text: "邀请运营、编辑与产品同学，用真实样例文章做视觉评审，反馈将直接进入 Sprint 7 backlog。",
      },
    },
    {
      id: sampleBlockId(E, 3),
      type: "info_card" as const,
      content: {
        title: "活动信息",
        body: "时间：2026-06-15 14:00 · 地点：上海 · 名额：20 人",
        icon: "info",
      },
    },
    { id: sampleBlockId(E, 4), type: "heading" as const, content: { text: "议程安排", level: 2 as const } },
    {
      id: sampleBlockId(E, 5),
      type: "list" as const,
      content: {
        ordered: true,
        items: [
          { text: "Gallery 8 套样例 walkthrough", subItems: [] },
          { text: "分组标注「像不像公众号文章」", subItems: [] },
          { text: "Paste QA 问题收集（Sprint 8 输入）", subItems: [] },
        ],
      },
    },
    { id: sampleBlockId(E, 6), type: "divider" as const, content: { style: "dot" as const } },
    { id: sampleBlockId(E, 7), type: "heading" as const, content: { text: "适合谁参加", level: 2 as const } },
    {
      id: sampleBlockId(E, 8),
      ...paragraph(
        "日常负责公众号发稿、对排版有审美要求、或参与轻篇内测的伙伴，都欢迎带上真实选题来讨论。",
      ),
    },
    {
      id: sampleBlockId(E, 9),
      type: "cta" as const,
      content: { text: "扫码报名（占位）", action: "register" },
    },
  ],
};

const R = 6;
export const samplePromoArticleRaw = {
  ...sampleArticleBase(R, "限时开放：轻篇内测名额领取", "fixture:sample-promo"),
  blocks: [
    { id: sampleBlockId(R, 1), type: "title" as const, content: { text: "限时开放：轻篇内测名额领取" } },
    {
      id: sampleBlockId(R, 2),
      type: "lead" as const,
      content: {
        text: "Release 1 主链路已稳定，现邀请 50 位公众号运营同学抢先体验 SSE 流式预览与一键复制。",
      },
    },
    {
      id: sampleBlockId(R, 3),
      type: "highlight" as const,
      content: { text: "内测期免费 · 反馈直达产品 backlog", label: "优惠" },
    },
    { id: sampleBlockId(R, 4), type: "heading" as const, content: { text: "三步上手", level: 2 as const } },
    {
      id: sampleBlockId(R, 5),
      type: "list" as const,
      content: {
        ordered: true,
        items: [
          { text: "首页输入主题", subItems: [] },
          { text: "预览页切换风格 / 配色", subItems: [] },
          { text: "复制 HTML 粘贴公众号", subItems: [] },
        ],
      },
    },
    { id: sampleBlockId(R, 6), type: "heading" as const, content: { text: "为什么现在试用", level: 2 as const } },
    {
      id: sampleBlockId(R, 7),
      ...paragraph(
        "你的粘贴反馈将帮助我们在 Sprint 8 建立 Paste QA 基线；样式评审则通过 Gallery 8 套样例持续迭代。",
      ),
    },
    {
      id: sampleBlockId(R, 8),
      type: "cta" as const,
      content: { text: "领取内测名额", action: "claim" },
    },
  ],
};

const L = 7;
export const sampleListicleArticleRaw = {
  ...sampleArticleBase(L, "7 个让公众号文章「像文章」的排版细节", "fixture:sample-listicle"),
  blocks: [
    { id: sampleBlockId(L, 1), type: "title" as const, content: { text: "7 个让公众号文章「像文章」的排版细节" } },
    {
      id: sampleBlockId(L, 2),
      type: "lead" as const,
      content: {
        text: "清单体是公众号最常见结构之一。下面 7 条来自 Release 1 Gallery 评审共识，可直接对照你的成稿。",
      },
    },
    { id: sampleBlockId(L, 3), type: "heading" as const, content: { text: "结构与节奏", level: 2 as const } },
    {
      id: sampleBlockId(L, 4),
      type: "list" as const,
      content: {
        ordered: true,
        items: [
          { text: "标题区不要堆副标题", subItems: [] },
          { text: "导语 2–3 句即可", subItems: [] },
          { text: "每 600 字至少 1 个小标题", subItems: [] },
        ],
      },
    },
    { id: sampleBlockId(L, 5), type: "heading" as const, content: { text: "样式与复制", level: 2 as const } },
    {
      id: sampleBlockId(L, 6),
      type: "list" as const,
      content: {
        ordered: true,
        items: [
          { text: "避免段段都是卡片", subItems: [] },
          { text: "highlight 只强调 1–2 处", subItems: [] },
          { text: "复制前切换配色看一遍", subItems: [] },
          { text: "CTA 放在自然收尾", subItems: [] },
        ],
      },
    },
    {
      id: sampleBlockId(L, 7),
      ...paragraph(
        "清单体的风险是「像目录不像文章」。用 paragraph 连接 list，并在结尾给一句总结，可读性会明显提升。",
      ),
    },
    {
      id: sampleBlockId(L, 8),
      type: "highlight" as const,
      content: { text: "清单写完，记得用一句话收束全文。", label: "小结" },
    },
  ],
};

const S = 8;
export const sampleSeasonalArticleRaw = {
  ...sampleArticleBase(S, "年中复盘：轻篇 Release 1 进展与感谢", "fixture:sample-seasonal"),
  blocks: [
    { id: sampleBlockId(S, 1), type: "title" as const, content: { text: "年中复盘：轻篇 Release 1 进展与感谢" } },
    {
      id: sampleBlockId(S, 2),
      type: "lead" as const,
      content: {
        text: "2026 上半年，我们从 Schema 契约走到可见 AI 主链路，再到 Gallery 8 套样例——感谢每一位参与评审的伙伴。",
      },
    },
    { id: sampleBlockId(S, 3), type: "heading" as const, content: { text: "我们完成了什么", level: 2 as const } },
    {
      id: sampleBlockId(S, 4),
      ...paragraph(
        "Sprint 6 交付首页 → SSE 预览 → 风格配色 → 复制闭环；Sprint 7 聚焦「像公众号文章」的样式体验与 Gallery 评审基线。",
      ),
    },
    { id: sampleBlockId(S, 5), type: "divider" as const, content: { style: "space" as const } },
    { id: sampleBlockId(S, 6), type: "heading" as const, content: { text: "一张图看进展", level: 2 as const } },
    {
      id: sampleBlockId(S, 7),
      type: "image_placeholder" as const,
      content: {
        caption: "Release 1 里程碑时间线（占位）",
        aspectRatio: "4:3" as const,
        position: "inline",
        suggestion: "Sprint 1–7 里程碑信息图",
      },
    },
    {
      id: sampleBlockId(S, 8),
      ...paragraph(
        "下半年我们将完成 Paste QA 与 Release 1 关闭准备，但样式改动仍会先在 Gallery 上与你见面。",
      ),
    },
    {
      id: sampleBlockId(S, 9),
      type: "cta" as const,
      content: { text: "关注轻篇后续更新", action: "follow" },
    },
  ],
};
