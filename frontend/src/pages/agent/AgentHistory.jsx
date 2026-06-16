import React, { useState } from 'react';
import { AgentLayout } from '../../components/agent/AgentLayout';
import { MOCK_ORDERS } from '../../mock/orders';
import { Badge } from '../../components/common/Badge';
import { formatDistanceToNow, format } from 'date-fns';

export const AgentHistory = () => {
  const [itemsToShow, setItemsToShow] = useState(10);
  
  // Fake filter for my deliveries
  const myOrders = MOCK_ORDERS.filter(o => o.status === 'Delivered').slice(0, 30);
  const displayedOrders = myOrders.slice(0, itemsToShow);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && itemsToShow < myOrders.length) {
      // Simulate loading more
      setTimeout(() => setItemsToShow(prev => prev + 10), 500);
    }
  };

  return (
    <AgentLayout>
      <div className="h-full flex flex-col bg-neutral-100">
        <div className="bg-white p-6 pb-4 border-b border-neutral-100 shrink-0 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-neutral-900">History</h1>
          <p className="text-neutral-600 text-sm">Your past deliveries</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3" onScroll={handleScroll}>
          {displayedOrders.map(order => (
            <div key={order.id} className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-xs text-neutral-500 mb-0.5">{format(new Date(order.timeline.delivered || Date.now()), 'MMM d, yyyy • h:mm a')}</div>
                  <div className="font-mono font-bold text-neutral-900 text-sm">{order.id}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-success">₹{Math.floor(Math.random() * 50) + 50}</div>
                  <Badge variant="success" className="mt-1 text-[10px]">Delivered</Badge>
                </div>
              </div>
              
              <div className="bg-neutral-50 rounded-xl p-3 text-xs text-neutral-600 flex flex-col gap-2 border border-neutral-100">
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1 shrink-0"></div>
                  <span className="truncate">{order.pickup.address}</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1 shrink-0"></div>
                  <span className="truncate">{order.drop.address}</span>
                </div>
              </div>
            </div>
          ))}
          
          {itemsToShow < myOrders.length && (
            <div className="py-4 text-center text-sm text-neutral-500 flex justify-center items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              Loading more...
            </div>
          )}
          {itemsToShow >= myOrders.length && (
            <div className="py-4 text-center text-sm text-neutral-400">
              No more deliveries to show
            </div>
          )}
        </div>
      </div>
    </AgentLayout>
  );
};
