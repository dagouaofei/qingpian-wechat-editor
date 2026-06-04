import { STYLE_SCHEMA_VERSION } from "@/core/styles";

/** 测试用 StyleRegistry — 覆盖 title / paragraph / heading variants */
export const minimalStyleRegistryFixture = {
  schemaVersion: STYLE_SCHEMA_VERSION,
  themes: [
    {
      id: "businessBlue",
      name: "商务蓝",
      schemaVersion: STYLE_SCHEMA_VERSION,
      tokens: {
        color: { "text.default": "#333333" },
        fontSize: { body: "16px" },
      },
    },
  ],
  presets: [
    {
      id: "business",
      name: "Classic News",
      schemaVersion: STYLE_SCHEMA_VERSION,
      themeId: "businessBlue",
      defaultVariantByBlockType: {
        title: "title-centered",
        paragraph: "paragraph-standard",
      },
    },
  ],
  variants: [
    {
      id: "title-centered",
      schemaVersion: STYLE_SCHEMA_VERSION,
      blockType: "title" as const,
      family: "simple",
      name: "title-centered",
      label: "居中标题",
      status: "release1_required" as const,
      tokens: { emphasis: "bold" },
    },
    {
      id: "title-left",
      schemaVersion: STYLE_SCHEMA_VERSION,
      blockType: "title" as const,
      family: "simple",
      name: "title-left",
      label: "左对齐标题",
      status: "release1_required" as const,
    },
    {
      id: "paragraph-standard",
      schemaVersion: STYLE_SCHEMA_VERSION,
      blockType: "paragraph" as const,
      family: "simple",
      name: "paragraph-standard",
      label: "标准段落",
      status: "release1_required" as const,
    },
    {
      id: "magazine_left_bar_title",
      schemaVersion: STYLE_SCHEMA_VERSION,
      blockType: "heading" as const,
      family: "magazine",
      name: "magazine_left_bar_title",
      label: "杂志左栏",
      status: "release1_candidate" as const,
    },
    {
      id: "heading-experimental",
      schemaVersion: STYLE_SCHEMA_VERSION,
      blockType: "heading" as const,
      family: "experimental",
      name: "heading-experimental",
      label: "实验标题",
      status: "experimental" as const,
    },
    {
      id: "heading-safe",
      schemaVersion: STYLE_SCHEMA_VERSION,
      blockType: "heading" as const,
      family: "simple",
      name: "heading-safe",
      label: "安全标题",
      status: "release1_required" as const,
    },
  ],
};
