-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('title', 'lead', 'heading', 'paragraph', 'list', 'quote', 'highlight', 'info_card', 'cta', 'divider', 'image_placeholder');

-- CreateEnum
CREATE TYPE "StyleVariantLifecycle" AS ENUM ('draft', 'candidate', 'validator_pass', 'paste_qa_pass', 'user_selectable', 'default_eligible', 'deprecated');

-- CreateEnum
CREATE TYPE "StyleVariantSourceType" AS ENUM ('registry', 'style_library_manifest', 'html_paste', 'harvest', 'manual', 'unknown');

-- CreateEnum
CREATE TYPE "StyleVariantValidationRunType" AS ENUM ('preview', 'copy_html', 'wechat_validator', 'paste_qa', 'manual_review');

-- CreateEnum
CREATE TYPE "StyleVariantValidationStatus" AS ENUM ('pass', 'warning', 'fail', 'skipped', 'pending');

-- CreateEnum
CREATE TYPE "StyleVariantEvidenceType" AS ENUM ('harvest', 'paste_qa', 'validator', 'matrix', 'drift', 'waiver', 'screenshot', 'raw_html', 'manual');

-- CreateEnum
CREATE TYPE "StyleVariantRollbackType" AS ENUM ('version', 'distribution', 'lifecycle');

-- CreateEnum
CREATE TYPE "RuntimeErrorScope" AS ENUM ('admin', 'runtime_variant_pool', 'preview', 'copy', 'db', 'unknown');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('info', 'warning', 'critical');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('open', 'acknowledged', 'resolved');

-- CreateEnum
CREATE TYPE "CopySafetyTier" AS ENUM ('strict', 'balanced', 'experimental');

