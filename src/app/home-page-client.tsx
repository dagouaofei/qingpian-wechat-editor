"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { CheckIcon, SparklesIcon } from "@/components/ui-shell/icons";
import { PageShell } from "@/components/ui-shell/page-shell";
import {
  ShellBadge,
  ShellButton,
  ShellCard,
  ShellCardAccent,
  ShellFieldLabel,
  ShellSelect,
  ShellTextarea,
} from "@/components/ui-shell/primitives";
import {
  HOME_ARTICLE_SCENES,
  HOME_BASIC_STYLES,
  HOME_TARGET_AUDIENCES,
  homeFormToSearchParams,
  validateHomeForm,
  type HomeFormState,
} from "@/lib/home-input";

const DEFAULT_FORM: HomeFormState = {
  topic: "",
  scene: "",
  audience: "",
  basicStyle: "",
};

const EXAMPLE_PROMPTS = [
  "如何做好一个公众号",
  "春季护肤指南：敏感肌如何平稳换季",
  "私域运营入门指南",
];

export function HomePageClient() {
  const router = useRouter();
  const [form, setForm] = useState<HomeFormState>(DEFAULT_FORM);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  function handleSubmit() {
    const validation = validateHomeForm(form);
    if (!validation.ok) {
      setValidationMessage(validation.message ?? "请填写文章主题。");
      return;
    }
    setValidationMessage(null);
    const params = homeFormToSearchParams(form);
    router.push(`/preview?${params.toString()}`);
  }

  return (
    <PageShell navCtaHref="#home-input" navCtaLabel="开始生成">
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 md:pt-12">
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-6">
            <div className="space-y-4">
              <ShellBadge className="border-blue-200/50 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-3 py-1 text-sm font-medium text-blue-700">
                <SparklesIcon className="mr-1 h-3.5 w-3.5" />
                AI 驱动的公众号排版助手
              </ShellBadge>
              <h1
                className="text-3xl font-bold leading-snug tracking-tight text-slate-900 sm:text-4xl"
                data-testid="home-page-title"
              >
                公众号文章生成
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-slate-600">
                输入主题与基础需求，使用真实 AI 生成结构化文章，自动排版后在预览页查看带样式效果，并一键复制到公众号编辑器。
              </p>
            </div>

            <div className="hidden flex-wrap gap-2 lg:flex">
              <ShellBadge className="border-emerald-200 bg-white/80 text-emerald-600 shadow-sm">
                <CheckIcon className="mr-1" />
                自动排版
              </ShellBadge>
              <ShellBadge className="border-blue-200 bg-white/80 text-blue-600 shadow-sm">
                <CheckIcon className="mr-1" />
                结构优化
              </ShellBadge>
              <ShellBadge className="border-indigo-200 bg-white/80 text-indigo-600 shadow-sm">
                <CheckIcon className="mr-1" />
                可复制到公众号
              </ShellBadge>
            </div>
          </div>

          <div id="home-input" className="relative">
            <div className="absolute inset-0 -z-10 scale-95 rounded-3xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-2xl" />
            <ShellCard>
              <ShellCardAccent />
              <form
                className="space-y-4 p-5 sm:p-6"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSubmit();
                }}
              >
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  输入选题，开始生成带样式公众号文章
                </div>

                <label className="block space-y-2">
                  <ShellFieldLabel required>文章主题</ShellFieldLabel>
                  <ShellTextarea
                    data-testid="home-topic-input"
                    value={form.topic}
                    onChange={(event) => setForm({ ...form, topic: event.target.value })}
                    placeholder="例如：春季护肤指南：敏感肌如何平稳换季"
                  />
                </label>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">试试这些：</span>
                  {EXAMPLE_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      className="rounded-full border border-transparent bg-slate-100 px-3 py-1.5 text-xs text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => setForm({ ...form, topic: prompt })}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  onClick={() => setShowAdvanced((value) => !value)}
                >
                  {showAdvanced ? "收起高级选项" : "展开高级选项（场景 / 读者 / 风格）"}
                </button>

                {showAdvanced ? (
                  <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 sm:grid-cols-2">
                    <label className="block space-y-2 sm:col-span-2">
                      <ShellFieldLabel>文章用途 / 场景</ShellFieldLabel>
                      <ShellSelect
                        data-testid="home-scene-select"
                        value={form.scene}
                        onChange={(event) => setForm({ ...form, scene: event.target.value })}
                      >
                        {HOME_ARTICLE_SCENES.map((option) => (
                          <option key={option.value || "none"} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </ShellSelect>
                    </label>
                    <label className="block space-y-2">
                      <ShellFieldLabel>目标读者</ShellFieldLabel>
                      <ShellSelect
                        data-testid="home-audience-select"
                        value={form.audience}
                        onChange={(event) => setForm({ ...form, audience: event.target.value })}
                      >
                        {HOME_TARGET_AUDIENCES.map((option) => (
                          <option key={option.value || "none"} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </ShellSelect>
                    </label>
                    <label className="block space-y-2">
                      <ShellFieldLabel>基础风格</ShellFieldLabel>
                      <ShellSelect
                        data-testid="home-style-select"
                        value={form.basicStyle}
                        onChange={(event) => setForm({ ...form, basicStyle: event.target.value })}
                      >
                        {HOME_BASIC_STYLES.map((option) => (
                          <option key={option.value || "default"} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </ShellSelect>
                    </label>
                  </div>
                ) : null}

                {validationMessage ? (
                  <p
                    className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
                    data-testid="home-validation-message"
                    role="alert"
                  >
                    {validationMessage}
                  </p>
                ) : null}

                <ShellButton
                  type="submit"
                  size="lg"
                  className="w-full"
                  data-testid="home-generate-button"
                >
                  <SparklesIcon className="h-5 w-5" />
                  开始生成
                </ShellButton>
              </form>
            </ShellCard>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
