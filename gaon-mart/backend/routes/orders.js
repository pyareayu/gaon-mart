const express = require("express");
const { readTable, writeTable, genId } = require("../db");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

const STATUS_FLOW = ["placed", "packed", "out_for_delivery", "delivered"];

router.post("/", requireAuth, (req, res) => {
  const { address, paymentMethod } = req.body;
  if (!address || !address.line1 || !address.village) {
    return res.status(400).json({ message: "Delivery address with village is required." });
  }

  const carts = readTable("carts");
  const cart = carts.find((c) => c.userId === req.user.id);
  if (!cart || !cart.items.length) {
    return res.status(400).json({ message: "Your cart is empty." });
  }

  const products = readTable("products");
  const villages = readTable("villages");
  const village = villages.find((v) => v.id === cart.villageId);

  const items = cart.items.map((i) => {
    const product = products.find((p) => p.id === i.productId);
    return {
      productId: i.productId,
      name: product?.name || "Unknown item",
      unit: product?.unit || "",
      qty: i.qty,
      price: product?.price || 0,
      lineTotal: (product?.price || 0) * i.qty,
    };
  });
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const deliveryFee = subtotal >= 199 ? 0 : 19;
  const total = subtotal + deliveryFee;

  const orders = readTable("orders");
  const order = {
    id: genId("ord"),
    userId: req.user.id,
    villageId: cart.villageId,
    villageName: village?.name || "Unknown",
    items,
    subtotal,
    deliveryFee,
    total,
    address,
    paymentMethod: paymentMethod || "COD",
    status: "placed",
    statusHistory: [{ status: "placed", at: new Date().toISOString() }],
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  writeTable("orders", orders);

  // clear cart after order
  cart.items = [];
  writeTable("carts", carts);

  res.status(201).json({ order });
});

router.get("/", requireAuth, (req, res) => {
  const orders = readTable("orders").filter((o) => o.userId === req.user.id);
  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ orders });
});

router.get("/:id", requireAuth, (req, res) => {
  const order = readTable("orders").find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found." });
  if (order.userId !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorised to view this order." });
  }
  res.json({ order });
});

// ---- Admin ----
router.get("/admin/all", requireAuth, requireAdmin, (req, res) => {
  const orders = readTable("orders");
  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ orders });
});

router.put("/admin/:id/status", requireAuth, requireAdmin, (req, res) => {
  const { status } = req.body;
  if (!STATUS_FLOW.includes(status)) {
    return res.status(400).json({ message: `Status must be one of: ${STATUS_FLOW.join(", ")}` });
  }
  const orders = readTable("orders");
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found." });
  order.status = status;
  order.statusHistory.push({ status, at: new Date().toISOString() });
  writeTable("orders", orders);
  res.json({ order });
});

module.exports = router;
