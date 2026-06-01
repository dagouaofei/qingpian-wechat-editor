import type { ResolvedBlockStyle } from "@/core/styles";

import { createRendererIssue } from "./issues";
import type {
  RenderMode,
  RendererIssue,
  ResolvedBlockStyleView,
  ResolvedComponentProtocolView,
  ResolvedSlotRenderInfo,
} from "./types";

export function getResolvedComponentProtocol(
  resolved: ResolvedBlockStyle,
): ResolvedComponentProtocolView {
  const raw = resolved.variant.componentProtocol;
  const present =
    raw != null &&
    (raw.componentId != null ||
      raw.familyId != null ||
      raw.layoutMode != null);

  return {
    present,
    componentId: raw?.componentId,
    familyId: raw?.familyId,
    layoutMode: raw?.layoutMode,
    raw,
  };
}

export function enrichResolvedBlockStyleForRenderer(
  resolved: ResolvedBlockStyle,
): ResolvedBlockStyleView {
  return {
    ...resolved,
    componentProtocol: getResolvedComponentProtocol(resolved),
  };
}

export function resolveSlotRenderStates(
  resolved: ResolvedBlockStyle,
  options?: { mode?: RenderMode },
): {
  slotStates: Record<string, ResolvedSlotRenderInfo>;
  issues: RendererIssue[];
} {
  const slotDefinitions =
    resolved.slots ?? resolved.variant.slots ?? ({} as Record<string, never>);
  const slotStates: Record<string, ResolvedSlotRenderInfo> = {};
  const issues: RendererIssue[] = [];

  for (const [slotId, slotDef] of Object.entries(slotDefinitions)) {
    if (slotDef.binding.source === "disabled") {
      slotStates[slotId] = {
        slotId,
        state: "disabled",
        binding: slotDef.binding,
        copySafety: slotDef.copySafety,
        fallbackReason: "binding_source_disabled",
      };

      if (slotDef.binding.required) {
        issues.push(
          createRendererIssue({
            code: "optional_slot_disabled",
            message: `Slot "${slotId}" is required but binding source is disabled`,
            severity: "warning",
            blockId: resolved.blockId,
            blockType: resolved.blockType,
            variantId: resolved.variantId,
            slotId,
          }),
        );
      }
      continue;
    }

    if (options?.mode === "copy" && !slotDef.copySafety.allowedInCopy) {
      slotStates[slotId] = {
        slotId,
        state: "fallback",
        binding: slotDef.binding,
        copySafety: slotDef.copySafety,
        fallbackReason:
          slotDef.copySafety.fallbackSlotId ?? "copy_not_allowed_for_slot",
      };
      continue;
    }

    slotStates[slotId] = {
      slotId,
      state: "active",
      binding: slotDef.binding,
      copySafety: slotDef.copySafety,
    };
  }

  return { slotStates, issues };
}
