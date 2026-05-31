export type {
  Article,
  ArticleInput,
  ArticleMetadata,
  ArticleStyleAssignment,
  BlockStyleOverride,
  GenerationMeta,
  GenerationMode,
  GenerationStatus,
  InputSource,
  InputSourceType,
  SlotOverrideValue,
  StyleAssignment,
} from "./article.types";

export {
  articleIdSchema,
  articleInputSchema,
  articleMetadataSchema,
  articleSchema,
  articleStyleAssignmentSchema,
  articleVersionSchema,
  blockStyleOverrideSchema,
  generationMetaSchema,
  generationModeSchema,
  generationStatusSchema,
  inputSourceSchema,
  inputSourceTypeSchema,
  styleAssignmentSchema,
} from "./article.schema";
export type {
  ArticleMetadataInput,
  ArticleStyleAssignmentInput,
} from "./article.schema";

export {
  ArticleSchemaError,
  parseArticle,
  validateArticle,
} from "./article.parse";

export { normalizeArticle } from "./article.normalize";

export type {
  InlineContent,
  InlineMark,
  InlineMarkBold,
  InlineMarkColor,
  InlineMarkHighlight,
  InlineMarkItalic,
  InlineMarkLink,
  InlineMarkSemantic,
  InlineMarkType,
  InlineTextInput,
  InlineTextNode,
  LegacyEmphasis,
} from "./inline-content.types";

export {
  inlineContentSchema,
  inlineContentSchemaLenient,
  inlineMarkSchema,
  inlineMarkSemanticSchema,
  inlineMarkTypeSchema,
  inlineTextInputSchema,
  inlineTextNodeSchema,
  plainTextSchema,
} from "./inline-content.schema";
export type {
  InlineContentInput,
  InlineMarkInput,
  InlineTextNodeInput,
} from "./inline-content.schema";

export {
  InlineContentValidationError,
  legacyEmphasisToMarks,
  normalizeInlineContent,
  parseInlineContent,
  parseInlineMark,
  isInlineContent,
} from "./inline-content.normalize";
