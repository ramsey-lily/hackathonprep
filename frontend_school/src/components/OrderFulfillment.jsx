import React from 'react';

export default function OrderFulfillment({ orders }) {
  return (
    <div className="table-card">
      <div className="table-toolbar">
        <h3 className="font-display" style={{ fontSize: '16px' }}>Confirmed Orders & Fulfillment Ledger</h3>
      </div>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Request ID</th>
            <th>Farmer ID</th>
            <th>Offer ID</th>
            <th>Price / Unit</th>
            <th>Quantity</th>
            <th>Total Amount</th>
            <th>Order Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: 'center', padding: '24px' }}>
                No active orders found. Accept an offer to generate an order.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id}>
                <td className="text-mono" style={{ fontWeight: 700 }}>#{order.id}</td>
                <td className="text-mono">#{order.request_id}</td>
                <td className="text-mono">#{order.farmer_id}</td>
                <td className="text-mono">#{order.offer_id}</td>
                <td className="text-mono">KES {order.price}</td>
                <td className="text-mono">{order.quantity}</td>
                <td className="text-mono" style={{ fontWeight: 700, color: 'var(--accent-navy)' }}>
                  KES {order.total_amount?.toLocaleString()}
                </td>
                <td>
                  <span className={`badge badge-${order.status}`}>
                    <span className="badge-dot"></span>
                    {order.status}
                  </span>
                </td>
                <td style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                  {new Date(order.created_at).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}