import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCategoryBySlug, getProductsByCategory } from '@/lib/database';
import ProductCard from '@/components/ProductCard';

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

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 py-16">
        <div className="container-custom">
          <div className="flex items-center space-x-6">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
              <Image
                src={category.image || '/placeholder-category.jpg'}
                alt={category.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{category.name}</h1>
              <p className="text-gray-300 text-lg">{category.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-800 py-4">
        <div className="container-custom">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-gray-500">/</span>
            <Link href="/shop" className="text-gray-400 hover:text-white transition-colors">
              Shop
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-white">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Products Grid */}
      <div className="py-12">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">
              {categoryProducts.length} Products in {category.name}
            </h2>
            <div className="flex items-center space-x-4">
              <select className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
                <option>Best Selling</option>
              </select>
            </div>
          </div>

          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
              <p className="text-gray-400 mb-6">We're working on adding more products to this category.</p>
              <Link 
                href="/shop" 
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
