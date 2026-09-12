const dotenv = require("dotenv");

// Load environment variables BEFORE importing routes
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

/* ================= AUTH ROUTES ================= */

app.use("/api/auth", authRoutes);


/* ================= ROOT ROUTE ================= */

app.get("/", (req, res) => {
  res.json({
    message: "SmartPay-Safe backend is running",
  });
});


/* ================= SERVER ================= */

const PORT = 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
  });