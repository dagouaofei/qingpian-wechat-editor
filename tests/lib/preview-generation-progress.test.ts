import { describe, expect, it } from "vitest";

import {
  analysisProgressPercent,
  buildAnalysisSteps,
} from "@/lib/preview-generation-progress";

describe("preview-generation-progress", () => {
  it("marks earlier steps done and current step active", () => {
    const steps = buildAnalysisSteps(2);
    expect(steps[0]?.status).toBe("done");
    expect(steps[1]?.status).toBe("done");
    expect(steps[2]?.status).toBe("active");
    expect(steps[3]?.status).toBe("pending");
  });

  it("returns higher progress when more steps complete", () => {
    const early = analysisProgressPercent(buildAnalysisSteps(0));
    const later = analysisProgressPercent(buildAnalysisSteps(3));
    expect(later).toBeGreaterThan(early);
  });
});
