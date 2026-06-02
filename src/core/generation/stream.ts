import type { NormalizedInput } from "./input";
import { isInputRequest } from "./input.parse";
import type {
  GenerationEvent,
  GenerationSequenceIssue,
  GenerationSequenceValidationResult,
  GenerationStream,
  GenerationStreamContext,
  GenerationStreamProvider,
} from "./events";

function isNormalizedInput(input: unknown): input is NormalizedInput {
  if (!input || typeof input !== "object") {
    return false;
  }
  if (isInputRequest(input)) {
    return false;
  }
  const candidate = input as Partial<NormalizedInput>;
  return (
    typeof candidate.normalizedAt === "string" &&
    typeof candidate.inputSummary === "string" &&
    typeof candidate.sourceCount === "number" &&
    typeof candidate.hasDraft === "boolean" &&
    typeof candidate.hasMaterials === "boolean" &&
    Array.isArray(candidate.materials)
  );
}

function sequenceIssue(
  index: number,
  code: string,
  message: string,
): GenerationSequenceIssue {
  return {
    path: [index],
    code,
    message,
  };
}

export function validateGenerationEventSequence(
  events: GenerationEvent[],
): GenerationSequenceValidationResult {
  const issues: GenerationSequenceIssue[] = [];
  let lastSequence = -1;
  let terminal: "none" | "done" | "error" = "none";
  const blockStates = new Map<
    string,
    { started: boolean; completed: boolean }
  >();

  events.forEach((event, index) => {
    if (event.sequence <= lastSequence) {
      issues.push(
        sequenceIssue(
          index,
          "sequence_not_monotonic",
          `sequence ${event.sequence} must be greater than previous ${lastSequence}`,
        ),
      );
    }
    lastSequence = event.sequence;

    if (event.type === "heartbeat" || event.type === "start" || event.type === "phase") {
      return;
    }

    if (terminal === "done") {
      issues.push(
        sequenceIssue(
          index,
          "event_after_done",
          "events must not follow done.article",
        ),
      );
      return;
    }

    if (terminal === "error") {
      issues.push(
        sequenceIssue(
          index,
          "event_after_error",
          "events must not follow error",
        ),
      );
      return;
    }

    switch (event.type) {
      case "block.start": {
        blockStates.set(event.blockId, { started: true, completed: false });
        break;
      }
      case "block.delta": {
        const state = blockStates.get(event.blockId);
        if (!state?.started) {
          issues.push(
            sequenceIssue(
              index,
              "delta_before_start",
              `block.delta for ${event.blockId} requires prior block.start`,
            ),
          );
        } else if (state.completed) {
          issues.push(
            sequenceIssue(
              index,
              "delta_after_complete",
              `block.delta for ${event.blockId} must not follow block.complete`,
            ),
          );
        }
        break;
      }
      case "block.complete": {
        const state = blockStates.get(event.blockId);
        if (!state?.started) {
          issues.push(
            sequenceIssue(
              index,
              "complete_before_start",
              `block.complete for ${event.blockId} requires prior block.start`,
            ),
          );
        }
        blockStates.set(event.blockId, { started: true, completed: true });
        break;
      }
      case "done.article": {
        for (let next = index + 1; next < events.length; next += 1) {
          const nextEvent = events[next];
          if (nextEvent && nextEvent.type !== "heartbeat") {
            issues.push(
              sequenceIssue(
                index,
                "done_not_last",
                "done.article must be the last non-heartbeat event",
              ),
            );
            break;
          }
        }
        terminal = "done";
        break;
      }
      case "error": {
        terminal = "error";
        break;
      }
      default: {
        break;
      }
    }
  });

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  return { ok: true, issues: [] };
}

export function createGenerationStream(
  input: NormalizedInput,
  provider: GenerationStreamProvider,
  context?: Partial<GenerationStreamContext>,
): GenerationStream {
  if (!isNormalizedInput(input)) {
    throw new TypeError(
      "createGenerationStream requires NormalizedInput; raw InputRequest is not accepted",
    );
  }

  const requestId =
    context?.requestId ??
    input.metadata?.requestId ??
    input.id ??
    "generation-request";

  const streamContext: GenerationStreamContext = {
    requestId,
    input,
    startedAt: context?.startedAt ?? new Date().toISOString(),
  };

  return provider.generate(input, streamContext);
}

export async function collectGenerationStream(
  stream: GenerationStream,
): Promise<GenerationEvent[]> {
  const events: GenerationEvent[] = [];
  for await (const event of stream) {
    events.push(event);
  }
  return events;
}

export { isNormalizedInput };
