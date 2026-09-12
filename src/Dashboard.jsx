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

  /* ================= CURRENT USER ================= */

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

  /* ================= USER TRANSACTION KEY ================= */

  const getTransactionStorageKey = () => {
    const currentUser = getCurrentUser();

    if (!currentUser?.email) {
      return null;
    }

    return `smartPayTransactions_${currentUser.email}`;
  };

  /* ================= LOAD TRANSACTIONS ================= */

  useEffect(() => {
    const loadTransactions = () => {
      const storageKey =
        getTransactionStorageKey();

      if (!storageKey) {
        setTransactions([]);
        return;
      }

      const saved =
        localStorage.getItem(storageKey);

      if (!saved) {
        setTransactions([]);
        return;
      }

      try {
        const parsedTransactions =
          JSON.parse(saved);

        if (Array.isArray(parsedTransactions)) {
          setTransactions(parsedTransactions);
        } else {
          setTransactions([]);
        }
      } catch (error) {
        console.error(
          "Failed to load transactions:",
          error
        );

        setTransactions([]);
      }
    };

    /* Initial load */
    loadTransactions();

    /* Browser tab/storage updates */
    window.addEventListener(
      "storage",
      loadTransactions
    );

    /* Risk Checker updates */
    window.addEventListener(
      "transactionsUpdated",
      loadTransactions
    );

    /* Login / Logout updates */
    window.addEventListener(
      "authUpdated",
      loadTransactions
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadTransactions
      );

      window.removeEventListener(
        "transactionsUpdated",
        loadTransactions
      );

      window.removeEventListener(
        "authUpdated",
        loadTransactions
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

  /* Risk Check entries */
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

          {recentTransactions.length === 0 ? (

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
                  key={transaction.id}
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