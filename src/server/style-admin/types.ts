import type {
  AlertSeverity,
  AlertStatus,
  BlockType,
  CopySafetyTier,
  Prisma,
  RuntimeErrorScope,
  StyleVariantEvidenceType,
  StyleVariantLifecycle,
  StyleVariantSourceType,
  StyleVariantValidationRunType,
  StyleVariantValidationStatus,
} from "@prisma/client";

export type {
  AlertSeverity,
  AlertStatus,
  BlockType,
  CopySafetyTier,
  RuntimeErrorScope,
  StyleVariant,
  StyleVariantDistribution,
  StyleVariantEvidence,
  StyleVariantLifecycle,
  StyleVariantLifecycleEvent,
  StyleVariantPromoteRecord,
  StyleVariantRollbackRecord,
  StyleVariantSource,
  StyleVariantValidationRun,
  StyleVariantVersion,
  AdminAuditLog,
  AlertEvent,
  RuntimeErrorLog,
  StyleVariantEvidenceType,
  StyleVariantRollbackType,
  StyleVariantSourceType,
  StyleVariantValidationRunType,
  StyleVariantValidationStatus,
} from "@prisma/client";

export type JsonValue = Prisma.InputJsonValue;

export type DistributionSnapshot = {
  userSelectable: boolean;
  defaultEligible: boolean;
  release1Required: boolean;
  hidden: boolean;
  deprecated: boolean;
  cacheVersion: number;
};

export type StyleVariantListFilter = {
  blockType?: BlockType;
  lifecycle?: StyleVariantLifecycle;
  styleFamily?: string;
  runtimeVariantId?: string;
  limit?: number;
  offset?: number;
};

export type UserSelectableVariantFilter = {
  blockType?: BlockType;
  styleFamily?: string;
  limit?: number;
  offset?: number;
};

export type CreateVariantWithVersionInput = {
  runtimeVariantId: string;
  blockType: BlockType;
  styleFamily: string;
  label: string;
  description?: string;
  lifecycle: StyleVariantLifecycle;
  definitionJson: JsonValue;
  componentProtocolJson?: JsonValue;
  compatibilityJson?: JsonValue;
  copySafety: CopySafetyTier;
  sourceChecksum?: string;
  createdBy?: string;
  distribution?: Partial<DistributionSnapshot>;
  source?: {
    sourceType: StyleVariantSourceType;
    sourceRef?: string;
    sourceMetadata?: JsonValue;
    rawHtml?: string;
  };
  actor: string;
};

export type CreateVariantVersionInput = {
  variantId: string;
  definitionJson: JsonValue;
  componentProtocolJson?: JsonValue;
  compatibilityJson?: JsonValue;
  copySafety: CopySafetyTier;
  sourceChecksum?: string;
  createdBy?: string;
  actor: string;
};

export type UpdateDistributionInput = {
  variantId: string;
  userSelectable?: boolean;
  defaultEligible?: boolean;
  release1Required?: boolean;
  hidden?: boolean;
  deprecated?: boolean;
  reason: string;
  actor: string;
};

export type RecordLifecycleEventInput = {
  variantId: string;
  fromLifecycle: StyleVariantLifecycle | null;
  toLifecycle: StyleVariantLifecycle;
  reason: string;
  actor: string;
};

export type RecordAdminAuditLogInput = {
  action: string;
  entityType: string;
  entityId: string;
  beforeJson?: JsonValue;
  afterJson?: JsonValue;
  reason?: string;
  actor: string;
};

export type RecordRuntimeErrorInput = {
  scope: RuntimeErrorScope;
  message: string;
  errorCode?: string;
  metadataJson?: JsonValue;
};

export type RecordAlertEventInput = {
  alertType: string;
  severity: AlertSeverity;
  status?: AlertStatus;
  message: string;
  metadataJson?: JsonValue;
};

export type CreateValidationRunInput = {
  variantId: string;
  versionId?: string;
  runType: StyleVariantValidationRunType;
  status: StyleVariantValidationStatus;
  issuesJson?: JsonValue;
  summaryJson?: JsonValue;
};

export type CreateEvidenceInput = {
  variantId: string;
  versionId?: string;
  evidenceType: StyleVariantEvidenceType;
  sourceUrl?: string;
  sourceLabel?: string;
  rawHtml?: string;
  ossKey?: string;
  metadataJson?: JsonValue;
};
