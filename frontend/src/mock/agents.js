
export const MOCK_AGENTS = [
  { id: "A101", name: "Ramesh Kumar", phone: "+91 9876543210", email: "ramesh@delivery.com", vehicle: "Bike", vehicleNumber: "TN 01 AB 1234", status: "Available", rating: 4.8, deliveriesToday: 12, totalDeliveries: 450, lat: 13.0850, lng: 80.2700, lastPing: new Date().toISOString(), battery: 85 },
  { id: "A102", name: "Suresh Babu", phone: "+91 9876543211", email: "suresh@delivery.com", vehicle: "Bike", vehicleNumber: "TN 02 XY 9876", status: "On Delivery", rating: 4.6, deliveriesToday: 8, totalDeliveries: 320, lat: 13.0780, lng: 80.2650, lastPing: new Date().toISOString(), currentOrderId: "ORD-9002", battery: 60 },
  { id: "A103", name: "Karthik Raj", phone: "+91 9876543212", email: "karthik@delivery.com", vehicle: "Van", vehicleNumber: "TN 09 ZZ 1111", status: "Offline", rating: 4.9, deliveriesToday: 0, totalDeliveries: 890, lat: 13.0900, lng: 80.2800, lastPing: new Date(Date.now() - 3600000).toISOString(), battery: 0 },
  { id: "A104", name: "Prakash V", phone: "+91 9876543213", email: "prakash@delivery.com", vehicle: "Bike", vehicleNumber: "TN 10 BQ 2222", status: "Available", rating: 4.5, deliveriesToday: 5, totalDeliveries: 150, lat: 13.0800, lng: 80.2750, lastPing: new Date().toISOString(), battery: 92 },
  { id: "A105", name: "Anand S", phone: "+91 9876543214", email: "anand@delivery.com", vehicle: "Bike", vehicleNumber: "TN 07 CC 3333", status: "On Delivery", rating: 4.7, deliveriesToday: 14, totalDeliveries: 610, lat: 13.0700, lng: 80.2600, lastPing: new Date().toISOString(), currentOrderId: "ORD-9005", battery: 45 },
  { id: "A106", name: "Vijay M", phone: "+91 9876543215", email: "vijay@delivery.com", vehicle: "Car", vehicleNumber: "TN 22 DX 4444", status: "Available", rating: 4.2, deliveriesToday: 3, totalDeliveries: 80, lat: 13.0880, lng: 80.2680, lastPing: new Date().toISOString(), battery: 100 },
  { id: "A107", name: "Arun Kumar", phone: "+91 9876543216", email: "arun@delivery.com", vehicle: "Bike", vehicleNumber: "TN 05 EE 5555", status: "Offline", rating: 4.8, deliveriesToday: 2, totalDeliveries: 200, lat: 13.0650, lng: 80.2500, lastPing: new Date(Date.now() - 7200000).toISOString(), battery: 10 },
  { id: "A108", name: "Ganesh P", phone: "+91 9876543217", email: "ganesh@delivery.com", vehicle: "Bike", vehicleNumber: "TN 04 FF 6666", status: "On Delivery", rating: 4.4, deliveriesToday: 9, totalDeliveries: 290, lat: 13.0950, lng: 80.2850, lastPing: new Date().toISOString(), currentOrderId: "ORD-9011", battery: 78 },
  { id: "A109", name: "Muthu K", phone: "+91 9876543218", email: "muthu@delivery.com", vehicle: "Van", vehicleNumber: "TN 03 GG 7777", status: "Available", rating: 4.6, deliveriesToday: 6, totalDeliveries: 410, lat: 13.0810, lng: 80.2710, lastPing: new Date().toISOString(), battery: 88 },
  { id: "A110", name: "Dinesh R", phone: "+91 9876543219", email: "dinesh@delivery.com", vehicle: "Bike", vehicleNumber: "TN 01 HH 8888", status: "Available", rating: 4.9, deliveriesToday: 15, totalDeliveries: 750, lat: 13.0750, lng: 80.2620, lastPing: new Date().toISOString(), battery: 55 },
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: `A11${i+1}`,
    name: `Agent ${i+11}`,
    phone: `+91 98765432${20+i}`,
    email: `agent${i+11}@delivery.com`,
    vehicle: i % 3 === 0 ? "Van" : "Bike",
    vehicleNumber: `TN 11 XX 00${i}`,
    status: i % 2 === 0 ? "Available" : "Offline",
    rating: 4.0 + (i % 10) / 10,
    deliveriesToday: i,
    totalDeliveries: i * 20,
    lat: 13.08 + (Math.random() * 0.04 - 0.02),
    lng: 80.27 + (Math.random() * 0.04 - 0.02),
    lastPing: new Date().toISOString(),
    battery: 40 + i * 5
  }))
];
