import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AgentLayout } from '../../components/agent/AgentLayout';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { MapPin, Package, Clock, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

export const AgentHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(true);
  const [incomingOrder, setIncomingOrder] = useState(null);
  const [countdown, setCountdown] = useState(60);

  // Simulate an incoming order after 3 seconds of being online
  useEffect(() => {
    let timeoutId;
    if (isOnline && !incomingOrder) {
      timeoutId = setTimeout(() => {
        setIncomingOrder({
          id: 'ORD-9005',
          pickup: 'Shop 12, Anna Nagar Main Road, Chennai',
          drop: 'Door 42, Cross Street, T Nagar, Chennai',
          distance: '4.2 km',
          time: '18 mins',
          items: 3
        });
        setCountdown(60);
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [isOnline, incomingOrder]);

  // Handle countdown
  useEffect(() => {
    let intervalId;
    if (incomingOrder && countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0 && incomingOrder) {
      toast.error('Order reassigned due to timeout');
      setIncomingOrder(null);
    }
    return () => clearInterval(intervalId);
  }, [incomingOrder, countdown]);

  const handleAccept = () => {
    toast.success('Order accepted! Head to pickup.');
    navigate(`/agent/delivery/${incomingOrder.id}`);
  };

  const handleDecline = () => {
    toast.success('Order declined');
    setIncomingOrder(null);
  };

  return (
    <AgentLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Avatar name={user?.data?.name} className="w-12 h-12" />
            <div>
              <div className="font-bold text-neutral-900 leading-tight">{user?.data?.name || 'Agent'}</div>
              <div className="text-xs text-neutral-600">ID: A104</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-full">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${isOnline ? 'text-primary' : 'text-neutral-500'}`}>Online</span>
            <button 
              onClick={() => {
                setIsOnline(!isOnline);
                if (isOnline) setIncomingOrder(null);
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isOnline ? 'bg-primary' : 'bg-neutral-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isOnline ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {!incomingOrder ? (
          <div className="space-y-6 page-transition">
            {/* Status Card */}
            <div className={`rounded-3xl p-8 text-center text-white shadow-xl relative overflow-hidden transition-colors duration-500 ${isOnline ? 'bg-primary' : 'bg-neutral-600'}`}>
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                  {isOnline ? (
                    <div className="relative flex items-center justify-center w-full h-full">
                      <div className="absolute inset-0 rounded-full border-2 border-white opacity-20 animate-ping"></div>
                      <MapPin size={32} className="text-white relative z-10" />
                    </div>
                  ) : (
                    <Clock size={32} className="text-white" />
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-1">{isOnline ? "You're Online" : "You're Offline"}</h2>
                <p className="text-white/80 text-sm">{isOnline ? "Waiting for new orders..." : "Go online to receive orders"}</p>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-8 -mt-8"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-tr-full -ml-8 -mb-8"></div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 text-center">
                <div className="text-xs text-neutral-500 uppercase font-semibold mb-1">Today</div>
                <div className="text-xl font-bold text-neutral-900">₹850</div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 text-center">
                <div className="text-xs text-neutral-500 uppercase font-semibold mb-1">Deliv.</div>
                <div className="text-xl font-bold text-neutral-900">12</div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 text-center">
                <div className="text-xs text-neutral-500 uppercase font-semibold mb-1">Accept</div>
                <div className="text-xl font-bold text-success">98%</div>
              </div>
            </div>

            {/* Recent */}
            <div>
              <h3 className="text-sm font-bold text-neutral-900 mb-4 px-2">Recent Deliveries</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-500">
                        <Package size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900 text-sm">ORD-90{i * 2}</div>
                        <div className="text-xs text-neutral-500">{i + 1} hours ago</div>
                      </div>
                    </div>
                    <div className="font-bold text-success text-sm">+₹75</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Incoming Order Card */
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden slide-up border border-neutral-100 relative z-20">
            <div className="bg-primary/5 p-6 border-b border-primary/10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-neutral-200">
                <div className="h-full bg-primary transition-all linear" style={{ width: `${(countdown / 60) * 100}%` }}></div>
              </div>
              <div className="text-primary font-bold text-sm uppercase tracking-wider mb-2">New Delivery Request</div>
              <div className="text-4xl font-mono font-bold text-neutral-900 mb-1">00:{countdown.toString().padStart(2, '0')}</div>
              <div className="text-sm text-neutral-600">to accept</div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center text-center">
                <div className="flex-1">
                  <div className="text-2xl font-bold text-neutral-900">{incomingOrder.distance}</div>
                  <div className="text-xs text-neutral-500 uppercase">Est. Distance</div>
                </div>
                <div className="w-px h-10 bg-neutral-200"></div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-neutral-900">{incomingOrder.time}</div>
                  <div className="text-xs text-neutral-500 uppercase">Est. Time</div>
                </div>
                <div className="w-px h-10 bg-neutral-200"></div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-neutral-900">₹85</div>
                  <div className="text-xs text-neutral-500 uppercase">Earnings</div>
                </div>
              </div>

              <div className="relative pl-6 space-y-6">
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-neutral-200"></div>
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-neutral-300 border-2 border-white shadow-sm"></div>
                  <div className="text-xs font-semibold text-neutral-600 uppercase mb-1">Pickup</div>
                  <div className="text-sm font-medium text-neutral-900">{incomingOrder.pickup}</div>
                </div>
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-accent border-2 border-white shadow-sm"></div>
                  <div className="text-xs font-semibold text-neutral-600 uppercase mb-1">Drop</div>
                  <div className="text-sm font-medium text-neutral-900">{incomingOrder.drop}</div>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-100 flex flex-col gap-3">
                <Button className="w-full h-14 text-lg rounded-2xl shadow-lg shadow-primary/30" onClick={handleAccept}>
                  Accept Delivery
                </Button>
                <Button variant="ghost" className="w-full h-14 text-lg rounded-2xl" onClick={handleDecline}>
                  Decline
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AgentLayout>
  );
};
