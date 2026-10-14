export default function HomeLoading() {
  return (
    <main className="min-h-screen bg-white" aria-busy="true" aria-label="در حال بارگذاری صفحه شهرزاد">
      <div className="h-52 bg-shahrzad-primary" />
      <div className="mx-auto -mt-8 max-w-4xl rounded-t-3xl bg-white p-5">
        <div className="h-44 w-full rounded-xl bg-shahrzad-surface-soft animate-shimmer" />
      </div>
    </main>
  );
}
