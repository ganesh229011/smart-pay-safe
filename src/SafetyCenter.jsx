import { useMemo, useState } from "react";
import {
  ShieldCheck,
  LockKeyhole,
  Smartphone,
  KeyRound,
  Wifi,
  QrCode,
  Eye,
  CheckCircle2,
  ChevronDown,
  Search,
  AlertTriangle,
} from "lucide-react";

function SafetyCenter() {
  const [openTip, setOpenTip] = useState(null);
  const [search, setSearch] = useState("");

  /* ================= SAFETY TIPS ================= */

  const safetyTips = [
    {
      id: 1,
      title: "Protect Your UPI PIN",
      category: "Credentials",
      icon: KeyRound,
      text:
        "Never share your UPI PIN with anyone. Your PIN is required only when you are sending money or completing a payment.",
      action:
        "Keep your UPI PIN private at all times.",
    },
    {
      id: 2,
      title: "Keep Your Phone Secure",
      category: "Device Security",
      icon: Smartphone,
      text:
        "Use a screen lock, keep your operating system updated, and avoid installing applications from unknown sources.",
      action:
        "Use biometric authentication and install updates regularly.",
    },
    {
      id: 3,
      title: "Use Secure Networks",
      category: "Network",
      icon: Wifi,
      text:
        "Avoid making sensitive payments on public Wi-Fi. Prefer a trusted mobile network or secure private Wi-Fi.",
      action:
        "Use trusted networks when accessing banking applications.",
    },
    {
      id: 4,
      title: "Verify QR Codes",
      category: "QR Payments",
      icon: QrCode,
      text:
        "Before scanning a QR code, confirm who you are paying and check the receiver details carefully.",
      action:
        "Always verify the receiver name before confirming.",
    },
    {
      id: 5,
      title: "Check Payment Details",
      category: "Payments",
      icon: Eye,
      text:
        "Always verify the receiver name, amount and payment purpose before pressing the final payment button.",
      action:
        "Review every detail before completing a payment.",
    },
    {
      id: 6,
      title: "Enable Device Security",
      category: "Protection",
      icon: LockKeyhole,
      text:
        "Use biometric authentication or a strong device password and keep your banking applications updated.",
      action:
        "Enable fingerprint, Face ID or a strong device password.",
    },
  ];

  /* ================= TOGGLE TIP ================= */

  const toggleTip = (id) => {
    setOpenTip((currentId) =>
      currentId === id ? null : id
    );
  };

  /* ================= FILTER TIPS ================= */

  const filteredTips = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return safetyTips;
    }

    return safetyTips.filter((tip) => {
      return (
        tip.title.toLowerCase().includes(searchText) ||
        tip.category.toLowerCase().includes(searchText) ||
        tip.text.toLowerCase().includes(searchText) ||
        tip.action.toLowerCase().includes(searchText)
      );
    });
  }, [search]);

  return (
    <div className="safety-page">

      {/* ================= HEADER ================= */}

      <div className="page-heading">

        <div>
          <p className="section-label">
            PROTECTION GUIDE
          </p>

          <h2>Safety Center</h2>

          <p className="page-description">
            Simple security practices to keep your digital
            payments safe.
          </p>
        </div>

        <div className="safety-badge">
          <ShieldCheck size={20} />
          <span>Security Enabled</span>
        </div>

      </div>


      {/* ================= HERO ================= */}

      <div className="safety-hero">

        <div className="safety-hero-icon">
          <ShieldCheck size={34} />
        </div>

        <div className="safety-hero-content">

          <h3>
            Your payments deserve protection.
          </h3>

          <p>
            Follow these simple steps to reduce the risk of
            payment fraud, phishing and unauthorized
            transactions.
          </p>

        </div>

        <div className="safety-score">

          <span>SAFETY SCORE</span>

          <strong>92</strong>

          <small>/100</small>

          <div className="safety-progress">
            <div></div>
          </div>

        </div>

      </div>


      {/* ================= INFO CARDS ================= */}

      <div className="safety-grid">

        <div className="safety-info-card">

          <div className="info-icon">
            <ShieldCheck size={22} />
          </div>

          <h3>
            Never Share Sensitive Data
          </h3>

          <p>
            OTP, UPI PIN, CVV, passwords and banking
            credentials should remain private.
          </p>

          <div className="check-line">
            <CheckCircle2 size={16} />
            <span>Keep credentials private</span>
          </div>

        </div>


        <div className="safety-info-card">

          <div className="info-icon">
            <LockKeyhole size={22} />
          </div>

          <h3>
            Verify Before You Pay
          </h3>

          <p>
            Check the receiver, amount and payment details
            before confirming every transaction.
          </p>

          <div className="check-line">
            <CheckCircle2 size={16} />
            <span>Review every payment</span>
          </div>

        </div>

      </div>


      {/* ================= CHECKLIST HEADER ================= */}

      <div className="safety-section-title">

        <div>
          <p className="section-label">
            SECURITY CHECKLIST
          </p>

          <h3>
            Essential Safety Tips
          </h3>
        </div>

        <span>
          {filteredTips.length} of {safetyTips.length}
        </span>

      </div>


      {/* ================= SEARCH ================= */}

      <div className="safety-search">

        <Search size={18} />

        <input
          type="text"
          aria-label="Search safety tips"
          placeholder="Search safety tips..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

      </div>


      {/* ================= TIPS ================= */}

      <div className="safety-tips">

        {filteredTips.length === 0 ? (

          <div className="safety-empty">

            <Search size={30} />

            <h3>
              No safety tips found
            </h3>

            <p>
              Try searching for another security topic.
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
            >
              Clear Search
            </button>

          </div>

        ) : (

          filteredTips.map((tip) => {

            const Icon = tip.icon;
            const isOpen = openTip === tip.id;

            return (
              <div
                className={`safety-tip ${
                  isOpen ? "safety-tip-open" : ""
                }`}
                key={tip.id}
              >

                <button
                  type="button"
                  className="safety-tip-button"
                  aria-expanded={isOpen}
                  onClick={() =>
                    toggleTip(tip.id)
                  }
                >

                  <div className="tip-icon">
                    <Icon size={20} />
                  </div>


                  <div className="tip-content">

                    <div className="tip-title-row">

                      <h4>
                        {tip.title}
                      </h4>

                      <span>
                        {tip.category}
                      </span>

                    </div>


                    <p>
                      {isOpen
                        ? tip.text
                        : "Click to view the recommended security practice."}
                    </p>


                    {isOpen && (
                      <div className="tip-action">

                        <CheckCircle2 size={15} />

                        <span>
                          {tip.action}
                        </span>

                      </div>
                    )}

                  </div>


                  <ChevronDown
                    size={19}
                    className={
                      isOpen
                        ? "tip-chevron rotate"
                        : "tip-chevron"
                    }
                  />

                </button>

              </div>
            );
          })

        )}

      </div>


      {/* ================= EMERGENCY ================= */}

      <div className="emergency-card">

        <div className="emergency-icon">
          <AlertTriangle size={23} />
        </div>

        <div>

          <h3>
            Think something is wrong?
          </h3>

          <p>
            Stop the payment, secure your account and contact
            your bank through its official support channel.
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            alert(
              "For a suspected fraud, immediately contact your bank through its official customer-care channel."
            )
          }
        >
          Get Help
        </button>

      </div>

    </div>
  );
}

export default SafetyCenter;