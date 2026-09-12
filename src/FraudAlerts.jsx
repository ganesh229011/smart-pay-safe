import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ShieldAlert,
  Smartphone,
  QrCode,
  PhoneCall,
  Gift,
  MonitorSmartphone,
  KeyRound,
  CheckCircle2,
  ChevronDown,
  Search,
  SlidersHorizontal,
} from "lucide-react";

function FraudAlerts() {
  const [openAlert, setOpenAlert] = useState(null);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");

  /* ================= FRAUD ALERT DATA ================= */

  const alerts = [
    {
      id: 1,
      title: "Fake UPI Collect Request",
      category: "UPI Scam",
      severity: "High",
      icon: Smartphone,
      description:
        "Scammers may send a UPI collect request and ask you to approve it to receive money.",
      action:
        "Never approve an unknown collect request. Receiving money does not require entering your UPI PIN.",
    },
    {
      id: 2,
      title: "Fake Customer Care Call",
      category: "Phone Scam",
      severity: "High",
      icon: PhoneCall,
      description:
        "Fraudsters may pretend to be bank or payment-app support staff and ask for confidential information.",
      action:
        "Do not share OTP, UPI PIN, CVV or passwords. Contact support only through the official app or website.",
    },
    {
      id: 3,
      title: "Lottery & Reward Scam",
      category: "Reward Scam",
      severity: "Medium",
      icon: Gift,
      description:
        "Messages claiming that you have won a prize may contain malicious links or payment requests.",
      action:
        "Do not click unknown links or pay a fee to claim a prize you never entered for.",
    },
    {
      id: 4,
      title: "QR Code Payment Scam",
      category: "QR Scam",
      severity: "High",
      icon: QrCode,
      description:
        "A QR code can be used to request money from your account instead of sending money to you.",
      action:
        "Scan QR codes only when you understand the payment purpose. Always verify the receiver before confirming.",
    },
    {
      id: 5,
      title: "Screen Sharing Scam",
      category: "Remote Access",
      severity: "Critical",
      icon: MonitorSmartphone,
      description:
        "Fraudsters may ask you to install screen-sharing or remote-access applications.",
      action:
        "Never allow unknown people to control or view your device during a payment or banking session.",
    },
    {
      id: 6,
      title: "OTP & PIN Fraud",
      category: "Credential Theft",
      severity: "Critical",
      icon: KeyRound,
      description:
        "Scammers often create urgency and ask for OTPs, UPI PINs or passwords.",
      action:
        "Your OTP and UPI PIN are private. No genuine support representative should ask you to share them.",
    },
  ];

  /* ================= TOGGLE ALERT ================= */

  const toggleAlert = (id) => {
    setOpenAlert((currentId) =>
      currentId === id ? null : id
    );
  };

  /* ================= FILTER ALERTS ================= */

  const filteredAlerts = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return alerts.filter((alert) => {
      const matchesSearch =
        searchText === "" ||
        alert.title.toLowerCase().includes(searchText) ||
        alert.category.toLowerCase().includes(searchText) ||
        alert.description.toLowerCase().includes(searchText) ||
        alert.severity.toLowerCase().includes(searchText);

      const matchesSeverity =
        severityFilter === "All" ||
        alert.severity === severityFilter;

      return matchesSearch && matchesSeverity;
    });
  }, [search, severityFilter]);

  /* ================= COUNTS ================= */

  const criticalCount = alerts.filter(
    (alert) => alert.severity === "Critical"
  ).length;

  const highCount = alerts.filter(
    (alert) => alert.severity === "High"
  ).length;

  const mediumCount = alerts.filter(
    (alert) => alert.severity === "Medium"
  ).length;

  return (
    <div className="fraud-page">

      {/* ================= HEADER ================= */}

      <div className="page-heading">

        <div>
          <p className="section-label">
            SECURITY CENTER
          </p>

          <h2>Fraud Alerts</h2>

          <p className="page-description">
            Stay informed about common digital payment scams
            and learn how to protect yourself.
          </p>
        </div>

        <div className="alert-status">
          <ShieldAlert size={20} />
          <span>Protection Active</span>
        </div>

      </div>


      {/* ================= WARNING BANNER ================= */}

      <div className="fraud-banner">

        <div className="fraud-banner-icon">
          <AlertTriangle size={28} />
        </div>

        <div>
          <h3>Be alert before you pay</h3>

          <p>
            Fraudsters often use urgency, fear and attractive
            rewards to convince users to make unsafe payments.
          </p>
        </div>

      </div>


      {/* ================= STATS ================= */}

      <div className="fraud-stats">

        <div className="fraud-stat-card">
          <span>Active Alerts</span>
          <strong>{alerts.length}</strong>
        </div>

        <div className="fraud-stat-card">
          <span>Critical Threats</span>
          <strong>{criticalCount}</strong>
        </div>

        <div className="fraud-stat-card">
          <span>High Risk</span>
          <strong>{highCount}</strong>
        </div>

        <div className="fraud-stat-card safe-stat">
          <span>Your Status</span>
          <strong>Protected</strong>
        </div>

      </div>


      {/* ================= SECTION HEADER ================= */}

      <div className="fraud-section-header">

        <div>
          <p className="section-label">
            LATEST THREATS
          </p>

          <h3>
            Common Payment Scams
          </h3>
        </div>

        <span>
          {filteredAlerts.length} of {alerts.length} alerts
        </span>

      </div>


      {/* ================= SEARCH + FILTER ================= */}

      <div className="fraud-toolbar">

        <div className="fraud-search">

          <Search size={17} />

          <input
            type="text"
            aria-label="Search fraud alerts"
            placeholder="Search fraud alerts..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>


        <div className="fraud-filter">

          <SlidersHorizontal size={16} />

          <select
            aria-label="Filter fraud alerts by severity"
            value={severityFilter}
            onChange={(event) =>
              setSeverityFilter(event.target.value)
            }
          >
            <option value="All">All Severity</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
          </select>

        </div>

      </div>


      {/* ================= ALERT LIST ================= */}

      <div className="fraud-list">

        {filteredAlerts.length === 0 ? (

          <div className="fraud-empty">

            <Search size={32} />

            <h3>No alerts found</h3>

            <p>
              Try another search term or severity level.
            </p>

            {(search || severityFilter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSeverityFilter("All");
                }}
              >
                Clear Filters
              </button>
            )}

          </div>

        ) : (

          filteredAlerts.map((alert) => {

            const Icon = alert.icon;
            const isOpen = openAlert === alert.id;

            return (
              <div
                className={`fraud-card ${
                  isOpen ? "fraud-card-open" : ""
                }`}
                key={alert.id}
              >

                {/* ================= ALERT HEADER ================= */}

                <button
                  type="button"
                  className="fraud-card-main"
                  aria-expanded={isOpen}
                  onClick={() =>
                    toggleAlert(alert.id)
                  }
                >

                  <div className="fraud-icon">
                    <Icon size={22} />
                  </div>


                  <div className="fraud-card-content">

                    <div className="fraud-title-row">

                      <h4>
                        {alert.title}
                      </h4>

                      <span
                        className={`severity severity-${alert.severity.toLowerCase()}`}
                      >
                        {alert.severity}
                      </span>

                    </div>


                    <p>
                      {alert.description}
                    </p>


                    <span className="fraud-category">
                      {alert.category}
                    </span>

                  </div>


                  <ChevronDown
                    size={20}
                    className={`chevron ${
                      isOpen ? "rotate" : ""
                    }`}
                  />

                </button>


                {/* ================= DETAILS ================= */}

                {isOpen && (

                  <div className="fraud-action">

                    <CheckCircle2 size={20} />

                    <div>

                      <strong>
                        What you should do
                      </strong>

                      <p>
                        {alert.action}
                      </p>

                    </div>

                  </div>

                )}

              </div>
            );
          })

        )}

      </div>


      {/* ================= AWARENESS ================= */}

      <div className="fraud-awareness">

        <div className="fraud-awareness-icon">
          <ShieldAlert size={22} />
        </div>

        <div>

          <strong>
            Remember these warning signs
          </strong>

          <p>
            Urgent requests, unknown QR codes, fake support
            calls, prize messages and requests for OTP/PIN
            are common signs of payment fraud.
          </p>

        </div>

      </div>


      {/* ================= GOLDEN RULE ================= */}

      <div className="fraud-footer-tip">

        <ShieldAlert size={22} />

        <div>

          <strong>
            Golden Rule
          </strong>

          <p>
            Never share your OTP, UPI PIN, password or CVV
            with anyone — even if they claim to be from
            your bank.
          </p>

        </div>

      </div>

    </div>
  );
}

export default FraudAlerts;