"use client";
import { useState, useMemo } from "react";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";


export interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}
export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
}


export default function TaskModePage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const stats: TaskStats = useMemo(
    () => ({
      total: tasks.length,
      completed: tasks.filter((t) => t.completed).length,
      pending: tasks.filter((t) => !t.completed).length,
    }),
    [tasks]
  );

  const addTask = (taskText: string): void => {
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date(),
      },
    ]);
  };

  const toggleTask = (id: number): void => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number): void => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const clearCompleted = (): void => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Task Management
              </h1>
              <p className="text-gray-600">
                Organize and track your daily tasks
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {stats.total}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  Total
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.completed}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  Done
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {stats.pending}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  Pending
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <TaskForm onAdd={addTask} />

          {tasks.length > 0 && stats.completed > 0 && (
            <div className="mb-6 flex justify-end">
              <button
                onClick={clearCompleted}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                Clear completed tasks ({stats.completed})
              </button>
            </div>
          )}

          <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
        </div>
      </div>
    </div>
  );
}
