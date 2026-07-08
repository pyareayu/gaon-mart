import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function ProductCard({ product }) {
  const { cart, addItem, updateQty } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const inCart = cart.items.find((i) => i.productId === product.id);
  const qty = inCart?.qty || 0;
  const discountPct = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  async function handleAdd(e) {
    e.stopPropagation();
    if (!user) return navigate("/login");
    if (qty === 0) await addItem(product.id, 1);
    else await updateQty(product.id, qty + 1);
  }

  async function handleRemove(e) {
    e.stopPropagation();
    await updateQty(product.id, qty - 1);
  }

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="card p-3 flex flex-col cursor-pointer hover:shadow-lg transition-shadow relative"
    >
      {discountPct > 0 && (
        <span className="absolute top-2 left-2 bg-mustard-500 text-earth-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
          {discountPct}% OFF
        </span>
      )}
      <div className="h-24 bg-earth-100 rounded-lg flex items-center justify-center text-3xl mb-2">
        {categoryEmoji(product.category)}
      </div>
      <div className="text-xs text-earth-800/50">{product.unit}</div>
      <div className="text-sm font-semibold leading-snug line-clamp-2 min-h-[2.5rem]">{product.name}</div>
      <div className="flex items-center gap-2 mt-1">
        <span className="font-bold text-earth-900">₹{product.price}</span>
        {product.mrp > product.price && (
          <span className="text-xs text-earth-800/40 line-through">₹{product.mrp}</span>
        )}
      </div>

      {product.stock === 0 ? (
        <div className="mt-2 text-xs font-semibold text-litchi-600">Out of stock</div>
      ) : qty === 0 ? (
        <button onClick={handleAdd} className="mt-2 btn-outline text-sm py-1.5">
          Add
        </button>
      ) : (
        <div className="mt-2 flex items-center justify-between btn-secondary py-1.5 px-2">
          <button onClick={handleRemove} className="px-2 font-bold focus-ring">
            −
          </button>
          <span className="font-semibold">{qty}</span>
          <button onClick={handleAdd} className="px-2 font-bold focus-ring">
            +
          </button>
        </div>
      )}
    </div>
  );
}

export function categoryEmoji(catId) {
  const map = {
    cat_litchi: "🍈",
    cat_fruitveg: "🥬",
    cat_dairy: "🥛",
    cat_atta: "🌾",
    cat_masala: "🧂",
    cat_snacks: "🍪",
    cat_beverages: "🥤",
    cat_personal: "🧴",
    cat_home: "🧹",
    cat_baby: "🍼",
  };
  return map[catId] || "🛒";
}
