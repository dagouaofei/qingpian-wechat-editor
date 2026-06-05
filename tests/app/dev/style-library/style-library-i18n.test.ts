import { describe, expect, it } from "vitest";

import {
  STYLE_LIBRARY_DEFAULT_LOCALE,
  getCandidateDisabledActions,
  getLifecycleDisplayLabel,
  getStyleLibraryUiCopy,
  resolveStyleLibraryLocale,
} from "@/app/dev/style-library/style-library-i18n";

describe("style-library-i18n", () => {
  it("defaults locale to zh when lang is missing or invalid", () => {
    expect(STYLE_LIBRARY_DEFAULT_LOCALE).toBe("zh");
    expect(resolveStyleLibraryLocale()).toBe("zh");
    expect(resolveStyleLibraryLocale(undefined)).toBe("zh");
    expect(resolveStyleLibraryLocale(null)).toBe("zh");
    expect(resolveStyleLibraryLocale("fr")).toBe("zh");
  });

  it("resolves en locale from query value", () => {
    expect(resolveStyleLibraryLocale("en")).toBe("en");
  });

  it("provides Chinese workbench copy by default", () => {
    const ui = getStyleLibraryUiCopy("zh");
    expect(ui.workbenchTitle).toBe("样式管理工作台");
    expect(ui.runtimeStatus).toBe("未接入运行时");
    expect(ui.summaryPasteQaPassed).toBe("已通过粘贴 QA 的候选样式");
  });

  it("provides English workbench copy when locale is en", () => {
    const ui = getStyleLibraryUiCopy("en");
    expect(ui.workbenchTitle).toBe("Style Library Workbench");
    expect(ui.runtimeStatus).toBe("Not connected to runtime");
    expect(ui.summaryPasteQaPassed).toBe("Candidate / Paste QA passed");
  });

  it("maps lifecycle labels in Chinese and English", () => {
    expect(getLifecycleDisplayLabel("zh", "paste_qa_pass")).toBe("粘贴 QA 通过");
    expect(getLifecycleDisplayLabel("en", "paste_qa_pass")).toBe("Paste QA Pass");
    expect(getLifecycleDisplayLabel("zh", "draft")).toBe("草稿");
    expect(getLifecycleDisplayLabel("en", "deprecated")).toBe("Deprecated");
  });

  it("localizes candidate disabled actions without changing story ids", () => {
    const zhActions = getCandidateDisabledActions("zh");
    const enActions = getCandidateDisabledActions("en");

    expect(zhActions.map((action) => action.label)).toEqual([
      "校验",
      "查看证据",
      "加入用户可选",
      "标记为可默认推荐",
    ]);
    expect(enActions.map((action) => action.label)).toEqual([
      "Validate",
      "Review Evidence",
      "Promote to User Selectable",
      "Mark Default Eligible",
    ]);
    expect(zhActions.every((action) => action.deferredStory.startsWith("S9-STORY-"))).toBe(
      true,
    );
  });
});
