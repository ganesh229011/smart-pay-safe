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

  const checkRisk = () => {
    const value = Number(amount);

    if (!receiver || !amount) {
      alert("Please enter receiver and amount.");
      return;
    }

    let score = 10;
    let warnings = [];

    if (value >= 10000) {
      score += 35;
      warnings.push("High transaction amount detected.");
    } else if (value >= 5000) {
      score += 20;
      warnings.push("Transaction amount is relatively high.");
    }

    const suspiciousWords = [
      "unknown",
      "winner",
      "lottery",
      "reward",
      "urgent",
      "prize",
    ];

    const lowerReceiver = receiver.toLowerCase();

    suspiciousWords.forEach((word) => {
      if (lowerReceiver.includes(word)) {
        score += 20;
        warnings.push(
          `Suspicious keyword detected: "${word}"`
        );
      }
    });

    const lowerMessage = message.toLowerCase();

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

    if (score > 100) {
      score = 100;
    }

    let level = "LOW";

    if (score >= 60) {
      level = "HIGH";
    } else if (score >= 30) {
      level = "MEDIUM";
    }

    const riskResult = {
      score,
      level,
      warnings,
    };

    setResult(riskResult);

    /* SAVE TRANSACTION */

    const existingTransactions =
      JSON.parse(
        localStorage.getItem("smartPayTransactions")
      ) || [];

    const newTransaction = {
      id: Date.now(),
      receiver,
      type: "Risk Check",
      amount: value,
      status: level === "LOW" ? "Safe" : "Review",
      riskLevel: level,
      riskScore: score,
      message,
      warnings,
      date: new Date().toLocaleDateString("en-IN"),
      time: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    localStorage.setItem(
      "smartPayTransactions",
      JSON.stringify([
        newTransaction,
        ...existingTransactions,
      ])
    );

    /* UPDATE DASHBOARD WITHOUT REFRESH */

    window.dispatchEvent(
      new Event("transactionsUpdated")
    );
  };

  return (
    <div className="risk-page">

      <div className="page-header">
        <div>
          <p className="page-label">
            PAYMENT SECURITY
          </p>

          <h2>Payment Risk Checker</h2>

          <p className="page-subtitle">
            Analyze a payment before sending money.
          </p>
        </div>

        <div className="protection-badge">
          <span></span>
          Protection Active
        </div>
      </div>


      <div className="risk-grid">

        {/* FORM */}

        <div className="risk-card">

          <div className="risk-card-header">
            <div className="risk-icon">
              <ShieldCheck />
            </div>

            <div>
              <h3>Check Payment Safety</h3>

              <p>
                Enter payment details to analyze
                possible risks.
              </p>
            </div>
          </div>


          <div className="risk-form">

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
                onChange={(e) =>
                  setAmount(e.target.value)
                }
              />
            </div>


            <label>
              Payment Message
              <span>Optional</span>
            </label>

            <textarea
              placeholder="Example: Payment for product..."
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
            />


            <button
              className="risk-check-btn"
              onClick={checkRisk}
            >
              <ShieldCheck size={18} />
              Check Payment Risk
            </button>

          </div>

        </div>


        {/* RESULT */}

        <div className="risk-card result-card">

          {!result ? (

            <div className="empty-result">

              <div className="empty-result-icon">
                <ShieldCheck size={38} />
              </div>

              <h3>Ready to Analyze</h3>

              <p>
                Enter payment details and click
                "Check Payment Risk" to see your
                safety result.
              </p>

            </div>

          ) : (

            <div className="risk-result">

              <div className="result-header">
                <CheckCircle2 size={22} />

                <span>
                  Analysis Complete
                </span>
              </div>


              <div className="risk-score-display">

                <strong>
                  {result.score}
                </strong>

                <span>
                  /100
                </span>

              </div>


              <div
                className={`risk-level ${result.level.toLowerCase()}`}
              >
                {result.level} RISK
              </div>


              <h3>
                {result.level === "LOW"
                  ? "Payment looks safe"
                  : result.level === "MEDIUM"
                  ? "Payment needs attention"
                  : "High risk payment detected"}
              </h3>


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


              {result.warnings.length === 0 && (

                <div className="safe-message">

                  <CheckCircle2 size={17} />

                  No major risk indicators
                  detected.

                </div>

              )}


              <div className="recommendation">

                <strong>
                  Recommendation
                </strong>

                <p>
                  {result.level === "LOW"
                    ? "You can proceed, but always verify the receiver before paying."
                    : "Verify the receiver carefully and avoid sharing OTP, PIN or passwords."}
                </p>

              </div>


              <div className="saved-check-message">

                <CheckCircle2 size={16} />

                Risk check saved to transaction
                history.

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default RiskChecker;