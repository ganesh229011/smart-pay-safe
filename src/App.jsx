import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  Menu,
  X,
} from "lucide-react";

import Home from "./Home";
import Dashboard from "./Dashboard";
import RiskChecker from "./RiskChecker";
import Transactions from "./Transactions";
import FraudAlerts from "./FraudAlerts";
import SafetyCenter from "./SafetyCenter";
import Settings from "./Settings";
import Login from "./Login";
import Register from "./Register";

import smartPayLogo from "./assets/smartpay-logo.png";

import "./App.css";


function AppContent() {

  const navigate = useNavigate();


  /* =========================================================
     LOGIN STATE
  ========================================================= */

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(
      localStorage.getItem("smartPayToken")
    );
  });


  /* =========================================================
     CURRENT USER
  ========================================================= */

  const getCurrentUser = () => {

    const savedUser =
      localStorage.getItem("smartPayCurrentUser");

    if (!savedUser) {
      return {
        name: "User",
        email: "",
      };
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      return {
        name: "User",
        email: "",
      };
    }
  };


  const [currentUser, setCurrentUser] =
    useState(getCurrentUser);


  /* =========================================================
     MOBILE SIDEBAR STATE
  ========================================================= */

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);


  /* =========================================================
     THEME
     DEFAULT = LIGHT MODE
  ========================================================= */

  const [darkMode, setDarkMode] = useState(() => {

    const savedSettings =
      localStorage.getItem("smartPaySettings");

    if (savedSettings) {

      try {

        const parsedSettings =
          JSON.parse(savedSettings);

        return parsedSettings.darkMode ?? false;

      } catch {

        return false;

      }
    }

    return false;
  });


  /* =========================================================
     APPLY THEME
  ========================================================= */

  useEffect(() => {

    document.body.classList.toggle(
      "light-mode",
      !darkMode
    );

  }, [darkMode]);


  /* =========================================================
     THEME UPDATE LISTENER
  ========================================================= */

  useEffect(() => {

    const handleThemeUpdate = () => {

      const savedSettings =
        localStorage.getItem("smartPaySettings");

      if (!savedSettings) {

        setDarkMode(false);

        return;
      }

      try {

        const parsedSettings =
          JSON.parse(savedSettings);

        setDarkMode(
          parsedSettings.darkMode ?? false
        );

      } catch {

        setDarkMode(false);

      }
    };


    window.addEventListener(
      "themeUpdated",
      handleThemeUpdate
    );


    return () => {

      window.removeEventListener(
        "themeUpdated",
        handleThemeUpdate
      );

    };

  }, []);


  /* =========================================================
     USER UPDATE LISTENER
  ========================================================= */

  useEffect(() => {

    const handleUserUpdate = () => {

      setCurrentUser(
        getCurrentUser()
      );

    };


    window.addEventListener(
      "userUpdated",
      handleUserUpdate
    );


    return () => {

      window.removeEventListener(
        "userUpdated",
        handleUserUpdate
      );

    };

  }, []);


  /* =========================================================
     AUTH UPDATE LISTENER
  ========================================================= */

  useEffect(() => {

    const handleAuthUpdate = () => {

      const token =
        localStorage.getItem("smartPayToken");

      setIsLoggedIn(Boolean(token));

      setCurrentUser(
        getCurrentUser()
      );

    };


    window.addEventListener(
      "authUpdated",
      handleAuthUpdate
    );


    return () => {

      window.removeEventListener(
        "authUpdated",
        handleAuthUpdate
      );

    };

  }, []);


  /* =========================================================
     CLOSE MOBILE MENU
  ========================================================= */

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };


  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {

    localStorage.removeItem(
      "smartPayToken"
    );

    localStorage.removeItem(
      "smartPayCurrentUser"
    );

    localStorage.removeItem(
      "smartPayLoggedIn"
    );


    setIsLoggedIn(false);

    setCurrentUser({
      name: "User",
      email: "",
    });


    closeMobileMenu();


    window.dispatchEvent(
      new Event("authUpdated")
    );


    alert(
      "You have been logged out successfully."
    );


    navigate("/", {
      replace: true,
    });

  };


  /* =========================================================
     MENU ITEMS
  ========================================================= */

  const menuItems = [
    {
      path: "/",
      name: "Home",
      icon: "⌂",
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: "▣",
    },
    {
      path: "/risk-checker",
      name: "Risk Checker",
      icon: "◈",
    },
    {
      path: "/transactions",
      name: "Transactions",
      icon: "▤",
    },
    {
      path: "/fraud-alerts",
      name: "Fraud Alerts",
      icon: "△",
    },
    {
      path: "/safety-center",
      name: "Safety Center",
      icon: "◇",
    },
  ];


  return (
    <div className="app">


      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {mobileMenuOpen && (
        <div
          className="mobile-sidebar-overlay"
          onClick={closeMobileMenu}
        />
      )}


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={
          mobileMenuOpen
            ? "sidebar mobile-open"
            : "sidebar"
        }
      >


        {/* MOBILE CLOSE BUTTON */}

        <button
          type="button"
          className="mobile-sidebar-close"
          onClick={closeMobileMenu}
          aria-label="Close navigation"
        >

          <X size={21} />

        </button>


        {/* =================================================
            WEBSITE LOGO
        ================================================= */}

        <div className="logo">

          <img
            src={smartPayLogo}
            alt="SmartPay Security Logo"
            className="brand-logo"
          />


          <div className="logo-text">

            <h2>
              Smart<span>Pay</span>
            </h2>

            <p>
              SAFE DIGITAL PAYMENT ASSISTANCE
            </p>

          </div>

        </div>


        {/* =================================================
            MAIN MENU
        ================================================= */}

        <nav className="navigation">

          <p className="menu-title">
            MAIN MENU
          </p>


          {menuItems.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                isActive
                  ? "nav-item active"
                  : "nav-item"
              }
            >

              <span className="nav-icon">
                {item.icon}
              </span>

              <span>
                {item.name}
              </span>

            </NavLink>

          ))}

        </nav>


        {/* =================================================
            ACCOUNT
        ================================================= */}

        <div className="sidebar-bottom">

          <p className="menu-title">
            ACCOUNT
          </p>


          {isLoggedIn ? (

            <>

              {/* SETTINGS */}

              <NavLink
                to="/settings"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  isActive
                    ? "nav-item active"
                    : "nav-item"
                }
              >

                <span className="nav-icon">
                  ⚙
                </span>

                <span>
                  Settings
                </span>

              </NavLink>


              {/* LOGOUT */}

              <button
                type="button"
                className="nav-item logout-btn"
                onClick={handleLogout}
              >

                <span className="nav-icon">
                  ↪
                </span>

                <span>
                  Logout
                </span>

              </button>

            </>

          ) : (

            /* LOGIN */

            <NavLink
              to="/login"
              onClick={closeMobileMenu}
              className="nav-item"
            >

              <span className="nav-icon">
                ↪
              </span>

              <span>
                Login
              </span>

            </NavLink>

          )}

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="main">


        {/* =================================================
            TOP HEADER
        ================================================= */}

        <header className="topbar">


          {/* MOBILE HAMBURGER */}

          <button
            type="button"
            className="mobile-menu-button"
            onClick={() =>
              setMobileMenuOpen(true)
            }
            aria-label="Open navigation"
          >

            <Menu size={22} />

          </button>


          {/* HEADER TITLE */}

          <div className="topbar-title">

            <p className="small-text">
              SMART PAY-SAFE
            </p>

            <h1>
              Digital Payment Protection
            </h1>

            <span className="topbar-subtitle">
              Check. Analyze. Pay Safe.
            </span>

          </div>


          {/* PROFILE */}

          {isLoggedIn && (

            <div className="profile">


              {/* NOTIFICATION */}

              <button
                type="button"
                className="notification"
                onClick={() =>
                  alert("No new notifications")
                }
                aria-label="Notifications"
              >
                🔔
              </button>


              {/* AVATAR */}

              <div className="avatar">

                {currentUser.name
                  ?.charAt(0)
                  .toUpperCase() || "U"}

              </div>


              {/* PROFILE INFO */}

              <div className="profile-info">

                <strong className="profile-name">

                  {currentUser.name || "User"}

                  <span className="profile-online-dot"></span>

                </strong>


                <span className="profile-status">

                  <span className="profile-shield">
                    ◆
                  </span>

                  Protected Account

                </span>

              </div>

            </div>

          )}

        </header>


        {/* =================================================
            ROUTES
        ================================================= */}

        <Routes>


          {/* LOGIN */}

          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate
                  to="/dashboard"
                  replace
                />
              ) : (
                <Login />
              )
            }
          />


          {/* REGISTER */}

          <Route
            path="/register"
            element={
              isLoggedIn ? (
                <Navigate
                  to="/dashboard"
                  replace
                />
              ) : (
                <Register />
              )
            }
          />


          {/* HOME */}

          <Route
            path="/"
            element={<Home />}
          />


          {/* DASHBOARD */}

          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <Dashboard />
              ) : (
                <Navigate
                  to="/login"
                  replace
                />
              )
            }
          />


          {/* RISK CHECKER */}

          <Route
            path="/risk-checker"
            element={
              isLoggedIn ? (
                <RiskChecker />
              ) : (
                <Navigate
                  to="/login"
                  replace
                />
              )
            }
          />


          {/* TRANSACTIONS */}

          <Route
            path="/transactions"
            element={
              isLoggedIn ? (
                <Transactions />
              ) : (
                <Navigate
                  to="/login"
                  replace
                />
              )
            }
          />


          {/* FRAUD ALERTS */}

          <Route
            path="/fraud-alerts"
            element={
              isLoggedIn ? (
                <FraudAlerts />
              ) : (
                <Navigate
                  to="/login"
                  replace
                />
              )
            }
          />


          {/* SAFETY CENTER */}

          <Route
            path="/safety-center"
            element={
              isLoggedIn ? (
                <SafetyCenter />
              ) : (
                <Navigate
                  to="/login"
                  replace
                />
              )
            }
          />


          {/* SETTINGS */}

          <Route
            path="/settings"
            element={
              isLoggedIn ? (
                <Settings />
              ) : (
                <Navigate
                  to="/login"
                  replace
                />
              )
            }
          />


          {/* FALLBACK */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </main>

    </div>
  );
}


/* =========================================================
   APP
========================================================= */

function App() {

  return (

    <BrowserRouter>

      <AppContent />

    </BrowserRouter>

  );
}


export default App;