// frontend/src/pages/DashboardPage.jsx
import React, { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  CalendarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { toast } from "react-toastify";
import StatCard from "../components/dashboard/StatCard";
import TasksList from "../components/dashboard/TasksList";
import QuickTaskForm from "../components/dashboard/QuickTaskForm";
import ProductivityChart from "../components/dashboard/ProductivityChart";
import DragDropCalendar from "../components/dashboard/DragDropCalendar";
import Galaxy from "../components/Aurora";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [todayTasks, setTodayTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [allTasks, setAllTasks] = useState([]);

  const handleTaskCreated = () => {
    setShowQuickForm(false);
    fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const [statsResponse, tasksResponse, allTasksResponse] =
        await Promise.all([
          axios.get("http://localhost:5000/api/dashboard/stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/dashboard/today-tasks", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/tasks", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      setDashboardData(statsResponse.data);
      setTodayTasks(tasksResponse.data);
      setAllTasks(allTasksResponse.data.tasks || allTasksResponse.data);
    } catch (error) {
      toast.error("Failed to load dashboard data");
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative text-white overflow-hidden">
        {/* Galaxy Background */}
        <div className="fixed inset-0 z-0">
          <Galaxy
            mouseRepulsion={true}
            mouseInteraction={true}
            density={1.2}
            glowIntensity={0.4}
            saturation={0.6}
            hueShift={200}
            speed={0.8}
            twinkleIntensity={0.4}
            rotationSpeed={0.05}
            transparent={true}
          />
        </div>

        {/* Loading Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <span className="text-white font-medium">
                Loading your dashboard...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { overview, chartData, recentActivity } = dashboardData || {};

  return (
    <div className="min-h-screen relative text-white overflow-hidden">
      {/* Galaxy Background */}
      <div className="fixed inset-0 z-0">
        <Galaxy
          mouseRepulsion={true}
          mouseInteraction={true}
          density={1.2}
          glowIntensity={0.4}
          saturation={0.6}
          hueShift={200}
          speed={0.8}
          twinkleIntensity={0.4}
          rotationSpeed={0.05}
          transparent={true}
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Header Section */}
        <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center py-8 space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
                  Dashboard
                </h1>
                <p className="text-gray-300 mt-2 text-lg drop-shadow-lg">
                  Welcome back! Here's what's happening with your tasks.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className={`group w-full sm:w-auto px-6 py-3 rounded-xl flex items-center justify-center space-x-3 transition-all duration-300 backdrop-blur-sm border font-semibold ${
                    showCalendar
                      ? "bg-blue-500/20 text-blue-200 border-blue-400/40 hover:bg-blue-500/30 hover:scale-105 shadow-lg shadow-blue-500/10"
                      : "bg-white/10 text-white/90 border-white/20 hover:bg-white/20 hover:scale-105 shadow-lg"
                  }`}
                >
                  <CalendarIcon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span>
                    {showCalendar ? "Hide Calendar" : "Show Calendar"}
                  </span>
                </button>
                <button
                  onClick={() => setShowQuickForm(true)}
                  className="group w-full sm:w-auto bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white px-6 py-3 rounded-xl hover:from-blue-700/90 hover:to-purple-700/90 flex items-center justify-center space-x-3 transition-all duration-300 font-semibold backdrop-blur-sm border border-blue-500/20 hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                >
                  <PlusIcon className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Quick Add Task</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-blue-400/40 transition-all duration-300 hover:bg-white/10 group shadow-xl hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">
                    Total Tasks
                  </p>
                  <p className="text-3xl font-bold text-white mt-1 group-hover:text-blue-200 transition-colors duration-300">
                    {overview?.totalTasks || 0}
                  </p>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-xl border border-blue-400/30 group-hover:bg-blue-500/30 group-hover:scale-110 transition-all duration-300">
                  <ChartBarIcon className="h-8 w-8 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-green-400/40 transition-all duration-300 hover:bg-white/10 group shadow-xl hover:shadow-2xl hover:shadow-green-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold text-white mt-1 group-hover:text-green-200 transition-colors duration-300">
                    {overview?.completedTasks || 0}
                  </p>
                  <p className="text-xs text-green-400 mt-1 font-medium">
                    {overview?.completionRate || 0}% completion rate
                  </p>
                </div>
                <div className="bg-green-500/20 p-3 rounded-xl border border-green-400/30 group-hover:bg-green-500/30 group-hover:scale-110 transition-all duration-300">
                  <CheckCircleIcon className="h-8 w-8 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-400/40 transition-all duration-300 hover:bg-white/10 group shadow-xl hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">
                    Today's Tasks
                  </p>
                  <p className="text-3xl font-bold text-white mt-1 group-hover:text-purple-200 transition-colors duration-300">
                    {todayTasks.length}
                  </p>
                </div>
                <div className="bg-purple-500/20 p-3 rounded-xl border border-purple-400/30 group-hover:bg-purple-500/30 group-hover:scale-110 transition-all duration-300">
                  <CalendarIcon className="h-8 w-8 text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-red-400/40 transition-all duration-300 hover:bg-white/10 group shadow-xl hover:shadow-2xl hover:shadow-red-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Overdue</p>
                  <p className="text-3xl font-bold text-white mt-1 group-hover:text-red-200 transition-colors duration-300">
                    {overview?.overdueTasks || 0}
                  </p>
                </div>
                <div className="bg-red-500/20 p-3 rounded-xl border border-red-400/30 group-hover:bg-red-500/30 group-hover:scale-110 transition-all duration-300">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Calendar View */}
          {showCalendar && (
            <div className="mb-8">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <CalendarIcon className="h-6 w-6 mr-3 text-blue-400" />
                  Calendar View
                </h3>
                <DragDropCalendar
                  tasks={allTasks}
                  onTaskUpdate={fetchDashboardData}
                />
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Tasks */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/20 shadow-2xl hover:border-blue-400/30 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-2 sm:space-y-0">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <ClockIcon className="h-6 w-6 mr-3 text-blue-400" />
                    Today's Tasks
                  </h2>
                  <span className="text-gray-300 bg-white/10 px-3 py-1 rounded-full text-sm font-medium  border border-white/20">
                    {todayTasks.length} tasks scheduled
                  </span>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <TasksList
                    tasks={todayTasks}
                    onTaskUpdate={fetchDashboardData}
                  />
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-8">
              {/* Productivity Chart */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/20 shadow-2xl hover:border-purple-400/30 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <ChartBarIcon className="h-6 w-6 mr-3 text-purple-400" />
                  Task Overview
                </h3>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <ProductivityChart data={chartData} />
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl hover:border-green-400/30 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <svg
                    className="h-6 w-6 mr-3 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentActivity?.length > 0 ? (
                    recentActivity.map((task) => (
                      <div
                        key={task._id}
                        className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 group"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-3 h-3 rounded-full flex-shrink-0 ${
                              task.status === "Completed"
                                ? "bg-green-400"
                                : task.status === "In Progress"
                                ? "bg-yellow-400"
                                : "bg-gray-400"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white group-hover:text-blue-200 truncate transition-colors duration-300">
                              {task.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(task.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
                              task.priority.toLowerCase() === "high"
                                ? "bg-red-500/20 text-red-300 border-red-400/30"
                                : task.priority.toLowerCase() === "medium"
                                ? "bg-yellow-500/20 text-yellow-300 border-yellow-400/30"
                                : "bg-gray-500/20 text-gray-300 border-gray-400/30"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                        <p className="text-gray-400">No recent activity.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Task Form Modal */}
        {showQuickForm && (
          <div
            className="fixed inset-0 flex items-center justify-center p-4 z-[99999]"
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-md z-[99999]"
              onClick={() => setShowQuickForm(false)}
            />
            <div className="relative bg-gray-900/98 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl max-w-lg w-full z-[100000]">
              <QuickTaskForm
                onClose={() => setShowQuickForm(false)}
                onTaskCreated={handleTaskCreated}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
