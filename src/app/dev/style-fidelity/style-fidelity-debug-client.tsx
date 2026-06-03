"use client";

import { useMemo, useState } from "react";

import {
  buildGoldenCopyHtml,
  buildStyleFidelityDebugReport,
  listR1GoldenFixtureIds,
  type R1GoldenFixtureId,
} from "@/lib/style-fidelity-debug";

export function StyleFidelityDebugClient() {
  const fixtureIds = listR1GoldenFixtureIds();
  const [fixtureId, setFixtureId] = useState<R1GoldenFixtureId>(fixtureIds[0]!);
  const [copyHtml, setCopyHtml] = useState("");

  const report = useMemo(
    () => buildStyleFidelityDebugReport(fixtureId),
    [fixtureId],
  );

  async function handleCopyHtml() {
    const html = buildGoldenCopyHtml(fixtureId);
    setCopyHtml(html);
    await navigator.clipboard.writeText(html);
  }

  return (
    <div className="mt-6 space-y-6">
      <label className="block text-sm">
        <span className="font-medium text-slate-700">Golden fixture</span>
        <select
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          value={fixtureId}
          onChange={(event) => setFixtureId(event.target.value as R1GoldenFixtureId)}
        >
          {fixtureIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </label>

      <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
        <p>
          <strong>Preset:</strong> {report.presetId} · <strong>Theme:</strong> {report.themeId}
        </p>
        <p className="mt-1">
          <strong>Copy safe:</strong>{" "}
          <span className={report.copySafe ? "text-emerald-700" : "text-red-700"}>
            {report.copySafe ? "PASS (automated)" : "FAIL (automated)"}
          </span>
        </p>
        <p className="mt-1 text-slate-600">{report.snapshotHint}</p>
        {report.copyViolations.length > 0 ? (
          <ul className="mt-2 list-disc pl-5 text-red-800">
            {report.copyViolations.map((violation) => (
              <li key={violation.code}>
                {violation.code}: {violation.message}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-3 py-2">block</th>
              <th className="px-3 py-2">type</th>
              <th className="px-3 py-2">variantId</th>
              <th className="px-3 py-2">familyId</th>
            </tr>
          </thead>
          <tbody>
            {report.blocks.map((row) => (
              <tr key={row.blockId} className="border-t border-slate-100">
                <td className="px-3 py-2 font-mono">{row.blockId.slice(0, 8)}…</td>
                <td className="px-3 py-2">{row.blockType}</td>
                <td className="px-3 py-2">{row.variantId}</td>
                <td className="px-3 py-2">{row.familyId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
        onClick={() => void handleCopyHtml()}
      >
        复制当前 fixture Copy HTML
      </button>

      {copyHtml ? (
        <pre className="max-h-64 overflow-auto rounded-lg border border-slate-200 bg-white p-3 text-[10px] text-slate-700">
          {copyHtml.slice(0, 4000)}
          {copyHtml.length > 4000 ? "\n…" : ""}
        </pre>
      ) : null}
    </div>
  );
}
