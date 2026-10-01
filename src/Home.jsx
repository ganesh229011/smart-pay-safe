import {
  ShieldCheck,
  ArrowRight,
  LockKeyhole,
  ScanSearch,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Smartphone,
  CreditCard,
  ShieldAlert,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import smartPaySquareLogo from "./assets/smartpay-square.png";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="home-hero"
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >

        {/* =====================================================
            LARGE S LOGO BACKGROUND WATERMARK
        ===================================================== */}

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: "640px",
            height: "640px",
            left: "52%",
            top: "52%",
            transform: "translate(-50%, -50%)",
            opacity: 0.08,
            pointerEvents: "none",
            zIndex: 0,
            filter:
              "drop-shadow(0 0 40px rgba(34, 211, 238, 0.28))",
          }}
        >
          <img
            src={smartPaySquareLogo}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>

        {/* =====================================================
            HERO CONTENT
        ===================================================== */}

        <div
          className="home-hero-content"
          style={{
            position: "relative",
            zIndex: 2,
          }}
        >

          <div className="home-badge">
            <span className="pulse-dot"></span>
            SMART PAYMENT PROTECTION
          </div>

          <h1>
            Your Easy Way to a
            <br />
            <span>Safer Digital Future.</span>
          </h1>

          <p className="home-description">
            Every digital payment should feel safe and simple.
            Smart Pay-Safe helps you detect suspicious payments,
            understand fraud risks and make smarter decisions
            before your money leaves your account.
          </p>

          <div className="home-buttons">

            <button
              type="button"
              className="primary-btn"
              onClick={() => navigate("/risk-checker")}
            >
              Check Payment Risk
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/safety-center")}
            >
              Explore Safety Center
            </button>

          </div>

          <div className="trust-list">

            <div>
              <CheckCircle2 size={16} />
              Smart Risk Analysis
            </div>

            <div>
              <CheckCircle2 size={16} />
              Fraud Awareness
            </div>

            <div>
              <CheckCircle2 size={16} />
              Security First
            </div>

          </div>

        </div>

        {/* =====================================================
    SECURITY PROTECTION CARD
===================================================== */}

<div
  className="payment-card-wrapper"
  style={{
    position: "relative",
    zIndex: 2,
  }}
>
  <div
    className="payment-card"
    style={{
      padding: "34px",
      minHeight: "520px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      background: "rgba(255, 255, 255, 0.92)",
      borderRadius: "28px",
    }}
  >

    {/* ICON */}

    <div
      style={{
        width: "64px",
        height: "64px",
        borderRadius: "18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#eaf3ff",
        marginBottom: "26px",
      }}
    >
      <ShieldCheck size={34} />
    </div>

    {/* HEADING */}

    <p
      style={{
        margin: 0,
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "2px",
        color: "#64748b",
      }}
    >
      SMART PAY-SAFE
    </p>

    <h2
      style={{
        margin: "10px 0 14px",
        fontSize: "32px",
        lineHeight: 1.15,
        color: "#172033",
      }}
    >
      Your Payment
      <br />
      <span style={{ color: "#2476d8" }}>
        Safety Matters.
      </span>
    </h2>

    <p
      style={{
        margin: "0 0 28px",
        fontSize: "15px",
        lineHeight: 1.7,
        color: "#64748b",
      }}
    >
      Smart Pay-Safe helps you identify suspicious
      payments and make safer digital payment decisions.
    </p>

    {/* SECURITY FEATURES */}

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        marginBottom: "28px",
      }}
    >

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        <CheckCircle2 size={20} />
        <span>Smart Risk Analysis</span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        <CheckCircle2 size={20} />
        <span>Fraud Detection</span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        <CheckCircle2 size={20} />
        <span>Secure Payment Practices</span>
      </div>

    </div>

    {/* STATUS */}

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "16px 18px",
        borderRadius: "16px",
        background: "#effcf7",
        border: "1px solid #d2f5e8",
      }}
    >
      <ShieldCheck size={22} />

      <div>
        <strong
          style={{
            display: "block",
            fontSize: "14px",
            color: "#172033",
          }}
        >
          Protection Active
        </strong>

        <span
          style={{
            fontSize: "12px",
            color: "#64748b",
          }}
        >
          Your safety comes first.
        </span>
      </div>

    </div>

  </div>
</div>
      </section>

      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section className="features-section">

        <div className="section-heading">

          <p>
            CORE PROTECTION
          </p>

          <h2>
            Everything you need before you pay.
          </h2>

          <span>
            Simple tools designed to help you make safer
            digital payment decisions.
          </span>

        </div>

        <div className="feature-grid">

          <FeatureCard
            icon={<ScanSearch size={24} />}
            title="Payment Risk Checker"
            text="Analyze receiver details, payment amount and transaction information to identify suspicious signals."
            onClick={() => navigate("/risk-checker")}
          />

          <FeatureCard
            icon={<AlertTriangle size={24} />}
            title="Fraud Alerts"
            text="Learn about common digital payment scams and recognize warning signs before you become a victim."
            onClick={() => navigate("/fraud-alerts")}
          />

          <FeatureCard
            icon={<LockKeyhole size={24} />}
            title="Security First"
            text="Built around safe payment practices without asking for sensitive credentials like OTPs or UPI PINs."
            onClick={() => navigate("/safety-center")}
          />

        </div>

      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section className="how-section">

        <div className="section-heading">

          <p>
            SIMPLE PROCESS
          </p>

          <h2>
            Check before you pay.
          </h2>

          <span>
            Three simple steps to make a smarter payment decision.
          </span>

        </div>

        <div className="steps-grid">

          <Step
            number="01"
            title="Enter Details"
            text="Add the receiver, amount and basic payment information."
          />

          <Step
            number="02"
            title="Analyze Risk"
            text="Smart Pay-Safe evaluates the transaction for suspicious indicators."
          />

          <Step
            number="03"
            title="Make a Decision"
            text="Review the safety recommendation before proceeding with your payment."
          />

        </div>

      </section>

      {/* =====================================================
          SECURITY
      ===================================================== */}

      <section className="security-section">

        <div className="security-card">

          <div className="security-icon">
            <ShieldCheck size={28} />
          </div>

          <div className="security-content">

            <p className="security-label">
              SECURITY FIRST
            </p>

            <h2>
              Built around payment safety.
            </h2>

            <p>
              Smart Pay-Safe helps users recognize suspicious
              transactions without asking for sensitive credentials
              such as OTPs, UPI PINs or banking passwords.
            </p>

          </div>

          <div className="security-status">

            <span></span>

            Protection Active

          </div>

        </div>

      </section>

    </div>
  );
}


/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
  icon,
  title,
  text,
  onClick,
}) {

  const handleKeyDown = (event) => {

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {

      event.preventDefault();

      onClick();

    }

  };

  return (

    <div
      className="feature-card"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Open ${title}`}
    >

      <div className="feature-icon">
        {icon}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

      <div className="card-arrow">
        <ArrowRight size={17} />
      </div>

    </div>

  );
}


/* =========================================================
   STEP
========================================================= */

function Step({
  number,
  title,
  text,
}) {

  return (

    <div className="step-card">

      <span className="step-number">
        {number}
      </span>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

    </div>

  );

}


export default Home;