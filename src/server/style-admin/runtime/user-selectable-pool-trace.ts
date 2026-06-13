import type { BlockType } from "@prisma/client";

import {
  evaluateUserSelectablePoolMembership,
  type UserSelectablePoolMembershipTrace,
} from "@/lib/user-selectable-pool-eligibility";

import type { StyleAdminPrismaClient } from "../prisma";

export type { UserSelectablePoolMembershipTrace };

export async function traceUserSelectablePoolVariant(
  db: StyleAdminPrismaClient,
  runtimeVariantId: string,
  options: { blockType?: BlockType } = {},
): Promise<UserSelectablePoolMembershipTrace | null> {
  const row = await db.styleVariant.findUnique({
    where: { runtimeVariantId },
    include: {
      distribution: true,
      currentVersion: true,
    },
  });

  if (!row) {
    return null;
  }

  return evaluateUserSelectablePoolMembership({
    runtimeVariantId: row.runtimeVariantId,
    blockType: row.blockType,
    lifecycle: row.lifecycle,
    distribution: row.distribution
      ? {
          userSelectable: row.distribution.userSelectable,
          hidden: row.distribution.hidden,
          deprecated: row.distribution.deprecated,
        }
      : null,
    currentVersion: row.currentVersion
      ? { qualityStatus: row.currentVersion.qualityStatus }
      : null,
    definitionJson: row.currentVersion?.definitionJson,
    requiredBlockType: options.blockType,
  });
}
