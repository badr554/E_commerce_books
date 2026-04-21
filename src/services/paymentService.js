import api from './api'

export const paymentService = {
  createCheckoutSession: (payload) =>
    api.post('/Pay_with_Stripe_checkout', payload),
}
