import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProductBySlug, getProducts } from '@/lib/database';
import ProductPageClient from '@/components/ProductPageClient';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Продукт не е намерен | Just Cases',
      description: 'Този продукт не съществува или е премахнат.',
    };
  }

  const price = product.discount 
    ? ((product.price ?? 0) * (1 - (product.discount ?? 0) / 100)).toFixed(2)
    : (product.price ?? 0).toFixed(2);

  return {
    title: `${product.name} | Just Cases`,
    description: product.description?.slice(0, 160) || `Купете ${product.name} от Just Cases. Премиум качество, бърза доставка.`,
    keywords: [product.name, product.category?.name || 'аксесоари', 'мобилни аксесоари', 'калъфи', 'Just Cases'].filter(Boolean),
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 160) || `Купете ${product.name} от Just Cases`,
      type: 'website',
      url: `https://justcases.bg/product/${slug}`,
      images: product.image ? [
        {
          url: product.image,
          width: 800,
          height: 800,
          alt: product.name,
        }
      ] : [],
      siteName: 'Just Cases',
      locale: 'bg_BG',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description?.slice(0, 160) || `Купете ${product.name} от Just Cases`,
      images: product.image ? [product.image] : [],
    },
    other: {
      'product:price:amount': price,
      'product:price:currency': 'BGN',
      'product:availability': product.stock > 0 ? 'in stock' : 'out of stock',
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) {
    notFound();
  }

  // Get related products (same category)
  const relatedProducts = await getProducts({ 
    categoryId: product.categoryId,
    limit: 4 
  });

  return (
    <ProductPageClient 
      product={product} 
      relatedProducts={relatedProducts} 
    />
  );
}