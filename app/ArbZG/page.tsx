"use client";
import React, { JSX, useState } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Coffee,
  Moon,
  TrendingUp,
  XCircle,
  Info,
} from "lucide-react";

interface WorkDay {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  breakDuration: number; // in minutes
  workingHours: number;
  violations: Violation[];
  isCompliant: boolean;
}

interface Violation {
  type:
    | "MAX_DAILY_HOURS"
    | "INSUFFICIENT_BREAK"
    | "INSUFFICIENT_REST"
    | "WEEKLY_LIMIT";
  message: string;
  severity: "critical" | "warning";
}

interface ComplianceStats {
  totalDays: number;
  compliantDays: number;
  violationDays: number;
  complianceRate: number;
}

export default function ArbZGCompliance(): JSX.Element {
  const [workDays, setWorkDays] = useState<WorkDay[]>([
    // Sample data for demonstration
    {
      id: 1,
      date: "2024-10-18",
      startTime: "08:00",
      endTime: "17:30",
      breakDuration: 45,
      workingHours: 8.75,
      violations: [],
      isCompliant: true,
    },
    {
      id: 2,
      date: "2024-10-17",
      startTime: "07:30",
      endTime: "19:00",
      breakDuration: 30,
      workingHours: 11,
      violations: [
        {
          type: "MAX_DAILY_HOURS",
          message:
            "Working hours exceeded 10 hours without proper compensation",
          severity: "critical",
        },
        {
          type: "INSUFFICIENT_BREAK",
          message:
            "Break time insufficient for working period over 9 hours (45 min required)",
          severity: "warning",
        },
      ],
      isCompliant: false,
    },
    {
      id: 3,
      date: "2024-10-16",
      startTime: "09:00",
      endTime: "17:00",
      breakDuration: 30,
      workingHours: 7.5,
      violations: [],
      isCompliant: true,
    },
  ]);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // ArbZG Rules
  const ARBZG_RULES = {
    maxDailyHours: 8,
    maxDailyHoursWithCompensation: 10,
    minRestPeriod: 11, // hours
    minBreakFor6Hours: 30, // minutes
    minBreakFor9Hours: 45, // minutes
    maxWeeklyHours: 48,
  };

  const calculateWorkingHours = (
    start: string,
    end: string,
    breakMinutes: number
  ): number => {
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    const totalMinutes =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    const workingMinutes = totalMinutes - breakMinutes;
    return Number((workingMinutes / 60).toFixed(2));
  };

  const checkCompliance = (
    workingHours: number,
    breakMinutes: number
  ): Violation[] => {
    const violations: Violation[] = [];

    // Check daily working hours
    if (workingHours > ARBZG_RULES.maxDailyHoursWithCompensation) {
      violations.push({
        type: "MAX_DAILY_HOURS",
        message: `Working hours (${workingHours}h) exceeded maximum of ${ARBZG_RULES.maxDailyHoursWithCompensation} hours`,
        severity: "critical",
      });
    } else if (workingHours > ARBZG_RULES.maxDailyHours) {
      violations.push({
        type: "MAX_DAILY_HOURS",
        message: `Working hours (${workingHours}h) exceeded standard ${ARBZG_RULES.maxDailyHours} hours. Compensation required.`,
        severity: "warning",
      });
    }

    // Check break requirements
    if (workingHours > 9 && breakMinutes < ARBZG_RULES.minBreakFor9Hours) {
      violations.push({
        type: "INSUFFICIENT_BREAK",
        message: `Break time (${breakMinutes} min) insufficient for work over 9 hours. Minimum ${ARBZG_RULES.minBreakFor9Hours} minutes required.`,
        severity: "critical",
      });
    } else if (
      workingHours > 6 &&
      breakMinutes < ARBZG_RULES.minBreakFor6Hours
    ) {
      violations.push({
        type: "INSUFFICIENT_BREAK",
        message: `Break time (${breakMinutes} min) insufficient for work over 6 hours. Minimum ${ARBZG_RULES.minBreakFor6Hours} minutes required.`,
        severity: "warning",
      });
    }

    return violations;
  };

  const checkRestPeriod = (
    currentDate: string,
    previousEndTime: string
  ): boolean => {
    if (!previousEndTime) return true;

    const current = new Date(`${currentDate}T08:00:00`);
    const previous = new Date(previousEndTime);
    const hoursDiff =
      (current.getTime() - previous.getTime()) / (1000 * 60 * 60);

    return hoursDiff >= ARBZG_RULES.minRestPeriod;
  };

  const calculateStats = (): ComplianceStats => {
    const total = workDays.length;
    const compliant = workDays.filter((day) => day.isCompliant).length;
    const violations = total - compliant;
    const rate = total > 0 ? Math.round((compliant / total) * 100) : 100;

    return {
      totalDays: total,
      compliantDays: compliant,
      violationDays: violations,
      complianceRate: rate,
    };
  };

  const calculateWeeklyHours = (): number => {
    const lastWeek = workDays.slice(0, 7);
    return lastWeek.reduce((sum, day) => sum + day.workingHours, 0);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getViolationIcon = (severity: "critical" | "warning"): JSX.Element => {
    return severity === "critical" ? (
      <XCircle className="w-4 h-4 text-red-600" />
    ) : (
      <AlertTriangle className="w-4 h-4 text-yellow-600" />
    );
  };

  const stats = calculateStats();
  const weeklyHours = calculateWeeklyHours();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar */}
      <div className="bg-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-lg p-3">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  ArbZG Compliance Monitor
                </h1>
                <p className="text-red-100 text-sm mt-1">
                  German Working Time Law Enforcement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-blue-50 rounded-lg p-3">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">
                Total Days
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalDays}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-green-50 rounded-lg p-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">
                Compliant
              </span>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {stats.compliantDays}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-red-50 rounded-lg p-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">
                Violations
              </span>
            </div>
            <p className="text-3xl font-bold text-red-600">
              {stats.violationDays}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-indigo-50 rounded-lg p-3">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Rate</span>
            </div>
            <p className="text-3xl font-bold text-indigo-600">
              {stats.complianceRate}%
            </p>
          </div>
        </div>

        {/* ArbZG Rules Reference */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                German Working Time Law (ArbZG) Requirements
              </h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-4">
                <div className="bg-red-50 rounded-lg p-3">
                  <Clock className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Daily Working Hours
                  </h3>
                  <p className="text-sm text-gray-600">
                    Maximum 8 hours standard
                  </p>
                  <p className="text-sm text-gray-600">
                    Up to 10 hours with compensation
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-red-50 rounded-lg p-3">
                  <Coffee className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Break Requirements
                  </h3>
                  <p className="text-sm text-gray-600">
                    30 minutes for 6-9 hours
                  </p>
                  <p className="text-sm text-gray-600">
                    45 minutes for over 9 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-red-50 rounded-lg p-3">
                  <Moon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Rest Period
                  </h3>
                  <p className="text-sm text-gray-600">
                    Minimum 11 hours between shifts
                  </p>
                  <p className="text-sm text-gray-600">
                    Mandatory for health protection
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-red-50 rounded-lg p-3">
                  <Calendar className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Weekly Limit
                  </h3>
                  <p className="text-sm text-gray-600">
                    Maximum 48 hours per week
                  </p>
                  <p className="text-sm text-gray-600">
                    6-month average compliance
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-red-50 rounded-lg p-3">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Sunday Work
                  </h3>
                  <p className="text-sm text-gray-600">Generally prohibited</p>
                  <p className="text-sm text-gray-600">
                    Exceptions require justification
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-red-50 rounded-lg p-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Night Work
                  </h3>
                  <p className="text-sm text-gray-600">
                    Maximum 8 hours (23:00-06:00)
                  </p>
                  <p className="text-sm text-gray-600">
                    Special health protection required
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Hours Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Weekly Working Hours
              </h3>
              <p className="text-sm text-gray-500 mt-1">Last 7 days tracked</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-gray-900">
                {weeklyHours.toFixed(1)}h
              </p>
              <div className="mt-2">
                {weeklyHours <= ARBZG_RULES.maxWeeklyHours ? (
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-semibold border border-green-200">
                    Within Limit
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-semibold border border-red-200">
                    Exceeds 48h Limit
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  weeklyHours <= ARBZG_RULES.maxWeeklyHours
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${Math.min((weeklyHours / 60) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>0h</span>
              <span>48h limit</span>
              <span>60h</span>
            </div>
          </div>
        </div>

        {/* Work Days List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Daily Compliance Report
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Detailed breakdown of working hours and violations
            </p>
          </div>

          <div className="p-6">
            {workDays.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No work days recorded
                </h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  Start tracking your working hours to monitor ArbZG compliance.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {workDays
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((day) => (
                    <div
                      key={day.id}
                      className={`border-2 rounded-lg p-5 transition-all duration-200 ${
                        day.isCompliant
                          ? "border-green-200 bg-green-50 hover:shadow-md"
                          : "border-red-200 bg-red-50 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            {day.isCompliant ? (
                              <div className="bg-green-100 rounded-full p-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              </div>
                            ) : (
                              <div className="bg-red-100 rounded-full p-2">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                              </div>
                            )}
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                {formatDate(day.date)}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {day.startTime} - {day.endTime} (
                                {day.workingHours}h working)
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <p className="text-xs font-medium text-gray-600 mb-1">
                                Start Time
                              </p>
                              <p className="text-sm font-bold text-gray-900">
                                {day.startTime}
                              </p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <p className="text-xs font-medium text-gray-600 mb-1">
                                End Time
                              </p>
                              <p className="text-sm font-bold text-gray-900">
                                {day.endTime}
                              </p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <p className="text-xs font-medium text-gray-600 mb-1">
                                Break
                              </p>
                              <p className="text-sm font-bold text-gray-900">
                                {day.breakDuration} min
                              </p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <p className="text-xs font-medium text-gray-600 mb-1">
                                Total Hours
                              </p>
                              <p className="text-sm font-bold text-gray-900">
                                {day.workingHours}h
                              </p>
                            </div>
                          </div>

                          {day.violations.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                Violations:
                              </h4>
                              {day.violations.map((violation, index) => (
                                <div
                                  key={index}
                                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                                    violation.severity === "critical"
                                      ? "bg-red-100 border-red-300"
                                      : "bg-yellow-50 border-yellow-300"
                                  }`}
                                >
                                  {getViolationIcon(violation.severity)}
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 mb-1">
                                      {violation.type.replace(/_/g, " ")}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                      {violation.message}
                                    </p>
                                  </div>
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-semibold ${
                                      violation.severity === "critical"
                                        ? "bg-red-200 text-red-800"
                                        : "bg-yellow-200 text-yellow-800"
                                    }`}
                                  >
                                    {violation.severity.toUpperCase()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {day.isCompliant && (
                            <div className="flex items-center gap-2 text-green-700 bg-green-100 px-4 py-2 rounded-lg">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm font-semibold">
                                All ArbZG requirements met
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Compliance Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 rounded-lg p-3">
              <Info className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Compliance Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    Plan your workday to stay within the 8-hour standard limit.
                    Exceeding 10 hours is a critical violation.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    Always take the required breaks: 30 minutes for 6-9 hours
                    work, 45 minutes for over 9 hours.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    Ensure at least 11 hours rest between work shifts for your
                    health and safety.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    Monitor your weekly hours to stay below the 48-hour limit
                    averaged over 6 months.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
