import React from 'react';
import { MOCK_STATS } from '../../mock/stats';
import { MOCK_ORDERS } from '../../mock/orders';
import { MOCK_AGENTS } from '../../mock/agents';
import { Package, TrendingUp, Users, Clock } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, delta, icon: Icon, isPositive }) => (
  <div className="bg-white p-6 rounded-2xl shadow-card border border-neutral-100">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-primary-surface text-primary rounded-xl">
        <Icon size={24} />
      </div>
      {delta && (
        <span className={`text-sm font-semibold ${isPositive ? 'text-success' : 'text-danger'} bg-${isPositive ? 'success' : 'danger'}/10 px-2 py-1 rounded-full flex items-center gap-1`}>
          {isPositive ? '↑' : '↓'} {delta}
        </span>
      )}
    </div>
    <h3 className="text-neutral-600 text-sm font-medium mb-1">{title}</h3>
    <div className="text-3xl font-bold text-neutral-900 tracking-tight">{value}</div>
  </div>
);

export const Dashboard = () => {
  const recentOrders = MOCK_ORDERS.slice(0, 10);
  
  return (
    <div className="page-transition max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-600">Overview of today's delivery operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Orders Today" 
          value={MOCK_STATS.summary.totalOrdersToday} 
          delta="12%" 
          isPositive={true} 
          icon={Package} 
        />
        <StatCard 
          title="Active Deliveries" 
          value={MOCK_STATS.summary.activeDeliveries} 
          icon={TrendingUp} 
        />
        <StatCard 
          title="Agents Online" 
          value={`${MOCK_STATS.summary.agentsOnline}/${MOCK_STATS.summary.agentsTotal}`} 
          icon={Users} 
        />
        <StatCard 
          title="Avg Delivery Time" 
          value={MOCK_STATS.summary.avgDeliveryTime} 
          delta="3m" 
          isPositive={true} 
          icon={Clock} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-card border border-neutral-100 overflow-hidden">
          <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-neutral-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-primary font-medium hover:underline text-sm">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-100/50">
                  <th className="px-6 py-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-neutral-100/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-neutral-900">{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-neutral-900">{order.customer.name}</div>
                      <div className="text-xs text-neutral-600">{order.pickup.address.split(',')[1]}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        order.status === 'Delivered' ? 'success' :
                        order.status === 'Cancelled' ? 'danger' :
                        order.status === 'In Transit' ? 'warning' : 'primary'
                      }>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {formatDistanceToNow(new Date(order.timeline.created), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-neutral-100 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-neutral-900 mb-6">Agent Status</h2>
          <div className="h-48 mb-6 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_STATS.agentStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {MOCK_STATS.agentStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <div className="text-2xl font-bold text-neutral-900">{MOCK_STATS.summary.agentsTotal}</div>
              <div className="text-xs text-neutral-600">Total Agents</div>
            </div>
          </div>
          
          <h3 className="text-sm font-bold text-neutral-900 mb-4 uppercase tracking-wider">Top Agents Today</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {MOCK_STATS.topAgents.map((agent, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={agent.name} />
                  <span className="text-sm font-medium text-neutral-900">{agent.name}</span>
                </div>
                <div className="text-sm font-bold text-primary">{agent.deliveries} deliv.</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-neutral-100 p-6">
        <h2 className="text-lg font-bold text-neutral-900 mb-6">Delivery Trend Today</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_STATS.deliveryTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPlaced" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3D8B6E" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3D8B6E" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill: '#5C6478', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#5C6478', fontSize: 12}} dx={-10} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="placed" stroke="#3D8B6E" strokeWidth={3} fillOpacity={1} fill="url(#colorPlaced)" />
              <Area type="monotone" dataKey="delivered" stroke="#5C6478" strokeWidth={2} strokeDasharray="5 5" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
