import { notFound } from "next/navigation";

import { StyleFidelityDebugClient } from "./style-fidelity-debug-client";

export default function StyleFidelityDebugPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-xl font-semibold text-slate-900">R1 Style Fidelity Debug</h1>
      <p className="mt-2 text-sm text-slate-600">
        Sprint 7 · 007A — Golden fixture → assignment → Copy HTML 违禁检测（仅开发环境）
      </p>
      <StyleFidelityDebugClient />
    </main>
  );
}
