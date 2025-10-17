import { Trash2, Edit2, CheckCircle, Clock, Circle } from "lucide-react";

const TaskCard = ({ task, onUpdate, onDelete, onEdit }) => {
  const statusIcons = {
    Pending: <Circle className="w-5 h-5 text-gray-400" />,
    "In Progress": <Clock className="w-5 h-5 text-yellow-500" />,
    Completed: <CheckCircle className="w-5 h-5 text-green-500" />,
  };

  const statusColors = {
    Pending: "bg-gray-50 border-gray-200",
    "In Progress": "bg-yellow-50 border-yellow-200",
    Completed: "bg-green-50 border-green-200",
  };

  return (
    <div
      className={`p-4 rounded-lg border-2 ${
        statusColors[task.status]
      } transition hover:shadow-md`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {statusIcons[task.status]}
          <h3 className="font-semibold text-gray-800 truncate">{task.title}</h3>
        </div>
        <div className="flex gap-2 flex-shrink-0 ml-2">
          <button
            onClick={() => onEdit(task)}
            className="p-1 hover:bg-blue-100 rounded transition"
            title="Edit task"
          >
            <Edit2 className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-1 hover:bg-red-100 rounded transition"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm mb-3 break-words">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {["Pending", "In Progress", "Completed"].map((status) => (
          <button
            key={status}
            onClick={() => onUpdate(task._id, { status })}
            disabled={task.status === status}
            className={`text-xs px-3 py-1 rounded-full transition ${
              task.status === status
                ? "bg-blue-600 text-white cursor-default"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="mt-3 text-xs text-gray-400">
        {new Date(task.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default TaskCard;
