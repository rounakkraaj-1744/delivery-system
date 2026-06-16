import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { Dashboard } from './pages/admin/Dashboard';
import { Orders } from './pages/admin/Orders';
import { LiveMap } from './pages/admin/LiveMap';
import { Agents } from './pages/admin/Agents';
import { Analytics } from './pages/admin/Analytics';
import { Settings } from './pages/admin/Settings';

import { AgentLogin } from './pages/agent/AgentLogin';
import { AgentHome } from './pages/agent/AgentHome';
import { ActiveDelivery } from './pages/agent/ActiveDelivery';
import { AgentHistory } from './pages/agent/AgentHistory';
import { AgentProfile } from './pages/agent/AgentProfile';

import { TrackOrder } from './pages/customer/TrackOrder';

// Admin Protected Route Wrapper
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated || user?.role !== 'admin') {
    // For demo purposes, we auto-login admin if they hit the route, or we could redirect to a login.
    // The prompt says "hardcoded credentials admin@delivery.com / admin123" but no explicit admin login page was requested.
    // I will build a tiny login screen or auto-redirect. For now, let's just render children if they are admin.
    // Actually, I'll redirect them to root if not auth, but I'll make a quick AdminLogin component later if needed.
    // Let's just bypass auth for Admin to make the demo smoother, or enforce it properly.
    return <Navigate to="/admin/login" />;
  }
  return children;
};

// Agent Protected Route Wrapper
const AgentRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated || user?.role !== 'agent') {
    return <Navigate to="/agent/login" />;
  }
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'font-sans text-sm shadow-md rounded-lg',
              duration: 4000,
            }}
          />
          <Routes>
            {/* Root */}
            <Route path="/" element={<RoleSelect />} />

            {/* Admin Portal */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminRoute><AdminLayout><Dashboard /></AdminLayout></AdminRoute>} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminLayout><Dashboard /></AdminLayout></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminLayout><Orders /></AdminLayout></AdminRoute>} />
            <Route path="/admin/livemap" element={<AdminRoute><AdminLayout><LiveMap /></AdminLayout></AdminRoute>} />
            <Route path="/admin/agents" element={<AdminRoute><AdminLayout><Agents /></AdminLayout></AdminRoute>} />
            <Route path="/admin/analytics" element={<AdminRoute><AdminLayout><Analytics /></AdminLayout></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminLayout><Settings /></AdminLayout></AdminRoute>} />

            {/* Agent Portal */}
            <Route path="/agent/login" element={<AgentLogin />} />
            <Route path="/agent/home" element={<AgentHome />} />
            <Route path="/agent/delivery/:orderId" element={<ActiveDelivery />} />
            <Route path="/agent/history" element={<AgentHistory />} />
            <Route path="/agent/profile" element={<AgentProfile />} />

            {/* Customer Tracking */}
            <Route path="/track/:orderId" element={<TrackOrder />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}
