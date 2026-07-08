# 🥭 GaonMart — Apni Village, Apna Mart

A full-fledged **Blinkit-style quick-commerce web app** built for villages around
**Muzaffarpur, Bihar** — starting with **Manika, Bishanpur, Chand, Musahari** and
extending to nearby villages (Kanti, Sakra, Paroo, Minapur, Motipur, Bochaha).

Customers pick their village, browse groceries by category, add to cart, and check
out with cash-on-delivery or mock UPI. Each village is treated as its own
"dark store" with independent stock, exactly like Blinkit's hyperlocal model —
including a signature touch: **Shahi Litchi**, Muzaffarpur's GI-tagged specialty
fruit, is only shown in stock in the litchi-belt villages.

---

## 🧱 Tech stack

| Layer     | Tech |
|-----------|------|
| Frontend  | React 18 + Vite + React Router + Tailwind CSS |
| Backend   | Node.js + Express |
| Database  | Simple JSON file storage (zero setup, no native modules, no external DB required) |
| Auth      | JWT (jsonwebtoken) + bcrypt password hashing |

No paid services, no Docker, no external database required — just Node.js and npm.

---

## 📁 Project structure

```
gaon-mart/
├── backend/                # Express REST API
│   ├── data/                # JSON "database" (villages, categories, products, users, orders)
│   ├── middleware/auth.js   # JWT auth + admin guard
│   ├── routes/               # auth, villages, categories, products, cart, orders
│   ├── seed.js               # Seeds villages/categories/products/admin user
│   └── server.js
└── frontend/                # React (Vite) storefront
    └── src/
        ├── api/client.js     # fetch wrapper
        ├── context/          # Auth, Village, Cart contexts
        ├── components/       # Header, VillagePickerModal, ProductCard, Footer...
        └── pages/            # Home, Search, ProductDetail, Cart, Checkout, Orders, Admin...
```

---

## 🚀 Getting started

### 1. Backend (API)

```bash
cd backend
npm install
cp .env.example .env
npm start
```

The API runs at **http://localhost:5000**. On first run it auto-seeds:
- 10 villages/stores around Muzaffarpur (Manika, Bishanpur, Chand, Musahari, Kanti, Sakra, Paroo, Minapur, Motipur, Bochaha)
- 10 categories, 56 products
- An admin account: `admin@gaonmart.in` / `Admin@123` (change these in `.env`)

To re-seed from scratch: `npm run seed` (only fills in missing data, won't duplicate).

### 2. Frontend (storefront)

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. The dev server proxies `/api` calls to the backend
on port 5000 (see `vite.config.js`), so both servers must be running.

### 3. Try it out

1. Pick a village (e.g. **Manika**) in the popup.
2. Browse categories — try **Litchi & Seasonal Fruits** for the Muzaffarpur specialty.
3. Register an account, add items to cart, and place an order (Cash on Delivery or mock UPI).
4. Log in as admin (`admin@gaonmart.in` / `Admin@123`) and visit **/admin** to manage
   orders (update status: placed → packed → out for delivery → delivered) and add new products.

---

## 🌾 Villages covered

Manika · Bishanpur · Chand · Musahari · Kanti · Sakra · Paroo · Minapur · Motipur · Bochaha
(all part of Muzaffarpur district, Bihar). Add more villages by editing the `villages`
array in `backend/seed.js` and re-running `npm run seed`.

---

## 🔌 API overview

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Log in, get JWT |
| GET  | `/api/villages` | List villages/stores |
| GET  | `/api/categories` | List categories |
| GET  | `/api/products?village=&category=&search=` | List products (with per-village stock) |
| GET/POST/PUT/DELETE | `/api/cart` | Manage logged-in user's cart |
| POST | `/api/orders` | Checkout |
| GET  | `/api/orders` | Order history |
| GET  | `/api/orders/admin/all` | (admin) All orders |
| PUT  | `/api/orders/admin/:id/status` | (admin) Update order status |
| POST/PUT/DELETE | `/api/products` | (admin) Manage catalog |

---

## 🏗️ Deploying

- **Backend**: deploy to any Node host (Render, Railway, a VPS). Because data is
  stored as JSON files on disk, use a host with a persistent disk/volume (or swap
  `db.js` for a real database like MongoDB/Postgres for production scale).
- **Frontend**: `npm run build` in `frontend/` produces a static `dist/` folder —
  deploy to Vercel, Netlify, or any static host. Update the API base URL /
  proxy target to your deployed backend URL.

---

## 📌 Notes for production use

This is a complete, working full-stack starting point. Before going live, consider:
- Swapping the JSON file store for a real database (Postgres/MongoDB) for concurrency.
- Adding payment gateway integration (Razorpay/UPI) instead of the mock payment option.
- Adding image uploads for products (currently uses emoji placeholders).
- Adding SMS/OTP login, delivery-partner tracking, and push notifications.
