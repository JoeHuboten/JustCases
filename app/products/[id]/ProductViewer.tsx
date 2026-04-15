"use client";

import dynamic from "next/dynamic";

const PhoneCaseViewer = dynamic(
  () => import("@/components/PhoneCaseViewer"),
  { ssr: false }
);

interface ProductViewerProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
  };
}

export default function ProductViewer({ product }: ProductViewerProps) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Left column — 3D viewer */}
        <div className="lg:w-1/2">
          <PhoneCaseViewer
            caseName={product.name}
            caseColor="#e05c00"
            phoneColor="#2c2c2e"
          />
        </div>

        {/* Right column — product details */}
        <div className="flex flex-col justify-center gap-6 lg:w-1/2">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {product.name}
          </h1>

          <p className="text-2xl font-semibold text-orange-400">
            ${product.price.toFixed(2)}
          </p>

          <p className="leading-relaxed text-zinc-400">
            {product.description}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="rounded-xl bg-orange-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-orange-500"
            >
              Add to Cart
            </button>
            <button
              type="button"
              className="rounded-xl border border-zinc-600 px-8 py-3 font-semibold text-zinc-300 transition-colors hover:bg-zinc-800"
            >
              Save to Wishlist
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
