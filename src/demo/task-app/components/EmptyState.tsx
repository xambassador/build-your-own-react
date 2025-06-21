import * as React from "../../../miniact.js";

function ClipboardList() {
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
      className="lucide lucide-clipboard-list-icon lucide-clipboard-list"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  );
}

const EmptyState = ({ onAddTask, filtered = false }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full mb-4">
        <ClipboardList size={40} className="text-purple-600 dark:text-purple-400" />
      </div>

      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
        {filtered ? "No matching tasks found" : "No tasks yet"}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
        {filtered
          ? "Try adjusting your filters or search terms to find what you're looking for."
          : "Start by adding your first task to keep track of what needs to be done."}
      </p>

      {!filtered && (
        <button
          onClick={onAddTask}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
        >
          Add Your First Task
        </button>
      )}
    </div>
  );
};

export default EmptyState;
