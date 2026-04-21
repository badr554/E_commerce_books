import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useCart } from '../hooks/useCart'

function CartItem({ item }) {
  const { removeFromCart, updateQuantity } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const title = item?.name || item?.title || 'Untitled Book'
  const author =
    item?.author || item?.writer || item?.category || 'Featured edition'
  const image =
    item?.image ||
    item?.image_url ||
    item?.cover_url ||
    'https://via.placeholder.com/120x120'
  const linePrice = Number(item?.price * item?.quantity || 0).toFixed(2)
  const unitPrice = Number(item?.price || 0).toFixed(2)

  const handleQuantityChange = async (nextQuantity) => {
    setError(null)
    setLoading(true)

    try {
      await updateQuantity(item.id, nextQuantity)
    } catch (err) {
      setError(err.message || 'Could not update quantity.')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async () => {
    setError(null)
    setLoading(true)

    try {
      await removeFromCart(item.id)
    } catch (err) {
      setError(err.message || 'Could not remove this item.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <article className="cart-item">
      <div className="cart-item-cover">
        <img src={image} alt={title} />
      </div>

      <div className="cart-item-main">
        <div className="cart-item-topline">
          <div>
            <h3 className="cart-item-title">{title}</h3>
            <p className="cart-item-author">{author}</p>
            <p className="cart-item-unit-price">${unitPrice}</p>
          </div>
          <p className="cart-item-line-price">${linePrice}</p>
        </div>

        <div className="cart-item-controls">
          <button
            type="button"
            className="cart-item-qty-button"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            aria-label={`Decrease quantity of ${title}`}
            disabled={loading}
          >
            -
          </button>
          <span className="cart-item-qty-value">{item.quantity}</span>
          <button
            type="button"
            className="cart-item-qty-button"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            aria-label={`Increase quantity of ${title}`}
            disabled={loading}
          >
            +
          </button>
        </div>

        {error && <p className="cart-inline-error cart-item-error">{error}</p>}
      </div>

      <button
        type="button"
        className="cart-item-remove"
        onClick={handleRemove}
        aria-label={`Remove ${title} from cart`}
        disabled={loading}
      >
        <Trash2 size={18} />
      </button>
    </article>
  )
}

export default CartItem
