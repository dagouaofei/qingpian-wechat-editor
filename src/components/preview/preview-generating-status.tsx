"use client";

function blockTypeLabel(blockType: string): string {
  switch (blockType) {
    case "title":
      return "标题";
    case "heading":
      return "小标题";
    case "lead":
      return "导语";
    case "paragraph":
      return "段落";
    case "highlight":
      return "重点";
    case "list":
      return "列表";
    case "quote":
      return "引用";
    case "info_card":
      return "信息卡片";
    case "summary":
      return "总结";
    case "cta":
      return "行动引导";
    case "divider":
      return "分隔";
    default:
      return blockType;
  }
}

export function PreviewGeneratingStatus({
  visible,
  completedBlockCount,
  totalBlockCount,
  activeBlockType,
  phase,
  statusHint,
}: {
  visible: boolean;
  completedBlockCount: number;
  totalBlockCount: number;
  activeBlockType?: string | null;
  phase: "loading" | "revealing" | "complete";
  statusHint?: string;
}) {
  if (!visible) {
    return null;
  }

  const message =
    statusHint?.trim() ||
    (phase === "loading"
      ? "正在连接 AI 并生成文章…"
      : phase === "complete"
        ? "成稿展示完成"
        : completedBlockCount === 0
          ? "正在写入首段内容…"
          : "正在逐段展示成稿…");

  return (
    <div
      className="sticky top-2 z-20 mb-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-xl border border-blue-100/80 bg-white/95 px-3 py-2 text-xs shadow-lg shadow-blue-500/10 backdrop-blur-md"
      role="status"
      aria-live="polite"
      data-testid="preview-generating-status"
    >
      <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
        {phase !== "complete" ? (
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" aria-hidden />
        ) : null}
        {message}
      </span>
      {phase === "revealing" && totalBlockCount > 0 ? (
        <>
          <span className="text-slate-500">
            已展示 {completedBlockCount} / {totalBlockCount} 个内容块
          </span>
          {activeBlockType ? (
            <span className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
              正在写入 {blockTypeLabel(activeBlockType)}
            </span>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
