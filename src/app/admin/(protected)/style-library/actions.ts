"use server";

import { revalidatePath } from "next/cache";

import {
  hideVariantFromUserPool,
  markVariantDeprecated,
  restoreVariantFromDeprecated,
  restoreVariantToUserSelectable,
  rollbackLastDistributionChange,
  type GovernanceActionResult,
} from "@/server/style-admin/actions/distribution-governance";

type GovernanceFormState = GovernanceActionResult;

function revalidateAdminPaths(runtimeVariantId: string) {
  revalidatePath("/admin/style-library");
  revalidatePath(`/admin/style-library/${encodeURIComponent(runtimeVariantId)}`);
}

async function runGovernanceAction(
  runtimeVariantId: string,
  reason: string,
  runner: (input: { runtimeVariantId: string; reason: string }) => Promise<GovernanceActionResult>,
): Promise<GovernanceFormState> {
  const result = await runner({ runtimeVariantId, reason });
  if (result.ok) {
    revalidateAdminPaths(runtimeVariantId);
  }
  return result;
}

export async function hideFromUserPoolAction(
  runtimeVariantId: string,
  reason: string,
): Promise<GovernanceFormState> {
  return runGovernanceAction(runtimeVariantId, reason, hideVariantFromUserPool);
}

export async function restoreToUserSelectableAction(
  runtimeVariantId: string,
  reason: string,
): Promise<GovernanceFormState> {
  return runGovernanceAction(runtimeVariantId, reason, restoreVariantToUserSelectable);
}

export async function markDeprecatedAction(
  runtimeVariantId: string,
  reason: string,
): Promise<GovernanceFormState> {
  return runGovernanceAction(runtimeVariantId, reason, markVariantDeprecated);
}

export async function restoreFromDeprecatedAction(
  runtimeVariantId: string,
  reason: string,
): Promise<GovernanceFormState> {
  return runGovernanceAction(runtimeVariantId, reason, restoreVariantFromDeprecated);
}

export async function rollbackLastDistributionAction(
  runtimeVariantId: string,
  reason: string,
): Promise<GovernanceFormState> {
  return runGovernanceAction(runtimeVariantId, reason, rollbackLastDistributionChange);
}
