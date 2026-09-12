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

  /* ================= DEMO TRANSACTIONS ================= */

  const demoTransactions = [
    {
      id: 1,
      receiver: "Amazon Pay",
      type: "Shopping",
      amount: 1299,
      status: "Safe",
      date: "11 Sep 2026",
      time: "10:30 AM",
    },
    {
      id: 2,
      receiver: "Swiggy",
      type: "Food",
      amount: 540,
      status: "Safe",
      date: "10 Sep 2026",
      time: "08:45 PM",
    },
    {
      id: 3,
      receiver: "Unknown UPI",
      type: "Payment",
      amount: 4500,
      status: "Review",
      riskLevel: "MEDIUM",
      riskScore: 30,
      date: "09 Sep 2026",
      time: "02:15 PM",
    },
    {
      id: 4,
      receiver: "Netflix",
      type: "Subscription",
      amount: 649,
      status: "Safe",
      date: "08 Sep 2026",
      time: "11:20 AM",
    },
  ];

  /* ================= LOAD TRANSACTIONS ================= */

  useEffect(() => {
    const loadTransactions = () => {
      const saved = localStorage.getItem("smartPayTransactions");

      if (!saved) {
        setTransactions(demoTransactions);

        localStorage.setItem(
          "smartPayTransactions",
          JSON.stringify(demoTransactions)
        );

        return;
      }

      try {
        const parsedTransactions = JSON.parse(saved);

        if (Array.isArray(parsedTransactions)) {
          setTransactions(parsedTransactions);
        } else {
          setTransactions(demoTransactions);
        }
      } catch (error) {
        console.error(
          "Failed to load transactions:",
          error
        );

        setTransactions(demoTransactions);
      }
    };

    loadTransactions();

    /* Refresh from other browser tabs/windows */
    window.addEventListener("storage", loadTransactions);

    /* Refresh immediately after Risk Checker updates data */
    window.addEventListener(
      "transactionsUpdated",
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
    };
  }, []);

  /* ================= SEARCH ================= */

  const searchText = search.trim().toLowerCase();

  const filteredTransactions = transactions.filter(
    (transaction) => {
      const receiver =
        transaction.receiver?.toLowerCase() || "";

      const type =
        transaction.type?.toLowerCase() || "";

      const status =
        transaction.status?.toLowerCase() || "";

      return (
        receiver.includes(searchText) ||
        type.includes(searchText) ||
        status.includes(searchText)
      );
    }
  );

  /* ================= TOTAL AMOUNT ================= */

  const totalAmount = transactions.reduce(
    (total, transaction) =>
      total + Number(transaction.amount || 0),
    0
  );

  /* ================= SAFE COUNT ================= */

  const safeCount = transactions.filter(
    (transaction) => transaction.status === "Safe"
  ).length;

  /* ================= REVIEW COUNT ================= */

  const reviewCount = transactions.filter(
    (transaction) => transaction.status === "Review"
  ).length;

  return (
    <div className="transactions-page">

      {/* ================= HEADER ================= */}

      <div className="page-header">

        <div>
          <p className="page-label">
            PAYMENT ACTIVITY
          </p>

          <h2>Transaction History</h2>

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
            <span>TOTAL TRANSACTIONS</span>

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
            <span>SAFE PAYMENTS</span>

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
            <span>NEEDS REVIEW</span>

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
            <span>TOTAL AMOUNT</span>

            <strong>
              ₹{totalAmount.toLocaleString("en-IN")}
            </strong>
          </div>

        </div>

      </div>


      {/* ================= TRANSACTION PANEL ================= */}

      <div className="transactions-panel">

        {/* TOOLBAR */}

        <div className="transactions-toolbar">

          <div>
            <h3>Recent Transactions</h3>

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
                setSearch(event.target.value)
              }
            />

          </div>

        </div>


        {/* ================= TABLE HEADER ================= */}

        <div className="transaction-table-header">

          <span>PAYMENT</span>

          <span>DATE</span>

          <span>AMOUNT</span>

          <span>STATUS</span>

        </div>


        {/* ================= TRANSACTION LIST ================= */}

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
                  key={transaction.id}
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
                      {transaction.date ||
                        "Recent"}
                    </span>

                    {transaction.time && (
                      <small className="transaction-time">
                        <Clock3 size={12} />
                        {transaction.time}
                      </small>
                    )}

                  </span>


                  {/* AMOUNT */}

                  <strong className="transaction-money">

                    ₹
                    {Number(
                      transaction.amount || 0
                    ).toLocaleString("en-IN")}

                  </strong>


                  {/* STATUS */}

                  <span
                    className={
                      transaction.status === "Safe"
                        ? "status-pill safe"
                        : "status-pill review"
                    }
                  >

                    {transaction.status === "Safe" ? (
                      <ShieldCheck size={13} />
                    ) : (
                      <AlertTriangle size={13} />
                    )}

                    {transaction.status ||
                      "Review"}

                  </span>

                </div>

              )
            )

          )}

        </div>

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