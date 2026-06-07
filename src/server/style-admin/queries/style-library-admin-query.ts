import type {
  BlockType,
  Prisma,
  StyleVariant,
  StyleVariantDistribution,
  StyleVariantEvidence,
  StyleVariantLifecycle,
  StyleVariantLifecycleEvent,
  StyleVariantPromoteRecord,
  StyleVariantSource,
  StyleVariantValidationRun,
  StyleVariantVersion,
} from "@prisma/client";

import { getStyleAdminDbAvailability } from "../db-availability";
import type { StyleAdminPrismaClient } from "../prisma";

export type AdminVariantListFilter = {
  blockType?: BlockType;
  lifecycle?: StyleVariantLifecycle;
  userSelectable?: boolean;
  release1Required?: boolean;
  defaultEligible?: boolean;
  deprecated?: boolean;
  hidden?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
};

export type AdminVariantListRow = StyleVariant & {
  distribution: StyleVariantDistribution | null;
  currentVersion: StyleVariantVersion | null;
  sources: StyleVariantSource[];
};

export type AdminVariantSummary = {
  total: number;
  userSelectable: number;
  release1Required: number;
  defaultEligible: number;
  hidden: number;
  deprecated: number;
  candidateOrPasteQa: number;
  missingComponentProtocol: number;
  validationIssueCount: number;
};

export type AdminVariantDetail = {
  variant: StyleVariant;
  distribution: StyleVariantDistribution | null;
  currentVersion: StyleVariantVersion | null;
  sources: StyleVariantSource[];
  lifecycleEvents: StyleVariantLifecycleEvent[];
  validationRuns: StyleVariantValidationRun[];
  evidence: StyleVariantEvidence[];
  promoteRecords: StyleVariantPromoteRecord[];
};

export type StyleLibraryAdminQueryResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: "db_not_configured" | "db_unavailable" };

function buildListWhere(filter: AdminVariantListFilter): Prisma.StyleVariantWhereInput {
  const distributionWhere: Prisma.StyleVariantDistributionWhereInput = {};

  if (filter.userSelectable !== undefined) {
    distributionWhere.userSelectable = filter.userSelectable;
  }
  if (filter.release1Required !== undefined) {
    distributionWhere.release1Required = filter.release1Required;
  }
  if (filter.defaultEligible !== undefined) {
    distributionWhere.defaultEligible = filter.defaultEligible;
  }
  if (filter.deprecated !== undefined) {
    distributionWhere.deprecated = filter.deprecated;
  }
  if (filter.hidden !== undefined) {
    distributionWhere.hidden = filter.hidden;
  }

  const search = filter.search?.trim();
  const searchWhere: Prisma.StyleVariantWhereInput | undefined = search
    ? {
        OR: [
          { runtimeVariantId: { contains: search, mode: "insensitive" } },
          { label: { contains: search, mode: "insensitive" } },
          { styleFamily: { contains: search, mode: "insensitive" } },
        ],
      }
    : undefined;

  const distributionFilter =
    Object.keys(distributionWhere).length > 0 ? { distribution: distributionWhere } : {};

  return {
    ...(filter.blockType ? { blockType: filter.blockType } : {}),
    ...(filter.lifecycle ? { lifecycle: filter.lifecycle } : {}),
    ...distributionFilter,
    ...(searchWhere ?? {}),
  };
}

export class StyleLibraryAdminQuery {
  constructor(private readonly db: StyleAdminPrismaClient) {}

  async listAdminVariants(
    filter: AdminVariantListFilter = {},
  ): Promise<StyleLibraryAdminQueryResult<AdminVariantListRow[]>> {
    const availability = getStyleAdminDbAvailability();
    if (!availability.configured) {
      return { ok: false, error: "db_not_configured" };
    }

    try {
      const rows = await this.db.styleVariant.findMany({
        where: buildListWhere(filter),
        include: {
          distribution: true,
          currentVersion: true,
          sources: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { updatedAt: "desc" },
        take: filter.limit ?? 500,
        skip: filter.offset,
      });
      return { ok: true, data: rows };
    } catch {
      return { ok: false, error: "db_unavailable" };
    }
  }

  async getAdminVariantSummary(): Promise<StyleLibraryAdminQueryResult<AdminVariantSummary>> {
    const availability = getStyleAdminDbAvailability();
    if (!availability.configured) {
      return { ok: false, error: "db_not_configured" };
    }

    try {
      const variants = await this.db.styleVariant.findMany({
        include: {
          distribution: true,
          currentVersion: true,
        },
      });

      const validationRuns = await this.db.styleVariantValidationRun.findMany({
        where: { status: { in: ["fail", "warning"] } },
        select: { id: true },
      });

      let userSelectable = 0;
      let release1Required = 0;
      let defaultEligible = 0;
      let hidden = 0;
      let deprecated = 0;
      let candidateOrPasteQa = 0;
      let missingComponentProtocol = 0;

      for (const variant of variants) {
        const distribution = variant.distribution;
        if (distribution?.userSelectable) userSelectable += 1;
        if (distribution?.release1Required) release1Required += 1;
        if (distribution?.defaultEligible) defaultEligible += 1;
        if (distribution?.hidden) hidden += 1;
        if (distribution?.deprecated) deprecated += 1;
        if (
          variant.lifecycle === "candidate" ||
          variant.lifecycle === "paste_qa_pass" ||
          variant.lifecycle === "validator_pass"
        ) {
          candidateOrPasteQa += 1;
        }
        if (!variant.currentVersion?.componentProtocolJson) {
          missingComponentProtocol += 1;
        }
      }

      return {
        ok: true,
        data: {
          total: variants.length,
          userSelectable,
          release1Required,
          defaultEligible,
          hidden,
          deprecated,
          candidateOrPasteQa,
          missingComponentProtocol,
          validationIssueCount: validationRuns.length,
        },
      };
    } catch {
      return { ok: false, error: "db_unavailable" };
    }
  }

  async getAdminVariantDetail(
    runtimeVariantId: string,
  ): Promise<StyleLibraryAdminQueryResult<AdminVariantDetail | null>> {
    const availability = getStyleAdminDbAvailability();
    if (!availability.configured) {
      return { ok: false, error: "db_not_configured" };
    }

    try {
      const variant = await this.db.styleVariant.findUnique({
        where: { runtimeVariantId },
        include: {
          distribution: true,
          currentVersion: true,
          sources: { orderBy: { createdAt: "desc" } },
          lifecycleEvents: { orderBy: { createdAt: "desc" } },
          validationRuns: { orderBy: { createdAt: "desc" }, take: 20 },
          evidence: { orderBy: { createdAt: "desc" }, take: 20 },
          promoteRecords: { orderBy: { createdAt: "desc" }, take: 10 },
        },
      });

      if (!variant) {
        return { ok: true, data: null };
      }

      const {
        sources,
        lifecycleEvents,
        validationRuns,
        evidence,
        promoteRecords,
        distribution,
        currentVersion,
        ...core
      } = variant;

      return {
        ok: true,
        data: {
          variant: core,
          distribution,
          currentVersion,
          sources,
          lifecycleEvents,
          validationRuns,
          evidence,
          promoteRecords,
        },
      };
    } catch {
      return { ok: false, error: "db_unavailable" };
    }
  }
}
