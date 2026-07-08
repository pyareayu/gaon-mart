require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const { seed } = require("./seed");

const authRoutes = require("./routes/auth");
const villageRoutes = require("./routes/villages");
const categoryRoutes = require("./routes/categories");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");

const app = express();
const PORT = process.env.PORT || 5000;

// Auto-seed on first run so the project works with zero manual setup
const productsFile = path.join(__dirname, "data", "products.json");
if (!fs.existsSync(productsFile)) {
  console.log("No data found, seeding GaonMart with villages, categories & products...");
  seed();
}

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "GaonMart API", time: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/villages", villageRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  console.log(`🥭 GaonMart API running on http://localhost:${PORT}`);
});
