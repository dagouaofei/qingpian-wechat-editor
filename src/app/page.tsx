export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 font-sans">
      <main className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-medium text-emerald-600">轻篇</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
          轻篇公众号排版
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-600">
          正式项目已初始化。当前处于 Sprint 1
          完成阶段：工程地基、Cursor 规则与文档体系已就绪，业务功能将在后续
          Sprint 实现。
        </p>
        <dl className="mt-8 grid gap-4 text-sm text-zinc-700 sm:grid-cols-2">
          <div>
            <dt className="font-medium text-zinc-500">项目名</dt>
            <dd className="mt-1 font-mono">qingpian-wechat-editor</dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-500">Release 1 聚焦</dt>
            <dd className="mt-1">
              文章生成、样式排版、流式预览与复制一致性闭环
            </dd>
          </div>
        </dl>
        <p className="mt-8 text-sm text-zinc-500">
          开发规范见 <code className="text-zinc-700">docs/</code> 与{" "}
          <code className="text-zinc-700">.cursor/rules/</code>
        </p>
      </main>
    </div>
  );
}
