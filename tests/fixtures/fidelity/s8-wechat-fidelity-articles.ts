import { parseArticle } from "@/core/article";
import type { Article } from "@/core/article";
import type { BlockType } from "@/core/blocks";

import { articleFixtureBase, fixtureBlockId } from "../articles/shared";
import type { WechatFidelityFixtureSpec } from "@/core/wechat-compat/fidelity-matrix-types";

import { S8_FIDELITY_PRESET_ID } from "./s8-wechat-fidelity-registry";

function fidelityBlockContent(
  blockType: BlockType,
  variantId: string,
): Record<string, unknown> {
  switch (blockType) {
    case "title":
      return { text: `S8 Matrix · ${variantId}` };
    case "heading":
      return { text: `章节 · ${variantId}`, level: 2 };
    case "lead":
      return { text: `导语 fixture：${variantId}。用于 Contract v1 复制校验。` };
    case "paragraph":
      return {
        text: `正文 fixture ${variantId}：验证 inline typography 与 Yellow 装饰边界。`,
      };
    case "divider":
      return { style: variantId.includes("dotted") ? "dot" : "line" };
    case "list":
      return {
        ordered: variantId.includes("numbered"),
        items: [
          { text: "第一项" },
          { text: "第二项", subItems: ["子项 A"] },
          { text: "第三项" },
        ],
      };
    case "quote":
      return {
        text: `引用 fixture ${variantId}`,
        attribution: "S8 Fidelity Matrix",
      };
    case "highlight":
      return {
        text: `总结/重点 fixture ${variantId}`,
        label: "重点",
      };
    case "info_card":
      return variantId === "info_card_reading_path_candidate"
        ? {
            title: "阅读路径：",
            body: "要点一 / 要点二 / 要点三",
          }
        : {
            title: `信息卡 ${variantId}`,
            body: "要点一\n要点二",
            icon: "提示",
          };
    case "cta":
      return {
        text: `行动号召 ${variantId}`,
        action: "占位操作",
      };
    default:
      return { text: variantId };
  }
}

export function createS8FidelityArticleFixture(
  spec: Pick<WechatFidelityFixtureSpec, "fixtureId" | "blockType" | "variantId">,
): Article {
  const blockId = fixtureBlockId(1);
  const block = {
    id: blockId,
    type: spec.blockType,
    content: fidelityBlockContent(spec.blockType, spec.variantId),
    ...(spec.blockType === "heading"
      ? {
          meta:
            spec.variantId === "heading_purple_chapter_label_candidate"
              ? { sourceIndex: 1, label: "CHAPTER 01" }
              : { sourceIndex: 1 },
        }
      : {}),
  };

  return parseArticle({
    ...articleFixtureBase(),
    metadata: {
      ...articleFixtureBase().metadata,
      title: `S8 Fidelity · ${spec.fixtureId}`,
    },
    styleAssignment: {
      themeId: "businessBlue",
      presetId: S8_FIDELITY_PRESET_ID,
      blockOverrides: [{ blockId, variantId: spec.variantId }],
    },
    blocks: [block],
  });
}
