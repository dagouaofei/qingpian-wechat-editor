"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { ArticlePreviewPanel } from "@/components/preview/article-preview-panel";
import type { StyleFidelityPageData, R1GoldenFixtureId } from "@/lib/style-fidelity-debug";

type Props = {
  data: StyleFidelityPageData;
  fixtureIds: R1GoldenFixtureId[];
};

export function StyleFidelityDebugClient({ data, fixtureIds }: Props) {
  const router = useRouter();
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const handleFixtureChange = useCallback(
    (nextId: R1GoldenFixtureId) => {
      router.push(`/dev/style-fidelity?fixture=${encodeURIComponent(nextId)}`);
    },
    [router],
  );

  async function handleCopyHtml() {
    try {
      await navigator.clipboard.writeText(data.copyHtml);
      setCopyStatus(`已复制 ${data.copyHtmlLength} 字符到剪贴板`);
    } catch {
      setCopyStatus("复制失败，请手动从下方 Copy HTML 区域选取");
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm">
        <span className="font-medium text-slate-700">Golden fixture</span>
        <select
          className="mt-1 w-full max-w-xl rounded-lg border border-slate-200 px-3 py-2 text-sm"
          value={data.fixtureId}
          onChange={(event) =>
            handleFixtureChange(event.target.value as R1GoldenFixtureId)
          }
        >
          {fixtureIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </label>

      <p className="text-xs text-slate-500">
        <strong>Style pipeline:</strong> {data.pipelineLabel}
      </p>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <section
          aria-labelledby="style-fidelity-preview-heading"
          className="min-w-0"
        >
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
            <h2
              id="style-fidelity-preview-heading"
              className="text-sm font-semibold text-slate-800"
            >
              网页 Preview
            </h2>
            <span className="text-xs text-slate-500">
              {data.previewBlockCount} blocks · preset={data.presetId} · theme=
              {data.themeId}
            </span>
          </div>
          <div
            className="max-h-[min(80vh,900px)] overflow-y-auto rounded-xl border border-slate-200 bg-[#f7f7f7] p-4 shadow-inner"
            data-testid="style-fidelity-preview-panel"
          >
            {data.previewBlockCount > 0 ? (
              <ArticlePreviewPanel
                blocks={data.previewBlocks}
                colorPalette={data.colorPalette}
                disableBlockRevealAnimation
              />
            ) : (
              <p className="text-sm text-red-700">
                Preview 无可用 block（请检查 fixture 与 renderer）。
              </p>
            )}
          </div>
        </section>

        <section
          aria-labelledby="style-fidelity-copy-heading"
          className="min-w-0 space-y-4"
        >
          <h2
            id="style-fidelity-copy-heading"
            className="text-sm font-semibold text-slate-800"
          >
            Copy HTML · 检查 · 元数据
          </h2>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
            <p>
              <strong>Preset:</strong> {data.presetId} · <strong>Theme:</strong>{" "}
              {data.themeId}
            </p>
            <p className="mt-1">
              <strong>Copy safe:</strong>{" "}
              <span
                className={data.copySafe ? "text-emerald-700" : "text-red-700"}
                data-testid="style-fidelity-copy-safe"
              >
                {data.copySafe ? "PASS (automated)" : "FAIL (automated)"}
              </span>
              <span className="text-slate-500">
                {" "}
                · {data.copyHtmlLength} chars
              </span>
            </p>
            <p className="mt-1 text-slate-600">{data.snapshotHint}</p>
            {data.copyViolations.length > 0 ? (
              <ul className="mt-2 list-disc pl-5 text-red-800">
                {data.copyViolations.map((violation) => (
                  <li key={violation.code}>
                    {violation.code}: {violation.message}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-emerald-800">无违禁 CSS（class / var / gradient 等）</p>
            )}
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-left text-xs" data-testid="style-fidelity-block-table">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-3 py-2">blockType</th>
                  <th className="px-3 py-2">variantId</th>
                  <th className="px-3 py-2">family</th>
                </tr>
              </thead>
              <tbody>
                {data.blocks.map((row) => (
                  <tr key={row.blockId} className="border-t border-slate-100">
                    <td className="px-3 py-2">{row.blockType}</td>
                    <td className="px-3 py-2 font-mono text-[11px]">{row.variantId}</td>
                    <td className="px-3 py-2">{row.familyId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            data-testid="style-fidelity-copy-button"
            onClick={() => void handleCopyHtml()}
          >
            复制 Copy HTML（与 Preview 同一 style 管线）
          </button>
          {copyStatus ? (
            <p className="text-xs text-slate-600" role="status">
              {copyStatus}
            </p>
          ) : null}

          <div>
            <h3 className="mb-1 text-xs font-medium text-slate-600">Copy HTML 摘要</h3>
            <pre
              className="max-h-72 overflow-auto rounded-lg border border-slate-200 bg-white p-3 text-[10px] leading-relaxed text-slate-700"
              data-testid="style-fidelity-copy-html-excerpt"
            >
              {data.copyHtmlExcerpt}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}
