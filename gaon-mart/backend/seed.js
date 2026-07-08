require("dotenv").config();
const bcrypt = require("bcryptjs");
const { readTable, writeTable, genId } = require("./db");

// ---- Villages / dark-stores around Muzaffarpur district, Bihar ----
const villages = [
  { id: "vlg_manika", name: "Manika", block: "Muzaffarpur Sadar", distanceKm: 3, etaMins: 12, tagline: "Our very first godown" },
  { id: "vlg_bishanpur", name: "Bishanpur", block: "Muzaffarpur Sadar", distanceKm: 5, etaMins: 15, tagline: "Fresh litchi orchards nearby" },
  { id: "vlg_chand", name: "Chand", block: "Kanti", distanceKm: 8, etaMins: 20, tagline: "Serving Chand & tola villages" },
  { id: "vlg_musahari", name: "Musahari", block: "Musahari", distanceKm: 6, etaMins: 18, tagline: "Fast delivery, Musahari block" },
  { id: "vlg_kanti", name: "Kanti", block: "Kanti", distanceKm: 12, etaMins: 25, tagline: "Home of the thermal power station" },
  { id: "vlg_sakra", name: "Sakra", block: "Sakra", distanceKm: 16, etaMins: 30, tagline: "Sakra market & nearby tolas" },
  { id: "vlg_paroo", name: "Paroo", block: "Paroo", distanceKm: 18, etaMins: 32, tagline: "Paroo bazaar coverage" },
  { id: "vlg_minapur", name: "Minapur", block: "Minapur", distanceKm: 20, etaMins: 35, tagline: "Border of Sitamarhi coverage" },
  { id: "vlg_motipur", name: "Motipur", block: "Motipur", distanceKm: 22, etaMins: 38, tagline: "Sugar mill town coverage" },
  { id: "vlg_bochaha", name: "Bochaha", block: "Bochaha", distanceKm: 14, etaMins: 28, tagline: "Bochaha & surrounding villages" },
];

// ---- Categories ----
const categories = [
  { id: "cat_litchi", name: "Litchi & Seasonal Fruits", icon: "🍈", signature: true },
  { id: "cat_fruitveg", name: "Fruits & Vegetables", icon: "🥬" },
  { id: "cat_dairy", name: "Dairy & Bread", icon: "🥛" },
  { id: "cat_atta", name: "Atta, Rice & Dal", icon: "🌾" },
  { id: "cat_masala", name: "Masala, Oil & Ghee", icon: "🧂" },
  { id: "cat_snacks", name: "Snacks & Namkeen", icon: "🍪" },
  { id: "cat_beverages", name: "Beverages", icon: "🥤" },
  { id: "cat_personal", name: "Personal Care", icon: "🧴" },
  { id: "cat_home", name: "Home & Cleaning", icon: "🧹" },
  { id: "cat_baby", name: "Baby Care", icon: "🍼" },
];

