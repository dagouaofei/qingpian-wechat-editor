import type { InputRequest } from "@/core/generation";

export const topicOnlyInputRequestFixture: InputRequest = {
  mode: "topic_only",
  topic: "如何提高团队执行力",
};

export const topicWithMaterialsInputRequestFixture: InputRequest = {
  mode: "topic_with_materials",
  topic: "春季产品发布会",
  materials: [
    {
      type: "outline",
      text: "1. 开场\n2. 新品介绍\n3. 互动环节",
      label: "活动大纲",
      order: 1,
    },
    {
      type: "reference",
      text: "参考去年发布会的节奏与重点。",
      order: 0,
    },
  ],
  styleIntent: {
    tone: "专业",
    densityHint: "medium",
  },
};

export const draftRewriteInputRequestFixture: InputRequest = {
  mode: "draft_rewrite",
  draft: "  这是一篇需要优化结构和排版的草稿正文。  ",
  metadata: {
    locale: "zh-CN",
    source: "ui",
    requestId: "req-draft-001",
  },
};

export const materialsOnlyInputRequestFixture: InputRequest = {
  mode: "topic_with_materials",
  materials: [
    {
      type: "plain_text",
      text: "仅资料输入，没有主题。",
    },
  ],
};
