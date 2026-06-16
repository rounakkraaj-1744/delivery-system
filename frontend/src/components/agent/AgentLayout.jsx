import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Map, Clock, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AgentLayout = ({ children, hideNav = false }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/agent/home', icon: Home },
    // Only show active delivery tab if they have one? Let's keep it simple
    { name: 'History', path: '/agent/history', icon: Clock },
    { name: 'Profile', path: '/agent/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="w-full max-w-[480px] bg-white h-screen flex flex-col shadow-2xl relative overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        {!hideNav && (
          <nav className="h-16 bg-white border-t border-neutral-100 flex justify-around items-center px-4 shrink-0 pb-safe">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex flex-col items-center gap-1 w-16 transition-colors
                  ${isActive ? 'text-primary' : 'text-neutral-400 hover:text-neutral-600'}
                `}
              >
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
};
