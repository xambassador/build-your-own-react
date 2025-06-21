// @ts-nocheck

import { useState, useEffect } from "../../miniact-dom.js";
import * as React from "../../miniact.js";
import { Task, Filter, ThemeSettings } from "../types.js";
import TaskItem from "./components/TaskItem.js";
import TaskForm from "./components/TaskForm.js";
import TaskFilters from "./components/TaskFilters.js";
import ThemeToggle from "./components/ThemeToggle.js";
import EmptyState from "./components/EmptyState.js";

function ListChecks() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-list-checks-icon lucide-list-checks"
    >
      <path d="m3 17 2 2 4-4" />
      <path d="m3 7 2 2 4-4" />
      <path d="M13 6h8" />
      <path d="M13 12h8" />
      <path d="M13 18h8" />
    </svg>
  );
}

function Plus() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-plus-icon lucide-plus"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Complete React reimplementation",
    completed: false,
    priority: "high",
    dueDate: "2025-06-15",
    description: "Finish building the custom React implementation with useState and useEffect hooks.",
    tags: ["react", "project"]
  },
  {
    id: "2",
    title: "Write documentation",
    completed: false,
    priority: "medium",
    dueDate: "2025-06-20",
    description: "Document how the custom React implementation works with examples.",
    tags: ["docs"]
  },
  {
    id: "3",
    title: "Create demo application",
    completed: true,
    priority: "medium",
    dueDate: "2025-06-10",
    description: "Build a demo app to showcase the custom React implementation.",
    tags: ["demo", "ui"]
  }
];

const initialFilters: Filter = {
  status: "all",
  priority: "all",
  search: ""
};

const initialTheme: ThemeSettings = {
  mode: "light",
  accentColor: "#9E7FFF",
  fontSize: "medium"
};

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks !== null ? JSON.parse(savedTasks) : initialTasks;
  });

  const [filters, setFilters] = useState<Filter>(initialFilters);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [theme, setTheme] = useState<ThemeSettings>(() => {
    const savedTheme = localStorage.getItem("theme");
    // return savedTheme ? JSON.parse(savedTheme) : initialTheme;
    return initialTheme;
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);

  const filteredTasks = tasks.filter((task) => {
    if (filters.status === "active" && task.completed) return false;
    if (filters.status === "completed" && !task.completed) return false;
    if (filters.priority !== "all" && task.priority !== filters.priority) return false;
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) {
      const inDescription = task.description.toLowerCase().includes(filters.search.toLowerCase());
      const inTags = task.tags.some((tag) => tag.toLowerCase().includes(filters.search.toLowerCase()));

      if (!inDescription && !inTags) return false;
    }

    return true;
  });

  const tasksCount = {
    all: tasks.length,
    active: tasks.filter((task) => !task.completed).length,
    completed: tasks.filter((task) => task.completed).length
  };

  const handleAddTask = (newTask: Task) => {
    setTasks([...tasks, newTask]);
    setShowForm(false);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    setEditTask(null);
    setShowForm(false);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setShowForm(true);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-purple-600 dark:bg-purple-700 p-2 rounded-lg mr-3">
                <ListChecks size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Task Manager</h1>
            </div>
            <ThemeToggle theme={theme} onThemeChange={setTheme} />
          </div>
        </header>

        <main>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {showForm ? (editTask ? "Edit Task" : "New Task") : "My Tasks"}
            </h2>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
              >
                <Plus size={18} className="mr-1" />
                Add Task
              </button>
            )}
          </div>

          {showForm ? (
            <TaskForm
              onSubmit={editTask ? handleUpdateTask : handleAddTask}
              onCancel={() => {
                setShowForm(false);
                setEditTask(null);
              }}
              editTask={editTask}
            />
          ) : (
            <div>
              <TaskFilters
                filters={filters}
                onFilterChange={setFilters}
                onClearFilters={handleClearFilters}
                tasksCount={tasksCount}
              />

              {tasks.length === 0 ? (
                <EmptyState onAddTask={() => setShowForm(true)} />
              ) : filteredTasks.length === 0 ? (
                <EmptyState onAddTask={() => setShowForm(true)} filtered={true} />
              ) : (
                <div className="space-y-4">
                  {filteredTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onDelete={handleDeleteTask}
                      onEdit={handleEditTask}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        <footer className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">Built with miniact</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
