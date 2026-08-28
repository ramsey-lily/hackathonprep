import React, { useEffect, useState } from 'react';
import { getFarmerOrders } from '../api/client';
import { LoadingState, ErrorState, EmptyState } from './StateViews';
import StatusBadge from './StatusBadge';

const ORDER_STAGES = ['confirmed', 'preparing', 'out_for_delivery', 'delivered'];

function normalizeStatus(status) {
  return status ? String(status).toLowerCase().replace(/\s+/g, '_') : '';
}

/**
 * Simple left-to-right progress tracker. If the backend returns a
 * status this component doesn't recognize, it still shows the badge
 * above but skips the stepper rather than guessing a position.
 */
function OrderProgress({ status }) {
  const normalized = normalizeStatus(status);
  const currentIndex = ORDER_STAGES.indexOf(normalized);

  if (currentIndex === -1) {
    return null;
  }

  return (
    <div className="order-progress">
      {ORDER_STAGES.map((stage, i) => (
        <React.Fragment key={stage}>
          <div className={`order-progress__step ${i <= currentIndex ? 'is-complete' : ''} ${i === currentIndex ? 'is-current' : ''}`}>
            <span className="order-progress__dot">{i <= currentIndex ? '✓' : '○'}</span>
            <span className="order-progress__label">
              {stage.replace(/_/g, ' ')}
            </span>
          </div>
          {i < ORDER_STAGES.length - 1 && <span className="order-progress__connector" />}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function Orders() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);

  async function loadOrders() {
    setLoading(true);
    setError(null);
    try {
      const data = await getFarmerOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) return <LoadingState label="Loading your orders..." />;
  if (error) return <ErrorState message={error} onRetry={loadOrders} />;

  if (orders.length === 0) {
    return <EmptyState title="You don't have any active orders yet." />;
  }

  return (
    <div className="orders">
      {orders.map((order) => {
        const total = order.total_amount ?? order.total ?? (order.quantity && order.price ? order.quantity * order.price : null);

        return (
          <div className="order-card" key={order.id}>
            <div className="order-card__header">
              <div>
                <span className="order-card__id">Order #{order.id}</span>
                {order.request_id && (
                  <span className="order-card__subid"> · Request #{order.request_id}</span>
                )}
              </div>
              <StatusBadge status={order.status} />
            </div>

            <p className="order-card__school">{order.school_name || 'Kasarani Secondary School'}</p>

            <div className="order-card__grid">
              <p><strong>{order.food_item}</strong></p>
              <p>Quantity: {order.quantity} {order.unit || ''}</p>
              <p>Price: KES {order.price}{order.unit ? `/${order.unit}` : ''}</p>
              {total !== null && <p>Total: KES {Number(total).toLocaleString()}</p>}
            </div>

            <OrderProgress status={order.status} />

            <div className="order-card__footer">
              <div className="order-card__payment">
                <span>Payment:</span>
                <StatusBadge status={order.payment_status} />
              </div>
              {order.mpesa_receipt && (
                <p className="order-card__receipt">M-Pesa Receipt: {order.mpesa_receipt}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
