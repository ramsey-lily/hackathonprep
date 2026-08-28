import React, { useState } from 'react';
import { apiClient } from '../api/client';

export default function OrderFulfillment({ orders, onPaymentComplete }) {
  const [phone, setPhone] = useState('');
  const [payingOrder, setPayingOrder] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const handlePayment = async (orderId) => {
    if (!phone) {
      setError('Please enter the M-Pesa phone number first.');
      return;
    }
    
    setPayingOrder(orderId);
    setMessage('');
    setError('');
    
    try {
      const result = await apiClient.initiateMpesaPayment(
        phone,
        orderId
      );
      
      console.log('M-Pesa response:', result);
      
      setMessage(
        'M-Pesa payment request sent. Check the phone for the STK prompt.'
      );
      
      if (onPaymentComplete) {
        await onPaymentComplete();
      }
      
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed to start.');
    } finally {
      setPayingOrder(null);
    }
  };
  
  return (
    <div className="table-card">
    
    <div className="table-toolbar">
    <h3
    className="font-display"
    style={{ fontSize: '16px' }}
    >
    Confirmed Orders & Fulfillment Ledger
    </h3>
    </div>
    
    {/* M-Pesa phone number */}
    <div style={{
      padding: '16px',
      borderBottom: '1px solid var(--border-color)'
    }}>
    
    <label
    style={{
      display: 'block',
      marginBottom: '6px',
      fontWeight: 600
    }}
    >
    M-Pesa Phone Number
    </label>
    
    <input
    type="text"
    placeholder="2547XXXXXXXX"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    style={{
      padding: '8px 10px',
      width: '250px',
      border: '1px solid #ccc',
      borderRadius: '4px'
    }}
    />
    
    <p style={{
      fontSize: '12px',
      color: 'var(--text-tertiary)',
          marginTop: '6px'
    }}>
    Enter the phone number that should receive the M-Pesa payment prompt.
    </p>
    
    {message && (
      <div style={{
        marginTop: '10px',
        color: 'green',
        fontWeight: 600
      }}>
      {message}
      </div>
    )}
    
    {error && (
      <div style={{
        marginTop: '10px',
        color: 'red',
        fontWeight: 600
      }}>
      {error}
      </div>
    )}
    
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
    <th>Payment</th>
    <th>Created At</th>
    </tr>
    </thead>
    
    <tbody>
    
    {orders.length === 0 ? (
      
      <tr>
      <td
      colSpan="10"
      style={{
        textAlign: 'center',
        padding: '24px'
      }}
      >
      No active orders found. Accept an offer to generate an order.
      </td>
      </tr>
      
    ) : (
      
      orders.map((order) => (
        
        <tr key={order.id}>
        
        <td
        className="text-mono"
        style={{ fontWeight: 700 }}
        >
        #{order.id}
        </td>
        
        <td className="text-mono">
        #{order.request_id}
        </td>
        
        <td className="text-mono">
        #{order.farmer_id}
        </td>
        
        <td className="text-mono">
        #{order.offer_id}
        </td>
        
        <td className="text-mono">
        KES {order.price}
        </td>
        
        <td className="text-mono">
        {order.quantity}
        </td>
        
        <td
        className="text-mono"
        style={{
          fontWeight: 700,
          color: 'var(--accent-navy)'
        }}
        >
        KES {order.total_amount?.toLocaleString()}
        </td>
        
        <td>
        
        <span className={`badge badge-${order.status}`}>
        <span className="badge-dot"></span>
        {order.status}
        </span>
        
        </td>
        
        <td>
        
        <button
        className="btn btn-primary btn-sm"
        onClick={() => handlePayment(order.id)}
        disabled={payingOrder === order.id}
        >
        
        {payingOrder === order.id
          ? 'Sending...'
      : 'Pay with M-Pesa'}
      
      </button>
      
      </td>
      
      <td
      style={{
        fontSize: '12px',
        color: 'var(--text-tertiary)'
      }}
      >
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

