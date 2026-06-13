import type { Metadata } from "next";
import { Suspense } from "react";

import {
  buildUserSelectableHeadingOptionsFromPool,
} from "@/lib/preview-user-selectable-pool";
import {
  getRuntimeVariantDslPool,
  getUserSelectableVariantPool,
  toDslRuntimeSnapshot,
  toUserSelectableVariantPoolSnapshot,
} from "@/server/style-admin/runtime";

import { PreviewPageClient } from "./preview-page-client";

export const metadata: Metadata = {
  title: "文章预览 | 轻篇公众号排版",
  description: "真实 AI 生成结果预览",
};

export const dynamic = "force-dynamic";

export default async function PreviewPage() {
  const [poolResult, dslPoolResult] = await Promise.all([
    getUserSelectableVariantPool({ blockType: "heading" }),
    getRuntimeVariantDslPool(),
  ]);
  const poolSnapshot = toUserSelectableVariantPoolSnapshot(poolResult);
  const dslRuntime = toDslRuntimeSnapshot(dslPoolResult);
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
        dslRuntime={dslRuntime}
        userSelectableHeadingOptions={userSelectableHeadingOptions}
      />
    </Suspense>
  );
}
