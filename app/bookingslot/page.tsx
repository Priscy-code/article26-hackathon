"use client";

import React, { JSX, use, useState } from "react";
import {
  Clock,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Calendar,
} from "lucide-react";

interface Duration {
  hours: number;
  minutes: number;
  totalMinutes: number;
}

interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  comment: string;
  duration: Duration;
  createdAt: string;
}

export default function TimeBookingSystem(): JSX.Element {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const calculateDuration = (start: string, end: string): Duration => {
    const startDate = new Date(`2000-01-01T${start}`);
    const endDate = new Date(`2000-01-01T${end}`);
    const diffMs = endDate.getTime() - startDate.getTime();
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    return { hours, minutes, totalMinutes: diffMs / 60000 };
  };

  const checkOverlap = (
    newStart: string,
    newEnd: string
  ): { index: number; slot: TimeSlot }[] => {
    const conflicts: { index: number; slot: TimeSlot }[] = [];
    const newStartDate = new Date(`2000-01-01T${newStart}`);
    const newEndDate = new Date(`2000-01-01T${newEnd}`);

    timeSlots.forEach((slot, index) => {
      const slotStartDate = new Date(`2000-01-01T${slot.startTime}`);
      const slotEndDate = new Date(`2000-01-01T${slot.endTime}`);

      if (
        (newStartDate >= slotStartDate && newStartDate < slotEndDate) ||
        (newEndDate > slotStartDate && newEndDate <= slotEndDate) ||
        (newStartDate <= slotStartDate && newEndDate >= slotEndDate)
      ) {
        conflicts.push({ index, slot });
      }
    });

    return conflicts;
  };

  const handleSaveTimeSlot = (): void => {
    setErrors([]);
    setSuccessMessage("");

    const validationErrors: string[] = [];

    if (!startTime) {
      validationErrors.push("Start time is required");
    }
    if (!endTime) {
      validationErrors.push("End time is required");
    }

    if (startTime && endTime) {
      const startDate = new Date(`2000-01-01T${startTime}`);
      const endDate = new Date(`2000-01-01T${endTime}`);

      if (endDate <= startDate) {
        validationErrors.push("End time must be after start time");
      }

      const conflicts = checkOverlap(startTime, endTime);
      if (conflicts.length > 0) {
        conflicts.forEach(({ slot }) => {
          validationErrors.push(
            `Time slot overlaps with existing booking: ${slot.startTime} - ${
              slot.endTime
            }${slot.comment ? ` (${slot.comment})` : ""}`
          );
        });
      }
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const duration = calculateDuration(startTime, endTime);
    const newSlot: TimeSlot = {
      id: Date.now(),
      startTime,
      endTime,
      comment: comment.trim(),
      duration,
      createdAt: new Date().toISOString(),
    };

    setTimeSlots([...timeSlots, newSlot]);
    setSuccessMessage("Time slot saved successfully!");

    setStartTime("");
    setEndTime("");
    setComment("");

    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleDeleteSlot = (id: number): void => {
    setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
    setErrors([]);
    setSuccessMessage("");
  };

  const formatDuration = (duration: Duration): string => {
    if (duration.hours === 0) {
      return `${duration.minutes}m`;
    }
    if (duration.minutes === 0) {
      return `${duration.hours}h`;
    }
    return `${duration.hours}h ${duration.minutes}m`;
  };

  const calculateTotalHours = (): Duration => {
    const totalMinutes = timeSlots.reduce(
      (sum, slot) => sum + slot.duration.totalMinutes,
      0
    );
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return { hours, minutes, totalMinutes };
  };

  const totalTime = calculateTotalHours();
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
                <Clock className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Time Booking System
                </h1>
                <p className="text-red-100 text-sm mt-1">
                  Professional Time Management
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  New Time Entry
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Record your working hours
                </p>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Time <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                      setErrors([]);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Time <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => {
                      setEndTime(e.target.value);
                      setErrors([]);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Work Description
                    <span className="text-gray-400 font-normal ml-1">
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe your work activities..."
                    rows={4}
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
                  onClick={handleSaveTimeSlot}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                  Save Time Entry
                </button>
              </div>
            </div>
          </div>

          {/* Daily Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Today's Time Entries
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {timeSlots.length}{" "}
                    {timeSlots.length === 1 ? "entry" : "entries"} recorded
                  </p>
                </div>
                {timeSlots.length > 0 && (
                  <div className="bg-red-50 px-4 py-3 rounded-lg border border-red-100">
                    <p className="text-xs font-medium text-red-600 uppercase tracking-wide">
                      Total Time
                    </p>
                    <p className="text-2xl font-bold text-red-600 mt-1">
                      {totalTime.hours}h {totalTime.minutes}m
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6">
                {timeSlots.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <Clock className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No entries yet
                    </h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                      Start tracking your time by creating your first entry
                      using the form on the left.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {timeSlots
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((slot) => (
                        <div
                          key={slot.id}
                          className="border border-gray-200 rounded-lg p-5 hover:border-red-200 hover:shadow-md transition-all duration-200 bg-white"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="flex items-center gap-2 text-gray-900">
                                  <Clock className="w-4 h-4 text-red-600" />
                                  <span className="text-lg font-semibold">
                                    {slot.startTime}
                                  </span>
                                  <span className="text-gray-400">→</span>
                                  <span className="text-lg font-semibold">
                                    {slot.endTime}
                                  </span>
                                </div>
                                <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-semibold border border-red-100">
                                  {formatDuration(slot.duration)}
                                </span>
                              </div>
                              {slot.comment && (
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    {slot.comment}
                                  </p>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleDeleteSlot(slot.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Delete entry"
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
