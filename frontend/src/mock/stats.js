// src/mock/stats.js

export const MOCK_STATS = {
  summary: {
    totalOrdersToday: 342,
    totalOrdersDelta: "+12%",
    activeDeliveries: 45,
    agentsOnline: 28,
    agentsTotal: 42,
    avgDeliveryTime: "32 mins"
  },
  deliveryTrend: [
    { hour: '08:00', placed: 12, delivered: 5 },
    { hour: '09:00', placed: 25, delivered: 18 },
    { hour: '10:00', placed: 40, delivered: 28 },
    { hour: '11:00', placed: 35, delivered: 35 },
    { hour: '12:00', placed: 50, delivered: 42 },
    { hour: '13:00', placed: 65, delivered: 48 },
    { hour: '14:00', placed: 45, delivered: 55 },
    { hour: '15:00', placed: 30, delivered: 40 },
  ],
  agentStatus: [
    { name: 'Available', value: 14, color: '#2E9E6B' },
    { name: 'On Delivery', value: 14, color: '#F5A623' },
    { name: 'Offline', value: 14, color: '#CBD2DC' },
  ],
  topAgents: [
    { name: 'Ramesh K', deliveries: 15 },
    { name: 'Suresh B', deliveries: 14 },
    { name: 'Dinesh R', deliveries: 12 },
    { name: 'Ganesh P', deliveries: 11 },
    { name: 'Anand S', deliveries: 10 },
  ],
  successRate: [
    { day: 'Mon', delivered: 240, cancelled: 10, pending: 5 },
    { day: 'Tue', delivered: 260, cancelled: 12, pending: 3 },
    { day: 'Wed', delivered: 280, cancelled: 8, pending: 6 },
    { day: 'Thu', delivered: 250, cancelled: 15, pending: 8 },
    { day: 'Fri', delivered: 310, cancelled: 5, pending: 2 },
    { day: 'Sat', delivered: 380, cancelled: 20, pending: 15 },
    { day: 'Sun', delivered: 350, cancelled: 18, pending: 10 },
  ],
  avgTimeByHour: [
    { hour: '08:00', minutes: 22 },
    { hour: '10:00', minutes: 28 },
    { hour: '12:00', minutes: 35 },
    { hour: '14:00', minutes: 42 },
    { hour: '16:00', minutes: 38 },
    { hour: '18:00', minutes: 45 },
    { hour: '20:00', minutes: 30 },
  ]
};
