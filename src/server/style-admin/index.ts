/**
 * S10 database-backed style admin — server-side data access only.
 * Do not import from React client components.
 */

export { prisma } from "./prisma";
export type { StyleAdminDb, StyleAdminPrismaClient } from "./prisma";

export * from "./types";
export * from "./mappers";

export { StyleVariantRepository } from "./repositories/style-variant-repository";
export { StyleVariantDistributionRepository } from "./repositories/style-variant-distribution-repository";
export { StyleVariantValidationRepository } from "./repositories/style-variant-validation-repository";
export { StyleVariantAuditRepository } from "./repositories/style-variant-audit-repository";

export { getStyleAdminDbAvailability, isStyleAdminDbConfigured } from "./db-availability";
export {
  StyleLibraryAdminQuery,
  type AdminVariantDetail,
  type AdminVariantListFilter,
  type AdminVariantListRow,
  type AdminVariantSummary,
  type StyleLibraryAdminQueryResult,
} from "./queries/style-library-admin-query";

export * from "./import";
