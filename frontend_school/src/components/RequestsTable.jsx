import React from 'react';

export default function RequestsTable({ requests, onSelectRequest }) {
  return (
    <div className="table-card">
      <div className="table-toolbar">
        <h3 className="font-display" style={{ fontSize: '16px' }}>School Produce Requests</h3>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Food Item</th>
            <th>Quantity</th>
            <th>Budget / Unit</th>
            <th>Delivery Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>No requests submitted yet.</td>
            </tr>
          ) : (
            requests.map((req) => (
              <tr key={req.id}>
                <td className="text-mono">#{req.id}</td>
                <td style={{ fontWeight: 600 }}>{req.food_item}</td>
                <td>{req.quantity} {req.unit}</td>
                <td className="text-mono">KES {req.budget}</td>
                <td>{req.delivery_date}</td>
                <td>
                  <span className={`badge badge-${req.status}`}>
                    <span className="badge-dot"></span>
                    {req.status}
                  </span>
                </td>
                <td>
                  {req.status === 'open' ? (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onSelectRequest(req.id)}
                    >
                      View Offers
                    </button>
                  ) : (
                    <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
                      {req.selected_farmer_id ? `Farmer #${req.selected_farmer_id} Selected` : 'Closed'}
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}