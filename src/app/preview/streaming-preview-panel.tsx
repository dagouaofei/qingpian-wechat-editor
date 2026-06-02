import type { BlockType } from "@/core/blocks";

/** In-progress block state for client-side Preview Renderer during SSE stream. */
export type StreamingPreviewBlock = {
  blockId: string;
  blockType: BlockType;
  content: Record<string, unknown>;
  complete: boolean;
};
