const express = require("express");
const { readTable } = require("../db");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ villages: readTable("villages") });
});

router.get("/:id", (req, res) => {
  const village = readTable("villages").find((v) => v.id === req.params.id);
  if (!village) return res.status(404).json({ message: "Village store not found." });
  res.json({ village });
});

module.exports = router;
