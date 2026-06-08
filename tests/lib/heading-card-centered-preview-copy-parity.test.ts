import { describe, expect, it } from "vitest";

import { decodeVariantDsl } from "@/core/dsl/decoder";
import { encodeRegistryVariantToDsl } from "@/core/dsl/encoder";
import { headingCardCentered } from "@/core/styles/variants/heading-publish-pool";
import {
  dslRuntimeTraceFixtureArticle,
  pickTraceFixtureBlock,
} from "@/lib/dsl-runtime/trace-fixture-article";

describe("heading_card_centered preview/copy parity", () => {
  it("copy html matches preview structure without extra h3 border lines", () => {
    const encoded = encodeRegistryVariantToDsl(headingCardCentered);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;

    const article = structuredClone(dslRuntimeTraceFixtureArticle);
    const block = pickTraceFixtureBlock("heading");

    const preview = decodeVariantDsl({
      article,
      block,
      variantDsl: encoded.value,
      target: "preview",
    });
    const copy = decodeVariantDsl({
      article,
      block,
      variantDsl: encoded.value,
      target: "copy_wechat",
    });

    expect(preview.ok).toBe(true);
    expect(copy.ok).toBe(true);
    if (!preview.ok || !copy.ok) return;

    expect(preview.output?.kind).toBe("title_block_preview");
    expect(copy.output?.kind).toBe("title_block_copy_html");
    expect(copy.html).toMatch(/text-align:\s*center/i);
    expect(copy.html).not.toMatch(/border-top:\s*1px/i);
    expect(copy.html).not.toMatch(/border-bottom:\s*1px/i);
    expect(copy.html).not.toMatch(/padding:\s*16px\s+18px/i);
  });
});
