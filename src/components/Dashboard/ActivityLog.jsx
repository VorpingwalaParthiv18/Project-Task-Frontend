import { Clock, Plus, Edit, Trash2, CheckCircle } from "lucide-react";

const ActivityLog = ({ activities = [], loading = false }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case "created":
        return <Plus className="w-4 h-4 text-green-600" />;
      case "updated":
        return <Edit className="w-4 h-4 text-blue-600" />;
      case "deleted":
        return <Trash2 className="w-4 h-4 text-red-600" />;
      case "status_changed":
        return <CheckCircle className="w-4 h-4 text-purple-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "created":
        return "bg-green-50 border-green-200";
      case "updated":
        return "bg-blue-50 border-blue-200";
      case "deleted":
        return "bg-red-50 border-red-200";
      case "status_changed":
        return "bg-purple-50 border-purple-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </h2>
        <p className="text-gray-400 text-sm text-center py-8">
          Loading activities...
        </p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </h2>
        </div>
        <p className="text-gray-400 text-sm text-center py-8">
          No recent activity yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
          <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {activities.length}
          </span>
        </h2>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity, index) => (
          <div
            key={activity._id || index}
            className={`p-3 rounded-lg border ${getActivityColor(activity.type)} transition hover:shadow-sm`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 font-medium">
                  {activity.message ||
                    `${activity.type || "Updated"}: "${activity.title}"`}
                </p>
                {activity.description && (
                  <p className="text-xs text-gray-600 mt-1">
                    {activity.description}
                  </p>
                )}
                {activity.prevStatus && activity.currentStatus ? (
                <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded">
                {activity.prevStatus}
                 </span>
               <ArrowRight className="w-3 h-3 text-gray-400" />
                <span className="px-2 py-1 bg-blue-600 text-white rounded">
               {activity.currentStatus}
              </span>
              </div>
               ) : activity.status ? (
               <p className="text-xs text-gray-600 mt-1">{activity.status}</p>
                ) : null}

                <p className="text-xs text-gray-500 mt-2">
                  {formatTimestamp(activity.timestamp || activity.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;
