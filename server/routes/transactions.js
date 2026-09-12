const express = require("express");
const mongoose = require("mongoose");

const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================================================
   GET ALL TRANSACTIONS FOR LOGGED-IN USER
========================================================= */

router.get("/", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      transactions,
    });
  } catch (error) {
    console.error(
      "Get transactions error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to fetch transactions.",
    });
  }
});

/* =========================================================
   CREATE NEW TRANSACTION
========================================================= */

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      receiver,
      type,
      amount,
      status,
      riskLevel,
      riskScore,
      message,
      warnings,
    } = req.body;

    /* -----------------------------------------
       VALIDATION
    ----------------------------------------- */

    if (!receiver || amount === undefined) {
      return res.status(400).json({
        message:
          "Receiver and amount are required.",
      });
    }

    const numericAmount = Number(amount);

    if (
      Number.isNaN(numericAmount) ||
      numericAmount <= 0
    ) {
      return res.status(400).json({
        message:
          "Please provide a valid transaction amount.",
      });
    }

    /* -----------------------------------------
       CREATE TRANSACTION
    ----------------------------------------- */

    const transaction =
      await Transaction.create({
        userId: req.user.id,

        receiver: receiver.trim(),

        type:
          type?.trim() ||
          "Payment",

        amount: numericAmount,

        status:
          status === "Safe"
            ? "Safe"
            : "Review",

        riskLevel:
          ["LOW", "MEDIUM", "HIGH"].includes(
            riskLevel
          )
            ? riskLevel
            : "LOW",

        riskScore:
          typeof riskScore === "number"
            ? Math.max(
                0,
                Math.min(100, riskScore)
              )
            : 0,

        message:
          message?.trim() || "",

        warnings:
          Array.isArray(warnings)
            ? warnings
            : [],
      });

    /* -----------------------------------------
       RESPONSE
    ----------------------------------------- */

    res.status(201).json({
      message:
        "Transaction saved successfully.",
      transaction,
    });
  } catch (error) {
    console.error(
      "Create transaction error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to save transaction.",
    });
  }
});

/* =========================================================
   DELETE ALL TRANSACTIONS FOR LOGGED-IN USER
========================================================= */

router.delete(
  "/clear",
  authMiddleware,
  async (req, res) => {
    try {
      await Transaction.deleteMany({
        userId: req.user.id,
      });

      res.json({
        message:
          "Transaction history cleared successfully.",
      });
    } catch (error) {
      console.error(
        "Clear transactions error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to clear transaction history.",
      });
    }
  }
);

module.exports = router;