import { useEffect, useState } from "react";
import {
  User,
  Bell,
  ShieldCheck,
  Moon,
  Save,
  RotateCcw,
  CheckCircle2,
  LockKeyhole,
  Database,
  Trash2,
  ChevronRight,
  Sun,
  Mail,
} from "lucide-react";

function Settings() {
  /* =========================================================
     CURRENT USER
  ========================================================= */

  const getCurrentUser = () => {
    const savedUser = localStorage.getItem(
      "smartPayCurrentUser"
    );

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

  const [currentUser, setCurrentUser] = useState(
    getCurrentUser
  );

  /* =========================================================
     ORIGINAL ACCOUNT NAME
  ========================================================= */

  const getOriginalName = (user) => {
    const savedOriginalName =
      localStorage.getItem("smartPayOriginalName");

    if (savedOriginalName) {
      return savedOriginalName;
    }

    const originalName =
      user?.name?.trim() || "User";

    localStorage.setItem(
      "smartPayOriginalName",
      originalName
    );

    return originalName;
  };

  const [originalName] = useState(() => {
    return getOriginalName(getCurrentUser());
  });

  /* =========================================================
     DEFAULT SETTINGS
  ========================================================= */

  const getDefaultSettings = () => ({
    displayName: originalName,
    paymentNotifications: true,
    securityAlerts: true,
    darkMode: true,
  });

  /* =========================================================
     LOAD SAVED SETTINGS
  ========================================================= */

  const getSavedSettings = () => {
    const savedSettings =
      localStorage.getItem("smartPaySettings");

    if (!savedSettings) {
      return getDefaultSettings();
    }

    try {
      const parsed = JSON.parse(savedSettings);

      return {
        ...getDefaultSettings(),
        ...parsed,

        displayName:
          parsed.displayName?.trim() ||
          originalName,
      };
    } catch {
      return getDefaultSettings();
    }
  };

  /* =========================================================
     DRAFT SETTINGS
  ========================================================= */

  const [settings, setSettings] = useState(
    getSavedSettings
  );

  const [saved, setSaved] = useState(false);

  /* =========================================================
     APPLY SAVED THEME WHEN PAGE LOADS
  ========================================================= */

  useEffect(() => {
    const savedSettings =
      localStorage.getItem("smartPaySettings");

    let darkMode = true;

    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);

        darkMode = parsed.darkMode ?? true;
      } catch {
        darkMode = true;
      }
    }

    document.body.classList.toggle(
      "light-mode",
      !darkMode
    );
  }, []);

  /* =========================================================
     USER UPDATE LISTENER
  ========================================================= */

  useEffect(() => {
    const handleUserUpdate = () => {
      const updatedUser = getCurrentUser();

      setCurrentUser(updatedUser);
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
     UPDATE TEMPORARY SETTING
  ========================================================= */

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setSaved(false);
  };

  /* =========================================================
     SAVE SETTINGS
  ========================================================= */

  const saveSettings = () => {
    const trimmedName =
      settings.displayName.trim();

    const finalName =
      trimmedName || originalName;

    const updatedSettings = {
      ...settings,
      displayName: finalName,
    };

    /* -----------------------------------------
       SAVE SETTINGS
    ----------------------------------------- */

    localStorage.setItem(
      "smartPaySettings",
      JSON.stringify(updatedSettings)
    );

    /* -----------------------------------------
       UPDATE CURRENT USER
    ----------------------------------------- */

    const updatedUser = {
      ...currentUser,
      name: finalName,
    };

    localStorage.setItem(
      "smartPayCurrentUser",
      JSON.stringify(updatedUser)
    );

    /* -----------------------------------------
       UPDATE REACT STATE
    ----------------------------------------- */

    setCurrentUser(updatedUser);
    setSettings(updatedSettings);

    /* -----------------------------------------
       APPLY THEME
    ----------------------------------------- */

    document.body.classList.toggle(
      "light-mode",
      !updatedSettings.darkMode
    );

    /* -----------------------------------------
       NOTIFY APP
    ----------------------------------------- */

    window.dispatchEvent(
      new Event("themeUpdated")
    );

    window.dispatchEvent(
      new Event("userUpdated")
    );

    /* -----------------------------------------
       SUCCESS MESSAGE
    ----------------------------------------- */

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  /* =========================================================
     RESET SETTINGS
  ========================================================= */

  const resetSettings = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset all SmartPay-Safe settings to their default values?"
    );

    if (!confirmed) {
      return;
    }

    /* -----------------------------------------
       DEFAULT DATA
    ----------------------------------------- */

    const resetData = {
      displayName: originalName,
      paymentNotifications: true,
      securityAlerts: true,
      darkMode: true,
    };

    /* -----------------------------------------
       RESET SETTINGS STATE
    ----------------------------------------- */

    setSettings(resetData);

    /* -----------------------------------------
       SAVE RESET SETTINGS
    ----------------------------------------- */

    localStorage.setItem(
      "smartPaySettings",
      JSON.stringify(resetData)
    );

    /* -----------------------------------------
       RESET PROFILE NAME
    ----------------------------------------- */

    const resetUser = {
      ...currentUser,
      name: originalName,
    };

    setCurrentUser(resetUser);

    localStorage.setItem(
      "smartPayCurrentUser",
      JSON.stringify(resetUser)
    );

    /* -----------------------------------------
       APPLY DARK MODE
    ----------------------------------------- */

    document.body.classList.remove(
      "light-mode"
    );

    /* -----------------------------------------
       NOTIFY APP
    ----------------------------------------- */

    window.dispatchEvent(
      new Event("themeUpdated")
    );

    window.dispatchEvent(
      new Event("userUpdated")
    );

    /* -----------------------------------------
       SUCCESS MESSAGE
    ----------------------------------------- */

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  /* =========================================================
     CLEAR TRANSACTION HISTORY FROM MONGODB
  ========================================================= */

  const clearTransactionHistory = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently clear your transaction history?"
    );

    if (!confirmed) {
      return;
    }

    /* -----------------------------------------
       GET JWT TOKEN
    ----------------------------------------- */

    const token =
      localStorage.getItem("smartPayToken");

    if (!token) {
      alert(
        "Your session has expired. Please login again."
      );

      return;
    }

    try {
      /* -----------------------------------------
         DELETE CURRENT USER TRANSACTIONS
      ----------------------------------------- */

      const response = await fetch(
        "https://smart-pay-safe.onrender.com/api/transactions/clear",
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      /* -----------------------------------------
         HANDLE AUTH ERROR
      ----------------------------------------- */

      if (response.status === 401) {
        localStorage.removeItem(
          "smartPayToken"
        );

        localStorage.removeItem(
          "smartPayCurrentUser"
        );

        window.dispatchEvent(
          new Event("authUpdated")
        );

        alert(
          "Your session has expired. Please login again."
        );

        return;
      }

      /* -----------------------------------------
         HANDLE OTHER ERRORS
      ----------------------------------------- */

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to clear transaction history."
        );
      }

      /* -----------------------------------------
         UPDATE DASHBOARD,
         TRANSACTIONS & SAFETY CENTER
      ----------------------------------------- */

      window.dispatchEvent(
        new Event("transactionsUpdated")
      );

      /* -----------------------------------------
         SUCCESS
      ----------------------------------------- */

      alert(
        data.message ||
          "Transaction history cleared successfully."
      );
    } catch (error) {
      console.error(
        "Clear transaction history error:",
        error
      );

      alert(
        error.message ||
          "Unable to clear transaction history. Please try again."
      );
    }
  };

  return (
    <>
      {/* =====================================================
          SETTINGS PAGE
      ===================================================== */}

      <div className="settings-page-modern">

        {/* ================= HEADER ================= */}

        <div className="settings-modern-header">

          <div>

            <p className="settings-eyebrow">
              ACCOUNT CONTROL
            </p>

            <h2>
              Settings
            </h2>

            <p className="settings-subtitle">
              Manage your SmartPay-Safe preferences,
              notifications and security controls.
            </p>

          </div>

          {saved && (
            <div className="settings-saved-modern">

              <CheckCircle2 size={17} />

              Changes saved

            </div>
          )}

        </div>

        {/* ================= PROFILE ================= */}

        <section className="settings-modern-card">

          <div className="settings-modern-card-header">

            <div className="settings-modern-icon blue">
              <User size={22} />
            </div>

            <div>

              <h3>
                Profile
              </h3>

              <p>
                Manage the information displayed on your account.
              </p>

            </div>

          </div>

          <div className="profile-modern-box">

            <div className="profile-modern-avatar">

              {(settings.displayName || "U")
                .charAt(0)
                .toUpperCase()}

            </div>

            <div className="profile-modern-form">

              <label>
                Display Name
              </label>

              <div className="modern-input-wrapper">

                <User size={17} />

                <input
                  type="text"
                  value={settings.displayName}
                  onChange={(e) =>
                    updateSetting(
                      "displayName",
                      e.target.value
                    )
                  }
                  placeholder="Enter your name"
                />

              </div>

              <small>
                Changes will be applied only after
                clicking Save Changes.
              </small>

              {currentUser.email && (
                <div className="profile-email">

                  <Mail size={14} />

                  <span>
                    {currentUser.email}
                  </span>

                </div>
              )}

            </div>

          </div>

        </section>

        {/* ================= NOTIFICATIONS ================= */}

        <section className="settings-modern-card">

          <div className="settings-modern-card-header">

            <div className="settings-modern-icon purple">
              <Bell size={22} />
            </div>

            <div>

              <h3>
                Notifications
              </h3>

              <p>
                Choose which alerts you want to receive.
              </p>

            </div>

          </div>

          <div className="modern-settings-list">

            {/* PAYMENT NOTIFICATIONS */}

            <div className="modern-setting-row">

              <div className="modern-row-icon">
                <Bell size={19} />
              </div>

              <div className="modern-row-content">

                <strong>
                  Payment Notifications
                </strong>

                <span>
                  Receive alerts about your payment activity.
                </span>

              </div>

              <button
                type="button"
                className={
                  settings.paymentNotifications
                    ? "modern-toggle active"
                    : "modern-toggle"
                }
                onClick={() =>
                  updateSetting(
                    "paymentNotifications",
                    !settings.paymentNotifications
                  )
                }
                aria-label="Toggle payment notifications"
              >

                <span></span>

              </button>

            </div>

            {/* SECURITY ALERTS */}

            <div className="modern-setting-row">

              <div className="modern-row-icon">
                <ShieldCheck size={19} />
              </div>

              <div className="modern-row-content">

                <strong>
                  Security Alerts
                </strong>

                <span>
                  Get important alerts about suspicious activity.
                </span>

              </div>

              <button
                type="button"
                className={
                  settings.securityAlerts
                    ? "modern-toggle active"
                    : "modern-toggle"
                }
                onClick={() =>
                  updateSetting(
                    "securityAlerts",
                    !settings.securityAlerts
                  )
                }
                aria-label="Toggle security alerts"
              >

                <span></span>

              </button>

            </div>

          </div>

        </section>

        {/* ================= SECURITY ================= */}

        <section className="settings-modern-card">

          <div className="settings-modern-card-header">

            <div className="settings-modern-icon green">
              <LockKeyhole size={22} />
            </div>

            <div>

              <h3>
                Security
              </h3>

              <p>
                Review your current protection status.
              </p>

            </div>

          </div>

          <div className="modern-settings-list">

            {/* PROTECTION STATUS */}

            <div className="modern-setting-row">

              <div className="modern-row-icon">
                <ShieldCheck size={19} />
              </div>

              <div className="modern-row-content">

                <strong>
                  Protection Status
                </strong>

                <span>
                  SmartPay-Safe security monitoring is active.
                </span>

              </div>

              <div className="modern-status active-status">

                <CheckCircle2 size={15} />

                Active

              </div>

            </div>

            {/* DARK MODE */}

            <div className="modern-setting-row">

              <div className="modern-row-icon">

                {settings.darkMode ? (
                  <Moon size={19} />
                ) : (
                  <Sun size={19} />
                )}

              </div>

              <div className="modern-row-content">

                <strong>
                  {settings.darkMode
                    ? "Dark Mode"
                    : "Light Mode"}
                </strong>

                <span>
                  Choose the appearance of your
                  SmartPay-Safe interface.
                </span>

              </div>

              <button
                type="button"
                className={
                  settings.darkMode
                    ? "modern-toggle active"
                    : "modern-toggle"
                }
                onClick={() =>
                  updateSetting(
                    "darkMode",
                    !settings.darkMode
                  )
                }
                aria-label="Toggle dark mode"
              >

                <span></span>

              </button>

            </div>

          </div>

        </section>

        {/* ================= PRIVACY ================= */}

        <section className="settings-modern-card">

          <div className="settings-modern-card-header">

            <div className="settings-modern-icon orange">
              <Database size={22} />
            </div>

            <div>

              <h3>
                Data & Privacy
              </h3>

              <p>
                Manage your SmartPay-Safe transaction data.
              </p>

            </div>

          </div>

          <div className="modern-settings-list">

            {/* DATABASE STORAGE */}

            <div className="modern-setting-row">

              <div className="modern-row-icon">
                <Database size={19} />
              </div>

              <div className="modern-row-content">

                <strong>
                  Secure Transaction Storage
                </strong>

                <span>
                  Your transaction history is securely
                  stored in your SmartPay-Safe account.
                </span>

              </div>

              <div className="modern-status active-status">

                <CheckCircle2 size={15} />

                Enabled

              </div>

            </div>

            {/* CLEAR HISTORY */}

            <div className="modern-setting-row">

              <div className="modern-row-icon danger-icon">
                <Trash2 size={19} />
              </div>

              <div className="modern-row-content">

                <strong>
                  Transaction History
                </strong>

                <span>
                  Permanently remove your transaction
                  records from your SmartPay-Safe account.
                </span>

              </div>

              <button
                type="button"
                className="modern-clear-btn"
                onClick={clearTransactionHistory}
              >

                Clear History

                <ChevronRight size={16} />

              </button>

            </div>

          </div>

        </section>

        {/* ================= SECURITY INFO ================= */}

        <div className="modern-security-banner">

          <div className="modern-security-banner-icon">
            <ShieldCheck size={22} />
          </div>

          <div>

            <strong>
              Your security matters
            </strong>

            <p>
              SmartPay-Safe never asks you to enter OTPs,
              UPI PINs or banking passwords into the system.
            </p>

          </div>

          <CheckCircle2
            size={22}
            className="banner-check"
          />

        </div>

        {/* ================= ACTIONS ================= */}

        <div className="modern-settings-actions">

          <button
            type="button"
            className="modern-reset-btn"
            onClick={resetSettings}
          >

            <RotateCcw size={17} />

            Reset

          </button>

          <button
            type="button"
            className="modern-save-btn"
            onClick={saveSettings}
          >

            <Save size={17} />

            Save Changes

          </button>

        </div>

      </div>

      {/* =====================================================
          SETTINGS PAGE CSS
      ===================================================== */}

      <style>{`

        .settings-page-modern {
          width: 100%;
          max-width: 1120px;
          margin: 0 auto;
          padding: 42px 34px 70px;
          box-sizing: border-box;
        }

        /* ================= HEADER ================= */

        .settings-modern-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;
          margin-bottom: 30px;
        }

        .settings-eyebrow {
          margin: 0 0 8px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          color: #00d9ff;
        }

        .settings-modern-header h2 {
          margin: 0;
          font-size: 36px;
          line-height: 1.1;
          color: #ffffff;
          font-weight: 800;
        }

        .settings-subtitle {
          margin: 10px 0 0;
          color: #8193b2;
          font-size: 15px;
        }

        .settings-saved-modern {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 15px;
          border-radius: 12px;
          border: 1px solid rgba(34, 197, 94, 0.3);
          background: rgba(34, 197, 94, 0.09);
          color: #4ade80;
          font-size: 13px;
          font-weight: 700;
          white-space: nowrap;
        }

        /* ================= CARD ================= */

        .settings-modern-card {
          width: 100%;
          box-sizing: border-box;
          margin-bottom: 20px;
          padding: 27px 29px;
          border: 1px solid #1c304a;
          border-radius: 20px;
          background: linear-gradient(
            145deg,
            #0d1727,
            #0b1422
          );
          box-shadow:
            0 15px 40px rgba(0, 0, 0, 0.12);
        }

        /* ================= CARD HEADER ================= */

        .settings-modern-card-header {
          display: flex;
          align-items: center;
          gap: 15px;
          padding-bottom: 23px;
          border-bottom: 1px solid #17263a;
        }

        .settings-modern-icon {
          width: 48px;
          height: 48px;
          min-width: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .settings-modern-icon.blue {
          color: #60a5fa;
          background: rgba(59, 130, 246, 0.13);
        }

        .settings-modern-icon.purple {
          color: #a78bfa;
          background: rgba(139, 92, 246, 0.13);
        }

        .settings-modern-icon.green {
          color: #4ade80;
          background: rgba(34, 197, 94, 0.12);
        }

        .settings-modern-icon.orange {
          color: #fb923c;
          background: rgba(249, 115, 22, 0.12);
        }

        .settings-modern-card-header h3 {
          margin: 0 0 5px;
          font-size: 19px;
          color: #ffffff;
          font-weight: 750;
        }

        .settings-modern-card-header p {
          margin: 0;
          color: #7186a5;
          font-size: 13px;
        }

        /* ================= PROFILE ================= */

        .profile-modern-box {
          margin-top: 22px;
          padding: 25px;
          display: flex;
          align-items: center;
          gap: 24px;
          border-radius: 17px;
          border: 1px solid #1b2b40;
          background: rgba(255, 255, 255, 0.025);
        }

        .profile-modern-avatar {
          width: 82px;
          height: 82px;
          min-width: 82px;
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 31px;
          font-weight: 800;
          background: linear-gradient(
            135deg,
            #2563eb,
            #06b6d4
          );
          box-shadow:
            0 10px 25px rgba(37, 99, 235, 0.25);
        }

        .profile-modern-form {
          flex: 1;
          min-width: 0;
        }

        .profile-modern-form label {
          display: block;
          margin-bottom: 8px;
          color: #dce7f6;
          font-size: 13px;
          font-weight: 700;
        }

        .modern-input-wrapper {
          height: 50px;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 0 15px;
          border-radius: 11px;
          border: 1px solid #273c56;
          background: #07101d;
          box-sizing: border-box;
        }

        .modern-input-wrapper svg {
          color: #607b9d;
          flex-shrink: 0;
        }

        .modern-input-wrapper input {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: #ffffff;
          font-size: 14px;
        }

        .modern-input-wrapper:focus-within {
          border-color: #159bc5;
          box-shadow:
            0 0 0 3px rgba(21, 155, 197, 0.1);
        }

        .profile-modern-form small {
          display: block;
          margin-top: 8px;
          color: #627995;
          font-size: 11px;
        }

        .profile-email {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 8px;
          color: #7890ae;
          font-size: 12px;
        }

        .profile-email svg {
          color: #4aa9d1;
        }

        /* ================= SETTINGS ROWS ================= */

        .modern-settings-list {
          margin-top: 3px;
        }

        .modern-setting-row {
          min-height: 76px;
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 17px 2px;
          box-sizing: border-box;
          border-bottom: 1px solid #17263a;
        }

        .modern-setting-row:last-child {
          border-bottom: none;
          padding-bottom: 3px;
        }

        .modern-row-icon {
          width: 40px;
          height: 40px;
          min-width: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          color: #7591b5;
          background: #111f31;
        }

        .modern-row-content {
          flex: 1;
          min-width: 0;
        }

        .modern-row-content strong {
          display: block;
          margin-bottom: 4px;
          color: #e8f0fa;
          font-size: 14px;
          font-weight: 700;
        }

        .modern-row-content span {
          display: block;
          color: #6e84a2;
          font-size: 12px;
          line-height: 1.5;
        }

        /* ================= TOGGLE ================= */

        .modern-toggle {
          position: relative;
          width: 54px;
          height: 30px;
          min-width: 54px;
          padding: 0;
          border: none;
          border-radius: 30px;
          background: #26364a;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .modern-toggle span {
          position: absolute;
          width: 22px;
          height: 22px;
          top: 4px;
          left: 4px;
          border-radius: 50%;
          background: #aebbd0;
          transition: 0.25s ease;
        }

        .modern-toggle.active {
          background: #2fb88c;
        }

        .modern-toggle.active span {
          left: 28px;
          background: #ffffff;
        }

        .modern-toggle:hover {
          transform: scale(1.03);
        }

        /* ================= STATUS ================= */

        .modern-status {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 30px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        .active-status {
          color: #22d3ee;
          border: 1px solid rgba(34, 211, 238, 0.22);
          background: rgba(34, 211, 238, 0.06);
        }

        /* ================= CLEAR BUTTON ================= */

        .danger-icon {
          color: #fb7185;
        }

        .modern-clear-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid rgba(244, 63, 94, 0.25);
          background: rgba(244, 63, 94, 0.06);
          color: #fb7185;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: 0.2s ease;
        }

        .modern-clear-btn:hover {
          background: rgba(244, 63, 94, 0.12);
          border-color: rgba(244, 63, 94, 0.45);
        }

        /* ================= SECURITY BANNER ================= */

        .modern-security-banner {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px 22px;
          margin-top: 5px;
          border-radius: 17px;
          border: 1px solid rgba(34, 211, 238, 0.2);
          background:
            linear-gradient(
              135deg,
              rgba(6, 182, 212, 0.08),
              rgba(14, 165, 233, 0.025)
            );
        }

        .modern-security-banner-icon {
          width: 44px;
          height: 44px;
          min-width: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          color: #22d3ee;
          background: rgba(6, 182, 212, 0.1);
        }

        .modern-security-banner strong {
          display: block;
          margin-bottom: 5px;
          color: #e8f6ff;
          font-size: 14px;
        }

        .modern-security-banner p {
          margin: 0;
          color: #718aa8;
          font-size: 12px;
          line-height: 1.5;
        }

        .banner-check {
          margin-left: auto;
          color: #22c55e;
          flex-shrink: 0;
        }

        /* ================= ACTIONS ================= */

        .modern-settings-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 22px;
        }

        .modern-reset-btn,
        .modern-save-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 44px;
          padding: 0 19px;
          border-radius: 11px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .modern-reset-btn {
          border: 1px solid #263950;
          background: #0d1828;
          color: #8ca0ba;
        }

        .modern-reset-btn:hover {
          border-color: #3b536f;
          color: #d5dfeb;
        }

        .modern-save-btn {
          border: 1px solid #12a8c9;
          background: linear-gradient(
            135deg,
            #0795b4,
            #087f9e
          );
          color: white;
          box-shadow:
            0 8px 20px rgba(8, 127, 158, 0.2);
        }

        .modern-save-btn:hover {
          transform: translateY(-1px);
          box-shadow:
            0 10px 24px rgba(8, 127, 158, 0.3);
        }

        /* ================= LIGHT MODE ================= */

        body.light-mode .settings-modern-header h2 {
          color: #172033;
        }

        body.light-mode .settings-subtitle {
          color: #667085;
        }

        body.light-mode .settings-modern-card {
          background: #ffffff;
          border-color: #dbe4ee;
          box-shadow:
            0 10px 30px rgba(30, 50, 80, 0.07);
        }

        body.light-mode .settings-modern-card-header {
          border-bottom-color: #e7edf4;
        }

        body.light-mode .settings-modern-card-header h3 {
          color: #182230;
        }

        body.light-mode .settings-modern-card-header p {
          color: #718096;
        }

        body.light-mode .profile-modern-box {
          background: #f7f9fc;
          border-color: #e2e8f0;
        }

        body.light-mode .modern-input-wrapper {
          background: #ffffff;
          border-color: #d5deea;
        }

        body.light-mode .modern-input-wrapper input {
          color: #172033;
        }

        body.light-mode .modern-setting-row {
          border-bottom-color: #e7edf4;
        }

        body.light-mode .modern-row-icon {
          background: #f1f5f9;
          color: #64748b;
        }

        body.light-mode .modern-row-content strong {
          color: #182230;
        }

        body.light-mode .modern-row-content span {
          color: #718096;
        }

        body.light-mode .modern-security-banner {
          background: #f1fbfd;
          border-color: #c8edf4;
        }

        body.light-mode .modern-security-banner strong {
          color: #19313a;
        }

        body.light-mode .modern-security-banner p {
          color: #687b86;
        }

        body.light-mode .modern-reset-btn {
          background: #ffffff;
          border-color: #d5deea;
          color: #667085;
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 800px) {

          .settings-page-modern {
            padding: 30px 20px 55px;
          }

          .settings-modern-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .settings-modern-header h2 {
            font-size: 31px;
          }

          .settings-modern-card {
            padding: 22px;
          }

          .profile-modern-box {
            align-items: flex-start;
          }

        }

        @media (max-width: 600px) {

          .settings-page-modern {
            padding: 25px 14px 45px;
          }

          .settings-modern-card {
            padding: 18px;
            border-radius: 16px;
          }

          .settings-modern-card-header {
            align-items: flex-start;
          }

          .profile-modern-box {
            flex-direction: column;
          }

          .profile-modern-avatar {
            width: 70px;
            height: 70px;
            min-width: 70px;
          }

          .modern-setting-row {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .modern-row-content {
            flex: 1 1 calc(100% - 65px);
          }

          .modern-toggle,
          .modern-status,
          .modern-clear-btn {
            margin-left: 55px;
          }

          .modern-security-banner {
            align-items: flex-start;
          }

          .banner-check {
            display: none;
          }

          .modern-settings-actions {
            width: 100%;
            flex-direction: column-reverse;
          }

          .modern-reset-btn,
          .modern-save-btn {
            width: 100%;
          }

        }

      `}</style>
    </>
  );
}

export default Settings;