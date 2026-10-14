import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-shahrzad-background p-6">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 text-center tile-shadow">
        <h1 className="mb-3 text-xl font-bold">صفحه‌ای که به دنبالش هستید پیدا نشد!</h1>
        <p className="mb-6 text-sm text-neutral-500">لطفاً به صفحه اصلی بروید.</p>
        <Link className="inline-flex rounded-xl bg-shahrzad-primary px-5 py-3 text-sm font-bold text-white" href="/home">
          صفحه اصلی
        </Link>
      </section>
    </main>
  );
}
