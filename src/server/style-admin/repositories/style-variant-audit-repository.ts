import type {
  AdminAuditLog,
  AlertEvent,
  RuntimeErrorLog,
  StyleVariantLifecycleEvent,
} from "@prisma/client";

import type { StyleAdminDb } from "../prisma";
import type {
  RecordAdminAuditLogInput,
  RecordAlertEventInput,
  RecordLifecycleEventInput,
  RecordRuntimeErrorInput,
} from "../types";

export class StyleVariantAuditRepository {
  constructor(private readonly db: StyleAdminDb) {}

  recordLifecycleEvent(
    input: RecordLifecycleEventInput,
  ): Promise<StyleVariantLifecycleEvent> {
    return this.db.styleVariantLifecycleEvent.create({
      data: {
        variantId: input.variantId,
        fromLifecycle: input.fromLifecycle ?? undefined,
        toLifecycle: input.toLifecycle,
        reason: input.reason,
        actor: input.actor,
      },
    });
  }

  recordAdminAuditLog(
    input: RecordAdminAuditLogInput,
  ): Promise<AdminAuditLog> {
    return this.db.adminAuditLog.create({
      data: {
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        beforeJson: input.beforeJson,
        afterJson: input.afterJson,
        reason: input.reason,
        actor: input.actor,
      },
    });
  }

  recordRuntimeError(input: RecordRuntimeErrorInput): Promise<RuntimeErrorLog> {
    return this.db.runtimeErrorLog.create({
      data: {
        scope: input.scope,
        message: input.message,
        errorCode: input.errorCode,
        metadataJson: input.metadataJson,
      },
    });
  }

  recordAlertEvent(input: RecordAlertEventInput): Promise<AlertEvent> {
    return this.db.alertEvent.create({
      data: {
        alertType: input.alertType,
        severity: input.severity,
        status: input.status ?? "open",
        message: input.message,
        metadataJson: input.metadataJson,
      },
    });
  }
}
