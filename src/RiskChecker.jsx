import { useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Search,
  CheckCircle2,
} from "lucide-react";

function RiskChecker() {
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  /* =========================================================
     GET CURRENT USER
  ========================================================= */

  const getCurrentUser = () => {
    const savedUser = localStorage.getItem(
      "smartPayCurrentUser"
    );

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  };

  /* =========================================================
     CHECK PAYMENT RISK
  ========================================================= */

  const checkRisk = async () => {
    const value = Number(amount);

    /* ---------------------------------------------------------
       BASIC VALIDATION
    --------------------------------------------------------- */

    if (!receiver.trim() || !amount) {
      alert("Please enter receiver and amount.");
      return;
    }

    if (value <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }

    /* ---------------------------------------------------------
       CURRENT USER
    --------------------------------------------------------- */

    const currentUser = getCurrentUser();

    if (!currentUser?.email) {
      alert("Please login before checking payment risk.");
      return;
    }

    /* ---------------------------------------------------------
       TOKEN
    --------------------------------------------------------- */

    const token = localStorage.getItem(
      "smartPayToken"
    );

    if (!token) {
      alert(
        "Your login session has expired. Please login again."
      );
      return;
    }

    setLoading(true);

    /* =======================================================
       RISK CALCULATION
    ======================================================= */

    let score = 10;

    let warnings = [];

    /* =======================================================
       AMOUNT CHECK
       
       ₹0 - ₹9,999       → LOW
       ₹10,000 - ₹49,999 → LOW-MEDIUM
       ₹50,000 - ₹99,999 → MEDIUM
       ₹1,00,000+        → HIGH
    ======================================================= */

    if (value >= 100000) {
      score += 90;

      warnings.push(
        "Very high transaction amount detected."
      );

    } else if (value >= 50000) {
      score += 50;

      warnings.push(
        "High transaction amount detected."
      );

    } else if (value >= 10000) {
      score += 20;

      warnings.push(
        "Transaction amount is relatively high."
      );
    }

    /* =======================================================
       RECEIVER CHECK
    ======================================================= */

    const suspiciousWords = [
      "unknown",
      "winner",
      "lottery",
      "reward",
      "urgent",
      "prize",
    ];

    const lowerReceiver =
      receiver.trim().toLowerCase();

    suspiciousWords.forEach((word) => {
      if (lowerReceiver.includes(word)) {
        score += 20;

        warnings.push(
          `Suspicious keyword detected: "${word}"`
        );
      }
    });

    /* =======================================================
       MESSAGE CHECK
    ======================================================= */

    const lowerMessage =
      message.trim().toLowerCase();

    if (
      lowerMessage.includes("otp") ||
      lowerMessage.includes("pin") ||
      lowerMessage.includes("urgent")
    ) {
      score += 25;

      warnings.push(
        "Message contains a potentially risky request."
      );
    }

    /* =======================================================
       LIMIT SCORE
    ======================================================= */

    if (score > 100) {
      score = 100;
    }

    /* =======================================================
       RISK LEVEL
       
       0 - 29     → LOW
       30 - 49    → LOW-MEDIUM
       50 - 99    → MEDIUM
       100        → HIGH
    ======================================================= */

    let level = "LOW";

    if (score >= 100) {
      level = "HIGH";

    } else if (score >= 50) {
      level = "MEDIUM";

    } else if (score >= 30) {
      level = "LOW-MEDIUM";
    }

    /* =======================================================
       FINAL RISK RESULT
    ======================================================= */

    const riskResult = {
      score,
      level,
      warnings,
    };

    setResult(riskResult);

    /* =======================================================
       SAVE TRANSACTION TO MONGODB
    ======================================================= */

    try {
      const response = await fetch(
        "https://smart-pay-safe.onrender.com/api/transactions",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            receiver: receiver.trim(),

            type: "Risk Check",

            amount: value,

            status:
              level === "LOW"
                ? "Safe"
                : "Review",

            riskLevel: level,

            // Score saved in database
            // but NOT displayed to the user.
            riskScore: score,

            message: message.trim(),

            warnings,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Transaction save failed:",
          data
        );

        alert(
          data.message ||
            "Risk checked, but transaction could not be saved."
        );

        return;
      }

      /* ---------------------------------------------------------
         UPDATE OTHER COMPONENTS
      --------------------------------------------------------- */

      window.dispatchEvent(
        new Event("transactionsUpdated")
      );

    } catch (error) {
      console.error(
        "Transaction API error:",
        error
      );

      alert(
        "Risk was calculated, but the transaction could not be saved to the server."
      );

    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     CLEAR RESULT
  ========================================================= */

  const clearResult = () => {
    setReceiver("");
    setAmount("");
    setMessage("");
    setResult(null);
  };

  /* =========================================================
     RISK TITLE
  ========================================================= */

  const getRiskTitle = () => {
    if (!result) return "";

    if (result.level === "LOW") {
      return "Payment looks safe";
    }

    if (result.level === "LOW-MEDIUM") {
      return "Payment needs attention";
    }

    if (result.level === "MEDIUM") {
      return "Payment needs attention";
    }

    return "High risk payment detected";
  };

  /* =========================================================
     RISK DESCRIPTION
  ========================================================= */

  const getRiskDescription = () => {
    if (!result) return "";

    if (result.level === "LOW") {
      return "No major risk indicators were detected for this payment.";
    }

    if (result.level === "LOW-MEDIUM") {
      return "The transaction amount is relatively high. Please verify the payment details before proceeding.";
    }

    if (result.level === "MEDIUM") {
      return "A higher transaction amount or other risk indicators were detected. Please verify the payment details carefully.";
    }

    return "A very high transaction amount or multiple risk indicators were detected. Verify the receiver before proceeding.";
  };

  /* =========================================================
     RECOMMENDATION
  ========================================================= */

  const getRecommendation = () => {
    if (!result) return "";

    if (result.level === "LOW") {
      return "You can proceed, but always verify the receiver before paying.";
    }

    if (result.level === "LOW-MEDIUM") {
      return "Verify the receiver and payment details carefully before making the payment.";
    }

    if (result.level === "MEDIUM") {
      return "Verify the receiver carefully and confirm the payment details before proceeding.";
    }

    return "Do not proceed until you verify the receiver and payment details.";
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="risk-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="page-header">

        <div>

          <p className="page-label">
            PAYMENT SECURITY
          </p>

          <h2>
            Payment Risk Checker
          </h2>

          <p className="page-subtitle">
            Analyze a payment before sending money.
          </p>

        </div>

        <div className="protection-badge">

          <span></span>

          Protection Active

        </div>

      </div>

      {/* =====================================================
          RISK GRID
      ===================================================== */}

      <div className="risk-grid">

        {/* ===================================================
            INPUT CARD
        =================================================== */}

        <div className="risk-card">

          <div className="risk-card-header">

            <div className="risk-icon">

              <ShieldCheck />

            </div>

            <div>

              <h3>
                Check Payment Safety
              </h3>

              <p>
                Enter payment details to analyze
                possible risks.
              </p>

            </div>

          </div>

          <div className="risk-form">

            {/* =================================================
                RECEIVER
            ================================================= */}

            <label>
              Receiver / UPI ID
            </label>

            <div className="input-wrapper">

              <Search size={18} />

              <input
                type="text"
                placeholder="Example: Amazon Pay"
                value={receiver}
                onChange={(e) =>
                  setReceiver(e.target.value)
                }
              />

            </div>

            {/* =================================================
                AMOUNT
            ================================================= */}

            <label>
              Payment Amount
            </label>

            <div className="input-wrapper">

              <span className="rupee-symbol">
                ₹
              </span>

              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                min="1"
                onChange={(e) =>
                  setAmount(e.target.value)
                }
              />

            </div>

            {/* =================================================
                MESSAGE
            ================================================= */}

            <label>

              Payment Message

              <span>
                Optional
              </span>

            </label>

            <textarea
              placeholder="Example: Payment for product..."
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
            />

            {/* =================================================
                CHECK BUTTON
            ================================================= */}

            <button
              type="button"
              className="risk-check-btn"
              onClick={checkRisk}
              disabled={loading}
            >

              <ShieldCheck size={18} />

              {loading
                ? "Checking Payment..."
                : "Check Payment Risk"}

            </button>

          </div>

        </div>

        {/* ===================================================
            RESULT CARD
        =================================================== */}

        <div className="risk-card result-card">

          {!result ? (

            /* =================================================
               EMPTY RESULT
            ================================================= */

            <div className="empty-result">

              <div className="empty-result-icon">

                <ShieldCheck size={38} />

              </div>

              <h3>
                Ready to Analyze
              </h3>

              <p>
                Enter payment details and click
                "Check Payment Risk" to see your
                safety result.
              </p>

            </div>

          ) : (

            /* =================================================
               RISK RESULT
            ================================================= */

            <div className="risk-result">

              {/* =================================================
                  RESULT HEADER
              ================================================= */}

              <div className="result-header">

                {result.level === "HIGH" ? (
                  <AlertTriangle size={22} />
                ) : (
                  <CheckCircle2 size={22} />
                )}

                <span>
                  Analysis Complete
                </span>

              </div>

              {/* =================================================
                  RISK LEVEL
              ================================================= */}

              <div
                className={`risk-level ${result.level
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >

                {result.level === "LOW" &&
                  "LOW RISK"}

                {result.level === "LOW-MEDIUM" &&
                  "LOW-MEDIUM RISK"}

                {result.level === "MEDIUM" &&
                  "MEDIUM RISK"}

                {result.level === "HIGH" &&
                  "HIGH RISK"}

              </div>

              {/* =================================================
                  RESULT TITLE
              ================================================= */}

              <h3>
                {getRiskTitle()}
              </h3>

              {/* =================================================
                  RESULT DESCRIPTION
              ================================================= */}

              <p className="risk-description">
                {getRiskDescription()}
              </p>

              {/* =================================================
                  RISK WARNINGS
              ================================================= */}

              {result.warnings.length > 0 && (

                <div className="risk-warnings">

                  <h4>

                    <AlertTriangle size={17} />

                    Risk Factors

                  </h4>

                  {result.warnings.map(
                    (warning, index) => (

                      <div
                        className="risk-warning"
                        key={index}
                      >

                        <AlertTriangle size={14} />

                        {warning}

                      </div>

                    )
                  )}

                </div>

              )}

              {/* =================================================
                  SAFE MESSAGE
              ================================================= */}

              {result.warnings.length === 0 && (

                <div className="safe-message">

                  <CheckCircle2 size={17} />

                  No major risk indicators
                  detected.

                </div>

              )}

              {/* =================================================
                  RECOMMENDATION
              ================================================= */}

              <div className="recommendation">

                <strong>
                  Recommendation
                </strong>

                <p>
                  {getRecommendation()}
                </p>

              </div>

              {/* =================================================
                  DATABASE SAVE MESSAGE
              ================================================= */}

              <div className="saved-check-message">

                <CheckCircle2 size={16} />

                Risk check saved to your
                secure transaction history.

              </div>

              {/* =================================================
                  CHECK AGAIN BUTTON
              ================================================= */}

              <button
                type="button"
                className="check-again-btn"
                onClick={clearResult}
              >
                Check Another Payment
              </button>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default RiskChecker;