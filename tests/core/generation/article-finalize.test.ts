import { describe, expect, it } from "vitest";

import {
  ArticleFinalizationError,
  assertFinalizedArticle,
  collectGenerationStream,
  createDeterministicGenerationEvents,
  createGenerationStream,
  deterministicGenerationStreamProvider,
  finalizeDoneArticleEvent,
  finalizeGenerationEvents,
  parseAndNormalizeInputRequest,
} from "@/core/generation";
import { isInlineContent } from "@/core/article";

import {
  buildDoneArticleEvent,
  normalizableDoneArticleEvent,
  REQUEST_ID,
  topicOnlyInputRequestFixture,
  validDoneArticleCandidate,
  validDoneArticleEvent,
  validFinalizableSequenceFixtures,
  validSequenceFixtures,
} from "../../fixtures/generation";

describe("article finalization", () => {
  const normalizedTopicOnly = parseAndNormalizeInputRequest(
    topicOnlyInputRequestFixture,
  );

  it("finalizes deterministic provider events into a formal Article", async () => {
    const events = createDeterministicGenerationEvents(normalizedTopicOnly, {
      requestId: REQUEST_ID,
      startedAt: "2026-06-02T00:00:00.000Z",
    });
    const result = finalizeGenerationEvents(events);

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.data.article.version).toBe(1);
    expect(result.data.article.blocks.length).toBeGreaterThanOrEqual(1);
  });

  it("finalizes collected deterministic stream through the same helper", async () => {
    const stream = createGenerationStream(
      normalizedTopicOnly,
      deterministicGenerationStreamProvider,
      { requestId: REQUEST_ID, startedAt: "2026-06-02T00:00:00.000Z" },
    );
    const events = await collectGenerationStream(stream);
    const result = finalizeGenerationEvents(events);

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(assertFinalizedArticle(result).blocks.length).toBeGreaterThanOrEqual(1);
  });

  it("parses valid done.article candidate through Article Schema", () => {
    if (validDoneArticleEvent.type !== "done.article") {
      throw new Error("expected done.article fixture");
    }
    const result = finalizeDoneArticleEvent(validDoneArticleEvent);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.data.article.id).toBe(validDoneArticleCandidate.id);
  });

  it("normalizes paragraph and lead string text to InlineContent", () => {
    if (normalizableDoneArticleEvent.type !== "done.article") {
      throw new Error("expected done.article fixture");
    }
    const result = finalizeDoneArticleEvent(normalizableDoneArticleEvent);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    const leadBlock = result.data.article.blocks.find((block) => block.type === "lead");
    const paragraphBlock = result.data.article.blocks.find(
      (block) => block.type === "paragraph",
    );
    expect(leadBlock?.type).toBe("lead");
    expect(paragraphBlock?.type).toBe("paragraph");
    if (
      leadBlock?.type === "lead" &&
      paragraphBlock?.type === "paragraph"
    ) {
      expect(isInlineContent(leadBlock.content.text)).toBe(true);
      expect(isInlineContent(paragraphBlock.content.text)).toBe(true);
    }
  });

  it("fails for invalid block type with article_schema issues", () => {
    const result = finalizeDoneArticleEvent(
      buildDoneArticleEvent({
        ...validDoneArticleCandidate,
        blocks: [
          {
            id: "11111111-1111-4111-8111-000000000099",
            type: "unknown_block",
            content: { text: "bad" },
          },
        ],
      }) as never,
    );
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.issues.some((issue) => issue.source === "article_schema")).toBe(
      true,
    );
  });

  it("fails when Article is missing required fields", () => {
    const result = finalizeDoneArticleEvent(
      buildDoneArticleEvent({
        id: validDoneArticleCandidate.id,
      }) as never,
    );
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.issues.some((issue) => issue.source === "article_schema")).toBe(
      true,
    );
  });

  it("fails when Article includes forbidden html field", () => {
    const result = finalizeDoneArticleEvent(
      buildDoneArticleEvent({
        ...validDoneArticleCandidate,
        html: "<p>forbidden</p>",
      }) as never,
    );
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.issues.some((issue) => issue.source === "article_schema")).toBe(
      true,
    );
  });

  it("fails when Article includes forbidden css field", () => {
    const result = finalizeDoneArticleEvent(
      buildDoneArticleEvent({
        ...validDoneArticleCandidate,
        css: "body { color: red; }",
      }) as never,
    );
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.issues.some((issue) => issue.source === "article_schema")).toBe(
      true,
    );
  });

  it("fails when Article includes forbidden className field", () => {
    const result = finalizeDoneArticleEvent(
      buildDoneArticleEvent({
        ...validDoneArticleCandidate,
        className: "article-root",
      }) as never,
    );
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.issues.some((issue) => issue.source === "article_schema")).toBe(
      true,
    );
  });

  it("fails when Article includes forbidden style field", () => {
    const result = finalizeDoneArticleEvent(
      buildDoneArticleEvent({
        ...validDoneArticleCandidate,
        style: { color: "red" },
      }) as never,
    );
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.issues.some((issue) => issue.source === "article_schema")).toBe(
      true,
    );
  });

  it("distinguishes event sequence issues from article schema issues", () => {
    const sequenceResult = finalizeGenerationEvents([
      validDoneArticleEvent,
      buildDoneArticleEvent(validDoneArticleCandidate, 5),
    ]);
    expect(sequenceResult.ok).toBe(false);
    if (sequenceResult.ok) {
      return;
    }
    expect(
      sequenceResult.issues.some((issue) => issue.source === "event_sequence"),
    ).toBe(true);
    expect(
      sequenceResult.issues.some((issue) => issue.source === "article_schema"),
    ).toBe(false);

    const schemaResult = finalizeGenerationEvents(validSequenceFixtures);
    expect(schemaResult.ok).toBe(false);
    if (schemaResult.ok) {
      return;
    }
    expect(
      schemaResult.issues.some((issue) => issue.source === "article_schema"),
    ).toBe(true);
  });

  it("throws ArticleFinalizationError from assertFinalizedArticle on failure", () => {
    expect(() =>
      assertFinalizedArticle({
        ok: false,
        issues: [
          {
            source: "event_sequence",
            path: [],
            message: "failed",
            code: "empty_events",
          },
        ],
      }),
    ).toThrow(ArticleFinalizationError);
  });

  it("does not mutate the original events array", () => {
    const events = [...validFinalizableSequenceFixtures];
    const snapshot = structuredClone(events);
    finalizeGenerationEvents(events);
    expect(events).toEqual(snapshot);
  });
});
