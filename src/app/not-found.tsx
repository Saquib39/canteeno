// app/not-found.tsx
export default function NotFoundPage() {
  return (
    <main className="flex h-screen flex-col items-center justify-center space-y-4 bg-white dark:bg-gray-900">
      <h1 className="text-6xl font-bold text-orange-400">404</h1>
      <p className="text-xl">Oops—this page doesn't exist.</p>
      <a
        href="/"
        className="mt-4 inline-block rounded bg-orange-400 px-4 py-2 text-white hover:bg-orange-500"
      >
        Go back home
      </a>
    </main>
  );
}
