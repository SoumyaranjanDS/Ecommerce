const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const Product = require("../models/poduct"); // Note: using the 'poduct' filename typo as found in the codebase

dotenv.config({ path: path.join(__dirname, "../.env") });

const products = [
  // ── ELECTRONICS (8) ──────────────────────────────────────────────────────
  {
    title: "Wireless Bluetooth Headphones",
    description: "Over-ear wireless headphones with active noise cancellation, 30-hour battery life, and premium sound drivers. Foldable design with memory foam ear cushions for all-day comfort.",
    price: 8999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505751104546-4b63c93054b1?auto=format&fit=crop&w=800&q=80",
    stock: 85,
  },
  {
    title: "TWS Noise-Cancelling Earbuds",
    description: "True wireless earbuds with hybrid active noise cancellation, 8-hour playback plus 24 hours via case, IPX5 water resistance, and multipoint Bluetooth 5.3 connectivity.",
    price: 5499,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    stock: 120,
  },
  {
    title: "Portable Magnetic Power Bank 20000mAh",
    description: "Ultra-slim 20000mAh power bank with 65W PD fast charging, dual USB-C ports, MagSafe wireless charging pad, and LED battery indicator. Charges a laptop in under 90 minutes.",
    price: 3299,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80",
    stock: 200,
  },
  {
    title: "Smart Fitness Tracker Watch",
    description: "Advanced fitness tracker with AMOLED display, 24/7 heart rate & SpO2 monitoring, GPS tracking, sleep analysis, 100+ workout modes, and 14-day battery life. Water resistant to 50m.",
    price: 7499,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    stock: 65,
  },
  {
    title: "4K Action Camera",
    description: "Waterproof 4K/60fps action camera with 2-inch touch screen, electronic image stabilization, 170° wide-angle lens, 8x slow motion, and voice control. Includes mounting accessories.",
    price: 12999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
    stock: 40,
  },
  {
    title: "Mechanical Gaming Keyboard",
    description: "TKL mechanical keyboard with Cherry MX Red switches, per-key RGB backlighting, aluminum top plate, N-key rollover, and detachable USB-C braided cable. Compatible with PC and Mac.",
    price: 6799,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1601445638532-1f626af277c0?auto=format&fit=crop&w=800&q=80",
    stock: 55,
  },
  {
    title: "Portable Bluetooth Speaker",
    description: "360-degree waterproof Bluetooth speaker with 24W output, 18-hour playtime, dual passive radiators for deep bass, USB-C charging, and a built-in microphone for hands-free calls.",
    price: 4299,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
    stock: 95,
  },
  {
    title: "USB-C Multi-Port Charging Hub",
    description: "7-in-1 USB-C hub with 4K HDMI, 100W PD pass-through, 3x USB-A 3.0, SD and MicroSD card readers. Plug-and-play, no drivers needed. Compact aluminum body.",
    price: 2499,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=80",
    stock: 150,
  },

  // ── FASHION (6) ──────────────────────────────────────────────────────────
  {
    title: "Men's Slim Fit Casual Shirt",
    description: "Premium 100% cotton slim-fit casual shirt with spread collar and single-button cuffs. Pre-washed for a soft feel from day one. Machine washable. Available in 6 colors.",
    price: 1299,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    stock: 300,
  },
  {
    title: "Women's Oversized Graphic Hoodie",
    description: "Cozy 380 GSM French terry cotton-blend oversized hoodie with drop shoulders, kangaroo pocket, and ribbed cuffs. Unisex fit, preshrunk fabric, available in S–3XL.",
    price: 1899,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?auto=format&fit=crop&w=800&q=80",
    stock: 180,
  },
  {
    title: "Classic White Leather Sneakers",
    description: "Minimalist low-top sneakers with genuine leather upper, cushioned memory foam insole, and durable rubber outsole. Timeless design that pairs with any outfit. Sizes 38–46.",
    price: 3499,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    stock: 110,
  },
  {
    title: "Slim-Fit Stretch Chino Pants",
    description: "4-way stretch cotton chino trousers with a tailored slim fit, hidden waistband extension, and wrinkle-resistant fabric. Perfect for office to weekend wear. Lengths 30–34.",
    price: 1599,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
    stock: 220,
  },
  {
    title: "Women's Floral Midi Dress",
    description: "Lightweight viscose midi dress with an all-over floral print, adjustable spaghetti straps, smocked bodice, and a flowy A-line skirt. Lined. Perfect for summer occasions.",
    price: 2199,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
    stock: 90,
  },
  {
    title: "Leather Bifold Wallet",
    description: "Handcrafted full-grain leather bifold wallet with RFID-blocking lining, 6 card slots, 2 currency compartments, and a slim 8mm profile. Gift-ready packaging included.",
    price: 999,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    stock: 250,
  },

  // ── BEAUTY & PERSONAL CARE (5) ───────────────────────────────────────────
  {
    title: "Vitamin C Brightening Face Serum",
    description: "15% stabilized Vitamin C serum with hyaluronic acid and niacinamide. Reduces dark spots, boosts collagen, and delivers a radiant glow. Dermatologist tested, fragrance-free, 30ml.",
    price: 1499,
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    stock: 175,
  },
  {
    title: "Matte Liquid Lipstick Set (6 Shades)",
    description: "Long-lasting transfer-proof matte liquid lipsticks in 6 curated shades from nude to bold red. Lightweight formula, non-drying, vegan & cruelty-free. 4.5ml each.",
    price: 1199,
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1586495777744-4e6232bf4b7c?auto=format&fit=crop&w=800&q=80",
    stock: 200,
  },
  {
    title: "Hair Growth Scalp Serum",
    description: "Clinically proven scalp serum with Redensyl, Anagain, and biotin complex. Reduces hair fall by 87% in 8 weeks. Lightweight, non-greasy formula. 60ml with dropper applicator.",
    price: 1799,
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1599751449128-eb7249c3d6b1?auto=format&fit=crop&w=800&q=80",
    stock: 130,
  },
  {
    title: "Electric Face Cleansing Brush",
    description: "Silicone sonic facial cleansing device with 3 speed settings, waterproof IPX7 rating, USB magnetic charging, and 30-day battery life. 10x better cleansing than manual washing.",
    price: 2299,
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80",
    stock: 80,
  },
  {
    title: "SPF 50 Sunscreen Gel Cream",
    description: "Lightweight PA++++ broad-spectrum SPF 50 sunscreen with niacinamide and hyaluronic acid. Invisible finish, no white cast, water-resistant for 80 minutes. 50g tube.",
    price: 649,
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    stock: 400,
  },

  // ── HOME & KITCHEN (5) ───────────────────────────────────────────────────
  {
    title: "Smart LED Desk Lamp",
    description: "Architect-style LED desk lamp with 5 color temperatures, 10 brightness levels, wireless Qi charging base, USB-A port, and touch controls. Eye-care flicker-free technology.",
    price: 2799,
    category: "Home & Kitchen",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    stock: 70,
  },
  {
    title: "Stainless Steel Water Bottle 1L",
    description: "Double-wall vacuum insulated 1-litre water bottle that keeps drinks cold for 24 hours and hot for 12 hours. BPA-free, leak-proof lid, and a wide mouth for ice cubes.",
    price: 899,
    category: "Home & Kitchen",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
    stock: 320,
  },
  {
    title: "Pour-Over Coffee Maker Set",
    description: "Borosilicate glass pour-over coffee maker with stainless steel filter, silicone band, and bamboo coaster. Brews 600ml of rich, barista-quality coffee. Dishwasher safe.",
    price: 1699,
    category: "Home & Kitchen",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
    stock: 60,
  },
  {
    title: "Non-Stick Ceramic Frying Pan Set",
    description: "3-piece PFAS-free ceramic non-stick frying pan set (20, 24, 28cm). Induction compatible, oven safe to 450°F, ergonomic stay-cool handles, and dishwasher safe.",
    price: 3999,
    category: "Home & Kitchen",
    image: "https://images.unsplash.com/photo-1584990347449-39b8a66bd141?auto=format&fit=crop&w=800&q=80",
    stock: 45,
  },
  {
    title: "Aromatherapy Essential Oil Diffuser",
    description: "400ml ultrasonic aroma diffuser with 7 LED color modes, auto shut-off, mist control, and whisper-quiet operation. Covers up to 300 sq ft. BPA-free, includes 2 essential oils.",
    price: 1499,
    category: "Home & Kitchen",
    image: "https://images.unsplash.com/photo-1608181831718-c9fec2f1d5d1?auto=format&fit=crop&w=800&q=80",
    stock: 100,
  },

  // ── SPORTS & FITNESS (4) ─────────────────────────────────────────────────
  {
    title: "Resistance Bands Set (5 Levels)",
    description: "Set of 5 latex-free fabric resistance bands from extra-light to extra-heavy. Ideal for strength training, yoga, Pilates, and physical therapy. Non-slip, portable, with carry bag.",
    price: 799,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=800&q=80",
    stock: 350,
  },
  {
    title: "Adjustable Dumbbell 20kg",
    description: "Space-saving adjustable dumbbell that replaces 15 sets of weights. Quick-select dial from 2–20kg in 2kg increments. Ergonomic handle with knurled grip. Suitable for home gyms.",
    price: 8499,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1585338107937-234f2729f52f?auto=format&fit=crop&w=800&q=80",
    stock: 30,
  },
  {
    title: "Yoga Mat with Alignment Lines",
    description: "6mm thick non-slip TPE yoga mat with body alignment markings, dual-textured surface, moisture-resistant, and carrying strap. 183cm x 61cm. Eco-friendly and latex-free.",
    price: 1299,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1601925228876-9b46bff2de38?auto=format&fit=crop&w=800&q=80",
    stock: 190,
  },
  {
    title: "Insulated Gym Shaker Bottle 700ml",
    description: "Stainless steel protein shaker with a leak-proof lid, BlenderBall wire whisk, and powder storage compartment. Keeps drinks cold for 12 hours. 700ml capacity, BPA-free.",
    price: 699,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=800&q=80",
    stock: 280,
  },

  // ── BOOKS (2) ────────────────────────────────────────────────────────────
  {
    title: "Atomic Habits — James Clear",
    description: "The instant New York Times bestseller on how tiny changes create remarkable results. Practical strategies for building good habits and breaking bad ones. Paperback, 320 pages.",
    price: 499,
    category: "Books",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    stock: 500,
  },
  {
    title: "The Psychology of Money — Morgan Housel",
    description: "19 short stories exploring the strange ways people think about money and how to make better financial decisions. A timeless guide to wealth, greed, and happiness. Paperback, 256 pages.",
    price: 449,
    category: "Books",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    stock: 420,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce");
    console.log("Connected to MongoDB for seeding...");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products.");

    // Insert new products
    await Product.insertMany(products);
    console.log(`${products.length} products seeded successfully!`);

    process.exit();
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
};

seedDB();
