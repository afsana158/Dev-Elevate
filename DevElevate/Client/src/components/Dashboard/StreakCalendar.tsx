import React from 'react';
import { Calendar, Flame } from 'lucide-react';
import { useGlobalState } from '../../contexts/GlobalContext';

const StreakCalendar: React.FC = () => {
  const { state } = useGlobalState();

  // Generate calendar for current month
  const generateCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const calendar = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendar.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendar.push(day);
    }

    return calendar;
  };

  const calendar = generateCalendar();
  const today = new Date().getDate();

  const isActiveDay = (day: number | null) => {
    if (!day) return false;
    const dateStr = new Date().toISOString().split('T')[0];
    return state.streakData[dateStr] || day <= today;
  };

  return (
    <div className={`${state.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-semibold tracking-tight ${state.darkMode ? 'text-white' : 'text-gray-900'}`}>
          Learning Streak
        </h3>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className={`font-semibold text-sm ${state.darkMode ? 'text-white' : 'text-gray-900'}`}>
            {state.user?.streak || 0} days
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-7 gap-1 text-[13px] font-semibold text-gray-50 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center py-1 rounded-md  bg-sky-50 dark:bg-sky-900 text-sky-700 dark:text-sky-200">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendar.map((day, index) => (
            <div
              key={index}
              className={`aspect-square flex items-center justify-center text-sm rounded-md transition-colors ${
                day === null
                  ? ''
                  : day === today
                  ? 'bg-blue-500 text-white font-bold'
                  : isActiveDay(day)
                  ? 'bg-green-500 text-white'
                  : state.darkMode
                  ? 'text-sky-400 hover:bg-sky-700'
                  : 'text-sky-600 hover:bg-sky-100'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className={state.darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Active days
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className={state.darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Today
          </span>
        </div>
      </div>
    </div>
  );
};

export default StreakCalendar;