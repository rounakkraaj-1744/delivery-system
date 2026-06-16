import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Map as MapIcon, Users, BarChart3, Settings, LogOut, Bell, Search, Truck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Orders', path: '/admin/orders', icon: Package },
  { name: 'Live Map', path: '/admin/livemap', icon: MapIcon },
  { name: 'Agents', path: '/admin/agents', icon: Users },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // The Live Map needs full screen, so we remove padding if we're on the map
  const isMap = location.pathname.includes('/livemap');

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-100 flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-neutral-100">
          <div className="flex items-center gap-2 text-primary">
            <Truck size={28} />
            <span className="text-xl font-bold tracking-tight">Logistics</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${isActive 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t border-neutral-100">
          <div className="flex items-center gap-3 p-3 bg-neutral-100 rounded-xl mb-4">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse-ring"></div>
            <div className="text-sm font-medium text-neutral-900">
              28 Agents Online
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-danger hover:bg-danger/10 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-neutral-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" size={18} />
              <input 
                type="text" 
                placeholder="Search orders, agents..." 
                className="w-full pl-10 pr-4 py-2 bg-neutral-100 border-none rounded-xl focus:ring-2 focus:ring-primary focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-neutral-600 hover:text-primary transition-colors">
              <Bell size={24} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-neutral-100 pl-6">
              <div className="text-right hidden md:block">
                <div className="text-sm font-semibold text-neutral-900">{user?.data?.name || 'Admin'}</div>
                <div className="text-xs text-neutral-600">Dispatcher</div>
              </div>
              <Avatar name={user?.data?.name || 'Admin'} />
            </div>
          </div>
        </header>

        <div className={`flex-1 overflow-y-auto ${isMap ? '' : 'p-8'}`}>
          {children}
        </div>
      </main>
    </div>
  );
};
