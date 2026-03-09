import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  // Parse JSON-string fields stored in DB
  let images: string[] = [];
  let colors: string[] = [];
  let sizes: string[] = [];
  try { images = JSON.parse(product.images || '[]'); } catch {}
  try { colors = JSON.parse(product.colors || '[]'); } catch {}
  try { sizes  = JSON.parse(product.sizes  || '[]'); } catch {}

  return NextResponse.json({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    oldPrice: product.oldPrice,
    discount: product.discount,
    image: product.image,
    images,
    colors,
    sizes,
    rating: product.rating,
    reviews: product.reviews,
    inStock: product.inStock,
    stock: product.stock,
    featured: product.featured,
    specifications: product.specifications,
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    },
  });
}
