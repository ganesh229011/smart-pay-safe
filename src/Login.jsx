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

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  /* =========================================================
     HANDLE INPUT CHANGE
  ========================================================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  /* =========================================================
     LOGIN
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
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


      /* =====================================================
         LOGIN FAILED
      ===================================================== */

      if (!response.ok) {
        alert(
          data.message ||
            "Invalid email or password."
        );

        return;
      }


      /* =====================================================
         SAVE LOGIN TOKEN
      ===================================================== */

      localStorage.setItem(
        "smartPayToken",
        data.token
      );


      /* =====================================================
         SAVE CURRENT USER
      ===================================================== */

      localStorage.setItem(
        "smartPayCurrentUser",
        JSON.stringify(data.user)
      );


      /* =====================================================
         IMPORTANT FIX
         
         Tell App.jsx immediately that login is successful.
         
         This removes the need to refresh the browser.
      ===================================================== */

      window.dispatchEvent(
        new Event("authUpdated")
      );


      /* =====================================================
         SUCCESS
      ===================================================== */

      alert(
        `Welcome back, ${data.user.name}!`
      );


      /* =====================================================
         GO TO HOME PAGE
         
         Change this to "/dashboard" if you want
         Dashboard immediately after login.
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
        "Unable to connect to server. Please make sure backend is running."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* ===================================================
            LOGO
        =================================================== */}

        <div className="auth-logo">

          <div className="auth-logo-icon">
            <ShieldCheck size={27} />
          </div>

          <div>
            <h2>
              Smart<span>Pay</span>
            </h2>

            <p>
              SAFE PAYMENTS
            </p>
          </div>

        </div>


        {/* ===================================================
            HEADING
        =================================================== */}

        <div className="auth-heading">

          <h1>
            Welcome Back
          </h1>

          <p>
            Login to continue protecting your digital
            payments.
          </p>

        </div>


        {/* ===================================================
            LOGIN FORM
        =================================================== */}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          {/* ================= EMAIL ================= */}

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


          {/* ================= PASSWORD ================= */}

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


          {/* =================================================
              LOGIN BUTTON
          ================================================= */}

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


        {/* ===================================================
            REGISTER LINK
        =================================================== */}

        <div className="auth-footer">

          <span>
            Don't have an account?
          </span>

          <Link to="/register">
            Create Account
          </Link>

        </div>


        {/* ===================================================
            SECURITY MESSAGE
        =================================================== */}

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