import * as React from "../../../miniact.js";
import { Filter } from "../../types.js";

function Search() {
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
      className="lucide lucide-search-icon lucide-search"
    >
      <path d="m21 21-4.34-4.34" />
      <circle cx="11" cy="11" r="8" />
    </svg>
  );
}

function X() {
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
      className="lucide lucide-x-icon lucide-x"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function SlidersHorizontal() {
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
      className="lucide lucide-sliders-horizontal-icon lucide-sliders-horizontal"
    >
      <line x1="21" x2="14" y1="4" y2="4" />
      <line x1="10" x2="3" y1="4" y2="4" />
      <line x1="21" x2="12" y1="12" y2="12" />
      <line x1="8" x2="3" y1="12" y2="12" />
      <line x1="21" x2="16" y1="20" y2="20" />
      <line x1="12" x2="3" y1="20" y2="20" />
      <line x1="14" x2="14" y1="2" y2="6" />
      <line x1="8" x2="8" y1="10" y2="14" />
      <line x1="16" x2="16" y1="18" y2="22" />
    </svg>
  );
}

interface TaskFiltersProps {
  filters: Filter;
  onFilterChange: (filters: Filter) => void;
  onClearFilters: () => void;
  tasksCount: {
    all: number;
    active: number;
    completed: number;
  };
}

const TaskFilters = ({ filters, onFilterChange, onClearFilters, tasksCount }) => {
  const handleStatusChange = (status: Filter["status"]) => {
    onFilterChange({ ...filters, status });
  };

  const handlePriorityChange = (e) => {
    onFilterChange({ ...filters, priority: e.target.value as Filter["priority"] });
  };

  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const isFiltered = filters.status !== "all" || filters.priority !== "all" || filters.search !== "";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex space-x-1">
          <button
            onClick={() => handleStatusChange("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filters.status === "all"
                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            All ({tasksCount.all})
          </button>
          <button
            onClick={() => handleStatusChange("active")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filters.status === "active"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            Active ({tasksCount.active})
          </button>
          <button
            onClick={() => handleStatusChange("completed")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filters.status === "completed"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            Completed ({tasksCount.completed})
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative flex items-center">
              <SlidersHorizontal size={16} className="absolute left-3 text-gray-500 dark:text-gray-400" />
              <select
                value={filters.priority}
                onChange={handlePriorityChange}
                className="pl-9 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {isFiltered && (
              <button
                onClick={onClearFilters}
                className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <X size={16} className="mr-1" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
