import React, { useState } from 'react';
import { Button } from '../common/Button';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('General');
  const tabs = ['General', 'Notifications', 'Zones', 'Account'];

  return (
    <div className="page-transition max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-600">Manage portal preferences and configurations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-primary/10 text-primary'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-card border border-neutral-100 p-8 min-h-[500px]">
          {activeTab === 'General' && (
            <div className="space-y-6 slide-in-right">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">General Settings</h2>
              
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1">App Name</label>
                  <input type="text" defaultValue="Logistics Portal" className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1">Default City</label>
                  <select className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white">
                    <option>Chennai</option>
                    <option>Mumbai</option>
                    <option>Delhi</option>
                    <option>Bangalore</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1">Max Active Orders per Agent</label>
                  <input type="number" defaultValue="3" className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" />
                </div>
                
                <div className="pt-4 border-t border-neutral-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-neutral-900">Auto-Dispatch</div>
                      <div className="text-sm text-neutral-600">Automatically assign orders to nearest available agent</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>

                <div className="pt-6">
                  <Button>Save Changes</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'General' && (
            <div className="h-full flex flex-col items-center justify-center text-center slide-in-right">
              <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mb-4">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">{activeTab} Settings</h3>
              <p className="text-neutral-600">This section is available in the full version.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
