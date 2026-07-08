import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../api/client";
import { useAuth } from "./AuthContext";
import { useVillage } from "./VillageContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const { village } = useVillage();
  const [cart, setCart] = useState({ items: [], subtotal: 0, villageId: null });
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(() => {
    if (!user) return;
    setLoading(true);
    api
      .get("/cart", { auth: true })
      .then((data) => setCart(data.cart))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (user) refresh();
    else setCart({ items: [], subtotal: 0, villageId: null });
  }, [user, refresh]);

  async function addItem(productId, qty = 1) {
    if (!user) throw new Error("LOGIN_REQUIRED");
    const data = await api.post("/cart", { productId, qty, villageId: village?.id }, { auth: true });
    setCart(data.cart);
  }

  async function updateQty(productId, qty) {
    const data = await api.put(`/cart/${productId}`, { qty }, { auth: true });
    setCart(data.cart);
  }

  async function removeItem(productId) {
    const data = await api.del(`/cart/${productId}`, { auth: true });
    setCart(data.cart);
  }

  async function clearCart() {
    const data = await api.del("/cart", { auth: true });
    setCart(data.cart);
  }

  const itemCount = cart.items.reduce((n, i) => n + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ cart, loading, addItem, updateQty, removeItem, clearCart, itemCount, refresh }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
