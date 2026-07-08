const express = require("express");
const { readTable } = require("../db");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ categories: readTable("categories") });
});

module.exports = router;
