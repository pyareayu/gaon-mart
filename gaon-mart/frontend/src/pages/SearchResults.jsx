import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import { useVillage } from "../context/VillageContext";
import ProductCard from "../components/ProductCard";

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const { village } = useVillage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!village) return;
    setLoading(true);
    api
      .get(`/products?village=${village.id}&search=${encodeURIComponent(q)}`)
      .then((data) => setProducts(data.products))
      .finally(() => setLoading(false));
  }, [q, village]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="font-display font-700 text-lg mb-4">
        Results for "<span className="text-litchi-600">{q}</span>"
      </h1>
      {loading ? (
        <div className="text-earth-800/50 text-sm py-10 text-center">Searching…</div>
      ) : products.length === 0 ? (
        <div className="text-earth-800/50 text-sm py-10 text-center">
          No products matched your search in {village?.name}.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