// ---- Products: [name, category, price, mrp, unit, note] ----
const productSeed = [
  ["Shahi Litchi (Muzaffarpur Special)", "cat_litchi", 180, 220, "1 dozen", "GI-tagged Shahi litchi, seasonal"],
  ["China Litchi", "cat_litchi", 140, 170, "1 dozen", "Sweet & juicy"],
  ["Mango - Langra", "cat_litchi", 90, 110, "1 kg", ""],
  ["Guava - Desi", "cat_litchi", 40, 50, "1 kg", ""],
  ["Banana - Robusta", "cat_fruitveg", 45, 55, "1 dozen", ""],
  ["Potato", "cat_fruitveg", 22, 28, "1 kg", ""],
  ["Onion", "cat_fruitveg", 35, 42, "1 kg", ""],
  ["Tomato", "cat_fruitveg", 30, 38, "1 kg", ""],
  ["Green Chilli", "cat_fruitveg", 20, 25, "250 g", ""],
  ["Bhindi (Okra)", "cat_fruitveg", 32, 40, "500 g", ""],
  ["Cauliflower", "cat_fruitveg", 28, 35, "1 pc", ""],
  ["Spinach (Palak)", "cat_fruitveg", 18, 22, "1 bunch", ""],
  ["Amul Toned Milk", "cat_dairy", 28, 30, "500 ml", ""],
  ["Paneer", "cat_dairy", 90, 100, "200 g", ""],
  ["Curd (Dahi)", "cat_dairy", 35, 40, "400 g", ""],
  ["Butter", "cat_dairy", 52, 55, "100 g", ""],
  ["Brown Bread", "cat_dairy", 42, 45, "400 g", ""],
  ["Eggs - Farm Fresh", "cat_dairy", 65, 72, "12 pc", ""],
  ["Gaon Mart Atta (Wheat Flour)", "cat_atta", 210, 240, "5 kg", "Store brand"],
  ["Sona Masoori Rice", "cat_atta", 320, 360, "5 kg", ""],
  ["Toor Dal (Arhar)", "cat_atta", 145, 165, "1 kg", ""],
  ["Moong Dal", "cat_atta", 130, 150, "1 kg", ""],
  ["Chana Dal", "cat_atta", 95, 110, "1 kg", ""],
  ["Sattu (Roasted Gram Flour)", "cat_atta", 80, 95, "1 kg", "Bihar special"],
  ["Mustard Oil (Kachi Ghani)", "cat_masala", 165, 185, "1 L", "Bihar's favourite"],
  ["Refined Sunflower Oil", "cat_masala", 140, 155, "1 L", ""],
  ["Ghee - Desi Cow", "cat_masala", 560, 620, "1 L", ""],
  ["Turmeric Powder", "cat_masala", 38, 45, "200 g", ""],
  ["Red Chilli Powder", "cat_masala", 42, 48, "200 g", ""],
  ["Garam Masala", "cat_masala", 55, 62, "100 g", ""],
  ["Salt (Iodised)", "cat_masala", 22, 25, "1 kg", ""],
  ["Litti Chokha Masala Mix", "cat_masala", 45, 55, "200 g", "Local specialty"],
  ["Aloo Bhujia", "cat_snacks", 30, 35, "200 g", ""],
  ["Litti Papad", "cat_snacks", 25, 30, "100 g", "Local specialty"],
  ["Thekua (Traditional Sweet)", "cat_snacks", 90, 100, "250 g", "Bihar special"],
  ["Parle-G Biscuits", "cat_snacks", 10, 10, "100 g", ""],
  ["Banana Chips", "cat_snacks", 40, 45, "150 g", ""],
  ["Litchi Juice (Seasonal)", "cat_beverages", 60, 70, "1 L", "Made from local litchi"],
  ["Aam Panna", "cat_beverages", 45, 50, "500 ml", ""],
  ["Tea Leaves (CTC)", "cat_beverages", 120, 135, "250 g", ""],
  ["Instant Coffee", "cat_beverages", 145, 160, "50 g", ""],
  ["Mineral Water Bottle", "cat_beverages", 20, 20, "1 L", ""],
  ["Lassi (Sweet)", "cat_beverages", 30, 35, "200 ml", ""],
  ["Neem Toothpaste", "cat_personal", 55, 60, "100 g", ""],
  ["Herbal Shampoo Sachet", "cat_personal", 5, 5, "8 ml", ""],
  ["Coconut Hair Oil", "cat_personal", 85, 95, "200 ml", ""],
  ["Bathing Soap", "cat_personal", 32, 36, "100 g", ""],
  ["Sanitary Pads", "cat_personal", 65, 75, "pack of 8", ""],
  ["Dishwash Bar", "cat_home", 20, 24, "200 g", ""],
  ["Detergent Powder", "cat_home", 110, 125, "1 kg", ""],
  ["Phenyl (Floor Cleaner)", "cat_home", 60, 68, "1 L", ""],
  ["Mosquito Coil", "cat_home", 35, 40, "pack of 10", ""],
  ["Broom (Jhadu)", "cat_home", 70, 80, "1 pc", ""],
  ["Baby Diapers (M)", "cat_baby", 320, 360, "pack of 30", ""],
  ["Baby Powder", "cat_baby", 95, 105, "200 g", ""],
  ["Baby Cerelac", "cat_baby", 210, 230, "300 g", ""],
];

function randomStock() {
  return Math.floor(Math.random() * 60) + 10;
}

function buildProducts() {
  return productSeed.map(([name, category, price, mrp, unit, note], idx) => {
    // every store carries every product with independently randomised stock,
    // so each dark-store's availability differs slightly (like real Blinkit dark stores)
    const storeStock = {};
    villages.forEach((v) => {
      // seasonal litchi only shown in-stock in litchi-belt villages to keep it realistic
      if (category === "cat_litchi" && !["vlg_manika", "vlg_bishanpur", "vlg_chand", "vlg_musahari", "vlg_kanti"].includes(v.id)) {
        storeStock[v.id] = 0;
      } else {
        storeStock[v.id] = randomStock();
      }
    });
    return {
      id: `prod_${idx + 1}`,
      name,
      category,
      price,
      mrp,
      unit,
      note,
      image: "",
      storeStock,
    };
  });
}

function seed() {
  writeTable("villages", villages);
  writeTable("categories", categories);
  writeTable("products", buildProducts());

  const users = readTable("users");
  if (!users.find((u) => u.role === "admin")) {
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
    users.push({
      id: genId("usr"),
      name: "GaonMart Admin",
      email: process.env.ADMIN_EMAIL || "admin@gaonmart.in",
      phone: "9999999999",
      passwordHash: bcrypt.hashSync(adminPassword, 10),
      role: "admin",
      addresses: [],
      createdAt: new Date().toISOString(),
    });
    writeTable("users", users);
  }

  if (!require("fs").existsSync(require("path").join(__dirname, "data", "orders.json"))) {
    writeTable("orders", []);
  }

  console.log("✅ Seed complete:");
  console.log(`   Villages: ${villages.length}`);
  console.log(`   Categories: ${categories.length}`);
  console.log(`   Products: ${productSeed.length}`);
  console.log(`   Admin login -> ${process.env.ADMIN_EMAIL || "admin@gaonmart.in"} / ${process.env.ADMIN_PASSWORD || "Admin@123"}`);
}

if (require.main === module) {
  seed();
}

module.exports = { seed };
