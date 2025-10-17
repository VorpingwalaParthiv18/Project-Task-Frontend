import { Search, X, Filter } from "lucide-react";

const TaskSearchFilter = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  taskCounts,
}) => {
  const statuses = ["All", "Pending", "In Progress", "Completed"];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title or description..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <div className="flex gap-2 flex-wrap">
            {statuses.map((status) => {
              const count =
                status === "All"
                  ? Object.values(taskCounts).reduce((a, b) => a + b, 0)
                  : taskCounts[status] || 0;

              return (
                <button
                  key={status}
                  onClick={() => onStatusChange(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedStatus === status
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status}
                  <span className="ml-1.5 text-xs opacity-75">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Filters Info */}
      {(searchQuery || selectedStatus !== "All") && (
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">Active filters:</span>
          {searchQuery && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
              Search: "{searchQuery}"
            </span>
          )}
          {selectedStatus !== "All" && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
              Status: {selectedStatus}
            </span>
          )}
          <button
            onClick={() => {
              onSearchChange("");
              onStatusChange("All");
            }}
            className="ml-2 text-blue-600 hover:text-blue-700 underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskSearchFilter;
