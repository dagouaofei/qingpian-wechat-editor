import type { DslRenderTarget } from "../runtime/dsl-types";
import type {
  DecoderTrace,
  DslDecoderPathTrace,
  TraceIssue,
} from "../runtime/dsl-trace-types";
import type { SlotContentMap } from "./block-slot-bindings";

export function resolveDecoderPath(hasTree: boolean, hasRenderContract: boolean): DslDecoderPathTrace {
  if (hasTree) return "tree";
  if (hasRenderContract) return "renderContract";
  return "none";
}

export function findMissingSlots(
  requiredSlots: string[],
  slots: SlotContentMap,
): string[] {
  return requiredSlots.filter((slot) => !(slots[slot] ?? "").trim());
}

export function buildDecoderTrace(input: {
  target: DslRenderTarget;
  decoderPath: DslDecoderPathTrace;
  rendered: boolean;
  outputLength: number;
  requiredSlots?: string[];
  slots?: SlotContentMap;
  issues?: string[];
  unsupportedNodes?: string[];
  unsupportedStyles?: string[];
}): DecoderTrace {
  const missingSlots =
    input.requiredSlots && input.slots
      ? findMissingSlots(input.requiredSlots, input.slots)
      : [];

  const traceIssues: TraceIssue[] = (input.issues ?? []).map((message) => ({
    code: message.startsWith("DSL_") ? message.split(":")[0] : "decoder_issue",
    message,
    severity: message.includes("empty") || message.includes("missing") ? "blocking" : "warning",
  }));

  for (const slot of missingSlots) {
    traceIssues.push({
      code: "DSL_SLOT_MISSING",
      message: `DSL_SLOT_MISSING:${slot}`,
      severity: "warning",
    });
  }

  if (!input.rendered) {
    traceIssues.push({
      code: "DSL_RENDER_EMPTY",
      message: "Decoder produced empty output",
      severity: "blocking",
    });
  }

  return {
    target: input.target,
    decoderPath: input.decoderPath,
    rendered: input.rendered,
    outputLength: input.outputLength,
    missingSlots,
    unsupportedNodes: input.unsupportedNodes ?? [],
    unsupportedStyles: input.unsupportedStyles ?? [],
    issues: traceIssues,
  };
}
