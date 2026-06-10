export default function AdminLogoutPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4 py-12">
      <div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Sign out</h1>
        <p className="mt-2 text-sm text-slate-600">
          Confirm sign-out from the style admin console. This action requires an explicit POST.
        </p>
        <form className="mt-6" method="POST" action="/api/admin/logout" data-testid="admin-logout-form">
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            data-testid="admin-logout-submit"
          >
            Confirm logout
          </button>
        </form>
      </div>
    </main>
  );
}
