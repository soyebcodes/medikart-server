require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const jwtRoute = require("./routes/jwt");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require('./routes/categoryRoutes');



connectDB();

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/users", userRoutes);
app.use("/uploads", express.static("uploads"));

// jwt route
app.use("/api", jwtRoute); 

// category routes
app.use('/api/categories', categoryRoutes);


app.get("/", (req, res) => {
  res.send("MediKart API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
