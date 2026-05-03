import api from './api';

export const fetchOrders = async () => {
  return await api.get('/my-orders');
};
