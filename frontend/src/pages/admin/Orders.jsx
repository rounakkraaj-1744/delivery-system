import React, { useState } from 'react';
import { MOCK_ORDERS } from '../../mock/orders';
import { MOCK_AGENTS } from '../../mock/agents';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { Modal } from '../common/Modal';
import { Search, Plus, Eye, UserPlus, XCircle, Copy, MapPin, Navigation } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import toast from 'react-hot-toast';

export const Orders = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  const tabs = ['All', 'Pending', 'Assigned', 'In Transit', 'Delivered', 'Cancelled'];

  const filteredOrders = MOCK_ORDERS.filter(order => {
    if (activeTab !== 'All' && order.status !== activeTab) return false;
    if (searchTerm) {
      return order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
             order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const handleCopyId = (id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    toast.success('Order ID copied');
  };

  const handleAssignAgent = (agent) => {
    toast.success(`Order assigned to ${agent.name}`);
    setIsAssignModalOpen(false);
  };

  return (
    <div className="page-transition max-w-7xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Orders</h1>
          <p className="text-neutral-600">Manage all incoming and active deliveries.</p>
        </div>
        <Button onClick={() => setIsNewOrderModalOpen(true)} className="gap-2">
          <Plus size={18} /> New Order
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-neutral-100 flex flex-col flex-1 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-neutral-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto hide-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input 
              type="text" 
              placeholder="Search ID or customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-100 border-none rounded-xl focus:ring-2 focus:ring-primary focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-neutral-100/90 backdrop-blur z-10 shadow-sm">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Locations</th>
                <th className="px-6 py-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Assigned Agent</th>
                <th className="px-6 py-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.map(order => (
                <tr 
                  key={order.id} 
                  onClick={() => setSelectedOrder(order)}
                  className="hover:bg-neutral-50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-neutral-900 group-hover:text-primary transition-colors">{order.id}</span>
                      <button onClick={(e) => handleCopyId(order.id, e)} className="text-neutral-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <Copy size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-neutral-900">{order.customer.name}</div>
                    <div className="text-xs text-neutral-600">{order.customer.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 max-w-[200px]">
                      <div className="text-xs text-neutral-600 truncate flex items-center gap-1" title={order.pickup.address}>
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 shrink-0"></div>
                        <span className="truncate">{order.pickup.address}</span>
                      </div>
                      <div className="text-xs text-neutral-600 truncate flex items-center gap-1" title={order.drop.address}>
                        <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0"></div>
                        <span className="truncate">{order.drop.address}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {order.agentId ? (() => {
                      const agent = MOCK_AGENTS.find(a => a.id === order.agentId);
                      return agent ? (
                        <div className="flex items-center gap-2">
                          <Avatar name={agent.name} className="w-8 h-8" />
                          <div className="text-sm font-medium text-neutral-900">{agent.name}</div>
                        </div>
                      ) : null;
                    })() : (
                      <span className="text-sm font-medium text-accent bg-accent/10 px-2 py-1 rounded-md">Unassigned</span>
                    )}
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
                  <td className="px-6 py-4 text-sm text-neutral-600 text-right">
                    {formatDistanceToNow(new Date(order.timeline.created), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-in Panel for Order Details */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm transition-opacity" onClick={() => setSelectedOrder(null)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col slide-in-right">
            <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-primary/5">
              <div>
                <div className="text-xs text-neutral-600 uppercase tracking-wider font-semibold mb-1">Order Details</div>
                <h2 className="text-xl font-mono font-bold text-neutral-900">{selectedOrder.id}</h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-neutral-200 rounded-full transition-colors">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
                  <Users size={16} className="text-primary"/> Customer
                </h3>
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                  <div className="font-semibold text-neutral-900">{selectedOrder.customer.name}</div>
                  <div className="text-sm text-neutral-600 mt-1">{selectedOrder.customer.phone}</div>
                </div>
              </div>

              {/* Locations */}
              <div>
                <h3 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
                  <MapPin size={16} className="text-primary"/> Route
                </h3>
                <div className="relative pl-6 space-y-6">
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-neutral-200"></div>
                  
                  <div className="relative">
                    <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-neutral-300 border-2 border-white shadow-sm"></div>
                    <div className="text-xs font-semibold text-neutral-600 uppercase mb-1">Pickup</div>
                    <div className="text-sm text-neutral-900">{selectedOrder.pickup.address}</div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-accent border-2 border-white shadow-sm"></div>
                    <div className="text-xs font-semibold text-neutral-600 uppercase mb-1">Drop</div>
                    <div className="text-sm text-neutral-900">{selectedOrder.drop.address}</div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
                  <Package size={16} className="text-primary"/> Items
                </h3>
                <ul className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center text-sm border-b border-neutral-100 pb-2 last:border-0">
                      <span className="text-neutral-900">{item.name}</span>
                      <span className="text-neutral-600 font-mono">x{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Agent */}
              <div>
                <h3 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
                  <Navigation size={16} className="text-primary"/> Assignment
                </h3>
                {selectedOrder.agentId ? (() => {
                  const agent = MOCK_AGENTS.find(a => a.id === selectedOrder.agentId);
                  return (
                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar name={agent.name} />
                        <div>
                          <div className="font-semibold text-neutral-900 text-sm">{agent.name}</div>
                          <div className="text-xs text-neutral-600">{agent.phone}</div>
                        </div>
                      </div>
                      {selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Cancelled' && (
                        <Button variant="outline" size="sm" onClick={() => setIsAssignModalOpen(true)}>Reassign</Button>
                      )}
                    </div>
                  );
                })() : (
                  <div className="bg-accent/5 p-4 rounded-xl border border-accent/20 flex flex-col items-center justify-center text-center gap-3">
                    <div className="text-sm text-accent font-medium">No agent assigned yet</div>
                    <Button onClick={() => setIsAssignModalOpen(true)} className="w-full">Assign Agent</Button>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-6 border-t border-neutral-100 bg-neutral-50 flex gap-3 shrink-0">
              {selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Cancelled' && (
                <>
                  <Button variant="danger" className="flex-1" onClick={() => {
                    toast.success('Order Cancelled');
                    setSelectedOrder(null);
                  }}>Cancel Order</Button>
                  {selectedOrder.status === 'In Transit' && (
                    <Button variant="primary" className="flex-1 bg-success hover:bg-success/90" onClick={() => {
                      toast.success('Order Marked as Delivered');
                      setSelectedOrder(null);
                    }}>Mark Delivered</Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assign Agent Modal */}
      <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title="Assign Agent">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input type="text" placeholder="Search available agents..." className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2">
            {MOCK_AGENTS.filter(a => a.status === 'Available').map(agent => (
              <div key={agent.id} className="p-3 border border-neutral-100 rounded-xl hover:border-primary cursor-pointer transition-colors flex items-center justify-between group" onClick={() => handleAssignAgent(agent)}>
                <div className="flex items-center gap-3">
                  <Avatar name={agent.name} />
                  <div>
                    <div className="font-semibold text-neutral-900 text-sm">{agent.name}</div>
                    <div className="text-xs text-neutral-600 flex items-center gap-1">
                      <span>★ {agent.rating}</span>
                      <span>•</span>
                      <span>{agent.vehicle}</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">Assign</Button>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* New Order Modal Form - simplified for demo */}
      <Modal isOpen={isNewOrderModalOpen} onClose={() => setIsNewOrderModalOpen(false)} title="Create New Order">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1">Customer Name</label>
            <input type="text" className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="Enter name" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1">Phone Number</label>
            <input type="text" className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="Enter phone" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1">Pickup Address</label>
            <textarea className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none resize-none h-20" placeholder="Enter full pickup address"></textarea>
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1">Drop Address</label>
            <textarea className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none resize-none h-20" placeholder="Enter full drop address"></textarea>
          </div>
          <div className="pt-4 border-t border-neutral-100 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsNewOrderModalOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              toast.success('Order created successfully!');
              setIsNewOrderModalOpen(false);
            }}>Create Order</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
