import type { Metadata } from "next";
import { Suspense } from "react";

import {
  buildUserSelectableHeadingOptionsFromPool,
} from "@/lib/preview-user-selectable-pool";
import {
  getUserSelectableVariantPool,
  toUserSelectableVariantPoolSnapshot,
} from "@/server/style-admin/runtime";

import { PreviewPageClient } from "./preview-page-client";

export const metadata: Metadata = {
  title: "文章预览 | 轻篇公众号排版",
  description: "真实 AI 生成结果预览",
};

export default async function PreviewPage() {
  const poolResult = await getUserSelectableVariantPool({ blockType: "heading" });
  const poolSnapshot = toUserSelectableVariantPoolSnapshot(poolResult);
  const userSelectableHeadingOptions =
    buildUserSelectableHeadingOptionsFromPool(poolSnapshot);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-zinc-600">
          加载预览页…
        </div>
      }
    >
      <PreviewPageClient
        userSelectablePool={poolSnapshot}
        userSelectableHeadingOptions={userSelectableHeadingOptions}
      />
    </Suspense>
  );
}
