"use client";
import React, { JSX, useState } from "react";
import {
  Umbrella,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Calendar,
  MapPin,
  Clock,
  Sun,
  Sunset,
} from "lucide-react";

interface Vacation {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
  notes?: string;
  vacationType: "full-day" | "half-day";
  halfDayPeriod?: "morning" | "afternoon";
  totalDays: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function VacationBooking(): JSX.Element {
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [destination, setDestination] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [vacationType, setVacationType] = useState<"full-day" | "half-day">(
    "full-day"
  );
  const [halfDayPeriod, setHalfDayPeriod] = useState<"morning" | "afternoon">(
    "morning"
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const calculateDays = (
    start: string,
    end: string,
    type: "full-day" | "half-day"
  ): number => {
    if (type === "half-day") {
      return 0.5;
    }
    const startD = new Date(start);
    const endD = new Date(end);
    const diffTime = Math.abs(endD.getTime() - startD.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const validateDates = (
    start: string,
    end: string,
    type: "full-day" | "half-day"
  ): string[] => {
    const validationErrors: string[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startD = new Date(start);
    const endD = new Date(end);

    if (startD < today) {
      validationErrors.push("Start date cannot be in the past");
    }

    if (type === "full-day" && endD < startD) {
      validationErrors.push("End date must be after or equal to start date");
    }

    if (type === "half-day" && start !== end) {
      validationErrors.push("Half-day vacation must be on a single day");
    }

    // Check for overlapping vacations
    const hasOverlap = vacations.some((vacation) => {
      const vacStart = new Date(vacation.startDate);
      const vacEnd = new Date(vacation.endDate);

      return (
        (startD >= vacStart && startD <= vacEnd) ||
        (endD >= vacStart && endD <= vacEnd) ||
        (startD <= vacStart && endD >= vacEnd)
      );
    });

    if (hasOverlap) {
      validationErrors.push(
        "This period overlaps with an existing vacation booking"
      );
    }

    return validationErrors;
  };

  const handleSubmitVacation = (): void => {
    setErrors([]);
    setSuccessMessage("");

    const validationErrors: string[] = [];

    if (!destination.trim()) {
      validationErrors.push("Destination is required");
    }
    if (!startDate) {
      validationErrors.push("Start date is required");
    }
    if (!endDate) {
      validationErrors.push("End date is required");
    }

    if (startDate && endDate) {
      const dateErrors = validateDates(startDate, endDate, vacationType);
      validationErrors.push(...dateErrors);

      // Check if user has enough vacation days left
      const requestedDays = calculateDays(startDate, endDate, vacationType);
      if (totalVacationDays + requestedDays > 30) {
        validationErrors.push(
          `Not enough vacation days. You have ${vacationDaysLeft} days remaining, but requesting ${requestedDays} days.`
        );
      }
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    const totalDays = calculateDays(startDate, endDate, vacationType);
    const newVacation: Vacation = {
      id: Date.now(),
      destination: destination.trim(),
      startDate,
      endDate,
      notes: notes.trim(),
      vacationType,
      halfDayPeriod: vacationType === "half-day" ? halfDayPeriod : undefined,
      totalDays,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setVacations([...vacations, newVacation]);
    setSuccessMessage(
      "Vacation request submitted successfully! Awaiting approval."
    );

    // Reset form
    setDestination("");
    setStartDate("");
    setEndDate("");
    setNotes("");
    setVacationType("full-day");
    setHalfDayPeriod("morning");

    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const handleDeleteVacation = (id: number): void => {
    setVacations(vacations.filter((vacation) => vacation.id !== id));
    setErrors([]);
    setSuccessMessage("");
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: Vacation["status"]): string => {
    switch (status) {
      case "approved":
        return "bg-green-50 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  const getStatusText = (status: Vacation["status"]): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const totalVacationDays = vacations.reduce(
    (sum, vacation) => sum + vacation.totalDays,
    0
  );
  const vacationDaysLeft = 30 - totalVacationDays;
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar */}
      <div className="bg-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-lg p-3">
                <Umbrella className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Vacation Management
                </h1>
                <p className="text-red-100 text-sm mt-1">
                  Plan and request your time off
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-red-700 px-4 py-2 rounded-lg">
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-medium">{today}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Days Used</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalVacationDays}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Days Remaining
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {vacationDaysLeft}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <Sun className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Requests
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {vacations.length}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <Umbrella className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vacation Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Book Vacation
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Request your time off
                </p>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Destination <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => {
                        setDestination(e.target.value);
                        setErrors([]);
                      }}
                      placeholder="Where are you going?"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Vacation Type <span className="text-red-600">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setVacationType("full-day")}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        vacationType === "full-day"
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-red-300"
                      }`}
                    >
                      <Sun className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm font-semibold">Full Day</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVacationType("half-day")}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        vacationType === "half-day"
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-red-300"
                      }`}
                    >
                      <Sunset className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm font-semibold">Half Day</p>
                    </button>
                  </div>
                </div>

                {vacationType === "half-day" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Period <span className="text-red-600">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setHalfDayPeriod("morning")}
                        className={`p-3 border-2 rounded-lg transition-all ${
                          halfDayPeriod === "morning"
                            ? "border-red-500 bg-red-50 text-red-700"
                            : "border-gray-300 bg-white text-gray-700 hover:border-red-300"
                        }`}
                      >
                        <p className="text-sm font-semibold">Morning</p>
                        <p className="text-xs text-gray-500">08:00 - 12:00</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setHalfDayPeriod("afternoon")}
                        className={`p-3 border-2 rounded-lg transition-all ${
                          halfDayPeriod === "afternoon"
                            ? "border-red-500 bg-red-50 text-red-700"
                            : "border-gray-300 bg-white text-gray-700 hover:border-red-300"
                        }`}
                      >
                        <p className="text-sm font-semibold">Afternoon</p>
                        <p className="text-xs text-gray-500">12:00 - 16:00</p>
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (vacationType === "half-day") {
                        setEndDate(e.target.value);
                      }
                      setErrors([]);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                </div>

                {vacationType === "full-day" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      End Date <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setErrors([]);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    />
                  </div>
                )}

                {startDate && endDate && (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Duration:</span>{" "}
                      {calculateDays(startDate, endDate, vacationType)} day(s)
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notes
                    <span className="text-gray-400 font-normal ml-1">
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional information..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none transition-all"
                  />
                </div>

                {errors.length > 0 && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-red-800 mb-2">
                          Validation Error{errors.length > 1 ? "s" : ""}
                        </h3>
                        <ul className="space-y-1">
                          {errors.map((error, index) => (
                            <li
                              key={index}
                              className="text-sm text-red-700 flex items-start gap-2"
                            >
                              <span className="text-red-500 mt-1">•</span>
                              <span>{error}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {successMessage && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <p className="text-sm font-medium text-green-800">
                        {successMessage}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSubmitVacation}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                  Request Vacation
                </button>
              </div>
            </div>
          </div>

          {/* Vacation List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Vacation Requests
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {vacations.length}{" "}
                  {vacations.length === 1 ? "request" : "requests"} submitted
                </p>
              </div>

              <div className="p-6">
                {vacations.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <Umbrella className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No vacation requests
                    </h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                      You haven't booked any vacations yet. Use the form to plan
                      your time off.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {vacations
                      .sort(
                        (a, b) =>
                          new Date(b.startDate).getTime() -
                          new Date(a.startDate).getTime()
                      )
                      .map((vacation) => (
                        <div
                          key={vacation.id}
                          className="border border-gray-200 rounded-lg p-5 hover:border-red-200 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3 flex-wrap">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                    vacation.status
                                  )}`}
                                >
                                  {getStatusText(vacation.status)}
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                                  {vacation.totalDays}{" "}
                                  {vacation.totalDays === 1 ? "day" : "days"}
                                </span>
                                <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-semibold border border-red-100">
                                  {vacation.vacationType === "full-day"
                                    ? "Full Day"
                                    : `Half Day (${vacation.halfDayPeriod})`}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-gray-900 mb-3">
                                <MapPin className="w-4 h-4 text-red-600" />
                                <span className="text-lg font-bold">
                                  {vacation.destination}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-gray-700 mb-3">
                                <Calendar className="w-4 h-4 text-red-600" />
                                <span className="font-semibold">
                                  {formatDate(vacation.startDate)}
                                </span>
                                {vacation.vacationType === "full-day" &&
                                  vacation.startDate !== vacation.endDate && (
                                    <>
                                      <span className="text-gray-400">→</span>
                                      <span className="font-semibold">
                                        {formatDate(vacation.endDate)}
                                      </span>
                                    </>
                                  )}
                              </div>

                              {vacation.notes && (
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                  <p className="text-sm text-gray-600 leading-relaxed">
                                    {vacation.notes}
                                  </p>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => handleDeleteVacation(vacation.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Cancel vacation"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
