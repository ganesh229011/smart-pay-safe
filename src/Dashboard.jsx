import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CreditCard,
  Activity,
  ArrowUpRight,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD TRANSACTIONS FROM MONGODB ================= */

  const loadTransactions = async () => {
    const token =
      localStorage.getItem("smartPayToken");

    if (!token) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://smart-pay-safe.onrender.com/api/transactions",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Dashboard transaction fetch failed:",
          data
        );

        setTransactions([]);
        return;
      }

      if (Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error(
        "Dashboard transaction API error:",
        error
      );

      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    loadTransactions();

    /* Refresh after Risk Checker saves transaction */
    const handleTransactionUpdate = () => {
      loadTransactions();
    };

    /* Refresh after login/logout */
    const handleAuthUpdate = () => {
      loadTransactions();
    };

    window.addEventListener(
      "transactionsUpdated",
      handleTransactionUpdate
    );

    window.addEventListener(
      "authUpdated",
      handleAuthUpdate
    );

    return () => {
      window.removeEventListener(
        "transactionsUpdated",
        handleTransactionUpdate
      );

      window.removeEventListener(
        "authUpdated",
        handleAuthUpdate
      );
    };
  }, []);

  /* ================= STATS ================= */

  const totalTransactions =
    transactions.length;

  const safeTransactions =
    transactions.filter(
      (transaction) =>
        transaction.status === "Safe"
    ).length;

  const reviewTransactions =
    transactions.filter(
      (transaction) =>
        transaction.status === "Review"
    ).length;

  /* ================= RISK CHECKS ================= */

  const riskChecks =
    transactions.filter(
      (transaction) =>
        transaction.type === "Risk Check" ||
        transaction.riskLevel
    ).length;

  /* ================= SAFETY SCORE ================= */

  const safetyScore =
    totalTransactions === 0
      ? 92
      : Math.max(
          0,
          Math.min(
            100,
            Math.round(
              (safeTransactions /
                totalTransactions) *
                100
            )
          )
        );

  /* ================= SAFETY LEVEL ================= */

  let safetyLevel = "Excellent";

  if (safetyScore < 80) {
    safetyLevel = "Good";
  }

  if (safetyScore < 60) {
    safetyLevel = "Needs Attention";
  }

  /* ================= RECENT TRANSACTIONS ================= */

  const recentTransactions =
    transactions.slice(0, 5);

  return (
    <div className="dashboard-page">

      {/* ================= PAGE HEADER ================= */}

      <div className="page-header">

        <div>

          <p className="page-label">
            OVERVIEW
          </p>

          <h2>
            Payment Dashboard
          </h2>

          <p className="page-subtitle">
            Monitor your payment safety and recent activity.
          </p>

        </div>

        <div className="protection-badge">

          <span></span>

          Protection Active

        </div>

      </div>

      {/* ================= STAT CARDS ================= */}

      <div className="dashboard-stats">

        {/* SAFETY SCORE */}

        <div className="dashboard-card">

          <div className="card-top">

            <span>
              SAFETY SCORE
            </span>

            <ShieldCheck />

          </div>

          <h3>

            {safetyScore}

            <span>
              /100
            </span>

          </h3>

          <div className="stat-change positive">

            <TrendingUp size={14} />

            {safetyLevel}

          </div>

        </div>

        {/* TRANSACTIONS */}

        <div className="dashboard-card">

          <div className="card-top">

            <span>
              TRANSACTIONS
            </span>

            <CreditCard />

          </div>

          <h3>
            {totalTransactions}
          </h3>

          <div className="stat-change">
            Total activity
          </div>

        </div>

        {/* RISK CHECKS */}

        <div className="dashboard-card">

          <div className="card-top">

            <span>
              RISK CHECKS
            </span>

            <Activity />

          </div>

          <h3>
            {riskChecks}
          </h3>

          <div className="stat-change positive">

            {safeTransactions}
            {" "}
            safe payments

          </div>

        </div>

        {/* ALERTS / REVIEW */}

        <div className="dashboard-card warning-card">

          <div className="card-top">

            <span>
              ALERTS
            </span>

            <AlertTriangle />

          </div>

          <h3>

            {String(
              reviewTransactions
            ).padStart(2, "0")}

          </h3>

          <div className="stat-change warning">

            {reviewTransactions > 0
              ? "Review required"
              : "No issues detected"}

          </div>

        </div>

      </div>

      {/* ================= MAIN GRID ================= */}

      <div className="dashboard-grid">

        {/* SAFETY SCORE */}

        <div className="dashboard-panel safety-panel">

          <div className="panel-header">

            <div>

              <p>
                SECURITY STATUS
              </p>

              <h3>
                Your Safety Score
              </h3>

            </div>

            <ShieldCheck className="panel-icon" />

          </div>

          <div className="score-area">

            <div className="score-circle">

              <strong>
                {safetyScore}
              </strong>

              <span>
                /100
              </span>

            </div>

            <div className="score-info">

              <h4>
                {safetyLevel}
              </h4>

              <p>

                {safetyScore >= 80
                  ? "Your payment security is currently strong."
                  : safetyScore >= 60
                  ? "Your payment security is good, but review flagged payments."
                  : "Some transactions need your attention."}

              </p>

              <div className="score-bar">

                <div
                  style={{
                    width: `${safetyScore}%`,
                  }}
                ></div>

              </div>

              <small>

                Based on{" "}
                {totalTransactions}{" "}
                transaction
                {totalTransactions !== 1
                  ? "s"
                  : ""}

              </small>

            </div>

          </div>

        </div>

        {/* QUICK ACTIONS */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>

              <p>
                QUICK ACTIONS
              </p>

              <h3>
                Payment Protection
              </h3>

            </div>

          </div>

          <div className="quick-actions">

            {/* RISK CHECKER */}

            <button
              type="button"
              onClick={() =>
                navigate("/risk-checker")
              }
            >

              <div>
                <ShieldCheck />
              </div>

              <span>

                Check Payment Risk

                <small>
                  Analyze before paying
                </small>

              </span>

              <ArrowUpRight />

            </button>

            {/* FRAUD ALERTS */}

            <button
              type="button"
              onClick={() =>
                navigate("/fraud-alerts")
              }
            >

              <div>
                <AlertTriangle />
              </div>

              <span>

                View Fraud Alerts

                <small>
                  See recent warnings
                </small>

              </span>

              <ArrowUpRight />

            </button>

          </div>

        </div>

      </div>

      {/* ================= RECENT ACTIVITY ================= */}

      <div className="dashboard-panel recent-panel">

        <div className="panel-header">

          <div>

            <p>
              ACTIVITY
            </p>

            <h3>
              Recent Transactions
            </h3>

          </div>

          <button
            type="button"
            className="view-all"
            onClick={() =>
              navigate("/transactions")
            }
          >
            View all
          </button>

        </div>

        <div className="transaction-list">

          {loading ? (

            <div className="dashboard-empty">

              <ShieldCheck size={28} />

              <h4>
                Loading transactions...
              </h4>

              <p>
                Fetching your secure payment activity.
              </p>

            </div>

          ) : recentTransactions.length === 0 ? (

            <div className="dashboard-empty">

              <CreditCard size={28} />

              <h4>
                No transactions yet
              </h4>

              <p>
                Run a payment risk check to start
                building your activity.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/risk-checker")
                }
              >
                Check Payment Risk
              </button>

            </div>

          ) : (

            recentTransactions.map(
              (transaction) => (

                <Transaction
                  key={transaction._id}
                  receiver={
                    transaction.receiver
                  }
                  type={
                    transaction.type
                  }
                  amount={
                    transaction.amount
                  }
                  status={
                    transaction.status
                  }
                  riskScore={
                    transaction.riskScore
                  }
                />

              )
            )

          )}

        </div>

      </div>

    </div>
  );
}

/* ================= TRANSACTION COMPONENT ================= */

function Transaction({
  receiver,
  type,
  amount,
  status,
  riskScore,
}) {
  return (
    <div className="transaction-row">

      <div className="transaction-icon">

        <CreditCard size={18} />

      </div>

      <div className="transaction-name">

        <strong>
          {receiver || "Unknown Receiver"}
        </strong>

        <span>

          {type || "Payment"}

          {riskScore !== undefined && (
            <>
              {" • Risk "}
              {riskScore}
              /100
            </>
          )}

        </span>

      </div>

      <strong className="transaction-amount">

        ₹
        {Number(
          amount || 0
        ).toLocaleString("en-IN")}

      </strong>

      <span
        className={
          status === "Safe"
            ? "transaction-status safe"
            : "transaction-status review"
        }
      >

        {status === "Safe" ? (
          <ShieldCheck size={13} />
        ) : (
          <AlertTriangle size={13} />
        )}

        {status || "Review"}

      </span>

    </div>
  );
}

export default Dashboard;