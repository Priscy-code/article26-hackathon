"use client";
import React, { JSX, useState } from "react";
import {
  Clock,
  Calendar,
  Umbrella,
  Heart,
  Shield,
  ArrowRight,
  User,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  stats?: string;
  color: string;
  onClick?: () => void;
}

export default function UserDashboard(): JSX.Element {
  const [userName] = useState<string>("John Doe");
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const router = useRouter()


  const dashboardCards: DashboardCard[] = [
    {
      id: "time-booking",
      title: "Daily Time Booking",
      description:
        "Record your daily working hours and track time spent on tasks",
      icon: <Clock className="w-8 h-8" />,
      action: "Book Time",
      stats: "8.5h today",
      color: "red",
      onClick: () => router.push("/bookingslot"),
    },
    {
      id: "vacation",
      title: "Vacation Booking",
      description: "Request and manage your vacation days and time off",
      icon: <Umbrella className="w-8 h-8" />,
      action: "Book Vacation",
      stats: "15 days left",
      color: "red",
      onClick: () => router.push("/vaction"),
    },
    {
      id: "sick-leave",
      title: "Sick Leave Booking",
      description: "Report sick days and manage medical leave documentation",
      icon: <Heart className="w-8 h-8" />,
      action: "Report Sick Leave",
      stats: "2 days this year",
      color: "red",
      onClick: () => router.push("/sickleave"),
    },
    {
      id: "arbzg-compliance",
      title: "ArbZG Compliance",
      description:
        "Monitor compliance with German Working Time Law regulations",
      icon: <Shield className="w-8 h-8" />,
      action: "View Compliance",
      stats: "All compliant",
      color: "red",
      onClick: () => router.push("/ArbZG"),
    },
  ];

  const handleNavigate = (featureId: string): void => {
    setSelectedFeature(featureId);
    // In a real app, this would navigate to the respective feature
    console.log(`Navigating to: ${featureId}`);
  };

  const quickStats = [
    { label: "Hours This Week", value: "42.5h", trend: "+2.5h" },
    { label: "Vacation Days Left", value: "15", trend: "-3 days" },
    { label: "Overtime Balance", value: "+5.5h", trend: "+1.5h" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar */}
      <div className="bg-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-full p-3">
                <User className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Welcome back, {userName}
                </h1>
                <p className="text-red-100 text-sm mt-1">
                  Manage your time and leave efficiently
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <p className="text-sm text-red-100">Today</p>
                <p className="text-lg font-semibold">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-gray-500">
                  <TrendingUp className="w-4 h-4" />
                  <span>{stat.trend}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Cards */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Quick Access
          </h2>
          <p className="text-gray-600">Select a feature to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {dashboardCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-red-200 transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-red-50 rounded-lg p-4 text-red-600 group-hover:bg-red-100 transition-colors">
                    {card.icon}
                  </div>
                  {card.stats && (
                    <div className="bg-gray-50 px-3 py-1 rounded-full">
                      <span className="text-sm font-semibold text-gray-700">
                        {card.stats}
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  {card.description}
                </p>

                <button
                  onClick={card.onClick}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-md"
                >
                  {card.action}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ArbZG Information Banner */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                German Working Time Law (ArbZG) Compliance
              </h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Your time bookings are automatically monitored for compliance
                with German labor laws. This includes maximum working hours,
                mandatory breaks, and rest periods.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                    Daily Limit
                  </p>
                  <p className="text-lg font-bold text-gray-900">8 hours</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Max 10h with compensation
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                    Rest Period
                  </p>
                  <p className="text-lg font-bold text-gray-900">11 hours</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Between work days
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                    Break Time
                  </p>
                  <p className="text-lg font-bold text-gray-900">30-45 min</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Required for 6-9h work
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="bg-red-100 rounded-full p-2">
                <Clock className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Time entry recorded
                </p>
                <p className="text-xs text-gray-500">
                  8:00 AM - 5:00 PM (8 hours)
                </p>
              </div>
              <span className="text-xs text-gray-500">Today</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="bg-red-100 rounded-full p-2">
                <Umbrella className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Vacation approved
                </p>
                <p className="text-xs text-gray-500">
                  Dec 20-27, 2024 (5 days)
                </p>
              </div>
              <span className="text-xs text-gray-500">2 days ago</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="bg-red-100 rounded-full p-2">
                <Shield className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Compliance check passed
                </p>
                <p className="text-xs text-gray-500">
                  All working time regulations met
                </p>
              </div>
              <span className="text-xs text-gray-500">1 week ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
