import type { Metadata } from "next";

import { GalleryPageClient } from "./gallery-page-client";

export const metadata: Metadata = {
  title: "样式进展 | 轻篇公众号排版",
  description: "Fixture 驱动的 Preview 展台 — 肉眼验收 Renderer 与 Style 系统进展，不调用 AI",
};

export default function GalleryPage() {
  return <GalleryPageClient />;
}
