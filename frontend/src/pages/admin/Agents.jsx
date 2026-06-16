import React, { useState } from 'react';
import { MOCK_AGENTS } from '../../mock/agents';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../common/Avatar';
import { Search, MoreVertical, Plus } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import {Input} from "../../components/ui/input"

export const Agents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const onlineCount = MOCK_AGENTS.filter(a => a.status !== 'Offline').length;
  
  const filteredAgents = MOCK_AGENTS.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-transition max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Agents</h1>
          <p className="text-neutral-600">{MOCK_AGENTS.length} agents · {onlineCount} online · {MOCK_AGENTS.length - onlineCount} offline</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <Input type="text" placeholder="Search agents..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"/>
          </div>
          <button className="bg-primary text-white p-2 sm:px-4 sm:py-2 rounded-xl hover:bg-primary-light transition-colors shadow-sm flex items-center justify-center gap-2">
            <Plus size={20} />
            <span className="hidden sm:inline font-medium">Add Agent</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map(agent => (
          <div key={agent.id} className="bg-white rounded-2xl shadow-card border border-neutral-100 p-6 flex flex-col hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <div className="relative">
                <Avatar name={agent.name} className="w-14 h-14 text-lg" />
                <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                  agent.status === 'Available' ? 'bg-success' : 
                  agent.status === 'On Delivery' ? 'bg-accent' : 'bg-neutral-400'
                }`}></div>
              </div>
              <button className="text-neutral-400 hover:text-neutral-900 p-1 rounded-full hover:bg-neutral-100 transition-colors opacity-0 group-hover:opacity-100">
                <MoreVertical size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-bold text-neutral-900 leading-tight">{agent.name}</h3>
              <div className="text-sm text-neutral-600">{agent.phone}</div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4 border-y border-neutral-100 py-3">
              <div className="text-center">
                <div className="text-xs text-neutral-600 uppercase">Today</div>
                <div className="font-bold text-neutral-900">{agent.deliveriesToday}</div>
              </div>
              <div className="text-center border-l border-neutral-100">
                <div className="text-xs text-neutral-600 uppercase">Rating</div>
                <div className="font-bold text-neutral-900">{agent.rating}</div>
              </div>
              <div className="text-center border-l border-neutral-100">
                <div className="text-xs text-neutral-600 uppercase">Total</div>
                <div className="font-bold text-neutral-900">{agent.totalDeliveries}</div>
              </div>
            </div>

            <div className="mt-auto flex justify-between items-center">
              <Badge variant={
                agent.status === 'Available' ? 'success' : 
                agent.status === 'On Delivery' ? 'warning' : 'default'
              }>
                {agent.status}
              </Badge>
              {agent.currentOrderId && (
                <div className="text-xs font-mono bg-neutral-100 px-2 py-1 rounded-md text-neutral-600">
                  {agent.currentOrderId}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};