const express = require("express");
const { readTable, writeTable } = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function getCarts() {
  return readTable("carts");
}

function saveCarts(carts) {
  writeTable("carts", carts);
}

function enrichCart(cart) {
  const products = readTable("products");
  const items = (cart?.items || []).map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      productId: item.productId,
      qty: item.qty,
      product,
      lineTotal: product ? product.price * item.qty : 0,
    };
  });
  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  return { villageId: cart?.villageId || null, items, subtotal };
}

router.get("/", requireAuth, (req, res) => {
  const carts = getCarts();
  const cart = carts.find((c) => c.userId === req.user.id);
  res.json({ cart: enrichCart(cart) });
});

router.post("/", requireAuth, (req, res) => {
  const { productId, qty = 1, villageId } = req.body;
  if (!productId) return res.status(400).json({ message: "productId is required." });

  const carts = getCarts();
  let cart = carts.find((c) => c.userId === req.user.id);
  if (!cart) {
    cart = { userId: req.user.id, villageId: villageId || null, items: [] };
    carts.push(cart);
  }
  // switching village clears the cart (different dark-store, like Blinkit)
  if (villageId && cart.villageId && cart.villageId !== villageId && cart.items.length) {
    cart.items = [];
  }
  if (villageId) cart.villageId = villageId;

  const existing = cart.items.find((i) => i.productId === productId);
  if (existing) {
    existing.qty += qty;
    if (existing.qty <= 0) cart.items = cart.items.filter((i) => i.productId !== productId);
  } else if (qty > 0) {
    cart.items.push({ productId, qty });
  }

  saveCarts(carts);
  res.json({ cart: enrichCart(cart) });
});

router.put("/:productId", requireAuth, (req, res) => {
  const { qty } = req.body;
  const carts = getCarts();
  const cart = carts.find((c) => c.userId === req.user.id);
  if (!cart) return res.status(404).json({ message: "Cart is empty." });
  const item = cart.items.find((i) => i.productId === req.params.productId);
  if (!item) return res.status(404).json({ message: "Item not in cart." });
  if (qty <= 0) {
    cart.items = cart.items.filter((i) => i.productId !== req.params.productId);
  } else {
    item.qty = qty;
  }
  saveCarts(carts);
  res.json({ cart: enrichCart(cart) });
});

router.delete("/:productId", requireAuth, (req, res) => {
  const carts = getCarts();
  const cart = carts.find((c) => c.userId === req.user.id);
  if (!cart) return res.status(404).json({ message: "Cart is empty." });
  cart.items = cart.items.filter((i) => i.productId !== req.params.productId);
  saveCarts(carts);
  res.json({ cart: enrichCart(cart) });
});

router.delete("/", requireAuth, (req, res) => {
  const carts = getCarts();
  const cart = carts.find((c) => c.userId === req.user.id);
  if (cart) {
    cart.items = [];
    saveCarts(carts);
  }
  res.json({ cart: enrichCart(cart) });
});

module.exports = router;
