// src/mock/orders.js

const STATUSES = ["Pending", "Assigned", "In Transit", "Delivered", "Cancelled"];
const ITEMS = ["Groceries", "Electronics", "Documents", "Food", "Medicines", "Clothing"];
const AREAS = [
  { name: "Anna Nagar", lat: 13.0849, lng: 80.2101 },
  { name: "T Nagar", lat: 13.0405, lng: 80.2337 },
  { name: "Adyar", lat: 13.0068, lng: 80.2575 },
  { name: "Velachery", lat: 12.9815, lng: 80.2180 },
  { name: "Mylapore", lat: 13.0368, lng: 80.2676 },
  { name: "Guindy", lat: 13.0067, lng: 80.2206 },
  { name: "Tambaram", lat: 12.9229, lng: 80.1275 },
  { name: "Nungambakkam", lat: 13.0595, lng: 80.2425 },
  { name: "Thiruvanmiyur", lat: 12.9863, lng: 80.2613 },
  { name: "Alwarpet", lat: 13.0335, lng: 80.2520 }
];

const generateMockOrders = (count) => {
  return Array.from({ length: count }).map((_, i) => {
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const pickupArea = AREAS[Math.floor(Math.random() * AREAS.length)];
    const dropArea = AREAS[Math.floor(Math.random() * AREAS.length)];
    
    const assignedAgentId = (status !== "Pending" && status !== "Cancelled") ? `A10${Math.floor(Math.random() * 5) + 1}` : null;
    
    // Generate realistic timestamps
    const now = new Date();
    const createdTime = new Date(now.getTime() - Math.random() * 86400000); // within last 24h
    let pickedUpTime = null;
    let deliveredTime = null;
    
    if (status === "In Transit" || status === "Delivered") {
      pickedUpTime = new Date(createdTime.getTime() + 15 * 60000);
    }
    if (status === "Delivered") {
      deliveredTime = new Date(pickedUpTime.getTime() + 30 * 60000);
    }

    const numItems = Math.floor(Math.random() * 4) + 1;
    const items = Array.from({ length: numItems }).map(() => ({
      name: ITEMS[Math.floor(Math.random() * ITEMS.length)],
      quantity: Math.floor(Math.random() * 3) + 1
    }));

    return {
      id: `ORD-90${i.toString().padStart(2, '0')}`,
      customer: {
        name: `Customer ${i + 1}`,
        phone: `+91 90000${Math.floor(10000 + Math.random() * 90000)}`
      },
      pickup: {
        address: `Shop ${i}, Main Road, ${pickupArea.name}, Chennai`,
        lat: pickupArea.lat + (Math.random() * 0.005),
        lng: pickupArea.lng + (Math.random() * 0.005)
      },
      drop: {
        address: `Door ${i * 2}, Cross Street, ${dropArea.name}, Chennai`,
        lat: dropArea.lat + (Math.random() * 0.005),
        lng: dropArea.lng + (Math.random() * 0.005)
      },
      status,
      items,
      agentId: assignedAgentId,
      timeline: {
        created: createdTime.toISOString(),
        assigned: assignedAgentId ? new Date(createdTime.getTime() + 5 * 60000).toISOString() : null,
        pickedUp: pickedUpTime ? pickedUpTime.toISOString() : null,
        delivered: deliveredTime ? deliveredTime.toISOString() : null
      },
      priority: Math.random() > 0.8 ? "Urgent" : "Normal"
    };
  });
};

export const MOCK_ORDERS = generateMockOrders(50);
