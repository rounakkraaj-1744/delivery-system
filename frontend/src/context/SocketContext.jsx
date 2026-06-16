import React, { createContext, useContext, useEffect, useState } from 'react';
import { MOCK_AGENTS } from '../mock/agents';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [agents, setAgents] = useState(MOCK_AGENTS);

  useEffect(() => {
    // Simulate live GPS ping updates every 5 seconds
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        if (agent.status !== 'Offline') {
          // move randomly a tiny bit to simulate driving
          const latDiff = (Math.random() - 0.5) * 0.0005;
          const lngDiff = (Math.random() - 0.5) * 0.0005;
          return {
            ...agent,
            lat: agent.lat + latDiff,
            lng: agent.lng + lngDiff,
            lastPing: new Date().toISOString(),
            battery: Math.max(0, agent.battery - (Math.random() * 0.1))
          };
        }
        return agent;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SocketContext.Provider value={{ agents, setAgents }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
