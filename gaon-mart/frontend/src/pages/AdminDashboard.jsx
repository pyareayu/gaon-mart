import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useVillage } from "../context/VillageContext";

const STATUS_FLOW = ["placed", "packed", "out_for_delivery", "delivered"];

export default function AdminDashboard() {
  const [tab, setTab] = useState("orders");
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display font-700 text-xl mb-6">Admin dashboard</h1>
      <div className="flex gap-2 mb-6">
        {["orders", "products"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              tab === t ? "bg-leaf-500 text-white" : "bg-earth-100"
            }`}
          >
            {t === "orders" ? "Orders" : "Products"}
          </button>
        ))}
      </div>
      {tab === "orders" ? <AdminOrders /> : <AdminProducts />}
    </div>
  );
}

function AdminOrders() {
  const [orders, setOrders] = useState(null);

  function load() {
    api.get("/orders/admin/all", { auth: true }).then((data) => setOrders(data.orders));
  }
  useEffect(load, []);

  async function updateStatus(id, status) {
    await api.put(`/orders/admin/${id}/status`, { status }, { auth: true });
    load();
  }

  if (!orders) return <div className="text-earth-800/50 text-sm">Loading…</div>;
  if (orders.length === 0) return <div className="text-earth-800/50 text-sm">No orders yet.</div>;

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div key={o.id} className="card p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="font-semibold">{o.villageName} · ₹{o.total}</div>
              <div className="text-xs text-earth-800/50">{new Date(o.createdAt).toLocaleString()}</div>
              <div className="text-xs text-earth-800/50">{o.address?.line1}, {o.address?.village}</div>
            </div>
            <select
              value={o.status}
              onChange={(e) => updateStatus(o.id, e.target.value)}
              className="bg-earth-100 rounded-lg px-2 py-1 text-sm focus-ring"
            >
              {STATUS_FLOW.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
          <ul className="text-xs text-earth-800/60 list-disc pl-5">
            {o.items.map((i) => (
              <li key={i.productId}>
                {i.name} × {i.qty}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function AdminProducts() {
  const { villages } = useVillage();
  const [products, setProducts] = useState(null);
  const [form, setForm] = useState({ name: "", category: "cat_fruitveg", price: "", mrp: "", unit: "", note: "" });
  const [error, setError] = useState("");

  function load() {
    api.get("/products").then((data) => setProducts(data.products));
  }
  useEffect(load, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    try {
      const storeStock = {};
      villages.forEach((v) => (storeStock[v.id] = 30));
      await api.post(
        "/products",
        { ...form, price: Number(form.price), mrp: Number(form.mrp) || Number(form.price), storeStock },
        { auth: true }
      );
      setForm({ name: "", category: "cat_fruitveg", price: "", mrp: "", unit: "", note: "" });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    await api.del(`/products/${id}`, { auth: true });
    load();
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="card p-4 mb-6 grid sm:grid-cols-2 gap-3">
        <h2 className="sm:col-span-2 font-semibold">Add a new product</h2>
        <input
          placeholder="Product name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="bg-earth-100 rounded-lg px-3 py-2 text-sm focus-ring"
          required
        />
        <input
          placeholder="Unit (e.g. 1 kg)"
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
          className="bg-earth-100 rounded-lg px-3 py-2 text-sm focus-ring"
          required
        />
        <input
          type="number"
          placeholder="Price (₹)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="bg-earth-100 rounded-lg px-3 py-2 text-sm focus-ring"
          required
        />
        <input
          type="number"
          placeholder="MRP (₹, optional)"
          value={form.mrp}
          onChange={(e) => setForm({ ...form, mrp: e.target.value })}
          className="bg-earth-100 rounded-lg px-3 py-2 text-sm focus-ring"
        />
        <input
          placeholder="Note (optional)"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className="bg-earth-100 rounded-lg px-3 py-2 text-sm focus-ring sm:col-span-2"
        />
        {error && <div className="text-litchi-600 text-sm sm:col-span-2">{error}</div>}
        <button className="btn-primary sm:col-span-2">Add product</button>
      </form>

      {!products ? (
        <div className="text-earth-800/50 text-sm">Loading…</div>
      ) : (
        <div className="card divide-y divide-earth-100">
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-3">
              <div>
                <div className="font-medium text-sm">{p.name}</div>
                <div className="text-xs text-earth-800/50">
                  ₹{p.price} / {p.unit}
                </div>
              </div>
              <button onClick={() => handleDelete(p.id)} className="text-litchi-500 text-sm font-medium">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
