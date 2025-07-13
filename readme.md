# 🩺 MediKart Server - Backend API

This is the **backend/server** repository for the **MediKart Multi-Vendor E-commerce Pharmacy** web application. It is built with **Node.js**, **Express.js**, and **MongoDB**, and it provides a RESTful API to handle authentication, user roles, medicine management, Stripe payments, and more.

🔗 **Frontend Repo:** [medikart-client](https://github.com/soyebcodes/medikart-client)  
🔗 **Live Site:** [Visit Live Site](https://medikartt.netlify.app)

---

## 🚀 Features

- JWT Authentication & Role-based Access
- CRUD for medicines (admin/seller)
- Stripe Payment Integration
- User roles: Buyer, Seller, Admin
- Middleware for route protection
- Payment history and transaction tracking
- CORS, dotenv, express-async-handler, and more

---

## 🧰 Tech Stack

| Technology         | Description                   |
| ------------------ | ----------------------------- |
| Node.js            | JavaScript runtime            |
| Express.js         | Web framework for Node.js     |
| MongoDB + Mongoose | NoSQL Database + ODM          |
| JWT                | JSON Web Token Authentication |
| Stripe             | Payment processing            |
| Dotenv             | Environment configuration     |
| CORS, Helmet       | Security and API protection   |

---

## 📁 Project Structure

medikart-server/
│
├── controllers/ # Business logic for routes
├── middleware/ # Auth & role protection
├── models/ # Mongoose models
├── routes/ # Express route handlers
├── utils/ # Utility functions (e.g., token, error handlers)
├── .env # Environment variables
├── server.js # Main server entry point
└── package.json # Project metadata & dependencies

---

## 🛠️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/soyebcodes/medikart-server.git
cd medikart-server
```
