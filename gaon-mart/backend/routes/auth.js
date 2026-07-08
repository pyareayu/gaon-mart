const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { readTable, writeTable, genId } = require("../db");
const { requireAuth, JWT_SECRET } = require("../middleware/auth");

const router = express.Router();

function publicUser(u) {
  const { passwordHash, ...rest } = u;
  return rest;
}

router.post("/register", (req, res) => {
  const { name, phone, email, password } = req.body;
  if (!name || !phone || !password) {
    return res.status(400).json({ message: "Name, phone and password are required." });
  }
  const users = readTable("users");
  if (users.find((u) => u.phone === phone)) {
    return res.status(409).json({ message: "An account with this phone number already exists." });
  }
  const user = {
    id: genId("usr"),
    name,
    phone,
    email: email || "",
    passwordHash: bcrypt.hashSync(password, 10),
    role: "customer",
    addresses: [],
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeTable("users", users);

  const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: "7d" });
  res.status(201).json({ token, user: publicUser(user) });
});

router.post("/login", (req, res) => {
  const { phone, email, password } = req.body;
  const users = readTable("users");
  const user = users.find((u) => (phone && u.phone === phone) || (email && u.email === email));
  if (!user || !bcrypt.compareSync(password || "", user.passwordHash)) {
    return res.status(401).json({ message: "Invalid credentials. Please check your phone/email and password." });
  }
  const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: publicUser(user) });
});

router.get("/me", requireAuth, (req, res) => {
  const users = readTable("users");
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: "User not found." });
  res.json({ user: publicUser(user) });
});

router.post("/address", requireAuth, (req, res) => {
  const { label, line1, village, landmark, phone } = req.body;
  if (!line1 || !village) return res.status(400).json({ message: "Address line and village are required." });
  const users = readTable("users");
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: "User not found." });
  const address = { id: genId("addr"), label: label || "Home", line1, village, landmark: landmark || "", phone: phone || user.phone };
  user.addresses = user.addresses || [];
  user.addresses.push(address);
  writeTable("users", users);
  res.status(201).json({ addresses: user.addresses });
});

module.exports = router;
