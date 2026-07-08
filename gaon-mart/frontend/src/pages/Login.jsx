import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ phone, password });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="font-display font-700 text-2xl mb-1 text-center">Welcome back</h1>
      <p className="text-earth-800/50 text-sm text-center mb-6">Log in to GaonMart</p>

      <form onSubmit={handleSubmit} className="space-y-3 card p-5">
        <input
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-earth-100 rounded-lg px-3 py-2 text-sm focus-ring"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-earth-100 rounded-lg px-3 py-2 text-sm focus-ring"
          required
        />
        {error && <div className="text-litchi-600 text-sm">{error}</div>}
        <button disabled={loading} className="btn-primary w-full py-2.5">
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="text-center text-sm text-earth-800/60 mt-4">
        New to GaonMart? <Link to="/register" className="text-leaf-600 font-semibold">Create an account</Link>
      </p>
      <p className="text-center text-xs text-earth-800/40 mt-6">
        Admin demo login: admin@gaonmart.in — check backend/.env for password
      </p>
    </div>
  );
}
