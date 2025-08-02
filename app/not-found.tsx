import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="mb-4 text-4xl font-bold">404</h1>
      <p className="mb-6 text-lg">This page could not be found.</p>
      <Link href="/" className="underline text-primary">
        Go back home
      </Link>
    </main>
  );
}
