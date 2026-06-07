-- S10-STORY-005 FIX-B: source cohort + version quality status + canonical source types

CREATE TYPE "StyleVariantQualityStatus" AS ENUM (
  'not_checked',
  'validator_pass',
  'validator_failed',
  'copy_fidelity_failed',
  'paste_qa_pass',
  'blocked'
);

ALTER TYPE "StyleVariantSourceType" ADD VALUE IF NOT EXISTS 'ai_generated';

ALTER TABLE "style_variant_versions"
  ADD COLUMN "quality_status" "StyleVariantQualityStatus" NOT NULL DEFAULT 'not_checked';

ALTER TABLE "style_variant_sources"
  ADD COLUMN "source_cohort" TEXT;

CREATE INDEX "style_variant_sources_source_cohort_idx"
  ON "style_variant_sources"("source_cohort");
