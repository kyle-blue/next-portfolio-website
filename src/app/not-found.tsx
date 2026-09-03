import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="font-mono text-sm tracking-widest text-zinc-500 uppercase">404</p>
            <h1 className="text-2xl font-semibold">Nothing here.</h1>
            <Link href="/" className="text-zinc-300 underline underline-offset-4 hover:text-white">
                Back to www.kblue.io
            </Link>
        </main>
    );
}
