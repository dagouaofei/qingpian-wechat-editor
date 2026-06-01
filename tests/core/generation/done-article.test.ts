import { describe, expect, it } from "vitest";

import {
  DoneArticleError,
  extractDoneArticleEvent,
  parseDoneArticleCandidate,
  validateDoneArticleEventSequence,
} from "@/core/generation";

import {
  blockCompleteFixture,
  blockStartFixture,
  buildDoneArticleEvent,
  errorEventFixture,
  heartbeatFixture,
  REQUEST_ID,
  validDoneArticleCandidate,
  validDoneArticleEvent,
  validFinalizableSequenceFixtures,
} from "../../fixtures/generation";

describe("done.article event sequence", () => {
  it("extracts the single done.article from a valid sequence", () => {
    const result = validateDoneArticleEventSequence(validFinalizableSequenceFixtures);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.event.type).toBe("done.article");
    expect(extractDoneArticleEvent(validFinalizableSequenceFixtures)).toEqual(
      result.event,
    );
  });

  it("fails when done.article is missing", () => {
    const result = validateDoneArticleEventSequence([
      blockStartFixture,
      blockCompleteFixture,
    ]);
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.issues.some((issue) => issue.code === "missing_done_article")).toBe(
      true,
    );
    expect(result.issues.every((issue) => issue.source === "event_sequence")).toBe(
      true,
    );
  });

  it("fails when multiple done.article events exist", () => {
    const result = validateDoneArticleEventSequence([
      validDoneArticleEvent,
      buildDoneArticleEvent(validDoneArticleCandidate, 5),
    ]);
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(
      result.issues.some((issue) => issue.code === "multiple_done_article"),
    ).toBe(true);
  });

  it("fails when done.article is not the last non-heartbeat event", () => {
    const result = validateDoneArticleEventSequence([
      validDoneArticleEvent,
      errorEventFixture,
    ]);
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(
      result.issues.some(
        (issue) =>
          issue.code === "done_not_last" || issue.code === "event_after_done",
      ),
    ).toBe(true);
  });

  it("fails when error and done.article coexist", () => {
    const result = validateDoneArticleEventSequence([
      errorEventFixture,
      validDoneArticleEvent,
    ]);
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(
      result.issues.some(
        (issue) =>
          issue.code === "error_and_done_coexist" ||
          issue.code === "event_after_error",
      ),
    ).toBe(true);
  });

  it("fails when done.article.article is null", () => {
    const result = validateDoneArticleEventSequence([
      buildDoneArticleEvent(null),
    ]);
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(
      result.issues.some((issue) => issue.code === "invalid_article_candidate"),
    ).toBe(true);
  });

  it("fails when done.article.article is a string", () => {
    const result = validateDoneArticleEventSequence([
      buildDoneArticleEvent("not-an-object"),
    ]);
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(
      result.issues.some((issue) => issue.code === "invalid_article_candidate"),
    ).toBe(true);
  });

  it("fails when done.article.article is an array", () => {
    const result = validateDoneArticleEventSequence([buildDoneArticleEvent([])]);
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(
      result.issues.some((issue) => issue.code === "invalid_article_candidate"),
    ).toBe(true);
  });

  it("fails for empty events", () => {
    const result = validateDoneArticleEventSequence([]);
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.issues.some((issue) => issue.code === "empty_events")).toBe(true);
  });

  it("ignores heartbeat before and after done.article", () => {
    const result = validateDoneArticleEventSequence([
      {
        ...heartbeatFixture,
        sequence: 0,
      },
      ...validFinalizableSequenceFixtures.slice(0, -1),
      validDoneArticleEvent,
      {
        type: "heartbeat",
        requestId: REQUEST_ID,
        sequence: 5,
      },
    ]);
    expect(result.ok).toBe(true);
  });

  it("returns event sequence issues without silent fail", () => {
    const result = validateDoneArticleEventSequence([
      {
        type: "block.delta",
        requestId: REQUEST_ID,
        sequence: 1,
        blockId: "missing-start",
        delta: "too early",
      },
    ]);
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.issues.length).toBeGreaterThan(0);
    expect(result.issues.some((issue) => issue.code === "delta_before_start")).toBe(
      true,
    );
  });

  it("throws DoneArticleError from extractDoneArticleEvent on invalid sequence", () => {
    expect(() => extractDoneArticleEvent([])).toThrow(DoneArticleError);
  });

  it("returns article candidate from parseDoneArticleCandidate", () => {
    if (validDoneArticleEvent.type !== "done.article") {
      throw new Error("expected done.article fixture");
    }
    expect(parseDoneArticleCandidate(validDoneArticleEvent)).toEqual(
      validDoneArticleCandidate,
    );
  });
});
