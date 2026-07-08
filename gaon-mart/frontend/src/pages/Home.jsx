import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useVillage } from "../context/VillageContext";
import ProductCard, { categoryEmoji } from "../components/ProductCard";

export default function Home() {
  const { village } = useVillage();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/categories").then((data) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    if (!village) return;
    setLoading(true);
    const params = new URLSearchParams({ village: village.id });
    if (activeCategory) params.set("category", activeCategory);
    api
      .get(`/products?${params.toString()}`)
      .then((data) => setProducts(data.products))
      .finally(() => setLoading(false));
  }, [village, activeCategory]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Hero */}
      <section className="bg-gradient-to-r from-leaf-600 to-leaf-500 rounded-xl2 p-6 sm:p-10 text-white mb-8 relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <h1 className="font-display font-800 text-2xl sm:text-3xl leading-tight mb-2">
            Groceries delivered to your gaon in minutes
          </h1>
          <p className="text-leaf-50/90 text-sm sm:text-base">
            From Manika to Musahari — fresh Shahi litchi, daily essentials & more, straight from your
            nearest village godown.
          </p>
        </div>
        <span className="absolute -right-4 -bottom-6 text-[8rem] opacity-20 select-none">🍈</span>
      </section>

      {/* Categories */}
      <section className="mb-8">
        <h2 className="font-display font-700 text-lg mb-3">Shop by category</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-xl border-2 focus-ring ${
              activeCategory === null ? "border-leaf-500 bg-leaf-50" : "border-earth-100 bg-white"
            }`}
          >
            <span className="text-2xl">🛍️</span>
            <span className="text-xs font-medium">All</span>
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-xl border-2 focus-ring w-24 ${
                activeCategory === c.id ? "border-leaf-500 bg-leaf-50" : "border-earth-100 bg-white"
              }`}
            >
              <span className="text-2xl">{categoryEmoji(c.id)}</span>
              <span className="text-xs font-medium text-center leading-tight">{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Products */}
      <section>
        <h2 className="font-display font-700 text-lg mb-3">
          {activeCategory ? categories.find((c) => c.id === activeCategory)?.name : "Popular near you"}
        </h2>
        {loading ? (
          <div className="text-earth-800/50 text-sm py-10 text-center">Loading products…</div>
        ) : products.length === 0 ? (
          <div className="text-earth-800/50 text-sm py-10 text-center">No products found here.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
