import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  LockKeyhole,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
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
     REGISTER ACCOUNT
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* Remove unnecessary spaces from name/email */
    const cleanedData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    /* Basic validation */

    if (!cleanedData.name) {
      alert("Please enter your full name.");
      return;
    }

    if (!cleanedData.email) {
      alert("Please enter your email address.");
      return;
    }

    if (cleanedData.password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cleanedData),
        }
      );

      const data = await response.json();

      /* =====================================================
         REGISTRATION FAILED
      ===================================================== */

      if (!response.ok) {
        alert(data.message || "Registration failed.");
        return;
      }


      /* =====================================================
         IMPORTANT:
         SAVE ORIGINAL REGISTERED NAME
         
         Example:
         Registered name = Ganesh

         Later:
         Ganesh → Mahesh → Save

         Reset → Ganesh
      ===================================================== */

      localStorage.setItem(
        "smartPayOriginalName",
        cleanedData.name
      );


      /* =====================================================
         SAVE CURRENT USER
         
         This helps the app remember the registered user.
      ===================================================== */

      const registeredUser = {
        name: cleanedData.name,
        email: cleanedData.email,
      };

      localStorage.setItem(
        "smartPayCurrentUser",
        JSON.stringify(registeredUser)
      );


      /* =====================================================
         REMOVE OLD SETTINGS
         
         If another test account was previously used on
         the same browser, start this account with defaults.
      ===================================================== */

      localStorage.removeItem("smartPaySettings");


      /* =====================================================
         REGISTRATION SUCCESS
      ===================================================== */

      alert(
        "Account created successfully! Please login."
      );

      navigate("/login");

    } catch (error) {
      console.error("Registration error:", error);

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
            Create Account
          </h1>

          <p>
            Create your account and start using
            SmartPay-Safe.
          </p>

        </div>


        {/* ===================================================
            FORM
        =================================================== */}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          {/* ================= FULL NAME ================= */}

          <div className="auth-input-group">

            <label>
              Full Name
            </label>

            <div className="auth-input-wrapper">

              <User size={18} />

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>

          </div>


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
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
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
              PASSWORD INFO
          ================================================= */}

          <div className="password-info">

            <CheckCircle2 size={15} />

            <span>
              Password must contain at least 6 characters.
            </span>

          </div>


          {/* =================================================
              SUBMIT BUTTON
          ================================================= */}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >

            {loading
              ? "Creating Account..."
              : "Create Account"}

            {!loading && (
              <ArrowRight size={18} />
            )}

          </button>

        </form>


        {/* ===================================================
            LOGIN LINK
        =================================================== */}

        <div className="auth-footer">

          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Login
          </Link>

        </div>


        {/* ===================================================
            SECURITY MESSAGE
        =================================================== */}

        <div className="auth-security">

          <ShieldCheck size={17} />

          <span>
            Your account is securely stored in MongoDB.
          </span>

        </div>

      </div>

    </div>
  );
}

export default Register;