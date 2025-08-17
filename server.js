require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const jwtRoute = require("./routes/jwt");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require('./routes/categoryRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const paymentsRoutes = require('./routes/paymentsRoutes');
const salesRoutes = require('./routes/sales');
const advertisedRoutes = require('./routes/advertised');


connectDB();

const app = express();

app.use(cors({
  origin: "https://medikartt.netlify.app", // or "*" for development
  
}));
app.use(express.json());


app.use("/api/users", userRoutes);

app.use("/uploads", express.static("uploads"));

// jwt route
app.use("/api/auth/jwt", jwtRoute);

// category routes
app.use('/api/categories', categoryRoutes);


// medicine routes
app.use('/api/medicines', medicineRoutes);

// seller routes
app.use('/api/seller', sellerRoutes);

// sales routes
app.use('/api/sales', salesRoutes);


// Advertised medicines routes
app.use("/api/advertised", advertisedRoutes);

// payment routes
app.use("/api/payments", paymentsRoutes);


app.get("/", (req, res) => {
  res.send("MediKart API is running");
});

const http = require("http");
const { initSocket } = require("./utils/socket");

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// initialize socket.io
initSocket(server);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

