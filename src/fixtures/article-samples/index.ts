import {
  sampleBrandArticleRaw,
  sampleEventArticleRaw,
  sampleIndustryArticleRaw,
  sampleKnowledgeArticleRaw,
  sampleListicleArticleRaw,
  sampleProductArticleRaw,
  samplePromoArticleRaw,
  sampleSeasonalArticleRaw,
} from "./samples";
import { smokeFullBlocksArticleRaw, smokeMinimalTitleArticleRaw } from "./smoke-fixtures";

export const ARTICLE_SAMPLE_IDS = [
  "sample-knowledge",
  "sample-industry",
  "sample-product",
  "sample-brand",
  "sample-event",
  "sample-promo",
  "sample-listicle",
  "sample-seasonal",
] as const;

export type ArticleSampleId = (typeof ARTICLE_SAMPLE_IDS)[number];

export type ArticleSampleDefinition = {
  id: ArticleSampleId;
  label: string;
  description: string;
  category: string;
  blockCount: number;
  blockTypes: string[];
};

type ArticleRaw = {
  blocks: Array<{ type: string }>;
};

function blockTypesFor(raw: ArticleRaw): string[] {
  return [...new Set(raw.blocks.map((block) => block.type))];
}

function defineSample(
  id: ArticleSampleId,
  label: string,
  description: string,
  category: string,
  raw: ArticleRaw,
): ArticleSampleDefinition {
  return {
    id,
    label,
    description,
    category,
    blockCount: raw.blocks.length,
    blockTypes: blockTypesFor(raw),
  };
}

const SAMPLE_RAW_BY_ID: Record<ArticleSampleId, ArticleRaw & Record<string, unknown>> = {
  "sample-knowledge": sampleKnowledgeArticleRaw,
  "sample-industry": sampleIndustryArticleRaw,
  "sample-product": sampleProductArticleRaw,
  "sample-brand": sampleBrandArticleRaw,
  "sample-event": sampleEventArticleRaw,
  "sample-promo": samplePromoArticleRaw,
  "sample-listicle": sampleListicleArticleRaw,
  "sample-seasonal": sampleSeasonalArticleRaw,
};

export const ARTICLE_SAMPLES: ArticleSampleDefinition[] = [
  defineSample(
    "sample-knowledge",
    "知识科普 / 干货",
    "导语 → 多节正文 → 要点 highlight → CTA",
    "knowledge",
    sampleKnowledgeArticleRaw,
  ),
  defineSample(
    "sample-industry",
    "行业趋势 / 观察",
    "观点 → 引用 → 分节 → info_card",
    "industry",
    sampleIndustryArticleRaw,
  ),
  defineSample(
    "sample-product",
    "产品 / 功能解读",
    "能力列表 → 场景卡片 → 配图占位 → CTA",
    "product",
    sampleProductArticleRaw,
  ),
  defineSample(
    "sample-brand",
    "品牌故事 / 价值",
    "叙事 lead → 金句 quote → 品牌 highlight",
    "brand",
    sampleBrandArticleRaw,
  ),
  defineSample(
    "sample-event",
    "活动招募 / 沙龙",
    "活动 info_card → 议程 list → 报名 CTA",
    "event",
    sampleEventArticleRaw,
  ),
  defineSample(
    "sample-promo",
    "促销 / 转化",
    "优惠 highlight → 步骤 list → 行动 CTA",
    "promo",
    samplePromoArticleRaw,
  ),
  defineSample(
    "sample-listicle",
    "清单体 / N 个技巧",
    "数字标题 → 多组 checklist / 编号 list",
    "listicle",
    sampleListicleArticleRaw,
  ),
  defineSample(
    "sample-seasonal",
    "节点 / 复盘 / 里程碑",
    "问候 lead → 分隔 → 配图占位 → 展望 CTA",
    "seasonal",
    sampleSeasonalArticleRaw,
  ),
];

export function articleSampleRawForId(sampleId: ArticleSampleId) {
  return SAMPLE_RAW_BY_ID[sampleId];
}

export function allArticleSampleBlockTypes(): string[] {
  const types = new Set<string>();
  for (const sample of ARTICLE_SAMPLES) {
    for (const blockType of sample.blockTypes) {
      types.add(blockType);
    }
  }
  return [...types].sort();
}

export { smokeFullBlocksArticleRaw, smokeMinimalTitleArticleRaw };
