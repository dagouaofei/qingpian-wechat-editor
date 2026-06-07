import type {
  StyleVariantEvidence,
  StyleVariantValidationRun,
} from "@prisma/client";

import type { StyleAdminDb } from "../prisma";
import type { CreateEvidenceInput, CreateValidationRunInput } from "../types";

export class StyleVariantValidationRepository {
  constructor(private readonly db: StyleAdminDb) {}

  createValidationRun(
    input: CreateValidationRunInput,
  ): Promise<StyleVariantValidationRun> {
    return this.db.styleVariantValidationRun.create({
      data: {
        variantId: input.variantId,
        versionId: input.versionId,
        runType: input.runType,
        status: input.status,
        issuesJson: input.issuesJson,
        summaryJson: input.summaryJson,
      },
    });
  }

  listValidationRuns(variantId: string): Promise<StyleVariantValidationRun[]> {
    return this.db.styleVariantValidationRun.findMany({
      where: { variantId },
      orderBy: { createdAt: "desc" },
    });
  }

  createEvidence(input: CreateEvidenceInput): Promise<StyleVariantEvidence> {
    return this.db.styleVariantEvidence.create({
      data: {
        variantId: input.variantId,
        versionId: input.versionId,
        evidenceType: input.evidenceType,
        sourceUrl: input.sourceUrl,
        sourceLabel: input.sourceLabel,
        rawHtml: input.rawHtml,
        ossKey: input.ossKey,
        metadataJson: input.metadataJson,
      },
    });
  }

  listEvidence(variantId: string): Promise<StyleVariantEvidence[]> {
    return this.db.styleVariantEvidence.findMany({
      where: { variantId },
      orderBy: { createdAt: "desc" },
    });
  }
}
