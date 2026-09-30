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
  Home as HomeIcon,
  LayoutDashboard,
  ShieldAlert,
  ReceiptText,
  TriangleAlert,
  ShieldCheck,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  MoreHorizontal,
  Bell,
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
     MOBILE MORE MENU
  ========================================================= */

  const [mobileMoreOpen, setMobileMoreOpen] =
    useState(false);


  /* =========================================================
     THEME
     DEFAULT = LIGHT
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
     THEME UPDATE
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
     USER UPDATE
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
     AUTH UPDATE
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
     CLOSE MOBILE MORE
  ========================================================= */

  const closeMobileMore = () => {
    setMobileMoreOpen(false);
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


    closeMobileMore();


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
     DESKTOP MENU
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


  /* =========================================================
     MOBILE BOTTOM NAV
  ========================================================= */

  const mobileNavItems = [
    {
      path: "/",
      name: "Home",
      icon: HomeIcon,
    },
    {
      path: "/risk-checker",
      name: "Risk",
      icon: ShieldAlert,
    },
    {
      path: "/fraud-alerts",
      name: "Alerts",
      icon: TriangleAlert,
    },
    {
      path: "/transactions",
      name: "Transactions",
      icon: ReceiptText,
    },
  ];


  return (
    <div className="app">


      {/* =====================================================
          DESKTOP SIDEBAR
      ===================================================== */}

      <aside className="sidebar">


        {/* LOGO */}

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


        {/* MAIN MENU */}

        <nav className="navigation">

          <p className="menu-title">
            MAIN MENU
          </p>


          {menuItems.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
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


        {/* ACCOUNT */}

        <div className="sidebar-bottom">

          <p className="menu-title">
            ACCOUNT
          </p>


          {isLoggedIn ? (
            <>

              <NavLink
                to="/settings"
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

            <NavLink
              to="/login"
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
          MAIN
      ===================================================== */}

      <main className="main">


        {/* ===================================================
            TOPBAR
        =================================================== */}

        <header className="topbar">


          {/* MOBILE BRAND */}

          <div className="mobile-brand">

            <img
              src={smartPayLogo}
              alt="SmartPay"
            />

          </div>


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


          {isLoggedIn && (

            <div className="profile">


              <button
                type="button"
                className="notification"
                onClick={() =>
                  alert("No new notifications")
                }
                aria-label="Notifications"
              >
                <Bell size={17} />
              </button>


              <div className="avatar">

                {currentUser.name
                  ?.charAt(0)
                  .toUpperCase() || "U"}

              </div>


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


        {/* ===================================================
            ROUTES
        =================================================== */}

        <Routes>


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


          <Route
            path="/"
            element={<Home />}
          />


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


        {/* ===================================================
            MOBILE MORE MENU
        =================================================== */}

        {mobileMoreOpen && (

          <>

            <div
              className="mobile-more-overlay"
              onClick={closeMobileMore}
            ></div>


            <div className="mobile-more-sheet">


              <div className="mobile-more-header">

                <div>

                  <span>
                    SMART PAY-SAFE
                  </span>

                  <strong>
                    More
                  </strong>

                </div>


                <button
                  type="button"
                  onClick={closeMobileMore}
                  aria-label="Close"
                >
                  <X size={19} />
                </button>

              </div>


              <NavLink
                to="/dashboard"
                onClick={closeMobileMore}
                className="mobile-more-item"
              >

                <span className="more-icon blue">
                  <LayoutDashboard size={19} />
                </span>

                <span>
                  Dashboard
                </span>

              </NavLink>


              <NavLink
                to="/safety-center"
                onClick={closeMobileMore}
                className="mobile-more-item"
              >

                <span className="more-icon green">
                  <ShieldCheck size={19} />
                </span>

                <span>
                  Safety Center
                </span>

              </NavLink>


              {isLoggedIn && (

                <NavLink
                  to="/settings"
                  onClick={closeMobileMore}
                  className="mobile-more-item"
                >

                  <span className="more-icon purple">
                    <SettingsIcon size={19} />
                  </span>

                  <span>
                    Settings
                  </span>

                </NavLink>

              )}


              {isLoggedIn && (

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mobile-more-item mobile-logout"
                >

                  <span className="more-icon red">
                    <LogOut size={19} />
                  </span>

                  <span>
                    Logout
                  </span>

                </button>

              )}

            </div>

          </>

        )}


        {/* ===================================================
            MOBILE BOTTOM NAVIGATION
        =================================================== */}

        <nav className="mobile-bottom-nav">


          {mobileNavItems.map((item) => {

            const Icon = item.icon;

            return (

              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "mobile-bottom-item active"
                    : "mobile-bottom-item"
                }
              >

                <Icon size={20} />

                <span>
                  {item.name}
                </span>

              </NavLink>

            );

          })}


          <button
            type="button"
            className={
              mobileMoreOpen
                ? "mobile-bottom-item more-button active"
                : "mobile-bottom-item more-button"
            }
            onClick={() =>
              setMobileMoreOpen(true)
            }
          >

            <MoreHorizontal size={21} />

            <span>
              More
            </span>

          </button>

        </nav>


      </main>

    </div>
  );
}


function App() {

  return (

    <BrowserRouter>

      <AppContent />

    </BrowserRouter>

  );
}


export default App;