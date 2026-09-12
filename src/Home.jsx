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

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="home-hero">

        <div className="home-hero-content">

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


        {/* =================================================
            PAYMENT DASHBOARD VISUAL
        ================================================= */}

        <div className="payment-card-wrapper">

          <div className="payment-glow"></div>

          <div className="payment-card">

            {/* Header */}

            <div className="payment-header">

              <div className="payment-brand">

                <div className="mini-logo">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <p>SMART PAY-SAFE</p>
                  <h3>Payment Monitor</h3>
                </div>

              </div>

              <div className="activity-icon">
                <Activity size={20} />
              </div>

            </div>


            {/* Balance */}

            <div className="balance-box">

              <div>
                <span>Total Protected</span>

                <strong>
                  ₹24,850
                </strong>
              </div>

              <div className="safe-badge">
                <ShieldCheck size={15} />
                Protected
              </div>

            </div>


            {/* Risk Score */}

            <div className="risk-box">

              <div>

                <p className="label">
                  PAYMENT RISK SCORE
                </p>

                <div className="risk-number">
                  18
                  <span>/100</span>
                </div>

                <small>
                  Low risk detected
                </small>

              </div>

              <div className="risk-circle">
                LOW
              </div>

            </div>


            {/* Progress */}

            <div className="risk-progress">
              <div></div>
            </div>


            {/* Transaction */}

            <div className="payment-detail">

              <span>
                Receiver
              </span>

              <strong>
                verified@upi
              </strong>

            </div>

            <div className="payment-detail">

              <span>
                Amount
              </span>

              <strong>
                ₹2,500
              </strong>

            </div>


            {/* Safe Message */}

            <div className="safe-message">

              <div className="safe-message-icon">
                <ShieldCheck size={20} />
              </div>

              <div>

                <strong>
                  Payment looks safe
                </strong>

                <p>
                  No major suspicious signals detected.
                </p>

              </div>

            </div>


            {/* Bottom Mini Stats */}

            <div className="payment-mini-stats">

              <div>
                <Smartphone size={16} />
                <span>Digital</span>
              </div>

              <div>
                <CreditCard size={16} />
                <span>Secure</span>
              </div>

              <div>
                <ShieldAlert size={16} />
                <span>Monitored</span>
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
   STEP CARD
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