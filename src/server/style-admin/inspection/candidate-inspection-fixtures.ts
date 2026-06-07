import type { BlockType } from "@prisma/client";

import type { CandidateInspectionFixture } from "./candidate-inspection-types";

const HEADING_SAMPLE = "这是一个测试小标题";
const INFO_CARD_TITLE = "核心提示";
const INFO_CARD_BODY = "这里是一段信息卡片正文，用于测试 candidate。";

export function buildCandidateInspectionFixture(
  blockType: BlockType,
  runtimeVariantId: string,
): CandidateInspectionFixture | null {
  if (blockType === "heading") {
    return {
      fixtureId: `admin-inspection-heading-${runtimeVariantId}`,
      fixtureLabel: "Heading inspection sample (S10-STORY-010)",
      sampleText: HEADING_SAMPLE,
      blockContent: {
        text: HEADING_SAMPLE,
        level: 2,
      },
    };
  }

  if (blockType === "info_card") {
    return {
      fixtureId: `admin-inspection-info-card-${runtimeVariantId}`,
      fixtureLabel: "Info card inspection sample (S10-STORY-010)",
      sampleText: `${INFO_CARD_TITLE} — ${INFO_CARD_BODY}`,
      blockContent: {
        title: INFO_CARD_TITLE,
        body: INFO_CARD_BODY,
      },
    };
  }

  return null;
}
