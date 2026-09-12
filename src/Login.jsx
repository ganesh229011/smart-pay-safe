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

import smartPaySquareLogo from "./assets/smartpay-square.png";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        alert(
          data.message ||
            "Invalid email or password."
        );

        return;
      }

      localStorage.setItem(
        "smartPayToken",
        data.token
      );

      localStorage.setItem(
        "smartPayCurrentUser",
        JSON.stringify(data.user)
      );

      window.dispatchEvent(
        new Event("authUpdated")
      );

      alert(
        `Welcome back, ${data.user.name}!`
      );

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
        ====================================================== */}

        <div className="auth-logo">

          <img
            src={smartPaySquareLogo}
            alt="SmartPay Safe"
            className="auth-brand-logo"
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
        ====================================================== */}

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
        ====================================================== */}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}

          <div className="auth-input-group">

            <label>
              Email Address
            </label>

            <div className="auth-input-wrapper">

              <Mail size={18} />

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div className="auth-input-group">

            <label>
              Password
            </label>

            <div className="auth-input-wrapper">

              <LockKeyhole size={18} />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
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

          {/* LOGIN BUTTON */}

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
        ====================================================== */}

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
        ====================================================== */}

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