import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Headphones } from "lucide-react";

const features = [
  { icon: Truck, title: "Free Shipping", desc: "On all orders over $50" },
  { icon: ShieldCheck, title: "Secure Payment", desc: "100% secure transactions" },
  { icon: RefreshCw, title: "Easy Returns", desc: "30-day return policy" },
  { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
];

const categories = [
  { name: "Electronics", emoji: "📱", slug: "electronics", color: "from-blue-500 to-indigo-600" },
  { name: "Clothing", emoji: "👕", slug: "clothing", color: "from-pink-500 to-rose-600" },
  { name: "Home & Living", emoji: "🏠", slug: "home-living", color: "from-green-500 to-emerald-600" },
  { name: "Sports", emoji: "⚽", slug: "sports", color: "from-orange-500 to-amber-600" },
  { name: "Books", emoji: "📚", slug: "books", color: "from-purple-500 to-violet-600" },
  { name: "Beauty", emoji: "💄", slug: "beauty", color: "from-red-400 to-pink-500" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-2xl">
            <span className="inline-block bg-indigo-700/50 backdrop-blur-sm text-indigo-200 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-indigo-600/50">
              🎉 New arrivals every week
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Shop Smarter,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                Live Better
              </span>
            </h1>
            <p className="text-lg text-indigo-200 mb-8 leading-relaxed">
              Discover thousands of premium products at unbeatable prices. From electronics to fashion — we have it all.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center justify-center gap-2 bg-indigo-700/40 backdrop-blur-sm text-white font-semibold px-8 py-3.5 rounded-xl border border-indigo-500/50 hover:bg-indigo-700/60 transition-all duration-200"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by Category</h2>
            <p className="text-gray-500 mt-1">Find exactly what you&apos;re looking for</p>
          </div>
          <Link href="/categories" className="text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map(({ name, emoji, slug, color }) => (
            <Link
              key={slug}
              href={`/products?category=${slug}`}
              className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white text-center hover:scale-105 transition-transform duration-200 shadow-md hover:shadow-lg`}
            >
              <span className="text-3xl block mb-2">{emoji}</span>
              <span className="text-sm font-semibold">{name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start shopping?</h2>
          <p className="text-indigo-200 mb-8 max-w-xl mx-auto">
            Join thousands of happy customers and discover amazing products today.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition-all duration-200 shadow-lg hover:-translate-y-0.5"
          >
            Create Free Account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
