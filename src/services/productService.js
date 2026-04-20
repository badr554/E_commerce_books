import api from './api'

export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  search: (query) => api.get('/products/search', { params: { q: query } }),
  getCategories: () => api.get('/products/categories'),
}
