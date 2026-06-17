import type { StyleVariantLifecycle } from "@prisma/client";

import { normalizeImportLifecycle } from "../import/lifecycle-distribution-mapper";
import { assertGovernanceSnapshotQualityStatus } from "../quality-status-contract";
import {
  GOVERNANCE_SNAPSHOT_SCHEMA_VERSION,
  type GovernanceSnapshot,
  type GovernanceSnapshotVariant,
} from "./governance-snapshot-types";

const FORBIDDEN_KEY_PATTERN =
  /(database_url|password|session|secret|token|credential|admin_password|style_admin)/i;

const ALLOWED_LIFECYCLES = new Set<string>([
  "draft",
  "candidate",
  "paste_qa_pass",
  "release1_required",
  "default_eligible",
  "deprecated",
  "user_selectable",
]);

function assertNoForbiddenKeys(value: unknown, path = "$"): void {
  if (value === null || value === undefined) {
    return;
  }
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      assertNoForbiddenKeys(value[index], `${path}[${index}]`);
    }
    return;
  }
  if (typeof value !== "object") {
    return;
  }
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    if (FORBIDDEN_KEY_PATTERN.test(key)) {
      throw new Error(`Governance snapshot contains forbidden key: ${path}.${key}`);
    }
    assertNoForbiddenKeys(nested, `${path}.${key}`);
  }
}

function parseDistribution(raw: Record<string, unknown>) {
  for (const key of [
    "userSelectable",
    "defaultEligible",
    "release1Required",
    "hidden",
    "deprecated",
  ] as const) {
    if (typeof raw[key] !== "boolean") {
      throw new Error(`Governance snapshot distribution.${key} must be boolean`);
    }
  }
  return {
    userSelectable: raw.userSelectable as boolean,
    defaultEligible: raw.defaultEligible as boolean,
    release1Required: raw.release1Required as boolean,
    hidden: raw.hidden as boolean,
    deprecated: raw.deprecated as boolean,
  };
}

function parseVariant(raw: Record<string, unknown>): GovernanceSnapshotVariant {
  if (typeof raw.runtimeVariantId !== "string" || !raw.runtimeVariantId.trim()) {
    throw new Error("Governance snapshot variant.runtimeVariantId must be a non-empty string");
  }
  if (typeof raw.label !== "string") {
    throw new Error(`Governance snapshot label must be string for ${raw.runtimeVariantId}`);
  }
  if (typeof raw.lifecycle !== "string" || !ALLOWED_LIFECYCLES.has(raw.lifecycle)) {
    throw new Error(`Governance snapshot invalid lifecycle for ${raw.runtimeVariantId}`);
  }
  const qualityStatus = assertGovernanceSnapshotQualityStatus(
    raw.qualityStatus,
    raw.runtimeVariantId as string,
  );
  if (!raw.distribution || typeof raw.distribution !== "object") {
    throw new Error(`Governance snapshot missing distribution for ${raw.runtimeVariantId}`);
  }

  const lifecycle = normalizeImportLifecycle(
    raw.lifecycle as StyleVariantLifecycle,
  );

  return {
    runtimeVariantId: raw.runtimeVariantId,
    label: raw.label,
    lifecycle,
    distribution: parseDistribution(raw.distribution as Record<string, unknown>),
    qualityStatus,
  };
}

export function parseGovernanceSnapshot(raw: unknown): GovernanceSnapshot {
  assertNoForbiddenKeys(raw);

  if (!raw || typeof raw !== "object") {
    throw new Error("Governance snapshot must be a JSON object");
  }

  const record = raw as Record<string, unknown>;
  if (record.schemaVersion !== GOVERNANCE_SNAPSHOT_SCHEMA_VERSION) {
    throw new Error(
      `Unsupported governance snapshot schemaVersion: ${String(record.schemaVersion)}`,
    );
  }
  if (typeof record.exportedAt !== "string") {
    throw new Error("Governance snapshot exportedAt must be a string");
  }
  if (typeof record.sourceEnvironment !== "string") {
    throw new Error("Governance snapshot sourceEnvironment must be a string");
  }
  if (!Array.isArray(record.variants)) {
    throw new Error("Governance snapshot variants must be an array");
  }

  const variants = record.variants.map((entry, index) =>
    parseVariant(entry as Record<string, unknown>),
  );

  const runtimeIds = new Set<string>();
  for (const variant of variants) {
    if (runtimeIds.has(variant.runtimeVariantId)) {
      throw new Error(`Duplicate runtimeVariantId in snapshot: ${variant.runtimeVariantId}`);
    }
    runtimeIds.add(variant.runtimeVariantId);
  }

  return {
    schemaVersion: GOVERNANCE_SNAPSHOT_SCHEMA_VERSION,
    exportedAt: record.exportedAt,
    sourceEnvironment: record.sourceEnvironment,
    variantCount: variants.length,
    variants,
  };
}
