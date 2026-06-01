import type { DoneArticleEvent, GenerationEvent } from "./events";
import { validateGenerationEventSequence } from "./stream";

export type DoneArticleValidationIssue = {
  source: "event_sequence";
  path: Array<string | number>;
  message: string;
  code: string;
};

export type DoneArticleParseResult =
  | { ok: true; event: DoneArticleEvent; issues: [] }
  | { ok: false; issues: DoneArticleValidationIssue[] };

export class DoneArticleError extends Error {
  readonly issues: DoneArticleValidationIssue[];

  constructor(message: string, issues: DoneArticleValidationIssue[]) {
    super(message);
    this.name = "DoneArticleError";
    this.issues = issues;
  }
}

function sequenceIssue(
  code: string,
  message: string,
  path: Array<string | number> = [],
): DoneArticleValidationIssue {
  return {
    source: "event_sequence",
    path,
    message,
    code,
  };
}

function isNonHeartbeatEvent(event: GenerationEvent): boolean {
  return event.type !== "heartbeat";
}

function getNonHeartbeatEvents(events: GenerationEvent[]): GenerationEvent[] {
  return events.filter(isNonHeartbeatEvent);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function validateDoneArticleEventSequence(
  events: GenerationEvent[],
): DoneArticleParseResult {
  const issues: DoneArticleValidationIssue[] = [];

  if (events.length === 0) {
    return {
      ok: false,
      issues: [
        sequenceIssue("empty_events", "generation event sequence must not be empty"),
      ],
    };
  }

  const sequenceResult = validateGenerationEventSequence(events);
  if (!sequenceResult.ok) {
    for (const issue of sequenceResult.issues) {
      issues.push({
        source: "event_sequence",
        path: issue.path,
        message: issue.message,
        code: issue.code,
      });
    }
  }

  const substantiveEvents = getNonHeartbeatEvents(events);
  const doneEvents = substantiveEvents.filter(
    (event): event is DoneArticleEvent => event.type === "done.article",
  );
  const errorEvents = substantiveEvents.filter((event) => event.type === "error");

  if (doneEvents.length === 0) {
    issues.push(
      sequenceIssue(
        "missing_done_article",
        "successful stream must include exactly one done.article event",
      ),
    );
  } else if (doneEvents.length > 1) {
    issues.push(
      sequenceIssue(
        "multiple_done_article",
        "stream must not contain multiple done.article events",
      ),
    );
  }

  if (errorEvents.length > 0 && doneEvents.length > 0) {
    issues.push(
      sequenceIssue(
        "error_and_done_coexist",
        "error and done.article must not coexist as success terminal state",
      ),
    );
  }

  if (doneEvents.length === 1) {
    const doneEvent = doneEvents[0]!;
    const lastSubstantive = substantiveEvents[substantiveEvents.length - 1];

    if (lastSubstantive?.type !== "done.article") {
      issues.push(
        sequenceIssue(
          "done_not_last",
          "done.article must be the last non-heartbeat event",
          [events.indexOf(doneEvent)],
        ),
      );
    }

    if (!isPlainObject(doneEvent.article)) {
      issues.push(
        sequenceIssue(
          "invalid_article_candidate",
          "done.article.article must be a non-null object",
          ["article"],
        ),
      );
    }
  }

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  return { ok: true, event: doneEvents[0]!, issues: [] };
}

export function extractDoneArticleEvent(events: GenerationEvent[]): DoneArticleEvent {
  const result = validateDoneArticleEventSequence(events);
  if (!result.ok) {
    throw new DoneArticleError(
      result.issues.map((issue) => issue.message).join("; "),
      result.issues,
    );
  }
  return result.event;
}

export function parseDoneArticleCandidate(event: DoneArticleEvent): unknown {
  return event.article;
}
