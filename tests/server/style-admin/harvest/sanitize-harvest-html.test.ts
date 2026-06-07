import { describe, expect, it } from "vitest";

import {
  escapeHtmlForDisplay,
  sanitizeHarvestHtml,
} from "@/server/style-admin/harvest/sanitize-harvest-html";

describe("sanitizeHarvestHtml", () => {
  it("removes script tags", () => {
    const input = '<div>ok</div><script>alert(1)</script>';
    expect(sanitizeHarvestHtml(input)).toBe("<div>ok</div>");
  });

  it("removes onclick and other event attributes", () => {
    const input = '<button onclick="alert(1)" onmouseover="x()">Click</button>';
    expect(sanitizeHarvestHtml(input)).toBe("<button>Click</button>");
  });

  it("escapeHtmlForDisplay escapes raw HTML for admin display", () => {
    const raw = '<img src=x onerror="alert(1)">';
    expect(escapeHtmlForDisplay(raw)).toBe(
      "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;",
    );
  });
});
