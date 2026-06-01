import type { Article } from "@/core/article";
import {
  ArticleSchemaError,
  normalizeArticle,
  validateArticle,
} from "@/core/article";
import type { SchemaValidationIssue } from "@/core/schema";

import type { DoneArticleEvent, GenerationEvent } from "./events";
import {
  parseDoneArticleCandidate,
  validateDoneArticleEventSequence,
  type DoneArticleValidationIssue,
} from "./done-article";

export type ArticleFinalizationIssue = {
  source: "event_sequence" | "article_schema";
  path: Array<string | number>;
  message: string;
  code: string;
};

export type FinalizedGeneratedArticle = {
  article: Article;
  doneEvent: DoneArticleEvent;
};

export type ArticleFinalizationResult =
  | { ok: true; data: FinalizedGeneratedArticle; issues: [] }
  | { ok: false; issues: ArticleFinalizationIssue[] };

export class ArticleFinalizationError extends Error {
  readonly issues: ArticleFinalizationIssue[];

  constructor(message: string, issues: ArticleFinalizationIssue[]) {
    super(message);
    this.name = "ArticleFinalizationError";
    this.issues = issues;
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function mapSequenceIssues(
  issues: DoneArticleValidationIssue[],
): ArticleFinalizationIssue[] {
  return issues.map((issue) => ({
    source: "event_sequence" as const,
    path: issue.path,
    message: issue.message,
    code: issue.code,
  }));
}

function mapSchemaIssues(
  issues: SchemaValidationIssue[],
): ArticleFinalizationIssue[] {
  return issues.map((issue) => ({
    source: "article_schema" as const,
    path: issue.path,
    message: issue.message,
    code: issue.code,
  }));
}

export function finalizeDoneArticleEvent(
  event: DoneArticleEvent,
): ArticleFinalizationResult {
  const candidate = parseDoneArticleCandidate(event);

  if (!isPlainObject(candidate)) {
    return {
      ok: false,
      issues: [
        {
          source: "article_schema",
          path: ["article"],
          message: "done.article.article must be a non-null object",
          code: "invalid_article_candidate",
        },
      ],
    };
  }

  const validation = validateArticle(candidate);
  if (!validation.ok) {
    return { ok: false, issues: mapSchemaIssues(validation.issues) };
  }

  try {
    const article = normalizeArticle(validation.data);
    return {
      ok: true,
      data: {
        article,
        doneEvent: event,
      },
      issues: [],
    };
  } catch (error) {
    if (error instanceof ArticleSchemaError) {
      return { ok: false, issues: mapSchemaIssues(error.issues) };
    }
    throw error;
  }
}

export function finalizeGenerationEvents(
  events: GenerationEvent[],
): ArticleFinalizationResult {
  const sequenceResult = validateDoneArticleEventSequence(events);
  if (!sequenceResult.ok) {
    return { ok: false, issues: mapSequenceIssues(sequenceResult.issues) };
  }

  return finalizeDoneArticleEvent(sequenceResult.event);
}

export function assertFinalizedArticle(result: ArticleFinalizationResult): Article {
  if (!result.ok) {
    throw new ArticleFinalizationError(
      result.issues.map((issue) => issue.message).join("; "),
      result.issues,
    );
  }
  return result.data.article;
}