-- CreateTable
CREATE TABLE "style_variants" (
    "id" TEXT NOT NULL,
    "runtime_variant_id" TEXT NOT NULL,
    "block_type" "BlockType" NOT NULL,
    "style_family" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "lifecycle" "StyleVariantLifecycle" NOT NULL,
    "current_version_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "style_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "style_variant_versions" (
    "id" TEXT NOT NULL,
    "variant_id" TEXT NOT NULL,
    "version_number" INTEGER NOT NULL,
    "definition_json" JSONB NOT NULL,
    "component_protocol_json" JSONB,
    "compatibility_json" JSONB,
    "copy_safety" "CopySafetyTier" NOT NULL,
    "source_checksum" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "style_variant_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "style_variant_sources" (
    "id" TEXT NOT NULL,
    "variant_id" TEXT NOT NULL,
    "source_type" "StyleVariantSourceType" NOT NULL,
    "source_ref" TEXT,
    "source_metadata" JSONB,
    "raw_html" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "style_variant_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "style_variant_distribution" (
    "id" TEXT NOT NULL,
    "variant_id" TEXT NOT NULL,
    "user_selectable" BOOLEAN NOT NULL DEFAULT false,
    "default_eligible" BOOLEAN NOT NULL DEFAULT false,
    "release1_required" BOOLEAN NOT NULL DEFAULT false,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "deprecated" BOOLEAN NOT NULL DEFAULT false,
    "cache_version" INTEGER NOT NULL DEFAULT 0,
    "updated_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "style_variant_distribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "style_variant_lifecycle_events" (
    "id" TEXT NOT NULL,
    "variant_id" TEXT NOT NULL,
    "from_lifecycle" "StyleVariantLifecycle",
    "to_lifecycle" "StyleVariantLifecycle" NOT NULL,
    "reason" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "style_variant_lifecycle_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "style_variant_validation_runs" (
    "id" TEXT NOT NULL,
    "variant_id" TEXT NOT NULL,
    "version_id" TEXT,
    "run_type" "StyleVariantValidationRunType" NOT NULL,
    "status" "StyleVariantValidationStatus" NOT NULL,
    "issues_json" JSONB,
    "summary_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "style_variant_validation_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "style_variant_evidence" (
    "id" TEXT NOT NULL,
    "variant_id" TEXT NOT NULL,
    "version_id" TEXT,
    "evidence_type" "StyleVariantEvidenceType" NOT NULL,
    "source_url" TEXT,
    "source_label" TEXT,
    "raw_html" TEXT,
    "oss_key" TEXT,
    "metadata_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "style_variant_evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "style_variant_promote_records" (
    "id" TEXT NOT NULL,
    "variant_id" TEXT NOT NULL,
    "from_lifecycle" "StyleVariantLifecycle" NOT NULL,
    "to_lifecycle" "StyleVariantLifecycle" NOT NULL,
    "distribution_before_json" JSONB NOT NULL,
    "distribution_after_json" JSONB NOT NULL,
    "reason" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "style_variant_promote_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "style_variant_rollback_records" (
    "id" TEXT NOT NULL,
    "variant_id" TEXT NOT NULL,
    "rollback_type" "StyleVariantRollbackType" NOT NULL,
    "from_version_id" TEXT,
    "to_version_id" TEXT,
    "distribution_before_json" JSONB,
    "distribution_after_json" JSONB,
    "reason" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "style_variant_rollback_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_audit_logs" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "before_json" JSONB,
    "after_json" JSONB,
    "reason" TEXT,
    "actor" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "runtime_error_logs" (
    "id" TEXT NOT NULL,
    "scope" "RuntimeErrorScope" NOT NULL,
    "message" TEXT NOT NULL,
    "error_code" TEXT,
    "metadata_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "runtime_error_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_events" (
    "id" TEXT NOT NULL,
    "alert_type" TEXT NOT NULL,
    "severity" "AlertSeverity" NOT NULL,
    "status" "AlertStatus" NOT NULL DEFAULT 'open',
    "message" TEXT NOT NULL,
    "metadata_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "alert_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "style_variants_runtime_variant_id_key" ON "style_variants"("runtime_variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "style_variants_current_version_id_key" ON "style_variants"("current_version_id");

-- CreateIndex
CREATE INDEX "style_variants_block_type_idx" ON "style_variants"("block_type");

-- CreateIndex
CREATE INDEX "style_variants_lifecycle_idx" ON "style_variants"("lifecycle");

-- CreateIndex
CREATE INDEX "style_variants_style_family_idx" ON "style_variants"("style_family");

-- CreateIndex
CREATE INDEX "style_variant_versions_variant_id_idx" ON "style_variant_versions"("variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "style_variant_versions_variant_id_version_number_key" ON "style_variant_versions"("variant_id", "version_number");

-- CreateIndex
CREATE INDEX "style_variant_sources_variant_id_idx" ON "style_variant_sources"("variant_id");

-- CreateIndex
CREATE INDEX "style_variant_sources_source_type_idx" ON "style_variant_sources"("source_type");

-- CreateIndex
CREATE UNIQUE INDEX "style_variant_distribution_variant_id_key" ON "style_variant_distribution"("variant_id");

-- CreateIndex
CREATE INDEX "style_variant_distribution_user_selectable_hidden_deprecate_idx" ON "style_variant_distribution"("user_selectable", "hidden", "deprecated");

-- CreateIndex
CREATE INDEX "style_variant_lifecycle_events_variant_id_created_at_idx" ON "style_variant_lifecycle_events"("variant_id", "created_at");

-- CreateIndex
CREATE INDEX "style_variant_validation_runs_variant_id_created_at_idx" ON "style_variant_validation_runs"("variant_id", "created_at");

-- CreateIndex
CREATE INDEX "style_variant_validation_runs_run_type_idx" ON "style_variant_validation_runs"("run_type");

-- CreateIndex
CREATE INDEX "style_variant_evidence_variant_id_created_at_idx" ON "style_variant_evidence"("variant_id", "created_at");

-- CreateIndex
CREATE INDEX "style_variant_promote_records_variant_id_created_at_idx" ON "style_variant_promote_records"("variant_id", "created_at");

-- CreateIndex
CREATE INDEX "style_variant_rollback_records_variant_id_created_at_idx" ON "style_variant_rollback_records"("variant_id", "created_at");

-- CreateIndex
CREATE INDEX "admin_audit_logs_entity_type_entity_id_idx" ON "admin_audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "admin_audit_logs_created_at_idx" ON "admin_audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "runtime_error_logs_scope_created_at_idx" ON "runtime_error_logs"("scope", "created_at");

-- CreateIndex
CREATE INDEX "alert_events_severity_status_idx" ON "alert_events"("severity", "status");

-- CreateIndex
CREATE INDEX "alert_events_created_at_idx" ON "alert_events"("created_at");

-- AddForeignKey
ALTER TABLE "style_variants" ADD CONSTRAINT "style_variants_current_version_id_fkey" FOREIGN KEY ("current_version_id") REFERENCES "style_variant_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "style_variant_versions" ADD CONSTRAINT "style_variant_versions_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "style_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "style_variant_sources" ADD CONSTRAINT "style_variant_sources_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "style_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "style_variant_distribution" ADD CONSTRAINT "style_variant_distribution_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "style_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "style_variant_lifecycle_events" ADD CONSTRAINT "style_variant_lifecycle_events_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "style_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "style_variant_validation_runs" ADD CONSTRAINT "style_variant_validation_runs_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "style_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "style_variant_validation_runs" ADD CONSTRAINT "style_variant_validation_runs_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "style_variant_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "style_variant_evidence" ADD CONSTRAINT "style_variant_evidence_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "style_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "style_variant_evidence" ADD CONSTRAINT "style_variant_evidence_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "style_variant_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "style_variant_promote_records" ADD CONSTRAINT "style_variant_promote_records_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "style_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "style_variant_rollback_records" ADD CONSTRAINT "style_variant_rollback_records_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "style_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "style_variant_rollback_records" ADD CONSTRAINT "style_variant_rollback_records_from_version_id_fkey" FOREIGN KEY ("from_version_id") REFERENCES "style_variant_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "style_variant_rollback_records" ADD CONSTRAINT "style_variant_rollback_records_to_version_id_fkey" FOREIGN KEY ("to_version_id") REFERENCES "style_variant_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
