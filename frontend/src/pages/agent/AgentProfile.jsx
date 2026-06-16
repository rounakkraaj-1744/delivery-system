import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AgentLayout } from '../../components/agent/AgentLayout';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { LogOut, Star, Truck, Phone, Mail, Award } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

export const AgentProfile = () => {
  const { user, logout } = useAuth();
  
  const weeklyData = [
    { day: 'Mon', deliv: 12 },
    { day: 'Tue', deliv: 15 },
    { day: 'Wed', deliv: 8 },
    { day: 'Thu', deliv: 14 },
    { day: 'Fri', deliv: 18 },
    { day: 'Sat', deliv: 22 },
    { day: 'Sun', deliv: 20 },
  ];

  return (
    <AgentLayout>
      <div className="h-full bg-neutral-100 flex flex-col">
        {/* Top Header */}
        <div className="bg-primary pt-8 pb-16 px-6 text-center shrink-0 rounded-b-[40px] relative">
          <h1 className="text-white font-bold text-xl mb-6">Profile</h1>
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <div className="p-1 bg-neutral-100 rounded-full">
              <Avatar name={user?.data?.name} className="w-24 h-24 text-2xl border-4 border-white" />
            </div>
          </div>
        </div>

        <div className="pt-16 px-6 pb-6 flex-1 overflow-y-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-neutral-900">{user?.data?.name || 'Agent'}</h2>
            <div className="text-neutral-500 font-medium">ID: A104</div>
            <div className="flex items-center justify-center gap-1 text-accent mt-2 font-bold bg-accent/10 w-max mx-auto px-3 py-1 rounded-full text-sm">
              <Star fill="currentColor" size={16} />
              4.8 Rating
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4 mb-6">
            <div className="flex items-center gap-4 border-b border-neutral-100 pb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <div className="text-xs text-neutral-500 uppercase font-semibold">Vehicle</div>
                <div className="text-neutral-900 font-medium">Hero Honda Splendor (Bike)</div>
                <div className="text-xs text-neutral-600 font-mono">TN 01 AB 1234</div>
              </div>
            </div>
            <div className="flex items-center gap-4 border-b border-neutral-100 py-4">
              <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <div className="text-xs text-neutral-500 uppercase font-semibold">Phone</div>
                <div className="text-neutral-900 font-medium">{user?.data?.phone || '+91 98765 43210'}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center shrink-0">
                <Award size={20} />
              </div>
              <div>
                <div className="text-xs text-neutral-500 uppercase font-semibold">Experience</div>
                <div className="text-neutral-900 font-medium">850 Total Deliveries</div>
                <div className="text-xs text-neutral-600">Joined Jan 2024</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 mb-8">
            <h3 className="font-bold text-neutral-900 mb-4">Last 7 Days</h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#5C6478', fontSize: 10}} dy={10} />
                  <Tooltip cursor={{fill: '#F4F6F9'}} contentStyle={{borderRadius: '8px', border: 'none', padding: '4px 8px'}} />
                  <Bar dataKey="deliv" fill="#3D8B6E" radius={[4, 4, 4, 4]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <Button variant="danger" className="w-full gap-2 rounded-xl" onClick={logout}>
            <LogOut size={18} /> Logout
          </Button>
        </div>
      </div>
    </AgentLayout>
  );
};
