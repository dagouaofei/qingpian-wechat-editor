/**
 * Gallery-facing exports — backed by S7-STORY-002 article sample registry.
 * @deprecated Import from `@/fixtures/article-samples` for new code.
 */

export {
  ARTICLE_SAMPLES as GALLERY_SAMPLES,
  ARTICLE_SAMPLE_IDS,
  type ArticleSampleId as GallerySampleId,
  type ArticleSampleDefinition as GallerySampleDefinition,
  articleSampleRawForId as galleryArticleRawForSample,
  smokeFullBlocksArticleRaw as galleryFullBlocksArticleRaw,
  smokeMinimalTitleArticleRaw as galleryMinimalArticleRaw,
} from "./article-samples";
