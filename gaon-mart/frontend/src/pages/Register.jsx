import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="font-display font-700 text-2xl mb-1 text-center">Create your account</h1>
      <p className="text-earth-800/50 text-sm text-center mb-6">Join GaonMart in seconds</p>

      <form onSubmit={handleSubmit} className="space-y-3 card p-5">
        <input
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full bg-earth-100 rounded-lg px-3 py-2 text-sm focus-ring"
          required
        />
        <input
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full bg-earth-100 rounded-lg px-3 py-2 text-sm focus-ring"
          required
        />
        <input
          placeholder="Email (optional)"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full bg-earth-100 rounded-lg px-3 py-2 text-sm focus-ring"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full bg-earth-100 rounded-lg px-3 py-2 text-sm focus-ring"
          required
        />
        {error && <div className="text-litchi-600 text-sm">{error}</div>}
        <button disabled={loading} className="btn-primary w-full py-2.5">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-center text-sm text-earth-800/60 mt-4">
        Already have an account? <Link to="/login" className="text-leaf-600 font-semibold">Log in</Link>
      </p>
    </div>
  );
}
