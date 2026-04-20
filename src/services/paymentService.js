import api from './api'

export const paymentService = {
  createCheckoutSession: (cartItems) =>
    api.post('/payment/create-checkout-session', { cartItems }),
  verifyPayment: (sessionId) =>
    api.get(`/payment/verify/${sessionId}`),
}
