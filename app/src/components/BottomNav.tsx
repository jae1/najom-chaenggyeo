import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, History, User } from 'lucide-react';

const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around items-center z-50 max-w-[500px] mx-auto">
      <NavLink 
        to="/" 
        className={({ isActive }) => `flex flex-col items-center ${isActive ? 'text-primary-500' : 'text-gray-400'}`}
      >
        <Calendar size={24} />
        <span className="text-xs mt-1">오늘</span>
      </NavLink>
      
      <NavLink 
        to="/history" 
        className={({ isActive }) => `flex flex-col items-center ${isActive ? 'text-primary-500' : 'text-gray-400'}`}
      >
        <History size={24} />
        <span className="text-xs mt-1">기록</span>
      </NavLink>
      
      <NavLink 
        to="/profile" 
        className={({ isActive }) => `flex flex-col items-center ${isActive ? 'text-primary-500' : 'text-gray-400'}`}
      >
        <User size={24} />
        <span className="text-xs mt-1">정보</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
