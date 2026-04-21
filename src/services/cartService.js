import api from './api'

export const cartService = {
  add: (productId, quantity = 1) =>
    api.post('/cart/add', {
      product_id: productId,
      quantity,
    }),
  update: (cartItemId, action) =>
    api.post('/cart/update', {
      cart_item_id: cartItemId,
      action,
    }),
  remove: (cartItemId) => api.delete(`/cart/remove/${cartItemId}`),
}
