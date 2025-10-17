import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { taskAPI } from "../../services/api";
import Header from "../Layout/Header";
import TaskFormModal from "./TaskFormModal";
// import TaskSearchFilter from "./TaskSearchFilter";
import ActivityLog from "./ActivityLog";
import { useAuth } from "../../context/useAuth";
import TaskSearchFilter from "./TaskFilterSearch";
import TaskCard from "./TaskCard";


const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Activity Log State
  const [activities, setActivities] = useState([]);
  
 useEffect(() => {
  const fetchActivities = async () => {
    try {
      const res = await taskAPI.getActivities(user.token);
      if (res.success) {
        setActivities(res.data);
      }

    } catch (err) {
      console.error("Error fetching activities:", err);
    }
  };

  if (user?.token) fetchActivities();
}, [user?.token]);


  const fetchTasks = async () => {
    try {
      const result = await taskAPI.getTasks(user.token);
      if (result.success) {
        setTasks(result.data);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addActivity = (type, message, details = null, statusChange = null, taskId = null) => {
    const newActivity = {
      _id: `local_${Date.now()}`,
      type,
      message,
      details,
      statusChange,
      taskId,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newActivity, ...(prev || [])]);
  };

  const handleCreateTask = async (taskData) => {
    try {
      const result = await taskAPI.createTask(user.token, taskData);
      if (result.success) {
        setTasks([...tasks, result.data]);
        setShowModal(false);

        // Add activity log
        addActivity(
          "created",
          `Created task: "${taskData.title}"`,
          taskData.description ? `Description: ${taskData.description}` : null
        );
        if (user?.token) await taskAPI.getActivities(user.token).then((res) => res.success && setActivities(res.data));

      }
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };
  
// const oldTask = tasks.find((t) => t._id === id);
  const handleUpdateTask = async (id, updates) => {
    try {
      const result = await taskAPI.updateTask(user.token, id, updates);
      if (result.success) {
        const oldTask = tasks.find((t) => t._id === id);
        setTasks(tasks.map((t) => (t._id === id ? result.data : t)));
        setShowModal(false);
        // Add activity log
        if (updates.status && oldTask.status !== updates.status) {
          addActivity(
            "status_changed",
            `Changed status of "${oldTask.title}"`,
            null,
            { from: oldTask.status, to: updates.status }
            
          );
          if (user?.token) await taskAPI.getActivities(user.token).then((res) => res.success && setActivities(res.data));
        } else if (updates.title || updates.description) {
          addActivity(
            "updated",
            `Updated task: "${updates.title || oldTask.title}"`,
            "Task details were modified"
          );
          if (user?.token) await taskAPI.getActivities(user.token).then((res) => res.success && setActivities(res.data));

        }

        if (editingTask) {
          setEditingTask(null);
          setShowModal(false);
        }
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const taskToDelete = tasks.find((t) => t._id === id);
      const result = await taskAPI.deleteTask(user.token, id);
      if (result.success) {
        setTasks(tasks.filter((t) => t._id !== id));

        // Add activity log
        addActivity(
          "deleted",
          `Deleted task: "${taskToDelete.title}"`,
          `Status was: ${taskToDelete.status}`
        );
      }
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const handleModalSubmit = (taskData) => {
    if (editingTask) {
      handleUpdateTask(editingTask._id, taskData);
    } else {
      handleCreateTask(taskData);
    }
  };


  // Filter and Search Logic
  const getFilteredTasks = () => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (selectedStatus !== "All") {
      filtered = filtered.filter((task) => task.status === selectedStatus);
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  // Group filtered tasks by status
  const groupedTasks = {
    Pending: filteredTasks.filter((t) => t.status === "Pending"),
    "In Progress": filteredTasks.filter((t) => t.status === "In Progress"),
    Completed: filteredTasks.filter((t) => t.status === "Completed"),
  };

  // Calculate task counts for all tasks (not filtered)
  const taskCounts = {
    Pending: tasks.filter((t) => t.status === "Pending").length,
    "In Progress": tasks.filter((t) => t.status === "In Progress").length,
    Completed: tasks.filter((t) => t.status === "Completed").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Add New Task Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add New Task
          </button>
        </div>

        {/* Search and Filter Component */}
        <TaskSearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          taskCounts={taskCounts}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Columns - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(groupedTasks).map(([status, statusTasks]) => (
                <div key={status} className="bg-white rounded-lg shadow-sm p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    {status}
                    <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {statusTasks.length}
                    </span>
                  </h2>
                  <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
                    {statusTasks.length === 0 ? (
                      <p className="text-gray-400 text-sm text-center py-8">
                        {searchQuery || selectedStatus !== "All"
                          ? "No matching tasks"
                          : "No tasks yet"}
                      </p>
                    ) : (
                      statusTasks.map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          onUpdate={handleUpdateTask}
                          onDelete={handleDeleteTask}
                          onEdit={handleEdit}
                        />
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log - Takes 1 column on large screens */}
          <div className="lg:col-span-1">
            <ActivityLog
             
              activities={activities}
              // onClear={handleClearActivities}
            />
          </div>
        </div>
      </main>

      {showModal && (
        <TaskFormModal
          task={editingTask}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};

export default Dashboard;
