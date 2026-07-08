import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useVillage } from "../context/VillageContext";
import { api } from "../api/client";

export default function Checkout() {
  const { cart, refresh } = useCart();
  const { village } = useVillage();
  const navigate = useNavigate();

  const [form, setForm] = useState({ label: "Home", line1: "", landmark: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  const deliveryFee = cart.subtotal >= 199 ? 0 : 19;
  const total = cart.subtotal + deliveryFee;

  async function handlePlaceOrder(e) {
    e.preventDefault();
    if (!form.line1.trim()) {
      setError("Please enter your address / house details.");
      return;
    }
    setPlacing(true);
    setError("");
    try {
      const data = await api.post(
        "/orders",
        {
          address: { ...form, village: village?.name },
          paymentMethod,
        },
        { auth: true }
      );
      refresh();
      navigate(`/order-success/${data.order.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display font-700 text-xl mb-6">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="space-y-6">
        <div className="card p-4">
          <h2 className="font-semibold mb-3">Delivery address — {village?.name}</h2>
          <div className="space-y-3">
            <input
              placeholder="House no., street, tola"
              value={form.line1}
              onChange={(e) => setForm({ ...form, line1: e.target.value })}
              className="w-full bg-earth-100 rounded-lg px-3 py-2 text-sm focus-ring"
              required
            />
            <input
              placeholder="Landmark (optional)"
              value={form.landmark}
              onChange={(e) => setForm({ ...form, landmark: e.target.value })}
              className="w-full bg-earth-100 rounded-lg px-3 py-2 text-sm focus-ring"
            />
            <input
              placeholder="Contact phone number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-earth-100 rounded-lg px-3 py-2 text-sm focus-ring"
            />
          </div>
        </div>

        <div className="card p-4">
          <h2 className="font-semibold mb-3">Payment method</h2>
          <div className="space-y-2">
            {[
              { id: "COD", label: "Cash on Delivery" },
              { id: "UPI", label: "UPI (mock payment)" },
            ].map((opt) => (
              <label
                key={opt.id}
                className={`flex items-center gap-3 border-2 rounded-lg p-3 cursor-pointer ${
                  paymentMethod === opt.id ? "border-leaf-500 bg-leaf-50" : "border-earth-100"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === opt.id}
                  onChange={() => setPaymentMethod(opt.id)}
                />
                <span className="text-sm font-medium">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="card p-4 text-sm space-y-1">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{cart.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery fee</span>
            <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t border-earth-100">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

        {error && <div className="text-litchi-600 text-sm font-medium">{error}</div>}

        <button type="submit" disabled={placing} className="btn-primary w-full py-3 text-base">
          {placing ? "Placing order…" : `Place order — ₹${total}`}
        </button>
      </form>
    </div>
  );
}
