import type { NormalizedInput } from "./input";
import type {
  GenerationEvent,
  GenerationStreamContext,
  GenerationStreamProvider,
} from "./events";

const TITLE_BLOCK_ID = "11111111-1111-4111-8111-000000000001";
const PARAGRAPH_BLOCK_ID = "11111111-1111-4111-8111-000000000002";
const ARTICLE_ID = "22222222-2222-4222-8222-222222222222";

function resolveTitle(input: NormalizedInput): string {
  if (input.topic) {
    return input.topic;
  }
  if (input.draft) {
    return input.draft.slice(0, 40);
  }
  if (input.materials[0]?.text) {
    return input.materials[0].text.slice(0, 40);
  }
  return "轻篇生成示例";
}

function resolveParagraph(input: NormalizedInput): string {
  if (input.draft) {
    return input.draft;
  }
  if (input.materials.length > 0) {
    return input.materials.map((source) => source.text).join("\n\n");
  }
  return `围绕「${resolveTitle(input)}」展开的 Release 1 示例正文。`;
}

function buildDeterministicEvents(
  input: NormalizedInput,
  context: GenerationStreamContext,
): GenerationEvent[] {
  const title = resolveTitle(input);
  const paragraph = resolveParagraph(input);
  const requestId = context.requestId;
  const timestamp = context.startedAt;

  const titleContent = { text: title };
  const paragraphContent = { text: paragraph };

  return [
    {
      type: "block.start",
      requestId,
      sequence: 1,
      blockId: TITLE_BLOCK_ID,
      blockType: "title",
      timestamp,
    },
    {
      type: "block.delta",
      requestId,
      sequence: 2,
      blockId: TITLE_BLOCK_ID,
      delta: title,
      timestamp,
    },
    {
      type: "block.complete",
      requestId,
      sequence: 3,
      blockId: TITLE_BLOCK_ID,
      blockType: "title",
      content: titleContent,
      timestamp,
    },
    {
      type: "block.start",
      requestId,
      sequence: 4,
      blockId: PARAGRAPH_BLOCK_ID,
      blockType: "paragraph",
      timestamp,
    },
    {
      type: "block.delta",
      requestId,
      sequence: 5,
      blockId: PARAGRAPH_BLOCK_ID,
      delta: paragraph,
      timestamp,
    },
    {
      type: "block.complete",
      requestId,
      sequence: 6,
      blockId: PARAGRAPH_BLOCK_ID,
      blockType: "paragraph",
      content: paragraphContent,
      timestamp,
    },
    {
      type: "done.article",
      requestId,
      sequence: 7,
      article: {
        id: ARTICLE_ID,
        version: 1,
        metadata: {
          title,
          createdAt: timestamp,
          updatedAt: timestamp,
          locale: input.metadata?.locale ?? "zh-CN",
        },
        input: {
          type: input.primaryIntent === "draft" ? "draft" : "topic",
          raw: input.inputSummary,
          normalized: input.inputSummary,
          capturedAt: input.normalizedAt,
        },
        styleAssignment: {
          themeId: "businessBlue",
          presetId: "business",
        },
        blocks: [
          {
            id: TITLE_BLOCK_ID,
            type: "title",
            content: titleContent,
          },
          {
            id: PARAGRAPH_BLOCK_ID,
            type: "paragraph",
            content: paragraphContent,
          },
        ],
        generation: {
          status: "completed",
          mode: "stream",
          startedAt: timestamp,
          completedAt: timestamp,
        },
      },
      timestamp,
    },
  ];
}

export const deterministicGenerationStreamProvider: GenerationStreamProvider = {
  async *generate(input, context = {}) {
    const streamContext: GenerationStreamContext = {
      requestId:
        context.requestId ??
        input.metadata?.requestId ??
        input.id ??
        "deterministic-generation",
      input,
      startedAt: context.startedAt ?? input.normalizedAt,
    };

    for (const event of buildDeterministicEvents(input, streamContext)) {
      yield event;
    }
  },
};

export function createDeterministicGenerationEvents(
  input: NormalizedInput,
  context?: Partial<GenerationStreamContext>,
): GenerationEvent[] {
  const streamContext: GenerationStreamContext = {
    requestId:
      context?.requestId ??
      input.metadata?.requestId ??
      input.id ??
      "deterministic-generation",
    input,
    startedAt: context?.startedAt ?? input.normalizedAt,
  };

  return buildDeterministicEvents(input, streamContext);
}
