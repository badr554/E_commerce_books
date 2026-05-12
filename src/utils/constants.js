export const APP_NAME = 'KotobOnline'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CART: '/cart',
  CHECKOUT: '/checkout',
  SUCCESS: '/success',
  CANCEL: '/cancel',
  ORDERS: '/orders',
  ORDER_DETAIL: (id = ':id') => `/orders/${id}`,
}

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  CART: 'cart',
}
