import { useState } from "../../../miniact-dom.js";
import * as React from "../../../miniact.js";
import { Task } from "../../types.js";

function Check() {
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
      className="lucide lucide-check-icon lucide-check"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function Clock() {
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
      className="lucide lucide-clock-icon lucide-clock"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function Edit() {
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
      class="lucide lucide-square-pen-icon lucide-square-pen"
    >
      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
    </svg>
  );
}

function Trash() {
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
      className="lucide lucide-trash-icon lucide-trash"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function Tag() {
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
      className="lucide lucide-tag-icon lucide-tag"
    >
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
      <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
    </svg>
  );
}

function ChevronDown() {
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
      className="lucide lucide-chevron-down-icon lucide-chevron-down"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronUp() {
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
      className="lucide lucide-chevron-up-icon lucide-chevron-up"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
};

const TaskItem = ({ task, onToggleComplete, onDelete, onEdit }) => {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg mb-4">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <button
              onClick={() => onToggleComplete(task.id)}
              className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                task.completed
                  ? "bg-purple-600 border-purple-600 dark:bg-purple-500 dark:border-purple-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              {task.completed && <Check size={14} className="text-white" />}
            </button>

            <div className="flex-1">
              <h3
                className={`font-medium text-lg ${
                  task.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white"
                }`}
              >
                {task.title}
              </h3>

              <div className="flex flex-wrap items-center mt-2 gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>

                {task.dueDate && (
                  <span className="text-xs flex items-center text-gray-600 dark:text-gray-300">
                    <Clock size={12} className="mr-1" />
                    {formatDate(task.dueDate)}
                  </span>
                )}

                {task.tags.length > 0 && (
                  <div className="flex items-center">
                    <Tag size={12} className="mr-1 text-gray-500 dark:text-gray-400" />
                    <div className="flex gap-1">
                      {task.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-2 ml-2">
            <button
              onClick={() => onEdit(task)}
              className="p-1 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
            >
              <Trash size={16} />
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
      </div>

      {expanded && task.description && (
        <div className="px-4 pb-4 pt-0">
          <div className="mt-1 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
            {task.description}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
