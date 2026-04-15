import type { Metadata } from "next";
import ProductViewer from "./ProductViewer";

export const metadata: Metadata = {
  title: "Product | AuraCase",
  description: "Preview your custom phone case in 3D",
};

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  // TODO: fetch product by id from your data layer
  const product = {
    id,
    name: "AuraCase — Cosmic Orange",
    price: 39.99,
    description:
      "Premium protective case for iPhone 17 Pro. Precision-moulded polycarbonate with a soft-touch matte finish.",
  };

  return <ProductViewer product={product} />;
}
