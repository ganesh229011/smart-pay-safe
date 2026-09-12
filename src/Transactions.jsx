import { useEffect, useState } from "react";
import {
  CreditCard,
  Search,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  Clock3,
} from "lucide-react";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= LOAD TRANSACTIONS FROM MONGODB ================= */

  const loadTransactions = async () => {
    const token =
      localStorage.getItem("smartPayToken");

    if (!token) {
      setTransactions([]);
      setLoading(false);
      setError(
        "Please login to view your transaction history."
      );
      return;
    }

    setLoading(true);
    setError("");

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
          "Transaction fetch failed:",
          data
        );

        setTransactions([]);
        setError(
          data.message ||
            "Unable to load transaction history."
        );

        return;
      }

      if (Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error(
        "Transaction API error:",
        error
      );

      setTransactions([]);
      setError(
        "Unable to connect to the payment server."
      );
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
      setSearch("");
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

  /* ================= SEARCH ================= */

  const searchText =
    search.trim().toLowerCase();

  const filteredTransactions =
    transactions.filter(
      (transaction) => {
        const receiver =
          transaction.receiver
            ?.toLowerCase() || "";

        const type =
          transaction.type
            ?.toLowerCase() || "";

        const status =
          transaction.status
            ?.toLowerCase() || "";

        return (
          receiver.includes(searchText) ||
          type.includes(searchText) ||
          status.includes(searchText)
        );
      }
    );

  /* ================= TOTAL AMOUNT ================= */

  const totalAmount =
    transactions.reduce(
      (total, transaction) =>
        total +
        Number(
          transaction.amount || 0
        ),
      0
    );

  /* ================= SAFE COUNT ================= */

  const safeCount =
    transactions.filter(
      (transaction) =>
        transaction.status === "Safe"
    ).length;

  /* ================= REVIEW COUNT ================= */

  const reviewCount =
    transactions.filter(
      (transaction) =>
        transaction.status === "Review"
    ).length;

  /* ================= DATE FORMAT ================= */

  const formatDate = (transaction) => {
    if (!transaction.createdAt) {
      return "Recent";
    }

    const date = new Date(
      transaction.createdAt
    );

    if (Number.isNaN(date.getTime())) {
      return "Recent";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* ================= TIME FORMAT ================= */

  const formatTime = (transaction) => {
    if (!transaction.createdAt) {
      return "";
    }

    const date = new Date(
      transaction.createdAt
    );

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  return (
    <div className="transactions-page">

      {/* ================= HEADER ================= */}

      <div className="page-header">

        <div>
          <p className="page-label">
            PAYMENT ACTIVITY
          </p>

          <h2>
            Transaction History
          </h2>

          <p className="page-subtitle">
            Review your digital payment activity and
            safety status.
          </p>
        </div>

        <div className="transaction-count">
          {transactions.length} Transactions
        </div>

      </div>

      {/* ================= SUMMARY ================= */}

      <div className="transaction-stats">

        {/* TOTAL TRANSACTIONS */}

        <div className="transaction-stat">

          <div className="transaction-stat-icon">
            <CreditCard size={20} />
          </div>

          <div>
            <span>
              TOTAL TRANSACTIONS
            </span>

            <strong>
              {transactions.length}
            </strong>
          </div>

        </div>

        {/* SAFE PAYMENTS */}

        <div className="transaction-stat">

          <div className="transaction-stat-icon safe-icon">
            <ShieldCheck size={20} />
          </div>

          <div>
            <span>
              SAFE PAYMENTS
            </span>

            <strong>
              {safeCount}
            </strong>
          </div>

        </div>

        {/* NEEDS REVIEW */}

        <div className="transaction-stat">

          <div className="transaction-stat-icon warning-icon">
            <AlertTriangle size={20} />
          </div>

          <div>
            <span>
              NEEDS REVIEW
            </span>

            <strong>
              {reviewCount}
            </strong>
          </div>

        </div>

        {/* TOTAL AMOUNT */}

        <div className="transaction-stat">

          <div className="transaction-stat-icon">
            <ArrowUpRight size={20} />
          </div>

          <div>
            <span>
              TOTAL AMOUNT
            </span>

            <strong>
              ₹
              {totalAmount.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

        </div>

      </div>

      {/* ================= TRANSACTION PANEL ================= */}

      <div className="transactions-panel">

        {/* TOOLBAR */}

        <div className="transactions-toolbar">

          <div>
            <h3>
              Recent Transactions
            </h3>

            <p>
              Your latest payment activity and risk checks
            </p>
          </div>

          {/* SEARCH */}

          <div className="transaction-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search receiver..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>

        </div>

        {/* ================= TABLE HEADER ================= */}

        <div className="transaction-table-header">

          <span>
            PAYMENT
          </span>

          <span>
            DATE
          </span>

          <span>
            AMOUNT
          </span>

          <span>
            STATUS
          </span>

        </div>

        {/* ================= LOADING ================= */}

        {loading ? (

          <div className="no-transactions">

            <ShieldCheck size={30} />

            <h3>
              Loading transactions...
            </h3>

            <p>
              Fetching your secure payment history.
            </p>

          </div>

        ) : error ? (

          /* ================= ERROR ================= */

          <div className="no-transactions">

            <AlertTriangle size={30} />

            <h3>
              Unable to load transactions
            </h3>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={loadTransactions}
              style={{
                marginTop: "14px",
                padding: "10px 18px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>

          </div>

        ) : (

          /* ================= TRANSACTION LIST ================= */

          <div className="transaction-table">

            {filteredTransactions.length === 0 ? (

              <div className="no-transactions">

                <Search size={30} />

                <h3>
                  No transactions found
                </h3>

                <p>
                  {search
                    ? "Try searching with another receiver or payment type."
                    : "Your transaction activity will appear here."}
                </p>

              </div>

            ) : (

              filteredTransactions.map(
                (transaction) => (

                  <div
                    className="transaction-table-row"
                    key={
                      transaction._id
                    }
                  >

                    {/* PAYMENT */}

                    <div className="transaction-payment">

                      <div className="transaction-avatar">
                        <CreditCard size={18} />
                      </div>

                      <div>

                        <strong>
                          {transaction.receiver ||
                            "Unknown Receiver"}
                        </strong>

                        <span>
                          {transaction.type ||
                            "Payment"}

                          {transaction.riskLevel && (
                            <>
                              {" • "}
                              Risk:{" "}
                              {transaction.riskScore ??
                                0}
                              /100
                            </>
                          )}
                        </span>

                      </div>

                    </div>

                    {/* DATE */}

                    <span className="transaction-date">

                      <span>
                        {formatDate(
                          transaction
                        )}
                      </span>

                      <small className="transaction-time">
                        <Clock3 size={12} />

                        {formatTime(
                          transaction
                        )}
                      </small>

                    </span>

                    {/* AMOUNT */}

                    <strong className="transaction-money">

                      ₹
                      {Number(
                        transaction.amount || 0
                      ).toLocaleString(
                        "en-IN"
                      )}

                    </strong>

                    {/* STATUS */}

                    <span
                      className={
                        transaction.status ===
                        "Safe"
                          ? "status-pill safe"
                          : "status-pill review"
                      }
                    >

                      {transaction.status ===
                      "Safe" ? (
                        <ShieldCheck
                          size={13}
                        />
                      ) : (
                        <AlertTriangle
                          size={13}
                        />
                      )}

                      {transaction.status ||
                        "Review"}

                    </span>

                  </div>

                )
              )

            )}

          </div>

        )}

      </div>

      {/* ================= SECURITY NOTE ================= */}

      <div className="transaction-security-note">

        <ShieldCheck size={20} />

        <div>

          <strong>
            Payment Safety Reminder
          </strong>

          <p>
            Always verify the receiver before sending
            money. Never share your OTP, UPI PIN or
            banking password.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Transactions;