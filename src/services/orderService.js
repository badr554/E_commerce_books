import api from './api';

export const fetchOrders = async () => {
  return await api.get('/my-orders');
};

export const fetchOrderById = async (id) => {
  return await api.get(`/orders/${encodeURIComponent(id)}`);
};
