import { notFound } from 'next/navigation';
import { getCategoryBySlug, getProductsByCategory } from '@/lib/database';
import CategoryPageClient from './client';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  
  if (!category) {
    notFound();
  }

  const categoryProducts = await getProductsByCategory(categorySlug);

  return <CategoryPageClient category={category} products={categoryProducts} />;
}
