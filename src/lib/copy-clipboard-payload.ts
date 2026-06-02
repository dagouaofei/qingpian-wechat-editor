export async function copyClipboardPayload(payload: {
  textHtml: string;
  textPlain: string;
}): Promise<{ ok: boolean; message: string }> {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    return { ok: false, message: "当前浏览器不支持 Clipboard API" };
  }

  try {
    if ("ClipboardItem" in window) {
      const item = new ClipboardItem({
        "text/html": new Blob([payload.textHtml], { type: "text/html" }),
        "text/plain": new Blob([payload.textPlain], { type: "text/plain" }),
      });
      await navigator.clipboard.write([item]);
      return { ok: true, message: "已复制，可直接粘贴到公众号编辑器" };
    }

    await navigator.clipboard.writeText(payload.textPlain);
    return {
      ok: true,
      message: "已复制纯文本（当前环境不支持 HTML 剪贴板）",
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "复制失败",
    };
  }
}
