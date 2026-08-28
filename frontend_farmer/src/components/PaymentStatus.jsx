import React, { useEffect, useState } from 'react';
import { getFarmerOrders } from '../api/client';
import { LoadingState, ErrorState, EmptyState } from './StateViews';
import StatusBadge from './StatusBadge';

/**
 * The farmer never initiates a payment — the school pays via M-Pesa
 * and the backend records the result. This screen only displays
 * whatever payment_status / mpesa_receipt the backend returns.
 */
export default function PaymentStatus() {
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

  if (loading) return <LoadingState label="Loading payment information..." />;
  if (error) return <ErrorState message={error} onRetry={loadOrders} />;

  if (orders.length === 0) {
    return <EmptyState title="No payment records yet." subtitle="Payments will appear here once a school pays for an order." />;
  }

  return (
    <div className="payments">
      <table className="payments-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Food Item</th>
            <th>Total</th>
            <th>Payment Status</th>
            <th>M-Pesa Receipt</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const total = order.total_amount ?? order.total ?? (order.quantity && order.price ? order.quantity * order.price : null);
            return (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.food_item}</td>
                <td>{total !== null ? `KES ${Number(total).toLocaleString()}` : '—'}</td>
                <td><StatusBadge status={order.payment_status} /></td>
                <td>{order.mpesa_receipt || '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
