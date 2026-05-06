import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Product from "../models/product.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const products = [
  {
    "title": "Smart LED TV",
    "description": "High-quality electronics item designed for durability and performance.",
    "price": 1112,
    "salePrice": 840,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop",
    "stock": 45,
    "sku": "SKU-1-A"
  },
  {
    "title": "Slim Fit Jeans",
    "description": "High-quality fashion item designed for durability and performance.",
    "price": 1039,
    "salePrice": 920,
    "category": "Fashion",
    "image": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    "stock": 79,
    "sku": "SKU-2-A"
  },
  {
    "title": "Vitamin C Serum",
    "description": "High-quality beauty item designed for durability and performance.",
    "price": 458,
    "salePrice": 345,
    "category": "Beauty",
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    "stock": 110,
    "sku": "SKU-3-A"
  },
  {
    "title": "Non-Stick Cookware Set",
    "description": "High-quality home & kitchen item designed for durability and performance.",
    "price": 225,
    "salePrice": 157,
    "category": "Home & Kitchen",
    "image": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&h=400&fit=crop",
    "stock": 15,
    "sku": "SKU-4-A"
  },
  {
    "title": "Yoga Mat",
    "description": "High-quality sports item designed for durability and performance.",
    "price": 1638,
    "salePrice": 1265,
    "category": "Sports",
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
    "stock": 55,
    "sku": "SKU-5-A"
  },
  {
    "title": "The Art of Thinking",
    "description": "High-quality books item designed for durability and performance.",
    "price": 1658,
    "salePrice": 1368,
    "category": "Books",
    "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop",
    "stock": 64,
    "sku": "SKU-6-A"
  },
  {
    "title": "Wireless Earbuds",
    "description": "High-quality electronics item designed for durability and performance.",
    "price": 548,
    "salePrice": 454,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
    "stock": 31,
    "sku": "SKU-7-A"
  },
  {
    "title": "Floral Maxi Dress",
    "description": "High-quality fashion item designed for durability and performance.",
    "price": 325,
    "salePrice": 215,
    "category": "Fashion",
    "image": "https://images.unsplash.com/photo-1572804013307-a9a1119812a7?w=400&h=400&fit=crop",
    "stock": 43,
    "sku": "SKU-8-A"
  },
  {
    "title": "Matte Lipstick",
    "description": "High-quality beauty item designed for durability and performance.",
    "price": 548,
    "salePrice": 459,
    "category": "Beauty",
    "image": "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop",
    "stock": 48,
    "sku": "SKU-9-A"
  },
  {
    "title": "Air Purifier",
    "description": "High-quality home & kitchen item designed for durability and performance.",
    "price": 1425,
    "salePrice": 1165,
    "category": "Home & Kitchen",
    "image": "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop",
    "stock": 31,
    "sku": "SKU-10-A"
  },
  {
    "title": "Resistance Bands Set",
    "description": "High-quality sports item designed for durability and performance.",
    "price": 1145,
    "salePrice": 1009,
    "category": "Sports",
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
    "stock": 43,
    "sku": "SKU-11-A"
  },
  {
    "title": "Python Mastery",
    "description": "High-quality books item designed for durability and performance.",
    "price": 1658,
    "salePrice": 1528,
    "category": "Books",
    "image": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=400&fit=crop",
    "stock": 48,
    "sku": "SKU-12-A"
  },
  {
    "title": "Laptop Pro",
    "description": "High-quality electronics item designed for durability and performance.",
    "price": 2758,
    "salePrice": 2545,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
    "stock": 64,
    "sku": "SKU-13-A"
  },
  {
    "title": "Leather Jacket",
    "description": "High-quality fashion item designed for durability and performance.",
    "price": 2345,
    "salePrice": 1793,
    "category": "Fashion",
    "image": "https://images.unsplash.com/photo-1551028711-0305ed9f390f?w=400&h=400&fit=crop",
    "stock": 31,
    "sku": "SKU-14-A"
  },
  {
    "title": "Hydrating Moisturiser",
    "description": "High-quality beauty item designed for durability and performance.",
    "price": 545,
    "salePrice": 477,
    "category": "Beauty",
    "image": "https://images.unsplash.com/photo-1556228578-00508f7d9ba6?w=400&h=400&fit=crop",
    "stock": 43,
    "sku": "SKU-15-A"
  },
  {
    "title": "Coffee Maker",
    "description": "High-quality home & kitchen item designed for durability and performance.",
    "price": 1458,
    "salePrice": 1255,
    "category": "Home & Kitchen",
    "image": "https://images.unsplash.com/photo-1520970014086-2208ec0f110e?w=400&h=400&fit=crop",
    "stock": 48,
    "sku": "SKU-16-A"
  },
  {
    "title": "Running Shoes",
    "description": "High-quality sports item designed for durability and performance.",
    "price": 1685,
    "salePrice": 1479,
    "category": "Sports",
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    "stock": 12,
    "sku": "SKU-17-A"
  },
  {
    "title": "Mindful Living",
    "description": "High-quality books item designed for durability and performance.",
    "price": 2458,
    "salePrice": 2039,
    "category": "Books",
    "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop",
    "stock": 31,
    "sku": "SKU-18-A"
  },
  {
    "title": "Bluetooth Speaker",
    "description": "High-quality electronics item designed for durability and performance.",
    "price": 4258,
    "salePrice": 3745,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    "stock": 43,
    "sku": "SKU-19-A"
  },
  {
    "title": "Casual Sneakers",
    "description": "High-quality fashion item designed for durability and performance.",
    "price": 1654,
    "salePrice": 1439,
    "category": "Fashion",
    "image": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
    "stock": 48,
    "sku": "SKU-20-A"
  },
  {
    "title": "SPF 50 Sunscreen",
    "description": "High-quality beauty item designed for durability and performance.",
    "price": 1258,
    "salePrice": 1079,
    "category": "Beauty",
    "image": "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop",
    "stock": 12,
    "sku": "SKU-21-A"
  },
  {
    "title": "Ceramic Planter",
    "description": "High-quality home & kitchen item designed for durability and performance.",
    "price": 1458,
    "salePrice": 1249,
    "category": "Home & Kitchen",
    "image": "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
    "stock": 31,
    "sku": "SKU-22-A"
  },
  {
    "title": "Agility Ladder",
    "description": "High-quality sports item designed for durability and performance.",
    "price": 1425,
    "salePrice": 1105,
    "category": "Sports",
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
    "stock": 43,
    "sku": "SKU-23-A"
  },
  {
    "title": "Modern Architecture",
    "description": "High-quality books item designed for durability and performance.",
    "price": 2654,
    "salePrice": 2428,
    "category": "Books",
    "image": "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=400&fit=crop",
    "stock": 48,
    "sku": "SKU-24-A"
  },
  {
    "title": "4K Webcam",
    "description": "High-quality electronics item designed for durability and performance.",
    "price": 3254,
    "salePrice": 2945,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1583394838336-acd977730f8a?w=400&h=400&fit=crop",
    "stock": 64,
    "sku": "SKU-25-A"
  },
  {
    "title": "Wool Sweater",
    "description": "High-quality fashion item designed for durability and performance.",
    "price": 2954,
    "salePrice": 2540,
    "category": "Fashion",
    "image": "https://images.unsplash.com/photo-1556905055-8f358a7a4bb4?w=400&h=400&fit=crop",
    "stock": 31,
    "sku": "SKU-26-A"
  },
  {
    "title": "Volumizing Mascara",
    "description": "High-quality beauty item designed for durability and performance.",
    "price": 2654,
    "salePrice": 2257,
    "category": "Beauty",
    "image": "https://images.unsplash.com/photo-1556228852-6d35a51c206d?w=400&h=400&fit=crop",
    "stock": 43,
    "sku": "SKU-27-A"
  },
  {
    "title": "Instant Pot",
    "description": "High-quality home & kitchen item designed for durability and performance.",
    "price": 3254,
    "salePrice": 2926,
    "category": "Home & Kitchen",
    "image": "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400&h=400&fit=crop",
    "stock": 48,
    "sku": "SKU-28-A"
  },
  {
    "title": "Dumbbell Set",
    "description": "High-quality sports item designed for durability and performance.",
    "price": 1245,
    "salePrice": 1031,
    "category": "Sports",
    "image": "https://images.unsplash.com/photo-1583454110551-21f2fa2ec617?w=400&h=400&fit=crop",
    "stock": 12,
    "sku": "SKU-29-A"
  },
  {
    "title": "Cook Like a Chef",
    "description": "High-quality books item designed for durability and performance.",
    "price": 3745,
    "salePrice": 3376,
    "category": "Books",
    "image": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=400&fit=crop",
    "stock": 31,
    "sku": "SKU-30-A"
  },
  {
    "title": "Noise-Cancelling Headphones",
    "description": "High-quality electronics item designed for durability and performance.",
    "price": 3845,
    "salePrice": 3202,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    "stock": 100,
    "sku": "SKU-31-A"
  },
  {
    "title": "Cargo Shorts",
    "description": "High-quality fashion item designed for durability and performance.",
    "price": 1112,
    "salePrice": 840,
    "category": "Fashion",
    "image": "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop",
    "stock": 79,
    "sku": "SKU-32-A"
  },
  {
    "title": "Rose Water Toner",
    "description": "High-quality beauty item designed for durability and performance.",
    "price": 1039,
    "salePrice": 920,
    "category": "Beauty",
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    "stock": 110,
    "sku": "SKU-33-A"
  },
  {
    "title": "Knife Block Set",
    "description": "High-quality home & kitchen item designed for durability and performance.",
    "price": 458,
    "salePrice": 345,
    "category": "Home & Kitchen",
    "image": "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400&h=400&fit=crop",
    "stock": 15,
    "sku": "SKU-34-A"
  },
  {
    "title": "Yoga Block",
    "description": "High-quality sports item designed for durability and performance.",
    "price": 225,
    "salePrice": 157,
    "category": "Sports",
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
    "stock": 55,
    "sku": "SKU-35-A"
  },
  {
    "title": "Creative Writing",
    "description": "High-quality books item designed for durability and performance.",
    "price": 1638,
    "salePrice": 1265,
    "category": "Books",
    "image": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=400&fit=crop",
    "stock": 64,
    "sku": "SKU-36-A"
  },
  {
    "title": "Portable Charger",
    "description": "High-quality electronics item designed for durability and performance.",
    "price": 1658,
    "salePrice": 1368,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1583394838336-acd977730f8a?w=400&h=400&fit=crop",
    "stock": 31,
    "sku": "SKU-37-A"
  },
  {
    "title": "Linen Shirt",
    "description": "High-quality fashion item designed for durability and performance.",
    "price": 548,
    "salePrice": 454,
    "category": "Fashion",
    "image": "https://images.unsplash.com/photo-1551028711-0305ed9f390f?w=400&h=400&fit=crop",
    "stock": 43,
    "sku": "SKU-38-A"
  },
  {
    "title": "Night Cream",
    "description": "High-quality beauty item designed for durability and performance.",
    "price": 325,
    "salePrice": 215,
    "category": "Beauty",
    "image": "https://images.unsplash.com/photo-1556228578-00508f7d9ba6?w=400&h=400&fit=crop",
    "stock": 48,
    "sku": "SKU-39-A"
  },
  {
    "title": "Bamboo Cutting Board",
    "description": "High-quality home & kitchen item designed for durability and performance.",
    "price": 548,
    "salePrice": 459,
    "category": "Home & Kitchen",
    "image": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&h=400&fit=crop",
    "stock": 31,
    "sku": "SKU-40-A"
  },
  {
    "title": "Jump Rope",
    "description": "High-quality sports item designed for durability and performance.",
    "price": 1425,
    "salePrice": 1165,
    "category": "Sports",
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
    "stock": 43,
    "sku": "SKU-41-A"
  },
  {
    "title": "The Design Mind",
    "description": "High-quality books item designed for durability and performance.",
    "price": 1145,
    "salePrice": 1009,
    "category": "Books",
    "image": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=400&fit=crop",
    "stock": 48,
    "sku": "SKU-42-A"
  },
  {
    "title": "Smart Watch",
    "description": "High-quality electronics item designed for durability and performance.",
    "price": 1658,
    "salePrice": 1528,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    "stock": 64,
    "sku": "SKU-43-A"
  },
  {
    "title": "Formal Blazer",
    "description": "High-quality fashion item designed for durability and performance.",
    "price": 2758,
    "salePrice": 2545,
    "category": "Fashion",
    "image": "https://images.unsplash.com/photo-1551028711-0305ed9f390f?w=400&h=400&fit=crop",
    "stock": 31,
    "sku": "SKU-44-A"
  },
  {
    "title": "Argan Hair Oil",
    "description": "High-quality beauty item designed for durability and performance.",
    "price": 2345,
    "salePrice": 1793,
    "category": "Beauty",
    "image": "https://images.unsplash.com/photo-1556228578-00508f7d9ba6?w=400&h=400&fit=crop",
    "stock": 43,
    "sku": "SKU-45-A"
  },
  {
    "title": "Stainless Steel Kettle",
    "description": "High-quality home & kitchen item designed for durability and performance.",
    "price": 545,
    "salePrice": 477,
    "category": "Home & Kitchen",
    "image": "https://images.unsplash.com/photo-1520970014086-2208ec0f110e?w=400&h=400&fit=crop",
    "stock": 48,
    "sku": "SKU-46-A"
  },
  {
    "title": "Water Bottle",
    "description": "High-quality sports item designed for durability and performance.",
    "price": 1458,
    "salePrice": 1255,
    "category": "Sports",
    "image": "https://images.unsplash.com/photo-1523362628242-f513a30f2df1?w=400&h=400&fit=crop",
    "stock": 12,
    "sku": "SKU-47-A"
  },
  {
    "title": "Financial Freedom",
    "description": "High-quality books item designed for durability and performance.",
    "price": 1685,
    "salePrice": 1479,
    "category": "Books",
    "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop",
    "stock": 31,
    "sku": "SKU-48-A"
  },
  {
    "title": "Gaming Mouse",
    "description": "High-quality electronics item designed for durability and performance.",
    "price": 2458,
    "salePrice": 2039,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop",
    "stock": 43,
    "sku": "SKU-49-A"
  },
  {
    "title": "Printed T-Shirt",
    "description": "High-quality fashion item designed for durability and performance.",
    "price": 4258,
    "salePrice": 3745,
    "category": "Fashion",
    "image": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&h=400&fit=crop",
    "stock": 48,
    "sku": "SKU-50-A"
  },
  {
    "title": "Charcoal Face Mask",
    "description": "High-quality beauty item designed for durability and performance.",
    "price": 1654,
    "salePrice": 1439,
    "category": "Beauty",
    "image": "https://images.unsplash.com/photo-1556228578-00508f7d9ba6?w=400&h=400&fit=crop",
    "stock": 12,
    "sku": "SKU-51-A"
  },
  {
    "title": "Microwave Oven",
    "description": "High-quality home & kitchen item designed for durability and performance.",
    "price": 1258,
    "salePrice": 1079,
    "category": "Home & Kitchen",
    "image": "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400&h=400&fit=crop",
    "stock": 31,
    "sku": "SKU-52-A"
  },
  {
    "title": "Gym Gloves",
    "description": "High-quality sports item designed for durability and performance.",
    "price": 1458,
    "salePrice": 1249,
    "category": "Sports",
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
    "stock": 43,
    "sku": "SKU-53-A"
  },
  {
    "title": "Science of Sleep",
    "description": "High-quality books item designed for durability and performance.",
    "price": 1425,
    "salePrice": 1105,
    "category": "Books",
    "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop",
    "stock": 48,
    "sku": "SKU-54-A"
  },
  {
    "title": "USB-C Hub",
    "description": "High-quality electronics item designed for durability and performance.",
    "price": 2654,
    "salePrice": 2428,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop",
    "stock": 64,
    "sku": "SKU-55-A"
  },
  {
    "title": "Denim Skirt",
    "description": "High-quality fashion item designed for durability and performance.",
    "price": 3254,
    "salePrice": 2945,
    "category": "Fashion",
    "image": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop",
    "stock": 31,
    "sku": "SKU-56-A"
  },
  {
    "title": "Eyebrow Pencil",
    "description": "High-quality beauty item designed for durability and performance.",
    "price": 2954,
    "salePrice": 2540,
    "category": "Beauty",
    "image": "https://images.unsplash.com/photo-1556228578-00508f7d9ba6?w=400&h=400&fit=crop",
    "stock": 43,
    "sku": "SKU-57-A"
  },
  {
    "title": "Cast Iron Pan",
    "description": "High-quality home & kitchen item designed for durability and performance.",
    "price": 2654,
    "salePrice": 2257,
    "category": "Home & Kitchen",
    "image": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&h=400&fit=crop",
    "stock": 48,
    "sku": "SKU-58-A"
  },
  {
    "title": "Knee Support Brace",
    "description": "High-quality sports item designed for durability and performance.",
    "price": 3254,
    "salePrice": 2926,
    "category": "Sports",
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
    "stock": 12,
    "sku": "SKU-59-A"
  },
  {
    "title": "Travel Diaries",
    "description": "High-quality books item designed for durability and performance.",
    "price": 1245,
    "salePrice": 1031,
    "category": "Books",
    "image": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&fit=crop",
    "stock": 31,
    "sku": "SKU-60-A"
  },
  {
    "title": "Smart LED TV",
    "description": "High-quality electronics item designed for durability and performance.",
    "price": 3745,
    "salePrice": 3376,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop",
    "stock": 43,
    "sku": "SKU-61-A"
  },
  {
    "title": "Slim Fit Jeans",
    "description": "High-quality fashion item designed for durability and performance.",
    "price": 3845,
    "salePrice": 3202,
    "category": "Fashion",
    "image": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    "stock": 48,
    "sku": "SKU-62-A"
  },
  {
    "title": "Vitamin C Serum",
    "description": "High-quality beauty item designed for durability and performance.",
    "price": 1112,
    "salePrice": 840,
    "category": "Beauty",
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    "stock": 12,
    "sku": "SKU-63-A"
  },
  {
    "title": "Non-Stick Cookware Set",
    "description": "High-quality home & kitchen item designed for durability and performance.",
    "price": 1039,
    "salePrice": 920,
    "category": "Home & Kitchen",
    "image": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&h=400&fit=crop",
    "stock": 31,
    "sku": "SKU-64-A"
  },
  {
    "title": "Yoga Mat",
    "description": "High-quality sports item designed for durability and performance.",
    "price": 458,
    "salePrice": 345,
    "category": "Sports",
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
    "stock": 43,
    "sku": "SKU-65-A"
  },
  {
    "title": "The Art of Thinking",
    "description": "High-quality books item designed for durability and performance.",
    "price": 225,
    "salePrice": 157,
    "category": "Books",
    "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop",
    "stock": 48,
    "sku": "SKU-66-A"
  },
  {
    "title": "Wireless Earbuds",
    "description": "High-quality electronics item designed for durability and performance.",
    "price": 1638,
    "salePrice": 1265,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
    "stock": 64,
    "sku": "SKU-67-A"
  },
  {
    "title": "Floral Maxi Dress",
    "description": "High-quality fashion item designed for durability and performance.",
    "price": 1658,
    "salePrice": 1368,
    "category": "Fashion",
    "image": "https://images.unsplash.com/photo-1572804013307-a9a1119812a7?w=400&h=400&fit=crop",
    "stock": 31,
    "sku": "SKU-68-A"
  },
  {
    "title": "Matte Lipstick",
    "description": "High-quality beauty item designed for durability and performance.",
    "price": 548,
    "salePrice": 454,
    "category": "Beauty",
    "image": "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop",
    "stock": 43,
    "sku": "SKU-69-A"
  },
  {
    "title": "Air Purifier",
    "description": "High-quality home & kitchen item designed for durability and performance.",
    "price": 325,
    "salePrice": 215,
    "category": "Home & Kitchen",
    "image": "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop",
    "stock": 48,
    "sku": "SKU-70-A"
  },
  {
    "title": "Resistance Bands Set",
    "description": "High-quality sports item designed for durability and performance.",
    "price": 548,
    "salePrice": 459,
    "category": "Sports",
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
    "stock": 12,
    "sku": "SKU-71-A"
  },
  {
    "title": "Python Mastery",
    "description": "High-quality books item designed for durability and performance.",
    "price": 1425,
    "salePrice": 1165,
    "category": "Books",
    "image": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=400&fit=crop",
    "stock": 31,
    "sku": "SKU-72-A"
  },
  {
    "title": "Laptop Pro",
    "description": "High-quality electronics item designed for durability and performance.",
    "price": 1145,
    "salePrice": 1009,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
    "stock": 43,
    "sku": "SKU-73-A"
  },
  {
    "title": "Leather Jacket",
    "description": "High-quality fashion item designed for durability and performance.",
    "price": 1658,
    "salePrice": 1528,
    "category": "Fashion",
    "image": "https://images.unsplash.com/photo-1551028711-0305ed9f390f?w=400&h=400&fit=crop",
    "stock": 48,
    "sku": "SKU-74-A"
  },
  {
    "title": "Hydrating Moisturiser",
    "description": "High-quality beauty item designed for durability and performance.",
    "price": 2758,
    "salePrice": 2545,
    "category": "Beauty",
    "image": "https://images.unsplash.com/photo-1556228578-00508f7d9ba6?w=400&h=400&fit=crop",
    "stock": 64,
    "sku": "SKU-75-A"
  },
  {
    "title": "Coffee Maker",
    "description": "High-quality home & kitchen item designed for durability and performance.",
    "price": 2345,
    "salePrice": 1793,
    "category": "Home & Kitchen",
    "image": "https://images.unsplash.com/photo-1520970014086-2208ec0f110e?w=400&h=400&fit=crop",
    "stock": 31,
    "sku": "SKU-76-A"
  },
  {
    "title": "Running Shoes",
    "description": "High-quality sports item designed for durability and performance.",
    "price": 545,
    "salePrice": 477,
    "category": "Sports",
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    "stock": 43,
    "sku": "SKU-77-A"
  },
  {
    "title": "Mindful Living",
    "description": "High-quality books item designed for durability and performance.",
    "price": 1458,
    "salePrice": 1255,
    "category": "Books",
    "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop",
    "stock": 48,
    "sku": "SKU-78-A"
  },
  {
    "title": "Bluetooth Speaker",
    "description": "High-quality electronics item designed for durability and performance.",
    "price": 1685,
    "salePrice": 1479,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    "stock": 12,
    "sku": "SKU-79-A"
  },
  {
    "title": "Casual Sneakers",
    "description": "High-quality fashion item designed for durability and performance.",
    "price": 2458,
    "salePrice": 2039,
    "category": "Fashion",
    "image": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
    "stock": 31,
    "sku": "SKU-80-A"
  },
  {
    "title": "SPF 50 Sunscreen",
    "description": "High-quality beauty item designed for durability and performance.",
    "price": 4258,
    "salePrice": 3745,
    "category": "Beauty",
    "image": "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop",
    "stock": 43,
    "sku": "SKU-81-A"
  },
  {
    "title": "Robotic Vacuum",
    "description": "High-quality home & kitchen item designed for durability and performance.",
    "price": 1654,
    "salePrice": 1439,
    "category": "Home & Kitchen",
    "image": "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400&h=400&fit=crop",
    "stock": 48,
    "sku": "SKU-82-A"
  },
  {
    "title": "Cycling Helmet",
    "description": "High-quality sports item designed for durability and performance.",
    "price": 1258,
    "salePrice": 1079,
    "category": "Sports",
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
    "stock": 12,
    "sku": "SKU-83-A"
  },
  {
    "title": "World History Atlas",
    "description": "High-quality books item designed for durability and performance.",
    "price": 1458,
    "salePrice": 1249,
    "category": "Books",
    "image": "https://images.unsplash.com/photo-1524850041227-615c8274370d?w=400&h=400&fit=crop",
    "stock": 31,
    "sku": "SKU-84-A"
  },
  {
    "title": "4K Webcam",
    "description": "High-quality electronics item designed for durability and performance.",
    "price": 1425,
    "salePrice": 1105,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1583394838336-acd977730f8a?w=400&h=400&fit=crop",
    "stock": 43,
    "sku": "SKU-85-A"
  },
  {
    "title": "Wool Sweater",
    "description": "High-quality fashion item designed for durability and performance.",
    "price": 2654,
    "salePrice": 2428,
    "category": "Fashion",
    "image": "https://images.unsplash.com/photo-1556905055-8f358a7a4bb4?w=400&h=400&fit=crop",
    "stock": 48,
    "sku": "SKU-86-A"
  },
  {
    "title": "Volumizing Mascara",
    "description": "High-quality beauty item designed for durability and performance.",
    "price": 3254,
    "salePrice": 2945,
    "category": "Beauty",
    "image": "https://images.unsplash.com/photo-1556228852-6d35a51c206d?w=400&h=400&fit=crop",
    "stock": 64,
    "sku": "SKU-87-A"
  },
  {
    "title": "Instant Pot",
    "description": "High-quality home & kitchen item designed for durability and performance.",
    "price": 2954,
    "salePrice": 2540,
    "category": "Home & Kitchen",
    "image": "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400&h=400&fit=crop",
    "stock": 31,
    "sku": "SKU-88-A"
  },
  {
    "title": "Dumbbell Set",
    "description": "High-quality sports item designed for durability and performance.",
    "price": 2654,
    "salePrice": 2257,
    "category": "Sports",
    "image": "https://images.unsplash.com/photo-1583454110551-21f2fa2ec617?w=400&h=400&fit=crop",
    "stock": 43,
    "sku": "SKU-89-A"
  },
  {
    "title": "Cook Like a Chef",
    "description": "High-quality books item designed for durability and performance.",
    "price": 3254,
    "salePrice": 2926,
    "category": "Books",
    "image": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=400&fit=crop",
    "stock": 48,
    "sku": "SKU-90-A"
  },
  {
    "title": "Noise-Cancelling Headphones",
    "description": "High-quality electronics item designed for durability and performance.",
    "price": 1245,
    "salePrice": 1031,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    "stock": 12,
    "sku": "SKU-91-A"
  },
  {
    "title": "Cargo Shorts",
    "description": "High-quality fashion item designed for durability and performance.",
    "price": 3745,
    "salePrice": 3376,
    "category": "Fashion",
    "image": "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop",
    "stock": 31,
    "sku": "SKU-92-A"
  },
  {
    "title": "Rose Water Toner",
    "description": "High-quality beauty item designed for durability and performance.",
    "price": 3845,
    "salePrice": 3202,
    "category": "Beauty",
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    "stock": 100,
    "sku": "SKU-93-A"
  },
  {
    "title": "Knife Block Set",
    "description": "High-quality home & kitchen item designed for durability and performance.",
    "price": 1112,
    "salePrice": 840,
    "category": "Home & Kitchen",
    "image": "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400&h=400&fit=crop",
    "stock": 79,
    "sku": "SKU-94-A"
  },
  {
    "title": "Foam Roller",
    "description": "High-quality sports item designed for durability and performance.",
    "price": 2954,
    "salePrice": 2540,
    "category": "Sports",
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
    "stock": 31,
    "sku": "SKU-95-A"
  },
  {
    "title": "Startup Secrets",
    "description": "High-quality books item designed for durability and performance.",
    "price": 2654,
    "salePrice": 2257,
    "category": "Books",
    "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop",
    "stock": 43,
    "sku": "SKU-96-A"
  },
  {
    "title": "Portable Charger",
    "description": "High-quality electronics item designed for durability and performance.",
    "price": 3254,
    "salePrice": 2926,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1583394838336-acd977730f8a?w=400&h=400&fit=crop",
    "stock": 48,
    "sku": "SKU-97-A"
  },
  {
    "title": "Summer Sandals",
    "description": "High-quality fashion item designed for durability and performance.",
    "price": 1245,
    "salePrice": 1031,
    "category": "Fashion",
    "image": "https://images.unsplash.com/photo-1562273103-912067decb3d?w=400&h=400&fit=crop",
    "stock": 12,
    "sku": "SKU-98-A"
  },
  {
    "title": "Sheet Face Mask",
    "description": "High-quality beauty item designed for durability and performance.",
    "price": 3745,
    "salePrice": 3376,
    "category": "Beauty",
    "image": "https://images.unsplash.com/photo-1556228578-00508f7d9ba6?w=400&h=400&fit=crop",
    "stock": 31,
    "sku": "SKU-99-A"
  },
  {
    "title": "Bamboo Cutting Board",
    "description": "High-quality home & kitchen item designed for durability and performance.",
    "price": 3845,
    "salePrice": 3202,
    "category": "Home & Kitchen",
    "image": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&h=400&fit=crop",
    "stock": 100,
    "sku": "SKU-100-A"
  }
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
