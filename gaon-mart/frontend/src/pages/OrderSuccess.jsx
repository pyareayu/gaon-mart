import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`, { auth: true }).then((data) => setOrder(data.order));
  }, [id]);

  if (!order) return <div className="max-w-xl mx-auto px-4 py-16 text-center text-earth-800/50">Loading…</div>;

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">✅</div>
      <h1 className="font-display font-700 text-2xl mb-2">Order placed!</h1>
      <p className="text-earth-800/60 mb-6">
        Your GaonMart order to <strong>{order.villageName}</strong> is being packed and will arrive soon.
      </p>
      <div className="card p-4 text-left text-sm mb-6">
        <div className="flex justify-between mb-1">
          <span>Order ID</span>
          <span className="font-mono">{order.id}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Total</span>
          <span className="font-semibold">₹{order.total}</span>
        </div>
        <div className="flex justify-between">
          <span>Payment</span>
          <span>{order.paymentMethod}</span>
        </div>
      </div>
      <div className="flex gap-3 justify-center">
        <Link to="/orders" className="btn-secondary">
          Track order
        </Link>
        <Link to="/" className="btn-outline">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
