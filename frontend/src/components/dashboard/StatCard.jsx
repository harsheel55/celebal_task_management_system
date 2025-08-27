// frontend/src/components/dashboard/StatCard.jsx
import React from 'react';

const StatCard = ({ title, value, icon, color = 'blue', subtitle }) => {
  // Your color classes are perfect. No changes needed here.
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300',
  };

  return (
    // Your card styling is excellent for the new black theme.
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {/* 
            IMPROVEMENT: Use React.cloneElement to add size classes to the icon prop.
            This makes the StatCard component responsible for the icon's size,
            ensuring all stat cards are consistent.
          */}
          {React.cloneElement(icon, { className: 'h-6 w-6' })}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;