"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Clock, TrendingUp, Users, BarChart3 } from "lucide-react";

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
import LoginImage from "../../../public/login image.jpeg"

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<"login" | "signup">("login");
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [signupName, setSignupName] = useState<string>("");
  const [signupEmail, setSignupEmail] = useState<string>("");
  const [signupCompany, setSignupCompany] = useState<string>("");
  const [signupPassword, setSignupPassword] = useState<string>("");
  const [signupConfirm, setSignupConfirm] = useState<string>("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent): void => {
    e.preventDefault();
    window.currentUser = { email: loginEmail, loggedIn: true };
    alert(`Welcome back! Logging in as ${loginEmail}`);
    router.push("/userDashboard");
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
    router.push("/userDashboard");
  };

  const switchTab = (tab: "login" | "signup"): void => {
    setCurrentTab(tab);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left Side - Image/Branding */}
          <div className="hidden md:flex bg-gradient-to-br from-red-600 to-red-800 p-12 flex-col justify-between text-white relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -ml-48 -mb-48"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <Clock className="w-7 h-7" />
                </div>
                <h1 className="text-3xl font-bold">ZeitFlow</h1>
              </div>

              <div className="space-y-6 mb-12">
                <h2 className="text-4xl font-bold leading-tight">
                  Track Your Time,
                  <br />
                  Boost Your Productivity
                </h2>
                <p className="text-red-100 text-lg">
                  Join thousands of professionals who manage their time
                  efficiently with ZeitFlow
                </p>
              </div>

              {/* Features */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Real-time Tracking
                    </h3>
                    <p className="text-red-100 text-sm">
                      Monitor your work hours and project time instantly
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Analytics Dashboard
                    </h3>
                    <p className="text-red-100 text-sm">
                      Get insights into your productivity patterns
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Team Collaboration
                    </h3>
                    <p className="text-red-100 text-sm">
                      Work seamlessly with your team members
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <p className="text-red-100 text-sm">
                "ZeitFlow transformed how we manage our projects. It's intuitive
                and powerful!"
              </p>
              <p className="text-white font-semibold mt-2">
                — Sarah Chen, Project Manager
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 md:p-12">
            <div className="max-w-md mx-auto">
              {/* Mobile Logo */}
              <div className="md:hidden flex items-center gap-2 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">ZeitFlow</h1>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 mb-8 border-b-2 border-gray-200">
                <button
                  onClick={() => switchTab("login")}
                  className={`pb-4 px-2 font-semibold text-lg transition-all ${
                    currentTab === "login"
                      ? "text-red-600 border-b-3 border-red-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  style={{
                    borderBottom:
                      currentTab === "login" ? "3px solid #dc2626" : "none",
                    marginBottom: "-2px",
                  }}
                >
                  Login
                </button>
                <button
                  onClick={() => switchTab("signup")}
                  className={`pb-4 px-2 font-semibold text-lg transition-all ${
                    currentTab === "signup"
                      ? "text-red-600 border-b-3 border-red-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  style={{
                    borderBottom:
                      currentTab === "signup" ? "3px solid #dc2626" : "none",
                    marginBottom: "-2px",
                  }}
                >
                  Sign Up
                </button>
              </div>

              {/* Login Form */}
              {currentTab === "login" && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Welcome back
                    </h2>
                    <p className="text-gray-600">
                      Enter your credentials to access your account
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <a
                      href="#"
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <button
                    onClick={handleLogin}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  >
                    Login
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all">
                      <svg width="20" height="20" viewBox="0 0 18 18">
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
                      <span className="font-medium text-gray-700">Google</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all">
                      <svg width="20" height="20" viewBox="0 0 23 23">
                        <path fill="#f25022" d="M0 0h11v11H0z" />
                        <path fill="#00a4ef" d="M12 0h11v11H12z" />
                        <path fill="#7fba00" d="M0 12h11v11H0z" />
                        <path fill="#ffb900" d="M12 12h11v11H12z" />
                      </svg>
                      <span className="font-medium text-gray-700">
                        Microsoft
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Signup Form */}
              {currentTab === "signup" && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Create account
                    </h2>
                    <p className="text-gray-600">
                      Get started with your free account
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={signupCompany}
                      onChange={(e) => setSignupCompany(e.target.value)}
                      placeholder="Acme Corp"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      required
                      minLength={8}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={signupConfirm}
                      onChange={(e) => setSignupConfirm(e.target.value)}
                      placeholder="Re-enter password"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all"
                    />
                  </div>

                  <button
                    onClick={handleSignup}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  >
                    Create Account
                  </button>

                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                      onClick={() => switchTab("login")}
                      className="text-red-600 hover:text-red-700 font-semibold"
                    >
                      Login
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
