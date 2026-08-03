import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <span className="text-8xl md:text-9xl font-display font-bold text-orange-500/20 mb-4">
        404
      </span>
      <h1 className="text-heading-1 text-gray-050 mb-3">Page Not Found</h1>
      <p className="text-body-lg text-gray-300 max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
