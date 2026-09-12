const dotenv = require("dotenv");

// Load environment variables BEFORE importing routes
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");

const app = express();

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(cors());

app.use(express.json());

/* =========================================================
   AUTH ROUTES
========================================================= */

app.use(
  "/api/auth",
  authRoutes
);

/* =========================================================
   TRANSACTION ROUTES
========================================================= */

app.use(
  "/api/transactions",
  transactionRoutes
);

/* =========================================================
   ROOT ROUTE
========================================================= */

app.get("/", (req, res) => {
  res.json({
    message:
      "SmartPay-Safe backend is running",
  });
});

/* =========================================================
   SERVER
========================================================= */

// Render provides PORT through environment variables.
// Local development will use port 5000.

const PORT =
  process.env.PORT || 5000;

/* =========================================================
   MONGODB CONNECTION
========================================================= */

mongoose
  .connect(process.env.MONGO_URI)

  .then(() => {
    console.log(
      "MongoDB connected successfully"
    );

    app.listen(
      PORT,
      "0.0.0.0",
      () => {
        console.log(
          `Server running on port ${PORT}`
        );
      }
    );
  })

  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  });