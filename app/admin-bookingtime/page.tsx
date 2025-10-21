"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { useRef } from "react";

interface ProjectAccount {
  id: number;
  name: string;
  projectName: string;
}

export default function BookTime() {
  const router = useRouter();
  const params = useSearchParams();
  const userId = params.get("userId");
  const toast = useRef<Toast>(null);

  const [accounts, setAccounts] = useState<ProjectAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<ProjectAccount | null>(
    null
  );
  const [hours, setHours] = useState<number | null>(null);
  const [date, setDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setAccounts(data);
    } catch (error) {
      console.error(error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Could not fetch project accounts.",
      });
    }
  };

  const handleSubmit = async () => {
    if (!selectedAccount || !hours || !date) {
      toast.current?.show({
        severity: "warn",
        summary: "Missing Data",
        detail: "Please fill in all fields.",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(userId),
          projectAccountId: selectedAccount.id,
          date,
          hoursWorked: hours,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Booking saved successfully!",
        });
        setTimeout(() => router.push("/"), 1500);
      } else {
        throw new Error(data.error || "Error saving booking");
      }
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded-2xl">
      <Toast ref={toast} />
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Book Time</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Date</label>
          <Calendar
            value={date}
            onChange={(e) => setDate(e.value!)}
            showIcon
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Hours Worked</label>
          <InputNumber
            value={hours}
            onValueChange={(e) => setHours(e.value!)}
            showButtons
            step={0.5}
            min={0.5}
            max={12}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Project Account
          </label>
          <Dropdown
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.value)}
            options={accounts}
            optionLabel="name"
            placeholder="Select Project Account"
            className="w-full"
            itemTemplate={(option) => (
              <div>
                <div className="font-medium">{option.name}</div>
                <small className="text-gray-500">{option.projectName}</small>
              </div>
            )}
          />
        </div>

        <Button
          label={loading ? "Saving..." : "Save Booking"}
          icon="pi pi-check"
          loading={loading}
          onClick={handleSubmit}
          className="w-full mt-4"
          style={{
            backgroundColor: "var(--brand-color)",
            borderColor: "var(--brand-color)",
          }}
        />
      </div>
    </div>
  );
}
