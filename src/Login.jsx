import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import smartPaySquareLogo from "./assets/smartpay-lr.png";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  /* =====================================================
     HANDLE INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     HANDLE LOGIN
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch(
        "https://smart-pay-safe.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Invalid email or password.");
        return;
      }

      /* =====================================================
         SAVE LOGIN SESSION
      ===================================================== */

      localStorage.setItem(
        "smartPayToken",
        data.token
      );

      localStorage.setItem(
        "smartPayCurrentUser",
        JSON.stringify(data.user)
      );

      /* =====================================================
         UPDATE AUTH STATE
      ===================================================== */

      window.dispatchEvent(
        new Event("authUpdated")
      );

      /* =====================================================
         SUCCESS MESSAGE
      ===================================================== */

      alert(
        `Welcome back, ${data.user.name}!`
      );

      /* =====================================================
         REDIRECT TO HOME
      ===================================================== */

      navigate("/", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      alert(
        "Unable to connect to server. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* =====================================================
            AUTH LOGO
        ===================================================== */}

        <div className="auth-logo">

          <img
            src={smartPaySquareLogo}
            alt="SmartPay Safe"
            className="auth-brand-logo"
            style={{
              width: "58px",
              height: "58px",
              minWidth: "58px",
              maxWidth: "58px",
              objectFit: "cover",
              objectPosition: "center",
              borderRadius: "14px",
              display: "block",
              flexShrink: 0,
            }}
          />

          <div>
            <h2>
              Smart<span>Pay</span>
            </h2>

            <p>
              SAFE PAYMENTS
            </p>
          </div>

        </div>

        {/* =====================================================
            HEADING
        ===================================================== */}

        <div className="auth-heading">

          <h1>
            Welcome Back
          </h1>

          <p>
            Login to continue protecting your digital
            payments.
          </p>

        </div>

        {/* =====================================================
            LOGIN FORM
        ===================================================== */}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          {/* =====================================================
              EMAIL
          ===================================================== */}

          <div className="auth-input-group">

            <label htmlFor="login-email">
              Email Address
            </label>

            <div className="auth-input-wrapper">

              <Mail size={18} />

              <input
                id="login-email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />

            </div>

          </div>

          {/* =====================================================
              PASSWORD
          ===================================================== */}

          <div className="auth-input-group">

            <label htmlFor="login-password">
              Password
            </label>

            <div className="auth-input-wrapper">

              <LockKeyhole size={18} />

              <input
                id="login-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

          </div>

          {/* =====================================================
              LOGIN BUTTON
          ===================================================== */}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"}

            {!loading && (
              <ArrowRight size={18} />
            )}

          </button>

        </form>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div className="auth-footer">

          <span>
            Don't have an account?
          </span>

          <Link to="/register">
            Create Account
          </Link>

        </div>

        {/* =====================================================
            SECURITY MESSAGE
        ===================================================== */}

        <div className="auth-security">

          <ShieldCheck size={17} />

          <span>
            Your payment safety starts here.
          </span>

        </div>

      </div>

    </div>
  );
}

export default Login;