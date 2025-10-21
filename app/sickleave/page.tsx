"use client";
import React, { JSX, useState } from "react";
import {
  Heart,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Calendar,
  FileText,
  Clock,
  Upload,
} from "lucide-react";

interface SickLeave {
  id: number;
  startDate: string;
  endDate: string;
  reason: string;
  hasMedicalCertificate: boolean;
  certificateFile?: string;
  status: "pending" | "approved" | "rejected";
  totalDays: number;
  createdAt: string;
}

export default function SickLeaveBooking(): JSX.Element {
  const [sickLeaves, setSickLeaves] = useState<SickLeave[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [hasCertificate, setHasCertificate] = useState<boolean>(false);
  const [certificateFileName, setCertificateFileName] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const calculateDays = (start: string, end: string): number => {
    const startD = new Date(start);
    const endD = new Date(end);
    const diffTime = Math.abs(endD.getTime() - startD.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const validateDates = (start: string, end: string): string[] => {
    const validationErrors: string[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startD = new Date(start);
    const endD = new Date(end);

    if (endD < startD) {
      validationErrors.push("End date must be after or equal to start date");
    }

    // Check for overlapping sick leaves
    const hasOverlap = sickLeaves.some((leave) => {
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);

      return (
        (startD >= leaveStart && startD <= leaveEnd) ||
        (endD >= leaveStart && endD <= leaveEnd) ||
        (startD <= leaveStart && endD >= leaveEnd)
      );
    });

    if (hasOverlap) {
      validationErrors.push("This period overlaps with an existing sick leave");
    }

    return validationErrors;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setCertificateFileName(file.name);
    }
  };

  const handleSubmitSickLeave = (): void => {
    setErrors([]);
    setSuccessMessage("");

    const validationErrors: string[] = [];

    if (!startDate) {
      validationErrors.push("Start date is required");
    }
    if (!endDate) {
      validationErrors.push("End date is required");
    }
    if (!reason.trim()) {
      validationErrors.push("Reason for sick leave is required");
    }

    if (startDate && endDate) {
      const dateErrors = validateDates(startDate, endDate);
      validationErrors.push(...dateErrors);

      const days = calculateDays(startDate, endDate);
      if (days > 3 && !hasCertificate) {
        validationErrors.push(
          "Medical certificate is required for sick leave longer than 3 days"
        );
      }
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const totalDays = calculateDays(startDate, endDate);
    const newSickLeave: SickLeave = {
      id: Date.now(),
      startDate,
      endDate,
      reason: reason.trim(),
      hasMedicalCertificate: hasCertificate,
      certificateFile: certificateFileName || undefined,
      status: "pending",
      totalDays,
      createdAt: new Date().toISOString(),
    };

    setSickLeaves([...sickLeaves, newSickLeave]);
    setSuccessMessage(
      "Sick leave submitted successfully! Your manager will review it."
    );

    // Reset form
    setStartDate("");
    setEndDate("");
    setReason("");
    setHasCertificate(false);
    setCertificateFileName("");

    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const handleDeleteSickLeave = (id: number): void => {
    setSickLeaves(sickLeaves.filter((leave) => leave.id !== id));
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

  const getStatusColor = (status: SickLeave["status"]): string => {
    switch (status) {
      case "approved":
        return "bg-green-50 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  const getStatusText = (status: SickLeave["status"]): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const totalSickDays = sickLeaves.reduce(
    (sum, leave) => sum + leave.totalDays,
    0
  );
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
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Sick Leave Management
                </h1>
                <p className="text-red-100 text-sm mt-1">
                  Report and track your medical leave
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
                <p className="text-sm font-medium text-gray-600">
                  Total Sick Days
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalSickDays}
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
                <p className="text-sm font-medium text-gray-600">This Year</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalSickDays}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <Clock className="w-6 h-6 text-red-600" />
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
                  {sickLeaves.length}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sick Leave Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Report Sick Leave
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Submit your medical leave request
                </p>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setErrors([]);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                </div>

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

                {startDate && endDate && (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Duration:</span>{" "}
                      {calculateDays(startDate, endDate)} day(s)
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Reason <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Describe your illness or medical condition..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="hasCertificate"
                      checked={hasCertificate}
                      onChange={(e) => setHasCertificate(e.target.checked)}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label
                      htmlFor="hasCertificate"
                      className="text-sm font-medium text-gray-700"
                    >
                      I have a medical certificate
                    </label>
                  </div>

                  {hasCertificate && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Upload Medical Certificate
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          id="certificate-upload"
                        />
                        <label
                          htmlFor="certificate-upload"
                          className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 cursor-pointer transition-all"
                        >
                          <Upload className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {certificateFileName || "Choose file..."}
                          </span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Accepted: PDF, JPG, PNG (Max 5MB)
                      </p>
                    </div>
                  )}
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
                  onClick={handleSubmitSickLeave}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                  Submit Sick Leave
                </button>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs text-blue-800 leading-relaxed">
                    <strong>Note:</strong> Medical certificate is required for
                    sick leave exceeding 3 days. Please submit your request as
                    soon as possible.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sick Leave History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Sick Leave History
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {sickLeaves.length}{" "}
                  {sickLeaves.length === 1 ? "request" : "requests"} submitted
                </p>
              </div>

              <div className="p-6">
                {sickLeaves.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <Heart className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No sick leave records
                    </h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                      You haven't submitted any sick leave requests yet. Use the
                      form to report when you're unwell.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sickLeaves
                      .sort(
                        (a, b) =>
                          new Date(b.startDate).getTime() -
                          new Date(a.startDate).getTime()
                      )
                      .map((leave) => (
                        <div
                          key={leave.id}
                          className="border border-gray-200 rounded-lg p-5 hover:border-red-200 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                    leave.status
                                  )}`}
                                >
                                  {getStatusText(leave.status)}
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                                  {leave.totalDays}{" "}
                                  {leave.totalDays === 1 ? "day" : "days"}
                                </span>
                                {leave.hasMedicalCertificate && (
                                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
                                    Certificate Provided
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2 text-gray-900 mb-3">
                                <Calendar className="w-4 h-4 text-red-600" />
                                <span className="font-semibold">
                                  {formatDate(leave.startDate)}
                                </span>
                                <span className="text-gray-400">→</span>
                                <span className="font-semibold">
                                  {formatDate(leave.endDate)}
                                </span>
                              </div>

                              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <p className="text-sm font-semibold text-gray-700 mb-1">
                                  Reason:
                                </p>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {leave.reason}
                                </p>
                              </div>

                              {leave.certificateFile && (
                                <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                                  <FileText className="w-4 h-4 text-red-600" />
                                  <span>{leave.certificateFile}</span>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => handleDeleteSickLeave(leave.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Delete request"
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
