import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useVillage } from "../context/VillageContext";
import { categoryEmoji } from "../components/ProductCard";

export default function Cart() {
  const { cart, updateQty, removeItem } = useCart();
  const { village } = useVillage();
  const navigate = useNavigate();

  const deliveryFee = cart.subtotal >= 199 || cart.subtotal === 0 ? 0 : 19;
  const total = cart.subtotal + deliveryFee;

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="font-display font-700 text-xl mb-2">Your cart is empty</h1>
        <p className="text-earth-800/50 mb-6">Add some fresh litchi or daily essentials to get started.</p>
        <Link to="/" className="btn-primary">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display font-700 text-xl mb-1">Your cart</h1>
      <p className="text-sm text-earth-800/50 mb-6">Delivering to {village?.name}</p>

      <div className="card divide-y divide-earth-100">
        {cart.items.map((i) => (
          <div key={i.productId} className="flex items-center gap-4 p-4">
            <div className="w-14 h-14 bg-earth-100 rounded-lg flex items-center justify-center text-2xl shrink-0">
              {i.product ? categoryEmoji(i.product.category) : "🛍️"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{i.product?.name || "Unavailable item"}</div>
              <div className="text-xs text-earth-800/50">{i.product?.unit}</div>
              <div className="text-sm font-semibold mt-1">₹{i.product?.price}</div>
            </div>
            <div className="flex items-center gap-3 btn-secondary py-1 px-2">
              <button onClick={() => updateQty(i.productId, i.qty - 1)} className="font-bold px-1 focus-ring">
                −
              </button>
              <span className="font-semibold">{i.qty}</span>
              <button onClick={() => updateQty(i.productId, i.qty + 1)} className="font-bold px-1 focus-ring">
                +
              </button>
            </div>
            <button
              onClick={() => removeItem(i.productId)}
              className="text-litchi-500 text-sm font-medium hover:underline shrink-0"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="card p-4 mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{cart.subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery fee</span>
          <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
        </div>
        {deliveryFee > 0 && (
          <div className="text-xs text-leaf-600">Add ₹{199 - cart.subtotal} more for free delivery</div>
        )}
        <div className="flex justify-between font-bold text-base pt-2 border-t border-earth-100">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      <button onClick={() => navigate("/checkout")} className="btn-primary w-full mt-4 py-3 text-base">
        Proceed to checkout
      </button>
    </div>
  );
}
