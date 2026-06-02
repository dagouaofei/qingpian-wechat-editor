"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const NEAR_BOTTOM_PX = 96;
const SCROLL_COOLDOWN_MS = 450;
const TYPING_FOLLOW_THROTTLE_MS = 280;
const VIEWPORT_ANCHOR_RATIO = 0.35;
const BOTTOM_EDGE_RATIO = 0.78;

function scheduleAfterPaint(run: () => void, delayMs = 48) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.setTimeout(run, delayMs);
    });
  });
}

function isBlockNearBottomEdge(
  blockEl: HTMLElement,
  container: HTMLElement,
): boolean {
  const containerRect = container.getBoundingClientRect();
  const blockRect = blockEl.getBoundingClientRect();
  return (
    (blockRect.bottom - containerRect.top) / container.clientHeight >
    BOTTOM_EDGE_RATIO
  );
}

function isBlockInComfortZone(
  blockEl: HTMLElement,
  container: HTMLElement,
): boolean {
  const containerRect = container.getBoundingClientRect();
  const blockRect = blockEl.getBoundingClientRect();
  const topRatio = (blockRect.top - containerRect.top) / container.clientHeight;
  const bottomRatio =
    (blockRect.bottom - containerRect.top) / container.clientHeight;
  return topRatio >= 0.08 && topRatio <= 0.52 && bottomRatio <= 0.78;
}

export function usePreviewStreamScroll(options: {
  activeBlockId: string | null;
  activeBlockType: string | null;
  contentRevision: number;
  enabled: boolean;
}) {
  const { activeBlockId, activeBlockType, contentRevision, enabled } = options;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [autoFollow, setAutoFollow] = useState(true);
  const lastScrollAtRef = useRef(0);
  const lastScrolledBlockIdRef = useRef<string | null>(null);
  const lastTopRef = useRef(0);

  const scrollBlockIntoView = useCallback(
    (blockId: string, behavior: ScrollBehavior) => {
      const container = containerRef.current;
      if (!container) {
        return false;
      }

      const target = container.querySelector(`#preview-block-${blockId}`);
      if (!(target instanceof HTMLElement)) {
        return false;
      }

      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const targetY = containerRect.top + container.clientHeight * VIEWPORT_ANCHOR_RATIO;
      const delta = targetRect.top - targetY;

      if (Math.abs(delta) < 8) {
        return true;
      }

      container.dataset.programmaticScroll = "1";
      container.scrollTo({
        top: Math.max(0, container.scrollTop + delta),
        behavior,
      });
      requestAnimationFrame(() => {
        if (containerRef.current) {
          delete containerRef.current.dataset.programmaticScroll;
        }
      });
      return true;
    },
    [],
  );

  const scrollToBottomIfNeeded = useCallback((behavior: ScrollBehavior) => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    if (distanceFromBottom <= NEAR_BOTTOM_PX) {
      return;
    }

    container.dataset.programmaticScroll = "1";
    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
    requestAnimationFrame(() => {
      if (containerRef.current) {
        delete containerRef.current.dataset.programmaticScroll;
      }
    });
  }, []);

  const resumeFollow = useCallback(() => {
    setAutoFollow(true);
    lastScrollAtRef.current = 0;
    lastScrolledBlockIdRef.current = null;
    if (activeBlockId) {
      scrollBlockIntoView(activeBlockId, "smooth");
    } else {
      scrollToBottomIfNeeded("smooth");
    }
  }, [activeBlockId, scrollBlockIntoView, scrollToBottomIfNeeded]);

  const resetAutoFollow = useCallback(() => {
    lastScrollAtRef.current = 0;
    lastScrolledBlockIdRef.current = null;
    lastTopRef.current = 0;
    setAutoFollow(true);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) {
      return;
    }

    lastTopRef.current = container.scrollTop;

    function handleScroll() {
      if (!container) {
        return;
      }

      if (container.dataset.programmaticScroll === "1") {
        lastTopRef.current = container.scrollTop;
        return;
      }

      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      const currentTop = container.scrollTop;

      if (distanceFromBottom <= NEAR_BOTTOM_PX) {
        setAutoFollow(true);
      } else if (currentTop < lastTopRef.current - 24) {
        setAutoFollow(false);
      }

      lastTopRef.current = currentTop;
    }

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !autoFollow || !activeBlockId) {
      return;
    }

    const isNewBlock = lastScrolledBlockIdRef.current !== activeBlockId;
    const now = Date.now();

    if (isNewBlock) {
      if (
        lastScrolledBlockIdRef.current !== null &&
        now - lastScrollAtRef.current < SCROLL_COOLDOWN_MS
      ) {
        return;
      }

      scheduleAfterPaint(() => {
        const container = containerRef.current;
        if (!container || !activeBlockId) {
          return;
        }

        const target = container.querySelector(`#preview-block-${activeBlockId}`);
        if (!(target instanceof HTMLElement)) {
          scrollToBottomIfNeeded("auto");
          return;
        }

        if (isBlockInComfortZone(target, container)) {
          lastScrolledBlockIdRef.current = activeBlockId;
          lastScrollAtRef.current = Date.now();
          return;
        }

        scrollBlockIntoView(activeBlockId, "smooth");
        lastScrolledBlockIdRef.current = activeBlockId;
        lastScrollAtRef.current = Date.now();
      });
      return;
    }

    if (now - lastScrollAtRef.current < TYPING_FOLLOW_THROTTLE_MS) {
      return;
    }

    scheduleAfterPaint(
      () => {
        const container = containerRef.current;
        if (!container || !activeBlockId) {
          return;
        }

        const target = container.querySelector(`#preview-block-${activeBlockId}`);
        if (!(target instanceof HTMLElement)) {
          scrollToBottomIfNeeded("auto");
          lastScrollAtRef.current = Date.now();
          return;
        }

        if (!isBlockNearBottomEdge(target, container)) {
          const distanceFromBottom =
            container.scrollHeight - container.scrollTop - container.clientHeight;
          if (distanceFromBottom > NEAR_BOTTOM_PX) {
            scrollToBottomIfNeeded("auto");
          }
          return;
        }

        scrollBlockIntoView(activeBlockId, "auto");
        lastScrollAtRef.current = Date.now();
      },
      0,
    );
  }, [
    activeBlockId,
    activeBlockType,
    autoFollow,
    contentRevision,
    enabled,
    scrollBlockIntoView,
    scrollToBottomIfNeeded,
  ]);

  useEffect(() => {
    if (!enabled || !autoFollow) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new ResizeObserver(() => {
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      if (distanceFromBottom > NEAR_BOTTOM_PX && activeBlockId) {
        const target = container.querySelector(`#preview-block-${activeBlockId}`);
        if (target instanceof HTMLElement && isBlockNearBottomEdge(target, container)) {
          scrollBlockIntoView(activeBlockId, "auto");
        } else if (distanceFromBottom > container.clientHeight * 0.25) {
          scrollToBottomIfNeeded("auto");
        }
      }
    });

    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, [
    activeBlockId,
    autoFollow,
    contentRevision,
    enabled,
    scrollBlockIntoView,
    scrollToBottomIfNeeded,
  ]);

  return {
    containerRef,
    autoFollow,
    resumeFollow,
    resetAutoFollow,
  };
}
