import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../services/orderService';
import { ROUTES } from '../utils/constants';
import '../styles/Orders.css';

function formatPrice(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatDate(dateString) {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };
  return new Date(dateString).toLocaleString('en-US', options);
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        // data should be an array of orders based on the API response structure
        setOrders(data || []);
      } catch (err) {
        setError(err.message || 'Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return <div className="orders-loading">Loading your orders...</div>;
  }

  if (error) {
    return <div className="orders-error">{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <section className="orders-empty-page">
        <div className="orders-empty-card">
          <h1 className="orders-empty-title">Your orders</h1>
          <p className="orders-empty-text">
            You haven't placed any orders yet.
          </p>
          <div style={{ marginTop: '26px' }}>
            <Link to={ROUTES.HOME} className="cart-primary-link" style={{ textDecoration: 'none', padding: '16px 32px' }}>
              Start shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="orders-page">
      <header className="orders-header">
        <h1 className="orders-title">Your orders</h1>
      </header>

      <div className="orders-list">
        {orders.map((order) => {
          // Generate a display ID using stripe_session_id or fallback to id
          const displayId = order.stripe_session_id 
            ? order.stripe_session_id.replace('cs_test_', '').substring(0, 8)
            : order.id;

          return (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <div className="order-id">Order #{displayId}</div>
                  <div className="order-date">{formatDate(order.created_at)}</div>
                </div>
                <div className="order-status">{order.status || 'PAID'}</div>
              </div>

              <div className="order-items">
                {order.items?.map((item, index) => (
                  <div key={index} className="order-item">
                    <span>{item.product_name} × {item.quantity}</span>
                    <span className="order-item-price">{formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <span className="order-total-label">Total</span>
                <span className="order-total-value">{formatPrice(order.display_total)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Orders;
