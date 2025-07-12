require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const jwtRoute = require("./routes/jwt");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require('./routes/categoryRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const salesRoutes = require('./routes/sales');
const advertisedRoutes = require('./routes/advertised');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/users", userRoutes);
app.use("/uploads", express.static("uploads"));

// jwt route
app.use("/api/jwt", jwtRoute); 

// category routes
app.use('/api/categories', categoryRoutes);


// medicine routes
app.use('/api/medicines', medicineRoutes);

// seller routes
app.use('/api/seller', sellerRoutes);

// payment routes
app.use("/api/payments", paymentRoutes);


// sales routes
app.use('/api/sales', salesRoutes);


// Advertised medicines routes
app.use("/api/advertised", advertisedRoutes);

app.get("/", (req, res) => {
  res.send("MediKart API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
