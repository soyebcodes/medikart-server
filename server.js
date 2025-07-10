const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const jwtRoute = require("./routes/jwt");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
connectDB();


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api", jwtRoute); 

app.get("/", (req, res) => {
  res.send("MediKart API is running");
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
