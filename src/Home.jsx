import {
  ShieldCheck,
  ArrowRight,
  LockKeyhole,
  ScanSearch,
  AlertTriangle,
  Activity,
  CheckCircle2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* ================= HERO ================= */}

      <section className="home-hero">

        <div className="home-hero-content">

          <div className="home-badge">
            <span className="pulse-dot"></span>
            Intelligent Payment Protection
          </div>

          <h2>
            Pay Smart.
            <br />
            <span>Stay Safe.</span>
          </h2>

          <p className="home-description">
            Smart Pay-Safe helps you identify suspicious digital payments,
            understand fraud risks and make safer payment decisions before
            money leaves your account.
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
              Risk Analysis
            </div>

            <div>
              <CheckCircle2 size={16} />
              Fraud Awareness
            </div>

            <div>
              <CheckCircle2 size={16} />
              Secure Design
            </div>

          </div>

        </div>


        {/* ================= PAYMENT CARD ================= */}

        <div className="payment-card-wrapper">

          <div className="payment-glow"></div>

          <div className="payment-card">

            <div className="payment-header">

              <div>
                <p>PAYMENT SAFETY</p>
                <h3>Risk Monitor</h3>
              </div>

              <div className="activity-icon">
                <Activity size={21} />
              </div>

            </div>

            <div className="risk-box">

              <div>

                <p className="label">
                  CURRENT RISK
                </p>

                <div className="risk-number">
                  18
                  <span>/100</span>
                </div>

              </div>

              <div className="risk-circle">
                LOW
              </div>

            </div>

            <div className="risk-progress">
              <div></div>
            </div>

            <div className="payment-detail">
              <span>Receiver</span>
              <strong>verified@upi</strong>
            </div>

            <div className="payment-detail">
              <span>Amount</span>
              <strong>₹2,500</strong>
            </div>

            <div className="safe-message">

              <ShieldCheck size={22} />

              <div>
                <strong>
                  Payment looks safe
                </strong>

                <p>
                  No major suspicious signals detected.
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section className="features-section">

        <div className="section-heading">

          <p>
            CORE PROTECTION
          </p>

          <h2>
            Everything you need before you pay.
          </h2>

        </div>


        <div className="feature-grid">

          <FeatureCard
            icon={<ScanSearch size={24} />}
            title="Payment Risk Checker"
            text="Analyze receiver details, amount and payment information to identify suspicious signals."
            onClick={() => navigate("/risk-checker")}
          />


          <FeatureCard
            icon={<AlertTriangle size={24} />}
            title="Fraud Alerts"
            text="Understand common digital payment scams and recognize important warning signs."
            onClick={() => navigate("/fraud-alerts")}
          />


          <FeatureCard
            icon={<LockKeyhole size={24} />}
            title="Security First"
            text="Built around secure payment practices without asking for sensitive credentials."
            onClick={() => navigate("/safety-center")}
          />

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}

      <section className="how-section">

        <div className="section-heading">

          <p>
            SIMPLE PROCESS
          </p>

          <h2>
            Check before you pay.
          </h2>

        </div>


        <div className="steps-grid">

          <Step
            number="01"
            title="Enter Details"
            text="Add amount, receiver and payment information."
          />

          <Step
            number="02"
            title="Analyze Risk"
            text="Smart Pay-Safe evaluates suspicious indicators."
          />

          <Step
            number="03"
            title="Make a Decision"
            text="Follow the safety recommendation before proceeding."
          />

        </div>

      </section>


      {/* ================= SECURITY ================= */}

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
              Smart Pay-Safe helps users recognize suspicious transactions
              without asking for sensitive credentials such as OTPs or
              UPI PINs.
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


/* ================= FEATURE CARD ================= */

function FeatureCard({
  icon,
  title,
  text,
  onClick,
}) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
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


/* ================= STEP CARD ================= */

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