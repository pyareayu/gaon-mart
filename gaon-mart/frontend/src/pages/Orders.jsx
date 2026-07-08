import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

const STATUS_LABEL = {
  placed: "Order placed",
  packed: "Packed",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

export default function Orders() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    api.get("/orders", { auth: true }).then((data) => setOrders(data.orders));
  }, []);

  if (!orders) return <div className="max-w-3xl mx-auto px-4 py-10 text-center text-earth-800/50">Loading…</div>;

  if (orders.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display font-700 text-xl mb-2">No orders yet</h1>
        <Link to="/" className="btn-primary">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display font-700 text-xl mb-6">My orders</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <Link to={`/order-success/${o.id}`} key={o.id} className="card p-4 flex items-center justify-between block">
            <div>
              <div className="font-semibold">{o.villageName} · ₹{o.total}</div>
              <div className="text-xs text-earth-800/50">{new Date(o.createdAt).toLocaleString()}</div>
              <div className="text-xs text-earth-800/50">{o.items.length} item(s)</div>
            </div>
            <span className="text-xs font-semibold bg-leaf-50 text-leaf-700 px-3 py-1 rounded-full">
              {STATUS_LABEL[o.status] || o.status}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
