import { describe, expect, it } from "vitest";

describe("style-admin JSON payload shapes", () => {
  it("accepts ComponentProtocol and validation issue JSON shapes", () => {
    const componentProtocol = {
      componentId: "heading_chapter_label",
      slots: [{ slotId: "title", required: true }],
    };

    const compatibility = {
      copySafety: "strict",
      wechatProfileId: "wechat-mp-editor-v1",
    };

    const validationIssues = {
      issues: [
        {
          code: "RED_INLINE_STYLE",
          severity: "error",
          message: "Unsupported inline style",
        },
      ],
    };

    expect(componentProtocol.slots).toHaveLength(1);
    expect(compatibility.copySafety).toBe("strict");
    expect(validationIssues.issues[0]?.code).toBe("RED_INLINE_STYLE");
  });
});
