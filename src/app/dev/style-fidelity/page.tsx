import { notFound } from "next/navigation";

import { isStyleFidelityDebugEnabled } from "@/lib/style-fidelity-env";
import {
  buildStyleFidelityPageData,
  listR1GoldenFixtureIds,
  parseR1GoldenFixtureId,
} from "@/lib/style-fidelity-debug";

import { StyleFidelityDebugClient } from "./style-fidelity-debug-client";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ fixture?: string }>;
};

export default async function StyleFidelityDebugPage({ searchParams }: PageProps) {
  if (!isStyleFidelityDebugEnabled()) {
    notFound();
  }

  const params = await searchParams;
  const fixtureId = parseR1GoldenFixtureId(params.fixture);
  const data = buildStyleFidelityPageData(fixtureId);
  const fixtureIds = [...listR1GoldenFixtureIds()];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">R1 Style Fidelity Debug</h1>
        <p className="mt-2 text-sm text-slate-600">
          Sprint 7 · 007B — Golden fixture 网页 Preview 与 Copy HTML 对照。请使用{" "}
          <code className="rounded bg-slate-100 px-1">npm run dev</code>
          ；生产构建需{" "}
          <code className="rounded bg-slate-100 px-1">STYLE_FIDELITY_DEBUG=1 npm start</code>
        </p>
      </header>
      <StyleFidelityDebugClient
        data={data}
        fixtureIds={fixtureIds}
      />
    </main>
  );
}
