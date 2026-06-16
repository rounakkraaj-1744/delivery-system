import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Users, MapPin } from 'lucide-react';

export default function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12 page-transition">
          <div className="inline-flex items-center justify-center p-4 bg-primary-surface rounded-2xl mb-6">
            <Package size={48} className="text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 tracking-tight">
            Delivery Management Portal
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Select your portal to continue. Three specialized views for our internal delivery operations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 page-transition" style={{ animationDelay: '100ms' }}>
          <div onClick={() => navigate('/admin/login')} className="group cursor-pointer bg-white p-8 rounded-2xl shadow-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-neutral-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            <div className="h-14 w-14 bg-primary text-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
              <Package size={28} />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Admin Portal</h2>
            <p className="text-neutral-600 leading-relaxed">
              Manage orders, dispatch agents, view live maps, and analyze delivery performance.
            </p>
            <div className="mt-8 flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
              Enter Admin Portal 
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>

          <div onClick={() => navigate('/agent/login')} className="group cursor-pointer bg-white p-8 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08),_0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-neutral-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            <div className="h-14 w-14 bg-accent text-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
              <Users size={28} />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Agent Portal</h2>
            <p className="text-neutral-600 leading-relaxed">
              Mobile-first view for delivery agents. Accept orders and update statuses on the go.
            </p>
            <div className="mt-8 flex items-center text-accent font-medium group-hover:translate-x-2 transition-transform">
              Enter Agent Portal 
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>

          <div onClick={() => navigate('/track/ORD-9005')} className="group cursor-pointer bg-white p-8 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08),_0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-neutral-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            <div className="h-14 w-14 bg-blue-500 text-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
              <MapPin size={28} />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Customer View</h2>
            <p className="text-neutral-600 leading-relaxed">
              Public tracking page for customers to view real-time delivery ETA and agent location.
            </p>
            <div className="mt-8 flex items-center text-blue-500 font-medium group-hover:translate-x-2 transition-transform">
              View Demo Order 
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}