# 🛒 Modern E-Commerce Platform

A high-performance, full-stack e-commerce solution built using the **MERN** stack (MongoDB, Express, React, Node.js). This platform offers a seamless shopping experience with features like user authentication, product management, cart functionality, and an integrated admin dashboard.

---

## 🚀 Features

### 👤 User Features
- **Secure Authentication**: Signup, Login, and JWT-based session management.
- **Product Discovery**: Browse products with detailed views, categories, and reviews.
- **Wishlist & Cart**: Save favorites and manage items for checkout.
- **Address Management**: Multiple shipping address support.
- **Order Tracking**: Comprehensive order history and status updates.
- **Reviews & Ratings**: Share feedback on purchased products.
- **Coupons**: Apply discount codes during checkout.

### 🛠️ Admin Features
- **Dashboard**: Overview of sales, users, and product metrics.
- **Product Management**: Create, update, and delete products.
- **Order Management**: Process and update order statuses.
- **User Insights**: Manage registered users and permissions.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Build Tool**: [Vite](https://vitejs.dev/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Security**: [JWT](https://jwt.io/), [Bcrypt](https://github.com/kelektiv/node.bcrypt.js), [Helmet](https://helmetjs.github.io/), [Express Rate Limit](https://www.npmjs.com/package/express-rate-limit)
- **Mailing**: [Nodemailer](https://nodemailer.com/)

---

## 📂 Project Structure

```text
ecommerce/
├── backend/            # Express Server & API
│   ├── config/         # Database & App configurations
│   ├── controllers/    # Request handlers
│   ├── models/         # Mongoose Schemas
│   ├── routes/         # API Endpoints
│   ├── middleware/     # Auth & Error handling
│   └── server.js       # Entry point
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Route-level components
│   │   ├── api/        # Axios configurations
│   │   └── admin/      # Admin dashboard components
│   └── index.html      # Entry point
└── readme.md           # Documentation
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ecommerce.git
cd ecommerce
```

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add the following:
   ```env
   PORT=8000
   MONGO_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret_here
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### 4. Database Seeding (Optional)
To populate the database with initial products and coupons:
1. Seed Products:
   ```bash
   cd backend
   node scripts/seedProducts.js
   ```
2. Seed Coupons:
   ```bash
   node seedCoupon.js
   ```

---

## 🛡️ Security & Optimization
- **Data Protection**: Sensitive information is hashed using `bcryptjs`.
- **API Security**: Implemented `helmet` for header security and `express-rate-limit` to prevent brute-force attacks.
- **Optimized UI**: Fast loading times with Vite and utility-first styling with Tailwind CSS 4.

---

## 📄 License
This project is licensed under the **ISC License**.
