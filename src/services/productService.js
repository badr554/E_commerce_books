import api from './api'

const BOOK_AUTHORS = {
  'The Silent Library': 'Eleanor Whitfield',
  'Recipes from a Slow Kitchen': 'Anouk Beaulieu',
  'The Hour Before Dawn': 'Sade Adekunle',
  'Quiet Machines': 'Dr. Adaeze Okonkwo',
  'Saltwater Hours': 'Theo Bishop',
  'The Glassmaker of Murano': 'Lucia Romano',
  'Code & Cathedral': 'Henrik Vass',
  'Wildflowers of the Pyrenees': 'Mireille Costa',
}

function normalizeProduct(product) {
  if (!product) return null

  const priceInDollars =
    typeof product.price === 'number' ? product.price / 100 : 0

  return {
    ...product,
    name: product.name,
    title: product.name,
    author: product.author || BOOK_AUTHORS[product.name] || 'Featured edition',
    description:
      product.description ||
      'A thoughtfully selected book from the Marginalia collection.',
    image: product.image || product.image_url || product.cover_url || null,
    image_url: product.image_url || product.image || product.cover_url || null,
    cover_url: product.cover_url || product.image_url || product.image || null,
    price: priceInDollars,
    price_cents: typeof product.price === 'number' ? product.price : 0,
  }
}

function normalizeProducts(payload) {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : []

  return list.map(normalizeProduct).filter(Boolean)
}

export const productService = {
  getAll: async () => normalizeProducts(await api.get('/get_products')),
  getById: async (id) => {
    const products = await productService.getAll()
    const product = products.find((item) => String(item.id) === String(id))

    if (!product) {
      throw new Error('Book not found.')
    }

    return product
  },
  search: async (query) => {
    const products = await productService.getAll()
    const normalizedQuery = String(query || '').trim().toLowerCase()

    if (!normalizedQuery) return products

    return products.filter((product) => {
      const haystack = [product.name, product.author, product.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalizedQuery)
    })
  },
  getCategories: async () => [],
}
