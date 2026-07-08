const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function filePath(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

function readTable(name) {
  const fp = filePath(name);
  if (!fs.existsSync(fp)) return [];
  const raw = fs.readFileSync(fp, "utf-8").trim();
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to parse ${name}.json`, e);
    return [];
  }
}

function writeTable(name, data) {
  const fp = filePath(name);
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), "utf-8");
}

// naive but dependency-free unique id generator
function genId(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

module.exports = { readTable, writeTable, genId, DATA_DIR };
