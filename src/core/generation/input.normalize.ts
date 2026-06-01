import type { InputRequest, NormalizedInput, NormalizedPrimaryIntent } from "./input";
import { InputRequestError, validateInputRequest } from "./input.parse";

function trimOptional(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function buildInputSummary(input: {
  topic?: string;
  draft?: string;
  materials: Array<{ type: string; label?: string }>;
}): string {
  const parts: string[] = [];
  if (input.topic) {
    parts.push(`topic: ${input.topic}`);
  }
  if (input.materials.length > 0) {
    parts.push(`materials: ${input.materials.length} source(s)`);
  }
  if (input.draft) {
    const preview =
      input.draft.length > 80 ? `${input.draft.slice(0, 80)}…` : input.draft;
    parts.push(`draft: ${preview}`);
  }
  return parts.join("; ");
}

function resolvePrimaryIntent(input: {
  mode: InputRequest["mode"];
  topic?: string;
  draft?: string;
  hasMaterials: boolean;
}): NormalizedPrimaryIntent {
  if (input.mode === "draft_rewrite" || input.draft) {
    return "draft";
  }
  if (input.mode === "topic_only") {
    return "topic";
  }
  if (input.topic && input.hasMaterials) {
    return "mixed";
  }
  if (input.topic) {
    return "topic";
  }
  if (input.hasMaterials) {
    return "material";
  }
  return "topic";
}

export function normalizeInputRequest(input: InputRequest): NormalizedInput {
  const topic = trimOptional(input.topic);
  const draft = trimOptional(input.draft);

  const materialsWithIndex = (input.materials ?? [])
    .map((source, index) => ({ source, index }))
    .filter(({ source }) => trimOptional(source.text) !== undefined)
    .sort((left, right) => {
      const leftOrder = left.source.order ?? left.index;
      const rightOrder = right.source.order ?? right.index;
      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }
      return left.index - right.index;
    })
    .map(({ source, index }) => ({
      type: source.type,
      text: source.text.trim(),
      label: trimOptional(source.label),
      order: source.order ?? index,
    }));

  const hasMaterials = materialsWithIndex.length > 0;
  const hasDraft = draft !== undefined;

  return {
    id: input.id,
    mode: input.mode,
    topic,
    materials: materialsWithIndex,
    draft,
    styleIntent: input.styleIntent,
    metadata: input.metadata,
    inputSummary: buildInputSummary({
      topic,
      draft,
      materials: materialsWithIndex,
    }),
    sourceCount: materialsWithIndex.length + (topic ? 1 : 0) + (draft ? 1 : 0),
    hasDraft,
    hasMaterials,
    primaryIntent: resolvePrimaryIntent({
      mode: input.mode,
      topic,
      draft,
      hasMaterials,
    }),
    normalizedAt: new Date().toISOString(),
  };
}

export function parseAndNormalizeInputRequest(input: unknown): NormalizedInput {
  const validation = validateInputRequest(input);
  if (!validation.ok) {
    throw new InputRequestError(
      validation.issues
        .filter((issue) => issue.severity === "error")
        .map((issue) => issue.message)
        .join("; "),
      validation.issues,
    );
  }
  return normalizeInputRequest(validation.data);
}
