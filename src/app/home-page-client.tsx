"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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

export function HomePageClient() {
  const router = useRouter();
  const [form, setForm] = useState<HomeFormState>(DEFAULT_FORM);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

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
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-6 py-10">
      <header className="mb-8 space-y-2">
        <p className="text-sm font-medium text-emerald-700">轻篇 · Release 1</p>
        <h1 className="text-3xl font-bold text-zinc-900">公众号文章生成</h1>
        <p className="text-zinc-600">
          输入主题与基础需求，使用真实 AI 生成结构化文章，并在预览页查看带样式效果。
        </p>
      </header>

      <form
        className="space-y-5 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <label className="block space-y-1">
          <span className="text-sm font-medium text-zinc-800">
            文章主题 <span className="text-red-600">*</span>
          </span>
          <input
            data-testid="home-topic-input"
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
            value={form.topic}
            onChange={(event) => setForm({ ...form, topic: event.target.value })}
            placeholder="例如：春季护肤指南：敏感肌如何平稳换季"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-zinc-800">文章用途 / 场景</span>
          <select
            data-testid="home-scene-select"
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
            value={form.scene}
            onChange={(event) => setForm({ ...form, scene: event.target.value })}
          >
            {HOME_ARTICLE_SCENES.map((option) => (
              <option key={option.value || "none"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-zinc-800">目标读者</span>
          <select
            data-testid="home-audience-select"
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
            value={form.audience}
            onChange={(event) => setForm({ ...form, audience: event.target.value })}
          >
            {HOME_TARGET_AUDIENCES.map((option) => (
              <option key={option.value || "none"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-zinc-800">基础风格</span>
          <select
            data-testid="home-style-select"
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
            value={form.basicStyle}
            onChange={(event) => setForm({ ...form, basicStyle: event.target.value })}
          >
            {HOME_BASIC_STYLES.map((option) => (
              <option key={option.value || "default"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-zinc-500">
            本轮仅作为生成参数；正式风格 / 配色切换将在后续 Story 实现。
          </p>
        </label>

        {validationMessage ? (
          <p
            className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
            data-testid="home-validation-message"
            role="alert"
          >
            {validationMessage}
          </p>
        ) : null}

        <button
          type="submit"
          data-testid="home-generate-button"
          className="w-full rounded-md bg-zinc-900 px-4 py-2.5 font-medium text-white"
        >
          开始生成
        </button>
      </form>

      <p className="mt-6 text-sm text-zinc-500">
        开发者验收入口：{" "}
        <a href="/generate" className="text-emerald-700 underline">
          /generate
        </a>
      </p>
    </div>
  );
}
