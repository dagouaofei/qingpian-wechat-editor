import { describe, expect, it } from "vitest";

import {
  enrichModelArticleCandidate,
  finalizeGenerationEvents,
  generateVolcengineProviderEvents,
  isValidUuid,
  parseAndNormalizeInputRequest,
  stripForbiddenFieldsFromCandidate,
} from "@/core/generation";

import {
  createMockVolcengineTransport,
  enabledVolcengineEnv,
  topicOnlyInputRequestFixture,
  validDoneArticleCandidate,
} from "../../fixtures/generation";

const TIMESTAMP = "2026-06-02T00:00:00.000Z";
const GENERATED_ARTICLE_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const GENERATED_BLOCK_ID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

function createIdGenerator(ids: string[]) {
  let index = 0;
  return () => ids[index++] ?? `cccccccc-cccc-4ccc-8ccc-${String(index).padStart(12, "0")}`;
}

function enrichBaseInput(
  rawCandidate: unknown,
  options?: { strictContent?: boolean },
) {
  const normalizedInput = parseAndNormalizeInputRequest(topicOnlyInputRequestFixture);
  return enrichModelArticleCandidate({
    rawCandidate,
    normalizedInput,
    requestId: "enrichment-test",
    providerName: "volcengine",
    modelName: "doubao-pro-32k",
    timestamp: TIMESTAMP,
    generateId: createIdGenerator([GENERATED_ARTICLE_ID, GENERATED_BLOCK_ID]),
    strictContent: options?.strictContent,
  });
}

