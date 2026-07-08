import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { useVillage } from "../context/VillageContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { categoryEmoji } from "../components/ProductCard";

export default function ProductDetail() {
  const { id } = useParams();
  const { village } = useVillage();
  const { cart, addItem, updateQty } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!village) return;
    api.get(`/products/${id}?village=${village.id}`).then((data) => setProduct(data.product));
  }, [id, village]);

  if (!product) return <div className="max-w-4xl mx-auto px-4 py-10 text-center text-earth-800/50">Loading…</div>;

  const inCart = cart.items.find((i) => i.productId === product.id);
  const qty = inCart?.qty || 0;

  async function handleAdd() {
    if (!user) return navigate("/login");
    if (qty === 0) await addItem(product.id, 1);
    else await updateQty(product.id, qty + 1);
  }
  async function handleRemove() {
    await updateQty(product.id, qty - 1);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid sm:grid-cols-2 gap-8">
      <div className="h-64 sm:h-80 bg-earth-100 rounded-xl2 flex items-center justify-center text-8xl">
        {categoryEmoji(product.category)}
      </div>
      <div>
        <h1 className="font-display font-700 text-2xl mb-1">{product.name}</h1>
        <p className="text-earth-800/50 text-sm mb-4">{product.unit}</p>
        {product.note && <p className="text-sm text-leaf-600 mb-4">{product.note}</p>}

        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl font-bold">₹{product.price}</span>
          {product.mrp > product.price && (
            <span className="text-earth-800/40 line-through">₹{product.mrp}</span>
          )}
        </div>

        {product.stock === 0 ? (
          <div className="text-litchi-600 font-semibold mb-4">Currently out of stock in {village?.name}</div>
        ) : (
          <div className="text-leaf-600 text-sm mb-4">In stock ({product.stock} left) in {village?.name}</div>
        )}

        {product.stock === 0 ? (
          <button disabled className="btn-outline opacity-50 cursor-not-allowed">
            Out of stock
          </button>
        ) : qty === 0 ? (
          <button onClick={handleAdd} className="btn-primary">
            Add to cart
          </button>
        ) : (
          <div className="flex items-center gap-4 btn-secondary w-fit px-4">
            <button onClick={handleRemove} className="text-xl font-bold focus-ring">
              −
            </button>
            <span className="font-semibold text-lg">{qty}</span>
            <button onClick={handleAdd} className="text-xl font-bold focus-ring">
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
