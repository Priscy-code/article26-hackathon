"use client";
import React from "react";
import { CheckCircle2, Circle, Trash2 } from "lucide-react";

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <p className="text-gray-500 text-lg font-medium">No tasks yet</p>
        <p className="text-gray-400 text-sm mt-1">
          Add your first task to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className={`group flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:shadow-md
            ${
              task.completed
                ? "bg-gray-50 border-gray-200"
                : "bg-white border-gray-200 hover:border-red-300"
            }
          `}
          style={{
            animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
          }}
        >
          {/* Checkbox */}
          <button
            onClick={() => onToggle(task.id)}
            className="flex-shrink-0 transition-transform hover:scale-110"
          >
            {task.completed ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : (
              <Circle className="w-6 h-6 text-gray-400 group-hover:text-red-500" />
            )}
          </button>

          {/* Task Text */}
          <div className="flex-1 min-w-0">
            <p
              onClick={() => onToggle(task.id)}
              className={`cursor-pointer text-base transition-all
                ${
                  task.completed
                    ? "line-through text-gray-400"
                    : "text-gray-800 group-hover:text-red-600"
                }
              `}
            >
              {task.text}
            </p>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(task.id)}
            className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
            title="Delete task"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ))}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
