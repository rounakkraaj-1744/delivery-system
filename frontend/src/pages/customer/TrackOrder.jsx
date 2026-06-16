import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MOCK_ORDERS } from '../../mock/orders';
import { MOCK_AGENTS } from '../../mock/agents';
import { Package, Truck, Phone, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';

const agentIcon = L.divIcon({
  className: 'custom-leaflet-icon',
  html: `<div class="relative w-6 h-6"><div class="absolute inset-0 bg-primary/40 rounded-full animate-ping"></div><div class="relative w-6 h-6 bg-primary rounded-full border-2 border-white shadow-sm flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M5 12l5 5l10 -10"></path></svg></div></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const homeIcon = L.divIcon({
  className: 'custom-leaflet-icon',
  html: `<div class="relative w-6 h-6 -top-3"><svg width="24" height="24" viewBox="0 0 24 24" fill="#F5A623" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24]
});

const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.panTo(center);
  }, [center, map]);
  return null;
};

export const TrackOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [agent, setAgent] = useState(null);
  const [eta, setEta] = useState(18);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [agentLocation, setAgentLocation] = useState([13.0800, 80.2000]);

  useEffect(() => {
    // Find the order
    const foundOrder = MOCK_ORDERS.find(o => o.id === orderId) || MOCK_ORDERS.find(o => o.status === 'In Transit');
    if (foundOrder) {
      setOrder(foundOrder);
      if (foundOrder.agentId) {
        setAgent(MOCK_AGENTS.find(a => a.id === foundOrder.agentId));
      }
    }
  }, [orderId]);

  useEffect(() => {
    // Simulate ETA ticking down
    const interval = setInterval(() => {
      setEta(prev => Math.max(0, prev - 1));
      
      // Also slightly move agent towards drop
      if (order) {
        setAgentLocation(prev => {
          const latDiff = (order.drop.lat - prev[0]) * 0.05;
          const lngDiff = (order.drop.lng - prev[1]) * 0.05;
          return [prev[0] + latDiff, prev[1] + lngDiff];
        });
      }
    }, 60000); // Every minute
    return () => clearInterval(interval);
  }, [order]);

  if (!order) return <div className="h-screen flex items-center justify-center text-neutral-500">Loading...</div>;

  const statusColors = {
    'Pending': 'bg-neutral-500',
    'Assigned': 'bg-blue-500',
    'In Transit': 'bg-accent',
    'Delivered': 'bg-success',
    'Cancelled': 'bg-danger'
  };

  const statusText = {
    'Pending': 'Order Received',
    'Assigned': 'Agent Assigned',
    'In Transit': 'Out for Delivery',
    'Delivered': 'Order Delivered',
    'Cancelled': 'Order Cancelled'
  };

  const steps = [
    { key: 'created', label: 'Order Placed', time: order.timeline.created },
    { key: 'assigned', label: 'Agent Assigned', time: order.timeline.assigned },
    { key: 'pickedUp', label: 'Order Picked Up', time: order.timeline.pickedUp },
    { key: 'inTransit', label: 'Out for Delivery', time: order.status === 'In Transit' || order.status === 'Delivered' ? new Date().toISOString() : null },
    { key: 'delivered', label: 'Delivered', time: order.timeline.delivered }
  ];

  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center">
      <div className="w-full max-w-[520px] bg-white h-screen flex flex-col shadow-xl">
        
        {/* Header */}
        <div className="h-14 flex items-center justify-center px-4 shrink-0 bg-white z-10 border-b border-neutral-100">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Truck size={20} />
            Logistics Tracker
          </div>
        </div>

        {/* Status Banner */}
        <div className={`${statusColors[order.status]} text-white py-3 px-6 text-center font-medium shrink-0`}>
          {statusText[order.status]}
        </div>

        {/* Map */}
        <div className="h-[350px] shrink-0 relative z-0">
          <MapContainer center={agentLocation} zoom={13} className="w-full h-full" zoomControl={false}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; OpenStreetMap'
            />
            {agent && order.status === 'In Transit' && (
              <Marker position={agentLocation} icon={agentIcon} />
            )}
            <Marker position={[order.drop.lat, order.drop.lng]} icon={homeIcon} />
            {agent && order.status === 'In Transit' && (
              <Polyline 
                positions={[agentLocation, [order.drop.lat, order.drop.lng]]} 
                color="#3D8B6E" 
                weight={4} 
                dashArray="5, 10"
              />
            )}
            <MapController center={order.status === 'In Transit' ? agentLocation : [order.drop.lat, order.drop.lng]} />
          </MapContainer>

          {/* ETA Chip */}
          {order.status === 'In Transit' && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] bg-white px-4 py-2 rounded-full shadow-lg border border-neutral-100 font-bold text-neutral-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              Arriving in ~{eta} min
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto bg-neutral-50 relative z-10 -mt-4 rounded-t-3xl pt-2">
          
          {/* Agent Card */}
          {agent && (order.status === 'In Transit' || order.status === 'Assigned') && (
            <div className="mx-4 mt-4 bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 text-primary font-bold rounded-full flex items-center justify-center text-lg">
                  {agent.name[0]}
                </div>
                <div>
                  <div className="font-bold text-neutral-900">{agent.name}</div>
                  <div className="text-xs text-neutral-600 flex items-center gap-1">
                    <span className="text-accent font-bold">★ {agent.rating}</span> • {agent.vehicle}
                  </div>
                </div>
              </div>
              <a href={`tel:${agent.phone}`} className="w-10 h-10 bg-primary-surface text-primary rounded-full flex items-center justify-center">
                <Phone size={18} />
              </a>
            </div>
          )}

          {/* Timeline */}
          <div className="m-4 bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <h3 className="font-bold text-neutral-900 mb-6">Delivery Updates</h3>
            <div className="relative pl-6 space-y-6">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-neutral-100"></div>
              
              {steps.map((step, idx) => {
                const isCompleted = !!step.time;
                const isCurrent = isCompleted && (!steps[idx + 1] || !steps[idx + 1].time);
                
                return (
                  <div key={step.key} className="relative">
                    <div className={`absolute -left-[27px] top-0 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                      isCurrent ? 'border-primary shadow-[0_0_0_4px_rgba(61,139,110,0.2)]' :
                      isCompleted ? 'border-primary' : 'border-neutral-300'
                    }`}>
                      {isCompleted && !isCurrent && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                      {isCurrent && <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>}
                    </div>
                    
                    <div className={`${isCompleted ? 'text-neutral-900' : 'text-neutral-400'}`}>
                      <div className="font-semibold text-sm">{step.label}</div>
                      {isCompleted && (
                        <div className="text-xs text-neutral-500 mt-0.5">
                          {format(new Date(step.time), 'MMM d, h:mm a')}
                        </div>
                      )}
                      {step.key === 'assigned' && agent && isCompleted && (
                        <div className="text-xs mt-1 text-primary font-medium">{agent.name} assigned</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="m-4 bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
            <button 
              onClick={() => setIsDetailsOpen(!isDetailsOpen)}
              className="w-full p-4 flex justify-between items-center text-left"
            >
              <div>
                <div className="font-bold text-neutral-900">Order Summary</div>
                <div className="text-xs text-neutral-500 font-mono mt-0.5">{order.id}</div>
              </div>
              {isDetailsOpen ? <ChevronUp size={20} className="text-neutral-400" /> : <ChevronDown size={20} className="text-neutral-400" />}
            </button>
            
            {isDetailsOpen && (
              <div className="p-4 pt-0 border-t border-neutral-100 bg-neutral-50">
                <div className="mb-4">
                  <div className="text-xs text-neutral-500 font-semibold uppercase mb-2">Delivery Address</div>
                  <div className="text-sm font-medium text-neutral-900">{order.drop.address}</div>
                </div>
                <div>
                  <div className="text-xs text-neutral-500 font-semibold uppercase mb-2">Items</div>
                  <ul className="space-y-1">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-sm">
                        <span className="text-neutral-700">{item.name}</span>
                        <span className="text-neutral-500 font-mono">x{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-center py-6 text-xs text-neutral-400">
            Powered by Logistics Portal
          </div>
        </div>
      </div>
    </div>
  );
};