describe("model article enrichment", () => {
  it("generates article id when missing", () => {
    const rest = { ...validDoneArticleCandidate };
    delete (rest as { id?: string }).id;
    const result = enrichBaseInput(rest);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.candidate.id).toBe(GENERATED_ARTICLE_ID);
    expect(result.warnings.some((w) => w.code === "missing_uuid_generated")).toBe(true);
  });

  it("replaces invalid article id with generated UUID", () => {
    const result = enrichBaseInput({
      ...validDoneArticleCandidate,
      id: "not-a-uuid",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.candidate.id).toBe(GENERATED_ARTICLE_ID);
    expect(isValidUuid(String(result.candidate.id))).toBe(true);
  });

  it("generates block id when missing", () => {
    const result = enrichBaseInput({
      ...validDoneArticleCandidate,
      blocks: [{ type: "title", content: { text: "标题" } }],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    const block = (result.candidate.blocks as Array<{ id: string }>)[0];
    expect(block.id).toBe(GENERATED_ARTICLE_ID);
  });

  it("replaces invalid block id with generated UUID", () => {
    const result = enrichBaseInput({
      ...validDoneArticleCandidate,
      blocks: [
        {
          id: "bad-block-id",
          type: "title",
          content: { text: "标题" },
        },
      ],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    const block = (result.candidate.blocks as Array<{ id: string }>)[0];
    expect(block.id).toBe(GENERATED_ARTICLE_ID);
  });

  it("defaults version to 1", () => {
    const result = enrichBaseInput({
      ...validDoneArticleCandidate,
      version: undefined,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.candidate.version).toBe(1);
  });

  it("fills minimal metadata when missing", () => {
    const result = enrichBaseInput({
      ...validDoneArticleCandidate,
      metadata: {},
    });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    const metadata = result.candidate.metadata as Record<string, unknown>;
    expect(metadata.title).toBeTruthy();
    expect(metadata.createdAt).toBe(TIMESTAMP);
    expect(metadata.updatedAt).toBe(TIMESTAMP);
    expect(metadata.locale).toBe("zh-CN");
  });

  it("generates input snapshot from NormalizedInput when missing", () => {
    const rest = { ...validDoneArticleCandidate };
    delete (rest as { input?: unknown }).input;
    const result = enrichBaseInput(rest);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    const input = result.candidate.input as Record<string, unknown>;
    expect(input.type).toBe("topic");
    expect(input.raw).toBeTruthy();
    expect(input.capturedAt).toBe(TIMESTAMP);
    expect(result.warnings.some((w) => w.code === "input_snapshot_generated")).toBe(true);
  });

  it("defaults styleAssignment when missing", () => {
    const rest = { ...validDoneArticleCandidate };
    delete (rest as { styleAssignment?: unknown }).styleAssignment;
    const result = enrichBaseInput(rest);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.candidate.styleAssignment).toEqual({
      themeId: "businessBlue",
      presetId: "business",
    });
  });

  it("fills title and paragraph content minimally in permissive mode", () => {
    const result = enrichBaseInput({
      ...validDoneArticleCandidate,
      blocks: [
        { id: GENERATED_BLOCK_ID, type: "title", content: {} },
        {
          id: "cccccccc-cccc-4ccc-8ccc-000000000002",
          type: "paragraph",
          content: {},
        },
      ],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    const blocks = result.candidate.blocks as Array<{ content: { text: string } }>;
    expect(blocks[0]?.content.text).toBeTruthy();
    expect(blocks[1]?.content.text).toBeTruthy();
    expect(JSON.stringify(result.candidate)).not.toContain("Release 1 生成正文");
  });

  it("fails in strict mode when paragraph content.text is empty", () => {
    const result = enrichBaseInput(
      {
        ...validDoneArticleCandidate,
        blocks: [
          { id: GENERATED_BLOCK_ID, type: "title", content: { text: "标题" } },
          {
            id: "cccccccc-cccc-4ccc-8ccc-000000000002",
            type: "paragraph",
            content: {},
          },
        ],
      },
      { strictContent: true },
    );
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.errors.some((issue) => issue.code === "missing_required_block_text")).toBe(
      true,
    );
  });

  it("does not emit internal Release fallback copy in strict mode success path", () => {
    const result = enrichBaseInput(
      {
        ...validDoneArticleCandidate,
        blocks: [
          { id: GENERATED_BLOCK_ID, type: "title", content: { text: "标题" } },
          {
            id: "cccccccc-cccc-4ccc-8ccc-000000000002",
            type: "paragraph",
            content: { text: "正文" },
          },
        ],
      },
      { strictContent: true },
    );
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(JSON.stringify(result.candidate)).not.toContain("Release 1 生成正文");
  });

  it("allows divider blocks without text in strict mode", () => {
    const result = enrichBaseInput(
      {
        ...validDoneArticleCandidate,
        blocks: [
          { id: GENERATED_BLOCK_ID, type: "title", content: { text: "标题" } },
          {
            id: "cccccccc-cccc-4ccc-8ccc-000000000002",
            type: "paragraph",
            content: { text: "正文" },
          },
          {
            id: "dddddddd-dddd-4ddd-8ddd-000000000003",
            type: "divider",
            content: {},
          },
        ],
      },
      { strictContent: true },
    );
    expect(result.ok).toBe(true);
  });

  it("still defaults non-blocking metadata in strict mode", () => {
    const result = enrichBaseInput(
      {
        ...validDoneArticleCandidate,
        metadata: {},
        blocks: [
          { id: GENERATED_BLOCK_ID, type: "title", content: { text: "标题" } },
          {
            id: "cccccccc-cccc-4ccc-8ccc-000000000002",
            type: "paragraph",
            content: { text: "正文" },
          },
        ],
      },
      { strictContent: true },
    );
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    const metadata = result.candidate.metadata as Record<string, unknown>;
    expect(metadata.title).toBeTruthy();
    expect(metadata.locale).toBe("zh-CN");
  });

  it("fails in strict mode when blocks array is missing", () => {
    const rest = { ...validDoneArticleCandidate };
    delete (rest as { blocks?: unknown }).blocks;
    const result = enrichBaseInput(rest, { strictContent: true });
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.errors.some((issue) => issue.code === "missing_blocks")).toBe(true);
  });

  it("coerces list items from string array", () => {
    const result = enrichBaseInput({
      ...validDoneArticleCandidate,
      blocks: [
        {
          id: GENERATED_BLOCK_ID,
          type: "list",
          content: { items: ["第一项", "第二项"] },
        },
      ],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    const block = (result.candidate.blocks as Array<{ content: { items: unknown[] } }>)[0];
    expect(block.content.items).toEqual([
      { text: "第一项" },
      { text: "第二项" },
    ]);
  });

  it("recovers info_card title and body", () => {
    const result = enrichBaseInput({
      ...validDoneArticleCandidate,
      blocks: [
        {
          id: GENERATED_BLOCK_ID,
          type: "info_card",
          content: {},
        },
      ],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    const content = (
      result.candidate.blocks as Array<{ content: { title: string; body: string } }>
    )[0]?.content;
    expect(content.title).toBeTruthy();
    expect(content.body).toBeTruthy();
  });

  it("recovers cta text", () => {
    const result = enrichBaseInput({
      ...validDoneArticleCandidate,
      blocks: [
        {
          id: GENERATED_BLOCK_ID,
          type: "cta",
          content: {},
        },
      ],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    const content = (result.candidate.blocks as Array<{ content: { text: string } }>)[0]
      ?.content;
    expect(content.text).toBe("了解更多");
  });

  it("does not silently repair invalid block type", () => {
    const result = enrichBaseInput({
      ...validDoneArticleCandidate,
      blocks: [{ id: GENERATED_BLOCK_ID, type: "unknown_block", content: {} }],
    });
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.errors[0]?.code).toBe("invalid_block_type");
  });

  it("fails when raw output is not an object", () => {
    const result = enrichBaseInput(["array"]);
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.errors[0]?.code).toBe("invalid_raw_candidate");
  });

  it("creates minimal blocks when blocks are missing", () => {
    const rest = { ...validDoneArticleCandidate };
    delete (rest as { blocks?: unknown }).blocks;
    const result = enrichBaseInput(rest);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(Array.isArray(result.candidate.blocks)).toBe(true);
    expect((result.candidate.blocks as unknown[]).length).toBeGreaterThanOrEqual(2);
  });

  it("strips forbidden fields with warnings", () => {
    const stripped = stripForbiddenFieldsFromCandidate({
      ...validDoneArticleCandidate,
      html: "<p>x</p>",
      className: "bad",
    });
    expect(stripped.candidate.html).toBeUndefined();
    expect(stripped.candidate.className).toBeUndefined();
    expect(stripped.warnings.some((w) => w.code === "forbidden_field_stripped")).toBe(
      true,
    );
  });

  it("passes finalizeGenerationEvents after enrichment", () => {
    const result = enrichBaseInput({
      id: "bad-id",
      version: undefined,
      metadata: {},
      blocks: [
        { type: "title", content: {} },
        { type: "paragraph", content: {} },
      ],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    const events = [
      {
        type: "block.start" as const,
        requestId: "enrichment-test",
        sequence: 1,
        blockId: (result.candidate.blocks as Array<{ id: string }>)[0]!.id,
        blockType: "title" as const,
        timestamp: TIMESTAMP,
      },
      {
        type: "block.complete" as const,
        requestId: "enrichment-test",
        sequence: 2,
        blockId: (result.candidate.blocks as Array<{ id: string }>)[0]!.id,
        blockType: "title" as const,
        content: (result.candidate.blocks as Array<{ content: unknown }>)[0]!.content,
        timestamp: TIMESTAMP,
      },
      {
        type: "done.article" as const,
        requestId: "enrichment-test",
        sequence: 3,
        article: result.candidate,
        timestamp: TIMESTAMP,
      },
    ];

    const finalization = finalizeGenerationEvents(events);
    expect(finalization.ok).toBe(true);
  });

  it("allows volcengine provider mock transport with missing UUIDs to finalize", async () => {
    const normalizedInput = parseAndNormalizeInputRequest(topicOnlyInputRequestFixture);
    const result = await generateVolcengineProviderEvents(
      normalizedInput,
      {
        provider: "volcengine",
        enabled: true,
        apiKey: enabledVolcengineEnv.VOLCENGINE_API_KEY,
        model: enabledVolcengineEnv.VOLCENGINE_MODEL,
        baseUrl: enabledVolcengineEnv.VOLCENGINE_BASE_URL,
        timeoutMs: 5_000,
      },
      createMockVolcengineTransport(
        JSON.stringify({
          id: "invalid-article-id",
          version: 1,
          metadata: { title: "Smoke Title" },
          blocks: [
            { id: "invalid-block-id", type: "title", content: { text: "标题" } },
            { type: "paragraph", content: { text: "正文" } },
          ],
        }),
      ),
      { requestId: "req-enrichment", startedAt: TIMESTAMP },
    );

    expect(result.events.at(-1)?.type).toBe("done.article");
    const finalization = finalizeGenerationEvents(result.events);
    expect(finalization.ok).toBe(true);
    if (!finalization.ok) {
      return;
    }
    expect(isValidUuid(finalization.data.article.id)).toBe(true);
    expect(finalization.data.article.blocks.every((block) => isValidUuid(block.id))).toBe(
      true,
    );
  });
});
