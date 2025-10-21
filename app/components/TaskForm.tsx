"use client";
import { useState } from "react";
import React from "react";

interface TaskFormProps {
  onAdd: (taskText: string) => void;
}

export default function TaskForm({ onAdd }: TaskFormProps) {
  const [task, setTask] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (task.trim() === "") return;
    onAdd(task);
    setTask("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full pl-5 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 text-gray-800 placeholder-gray-400 transition-all"
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl font-semibold"
        >
          Add Task
        </button>
      </div>
    </form>
  );
}
