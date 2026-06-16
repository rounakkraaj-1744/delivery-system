import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useSocket } from '../../context/SocketContext';
import { MOCK_ORDERS } from '../../mock/orders';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { Search, Layers, Maximize } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {Input} from "../../components/ui/input"

const createAgentIcon = () => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div class="relative w-8 h-8 flex items-center justify-center">
        <div class="absolute inset-0 bg-primary/30 rounded-full animate-ping"></div>
        <div class="relative w-8 h-8 bg-primary rounded-full shadow-lg flex items-center justify-center border-2 border-white">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const createOrderIcon = () => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div class="relative w-6 h-6 flex items-center justify-center -top-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#F5A623" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-md">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3" fill="white"></circle>
        </svg>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });
};

const MapController = ({ agents }) => {
  const map = useMap();
  useEffect(() => {
    // Optionally fit bounds to agents if required, for now static center
  }, [map, agents]);
  return null;
};

export const LiveMap = () => {
  const { agents } = useSocket();
  const [activeTab, setActiveTab] = useState('Agents');
  const [searchTerm, setSearchTerm] = useState('');
  
  const activeOrders = MOCK_ORDERS.filter(o => o.status === 'In Transit' || o.status === 'Pending' || o.status === 'Assigned');
  const unassignedOrders = MOCK_ORDERS.filter(o => o.status === 'Pending' || (!o.agentId && o.status !== 'Cancelled'));

  const panelAgents = agents.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const panelOrders = activeOrders.filter(o => o.id.toLowerCase().includes(searchTerm.toLowerCase()));

  const agentIcon = createAgentIcon();
  const orderIcon = createOrderIcon();

  return (
    <div className="relative h-full w-full bg-neutral-100 flex overflow-hidden">
      
      <div className="absolute top-4 left-4 bottom-4 w-80 bg-white rounded-2xl shadow-xl z-[400] flex flex-col overflow-hidden border border-neutral-100 slide-in-right" style={{ animationName: 'slideInLeft' }}>
        <div className="p-4 border-b border-neutral-100 bg-neutral-50 shrink-0">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <Input 
              type="text" 
              placeholder={`Search ${activeTab.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <div className="flex bg-neutral-200/50 p-1 rounded-xl">
            <Button onClick={() => setActiveTab('Agents')} className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'Agents' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-600 hover:text-neutral-900'}`}>
              Agents
            </Button>
            <Button onClick={() => setActiveTab('Orders')} className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'Orders' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-600 hover:text-neutral-900'}`}>
              Orders
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {activeTab === 'Agents' && panelAgents.map(agent => (
            <div key={agent.id} className="p-3 mb-2 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer border border-transparent hover:border-neutral-100 flex items-center gap-3 group">
              <div className="relative">
                <Avatar name={agent.name} className="w-10 h-10" />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${agent.status !== 'Offline' ? 'bg-success' : 'bg-neutral-400'}`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-neutral-900 text-sm truncate">{agent.name}</div>
                <div className="text-xs text-neutral-600 flex justify-between items-center mt-1">
                  <span>{agent.status}</span>
                  {agent.status !== 'Offline' && <span className="text-primary font-mono">{agent.battery}%</span>}
                </div>
              </div>
            </div>
          ))}

          {activeTab === 'Orders' && panelOrders.map(order => (
            <div key={order.id} className="p-3 mb-2 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer border border-transparent hover:border-neutral-100 group">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-sm font-bold text-neutral-900">{order.id}</span>
                <Badge variant={order.status === 'In Transit' ? 'warning' : 'default'} className="text-[10px] py-0 px-1.5">{order.status}</Badge>
              </div>
              <div className="text-xs text-neutral-600 truncate mb-1">Pickup: {order.pickup.address}</div>
              {order.agentId && (
                <div className="text-xs text-primary mt-2">Assigned to: {MOCK_AGENTS.find(a => a.id === order.agentId)?.name}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-4 right-4 z-400 flex flex-col gap-2">
        <button className="w-10 h-10 bg-white rounded-xl shadow-md border border-neutral-100 flex items-center justify-center text-neutral-600 hover:text-primary hover:bg-neutral-50 transition-colors">
          <Layers size={20} />
        </button>
        <button className="w-10 h-10 bg-white rounded-xl shadow-md border border-neutral-100 flex items-center justify-center text-neutral-600 hover:text-primary hover:bg-neutral-50 transition-colors">
          <Maximize size={20} />
        </button>
      </div>

      <MapContainer center={[13.0827, 80.2707]} zoom={12} className="w-full h-full z-0" zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>' />
        
        {activeOrders.filter(o => o.status === 'In Transit' && o.agentId).map(order => {
          const agent = agents.find(a => a.id === order.agentId);
          if (!agent)
            return null;
          return (
            <Polyline key={`route-${order.id}`} positions={[[agent.lat, agent.lng], [order.drop.lat, order.drop.lng]]} color="#3D8B6E" weight={3} opacity={0.6} dashArray="5, 10" />
          );
        })}

        {unassignedOrders.map(order => (
          <Marker key={`order-${order.id}`} position={[order.pickup.lat, order.pickup.lng]} icon={orderIcon}>
            <Popup className="custom-popup">
              <div className="p-1">
                <div className="text-xs font-bold font-mono text-neutral-900 mb-1">{order.id}</div>
                <div className="text-xs text-accent font-medium mb-2">Unassigned Pickup</div>
                <div className="text-xs text-neutral-600 truncate max-w-[150px]">{order.pickup.address}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {agents.filter(a => a.status !== 'Offline').map(agent => (
          <Marker key={`agent-${agent.id}`} position={[agent.lat, agent.lng]} icon={agentIcon}>
            <Popup className="custom-popup">
              <div className="p-2 min-w-[160px]">
                <div className="flex items-center gap-3 mb-3 border-b border-neutral-100 pb-2">
                  <Avatar name={agent.name} className="w-8 h-8" />
                  <div>
                    <div className="font-bold text-sm text-neutral-900">{agent.name}</div>
                    <div className="text-xs text-neutral-600">{agent.status}</div>
                  </div>
                </div>
                {agent.currentOrderId && (
                  <div className="text-xs mb-2">
                    <span className="text-neutral-500">Order:</span> <span className="font-mono font-medium text-neutral-900">{agent.currentOrderId}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs text-neutral-500 mb-3">
                  <span>32 km/h</span>
                  <span>{formatDistanceToNow(new Date(agent.lastPing), { addSuffix: true })}</span>
                </div>
                <Button className="w-full text-xs font-medium text-primary hover:underline text-center">
                  View Agent Details
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
        
        <MapController agents={agents} />
      </MapContainer>
    </div>
  );
};