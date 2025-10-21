"use client";

import React, { useState } from "react";

interface User {
  name?: string;
  email: string;
  company?: string;
  loggedIn: boolean;
}

declare global {
  interface Window {
    currentUser?: User;
  }
}

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<"login" | "signup">("login");

  // Login form state
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  // Signup form state
  const [signupName, setSignupName] = useState<string>("");
  const [signupEmail, setSignupEmail] = useState<string>("");
  const [signupCompany, setSignupCompany] = useState<string>("");
  const [signupPassword, setSignupPassword] = useState<string>("");
  const [signupConfirm, setSignupConfirm] = useState<string>("");

  const handleLogin = (e: React.FormEvent): void => {
    e.preventDefault();
    window.currentUser = { email: loginEmail, loggedIn: true };
    alert(`Welcome back! Logging in as ${loginEmail}`);
  };

  const handleSignup = (e: React.FormEvent): void => {
    e.preventDefault();

    if (signupPassword !== signupConfirm) {
      alert("Passwords do not match!");
      return;
    }

    window.currentUser = {
      name: signupName,
      email: signupEmail,
      company: signupCompany,
      loggedIn: true,
    };

    alert(`Account created! Welcome ${signupName}!`);
  };

  const switchTab = (tab: "login" | "signup"): void => {
    setCurrentTab(tab);
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        // background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        minHeight: "50vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          width: "100%",
          maxWidth: "420px",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
            padding: "40px 30px",
            textAlign: "center",
            color: "white",
          }}
        >
          <div
            style={{
              fontSize: "36px",
              fontWeight: 700,
              letterSpacing: "1px",
              marginBottom: "8px",
            }}
          >
            ZitaFlow
          </div>
          <div
            style={{
              fontSize: "14px",
              opacity: 0.95,
              fontWeight: 300,
            }}
          >
            Time Tracking Made Simple
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "40px 30px" }}>
          {/* Tab Container */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "30px",
              borderBottom: "2px solid #f3f4f6",
            }}
          >
            <button
              onClick={() => switchTab("login")}
              style={{
                flex: 1,
                padding: "12px",
                background: "none",
                border: "none",
                fontSize: "16px",
                fontWeight: 600,
                color: currentTab === "login" ? "#dc2626" : "#6b7280",
                cursor: "pointer",
                transition: "all 0.3s ease",
                borderBottom:
                  currentTab === "login"
                    ? "3px solid #dc2626"
                    : "3px solid transparent",
                marginBottom: "-2px",
              }}
            >
              Login
            </button>
            <button
              onClick={() => switchTab("signup")}
              style={{
                flex: 1,
                padding: "12px",
                background: "none",
                border: "none",
                fontSize: "16px",
                fontWeight: 600,
                color: currentTab === "signup" ? "#dc2626" : "#6b7280",
                cursor: "pointer",
                transition: "all 0.3s ease",
                borderBottom:
                  currentTab === "signup"
                    ? "3px solid #dc2626"
                    : "3px solid transparent",
                marginBottom: "-2px",
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Login Form */}
          {currentTab === "login" && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: 600,
                    color: "#374151",
                    fontSize: "14px",
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "15px",
                    outline: "none",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#dc2626";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(220, 38, 38, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: 600,
                    color: "#374151",
                    fontSize: "14px",
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "15px",
                    outline: "none",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#dc2626";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(220, 38, 38, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div
                style={{
                  textAlign: "right",
                  marginTop: "-10px",
                  marginBottom: "20px",
                }}
              >
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Password reset coming soon!");
                  }}
                  style={{
                    color: "#dc2626",
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  Forgot password?
                </a>
              </div>

              <button
                onClick={handleLogin}
                style={{
                  width: "100%",
                  padding: "14px",
                  background:
                    "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(220, 38, 38, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(220, 38, 38, 0.3)";
                }}
              >
                Login
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "25px 0",
                  color: "#9ca3af",
                  fontSize: "13px",
                }}
              >
                <div
                  style={{ flex: 1, height: "1px", background: "#e5e7eb" }}
                />
                <span style={{ padding: "0 15px" }}>or continue with</span>
                <div
                  style={{ flex: 1, height: "1px", background: "#e5e7eb" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => alert("Google login coming soon!")}
                  style={{
                    flex: 1,
                    padding: "12px",
                    border: "2px solid #e5e7eb",
                    background: "white",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    fontWeight: 500,
                    color: "#374151",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#dc2626";
                    e.currentTarget.style.background = "#fef2f2";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.background = "white";
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path
                      fill="#4285F4"
                      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                    />
                    <path
                      fill="#34A853"
                      d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.335z"
                    />
                    <path
                      fill="#EA4335"
                      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                    />
                  </svg>
                  Google
                </button>
                <button
                  onClick={() => alert("Microsoft login coming soon!")}
                  style={{
                    flex: 1,
                    padding: "12px",
                    border: "2px solid #e5e7eb",
                    background: "white",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    fontWeight: 500,
                    color: "#374151",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#dc2626";
                    e.currentTarget.style.background = "#fef2f2";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.background = "white";
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 23 23">
                    <path fill="#f25022" d="M0 0h11v11H0z" />
                    <path fill="#00a4ef" d="M12 0h11v11H12z" />
                    <path fill="#7fba00" d="M0 12h11v11H0z" />
                    <path fill="#ffb900" d="M12 12h11v11H12z" />
                  </svg>
                  Microsoft
                </button>
              </div>
            </div>
          )}

          {/* Signup Form */}
          {currentTab === "signup" && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: 600,
                    color: "#374151",
                    fontSize: "14px",
                  }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="John Doe"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "15px",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#dc2626";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(220, 38, 38, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: 600,
                    color: "#374151",
                    fontSize: "14px",
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "15px",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#dc2626";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(220, 38, 38, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: 600,
                    color: "#374151",
                    fontSize: "14px",
                  }}
                >
                  Company Name
                </label>
                <input
                  type="text"
                  value={signupCompany}
                  onChange={(e) => setSignupCompany(e.target.value)}
                  placeholder="Acme Corp"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "15px",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#dc2626";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(220, 38, 38, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: 600,
                    color: "#374151",
                    fontSize: "14px",
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "15px",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#dc2626";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(220, 38, 38, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: 600,
                    color: "#374151",
                    fontSize: "14px",
                  }}
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={signupConfirm}
                  onChange={(e) => setSignupConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "15px",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#dc2626";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(220, 38, 38, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <button
                onClick={handleSignup}
                style={{
                  width: "100%",
                  padding: "14px",
                  background:
                    "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(220, 38, 38, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(220, 38, 38, 0.3)";
                }}
              >
                Create Account
              </button>

              <div
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                Already have an account?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    switchTab("login");
                  }}
                  style={{
                    color: "#dc2626",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Login
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
