import type { Metadata } from "next";

import { GeneratePageClient } from "./generate-page-client";

export const metadata: Metadata = {
  title: "轻篇生成 | 轻篇公众号排版",
  description: "Release 1 主流程：输入 → 生成 → 预览 → 复制",
};

export default function GeneratePage() {
  return <GeneratePageClient />;
}
