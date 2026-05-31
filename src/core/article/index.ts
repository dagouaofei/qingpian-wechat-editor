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
