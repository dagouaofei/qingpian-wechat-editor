import type { ComponentProps, ReactNode } from "react";

export function cn(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

type ButtonProps = ComponentProps<"button"> & {
  size?: "sm" | "lg" | "default";
  variant?: "primary" | "secondary" | "ghost";
};

export function ShellButton({
  className,
  size = "default",
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  const sizeClass =
    size === "lg"
      ? "h-12 px-6 text-base rounded-xl"
      : size === "sm"
        ? "h-9 px-4 text-sm rounded-lg"
        : "h-10 px-4 text-sm rounded-lg";

  const variantClass =
    variant === "secondary"
      ? "border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
      : variant === "ghost"
        ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700";

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-all disabled:pointer-events-none disabled:opacity-50",
        sizeClass,
        variantClass,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ShellCard({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-xl backdrop-blur-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ShellCardAccent() {
  return (
    <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500" />
  );
}

export function ShellBadge({
  className,
  children,
  ...props
}: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function ShellFieldLabel({
  children,
  required,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <span className="text-sm font-medium text-slate-800">
      {children}
      {required ? <span className="text-red-500"> *</span> : null}
    </span>
  );
}

export function ShellSelect(props: ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-400/20",
        props.className,
      )}
      {...props}
    />
  );
}

export function ShellInput(props: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-400/20",
        props.className,
      )}
      {...props}
    />
  );
}

export function ShellTextarea(props: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "w-full min-h-[120px] resize-none rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-base text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-400/20 md:text-sm",
        props.className,
      )}
      {...props}
    />
  );
}
