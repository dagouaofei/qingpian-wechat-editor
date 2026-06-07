import { encodeHtmlToVariantDsl } from "@/core/dsl/encoder";

const PROMOTE_HEADING_HTML = `<section style="padding: 8px 0; border-left: 4px solid #1677ff;">
  <span style="font-size: 18px; font-weight: 700; color: #111;">Promote Test Heading</span>
</section>`;

export function buildPromoteHeadingVariantDsl(runtimeVariantId: string) {
  const encoded = encodeHtmlToVariantDsl({
    html: PROMOTE_HEADING_HTML,
    runtimeVariantId,
    blockType: "heading",
    label: "Promote Test Heading",
  });
  if (!encoded.ok) {
    throw new Error(encoded.issues.map((issue) => issue.message).join("; "));
  }
  return encoded.value;
}
