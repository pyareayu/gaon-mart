const express = require("express");
const { readTable, writeTable, genId } = require("../db");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

function withStoreStock(product, villageId) {
  const stock = villageId ? product.storeStock?.[villageId] ?? 0 : undefined;
  return {
    ...product,
    stock,
    inStock: villageId ? stock > 0 : undefined,
  };
}

// GET /api/products?village=vlg_manika&category=cat_fruitveg&search=milk
router.get("/", (req, res) => {
  const { village, category, search } = req.query;
  let products = readTable("products");

  if (category) products = products.filter((p) => p.category === category);
  if (search) {
    const q = search.toLowerCase();
    products = products.filter((p) => p.name.toLowerCase().includes(q));
  }

  const mapped = products.map((p) => withStoreStock(p, village));
  res.json({ products: mapped, count: mapped.length });
});

router.get("/:id", (req, res) => {
  const { village } = req.query;
  const product = readTable("products").find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found." });
  res.json({ product: withStoreStock(product, village) });
});

// ---- Admin CRUD ----
router.post("/", requireAuth, requireAdmin, (req, res) => {
  const { name, category, price, mrp, unit, note, storeStock } = req.body;
  if (!name || !category || !price || !unit) {
    return res.status(400).json({ message: "name, category, price and unit are required." });
  }
  const products = readTable("products");
  const product = {
    id: genId("prod"),
    name,
    category,
    price,
    mrp: mrp || price,
    unit,
    note: note || "",
    image: "",
    storeStock: storeStock || {},
  };
  products.push(product);
  writeTable("products", products);
  res.status(201).json({ product });
});

router.put("/:id", requireAuth, requireAdmin, (req, res) => {
  const products = readTable("products");
  const idx = products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Product not found." });
  products[idx] = { ...products[idx], ...req.body, id: products[idx].id };
  writeTable("products", products);
  res.json({ product: products[idx] });
});

router.delete("/:id", requireAuth, requireAdmin, (req, res) => {
  let products = readTable("products");
  const exists = products.some((p) => p.id === req.params.id);
  if (!exists) return res.status(404).json({ message: "Product not found." });
  products = products.filter((p) => p.id !== req.params.id);
  writeTable("products", products);
  res.json({ message: "Product deleted." });
});

module.exports = router;
