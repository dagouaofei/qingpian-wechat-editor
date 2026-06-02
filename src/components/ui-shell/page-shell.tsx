import Link from "next/link";
import type { ReactNode } from "react";

import { SparklesIcon } from "./icons";
import { ShellButton } from "./primitives";

export function PageBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute top-0 right-0 h-[800px] w-[800px] -translate-y-1/3 translate-x-1/4 rounded-full bg-gradient-to-br from-blue-100/60 via-indigo-100/40 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 h-[600px] w-[600px] -translate-x-1/4 translate-y-1/3 rounded-full bg-gradient-to-tr from-cyan-100/50 via-teal-100/30 to-transparent blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
    </div>
  );
}

export function AppNav({
  ctaHref = "/",
  ctaLabel = "立即体验",
}: {
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/70 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-slate-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
            <SparklesIcon className="h-5 w-5 text-white" />
          </div>
          <span>轻篇</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/generate"
            className="hidden text-sm text-slate-600 transition-colors hover:text-slate-900 sm:inline"
          >
            开发者入口
          </Link>
          <Link href={ctaHref}>
            <ShellButton size="sm">{ctaLabel}</ShellButton>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export function PageShell({
  children,
  navCtaHref,
  navCtaLabel,
}: {
  children: ReactNode;
  navCtaHref?: string;
  navCtaLabel?: string;
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50">
      <PageBackdrop />
      <AppNav ctaHref={navCtaHref} ctaLabel={navCtaLabel} />
      <main className="relative z-10">{children}</main>
    </div>
  );
}
