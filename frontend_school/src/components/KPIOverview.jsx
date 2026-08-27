import React from 'react';
import { Banknote, ClipboardList, Hourglass, Truck } from 'lucide-react';

export default function KPIOverview({ requests, orders }) {
  const totalSpent = orders.reduce((acc, curr) => acc + (curr.total_amount || 0), 0);
  const openRequestsCount = requests.filter(r => r.status === 'open').length;
  const activeOrdersCount = orders.filter(o => o.status === 'confirmed').length;

  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <div className="kpi-label">
          <div className="kpi-icon navy"><Banknote size={16} /></div>
          Total Budget Spent
        </div>
        <div className="kpi-value text-mono">KES {totalSpent.toLocaleString()}</div>
        <div className="kpi-sub">Across {orders.length} confirmed orders</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-label">
          <div className="kpi-icon emerald"><ClipboardList size={16} /></div>
          Total Food Requests
        </div>
        <div className="kpi-value text-mono">{requests.length}</div>
        <div className="kpi-sub">{openRequestsCount} currently open</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-label">
          <div className="kpi-icon amber"><Hourglass size={16} /></div>
          Open Requests
        </div>
        <div className="kpi-value text-mono">{openRequestsCount}</div>
        <div className="kpi-sub">Awaiting farmer offers</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-label">
          <div className="kpi-icon blue"><Truck size={16} /></div>
          Confirmed Orders
        </div>
        <div className="kpi-value text-mono">{activeOrdersCount}</div>
        <div className="kpi-sub">Ready for fulfillment</div>
      </div>
    </div>
  );
}