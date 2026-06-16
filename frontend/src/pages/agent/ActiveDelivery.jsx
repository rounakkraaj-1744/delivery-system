import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AgentLayout } from '../../components/agent/AgentLayout';
import { Button } from '../../components/common/Button';
import { Phone, MapPin, CheckCircle, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import toast from 'react-hot-toast';

// Simple pulsing dot for agent
const agentIcon = L.divIcon({
  className: 'custom-leaflet-icon',
  html: `<div class="relative w-6 h-6"><div class="absolute inset-0 bg-primary/40 rounded-full animate-ping"></div><div class="relative w-6 h-6 bg-primary rounded-full border-2 border-white shadow-sm"></div></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// Destination pin
const destIcon = L.divIcon({
  className: 'custom-leaflet-icon',
  html: `<div class="relative w-6 h-6 -top-3"><svg width="24" height="24" viewBox="0 0 24 24" fill="#F5A623" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="white"></circle></svg></div>`,
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

export const ActiveDelivery = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const steps = [
    { id: 'accepted', label: 'Accepted', btn: 'Arrived at Pickup' },
    { id: 'arrived_pickup', label: 'At Pickup', btn: 'Mark as Picked Up' },
    { id: 'picked_up', label: 'Picked Up', btn: 'Start Delivery' },
    { id: 'in_transit', label: 'In Transit', btn: 'Arrived at Drop' },
    { id: 'arrived_drop', label: 'At Drop', btn: 'Mark as Delivered' },
    { id: 'delivered', label: 'Delivered', btn: 'Done' }
  ];

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Mock locations
  const pickupLocation = [13.0849, 80.2101];
  const dropLocation = [13.0405, 80.2337];
  const [agentLocation, setAgentLocation] = useState([13.0800, 80.2000]);

  useEffect(() => {
    // Simulate moving towards destination based on step
    const interval = setInterval(() => {
      setAgentLocation(prev => {
        const target = currentStepIdx < 2 ? pickupLocation : dropLocation;
        const latDiff = (target[0] - prev[0]) * 0.1;
        const lngDiff = (target[1] - prev[1]) * 0.1;
        return [prev[0] + latDiff, prev[1] + lngDiff];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [currentStepIdx]);

  const handleNextStep = () => {
    if (currentStepIdx === steps.length - 1) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      
      if (nextIdx === steps.length - 1) {
        setShowConfetti(true);
        toast.success('Delivery Completed Successfully!', { icon: '🎉' });
        setTimeout(() => navigate('/agent/home'), 3000);
      } else {
        toast.success(`Status updated: ${steps[nextIdx].label}`);
      }
    }, 800);
  };

  const currentStep = steps[currentStepIdx];
  const isGoingToDrop = currentStepIdx >= 2;
  const targetLocation = isGoingToDrop ? dropLocation : pickupLocation;
  const targetAddress = isGoingToDrop ? 'Door 42, Cross Street, T Nagar' : 'Shop 12, Anna Nagar Main Road';

  return (
    <AgentLayout hideNav>
      <div className="relative h-full w-full flex flex-col bg-neutral-100">
        
        {/* Top Half: Map */}
        <div className="h-[45vh] relative z-0">
          <MapContainer center={agentLocation} zoom={14} className="w-full h-full" zoomControl={false}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={agentLocation} icon={agentIcon} />
            {currentStepIdx < steps.length - 1 && (
              <Marker position={targetLocation} icon={destIcon} />
            )}
            <Polyline 
              positions={[agentLocation, targetLocation]} 
              color="#3D8B6E" 
              weight={4} 
              opacity={0.8}
            />
            <MapController center={agentLocation} />
          </MapContainer>

          {/* Back button overlay */}
          <button 
            onClick={() => navigate('/agent/home')}
            className="absolute top-4 left-4 z-[400] w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-neutral-600"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Bottom Half: Sliding Panel */}
        <div className="flex-1 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative z-10 -mt-6 p-6 flex flex-col">
          <div className="w-12 h-1.5 bg-neutral-200 rounded-full mx-auto mb-6"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="font-mono text-sm font-bold text-neutral-500 mb-1">{orderId}</div>
              <h2 className="text-xl font-bold text-neutral-900">Customer Name</h2>
            </div>
            <a href="tel:+919876543210" className="w-12 h-12 bg-primary-surface text-primary rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors">
              <Phone size={24} />
            </a>
          </div>

          {/* Horizontal Stepper */}
          <div className="mb-8 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-neutral-100 -translate-y-1/2 z-0"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
            ></div>
            
            <div className="flex justify-between relative z-10">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-500 ${
                    idx < currentStepIdx ? 'bg-primary border-primary' : 
                    idx === currentStepIdx ? 'bg-white border-primary shadow-[0_0_0_4px_rgba(61,139,110,0.2)]' : 'bg-white border-neutral-300'
                  }`}>
                    {idx < currentStepIdx && <CheckCircle size={10} className="text-white" />}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-3 font-semibold text-primary text-sm">
              {currentStep.label}
            </div>
          </div>

          <div className="bg-neutral-50 rounded-2xl p-4 mb-auto border border-neutral-100">
            <div className="flex gap-3">
              <Navigation className="text-accent mt-0.5" size={20} />
              <div>
                <div className="text-xs text-neutral-500 font-semibold uppercase mb-1">
                  {isGoingToDrop ? 'Drop Location' : 'Pickup Location'}
                </div>
                <div className="text-neutral-900 font-medium leading-snug">{targetAddress}</div>
              </div>
            </div>
          </div>

          {showConfetti && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-t-3xl z-50 slide-up">
              <div className="text-center">
                <div className="w-24 h-24 bg-success text-white rounded-full flex items-center justify-center mx-auto mb-4 scale-in-animation shadow-xl shadow-success/30">
                  <CheckCircle size={48} />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Delivered!</h2>
                <p className="text-neutral-600">Great job. ₹85 added to earnings.</p>
              </div>
            </div>
          )}

          {!showConfetti && (
            <div className="pt-4">
              <Button 
                className="w-full h-14 text-lg rounded-2xl shadow-lg shadow-primary/20"
                onClick={handleNextStep}
                isLoading={isLoading}
              >
                {currentStep.btn}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .scale-in-animation { animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        @keyframes scaleIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}} />
    </AgentLayout>
  );
};
