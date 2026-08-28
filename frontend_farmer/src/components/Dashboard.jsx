import React, { useEffect, useState } from 'react';
import { ClipboardList, FileText, Package, Wallet } from 'lucide-react';
import { getOpenRequests, getFarmerOffers, getFarmerOrders } from '../api/client';
import { LoadingState, ErrorState } from './StateViews';

/**
 * KPIs are computed only from data actually returned by the backend.
 * If an endpoint isn't available yet, that single KPI shows "—"
 * instead of a fabricated number — the rest of the dashboard still
 * renders normally.
 */
export default function Dashboard({ onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    openRequests: null,
    myOffers: null,
    activeOrders: null,
    paidAmount: null,
  });

  async function loadStats() {
    setLoading(true);
    setError(null);

    const results = await Promise.allSettled([
      getOpenRequests(),
      getFarmerOffers(),
      getFarmerOrders(),
    ]);

    const [requestsRes, offersRes, ordersRes] = results;

    const next = {
      openRequests: null,
      myOffers: null,
      activeOrders: null,
      paidAmount: null,
    };

    if (requestsRes.status === 'fulfilled') {
      next.openRequests = Array.isArray(requestsRes.value)
        ? requestsRes.value.length
        : null;
    }

    if (offersRes.status === 'fulfilled') {
      next.myOffers = Array.isArray(offersRes.value)
        ? offersRes.value.length
        : null;
    }

    if (ordersRes.status === 'fulfilled' && Array.isArray(ordersRes.value)) {
      const orders = ordersRes.value;
      next.activeOrders = orders.filter(
        (o) => o.status && o.status.toLowerCase() !== 'delivered' && o.status.toLowerCase() !== 'cancelled'
      ).length;
      next.paidAmount = orders
        .filter((o) => o.payment_status && o.payment_status.toLowerCase() === 'paid')
        .reduce((sum, o) => sum + (Number(o.total) || Number(o.total_amount) || 0), 0);
    }

    setStats(next);

    // Only treat this as a hard error if every call failed — a single
    // missing endpoint should degrade gracefully, not block the page.
    const allFailed = results.every((r) => r.status === 'rejected');
    if (allFailed) {
      setError('Unable to load dashboard data.');
    }

    setLoading(false);
  }

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <LoadingState label="Loading your dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={loadStats} />;

  const cards = [
    {
      key: 'requests',
      label: 'Open Requests',
      value: stats.openRequests,
      icon: ClipboardList,
    },
    {
      key: 'offers',
      label: 'My Offers',
      value: stats.myOffers,
      icon: FileText,
    },
    {
      key: 'orders',
      label: 'Active Orders',
      value: stats.activeOrders,
      icon: Package,
    },
    {
      key: 'payments',
      label: 'Paid Amount',
      value: stats.paidAmount !== null ? `KES ${stats.paidAmount.toLocaleString()}` : null,
      icon: Wallet,
    },
  ];

  return (
    <div className="dashboard">
      <div className="kpi-grid">
        {cards.map(({ key, label, value, icon: Icon }) => (
          <button
            key={key}
            className="kpi-card"
            onClick={() => onNavigate(key)}
          >
            <div className="kpi-card__icon">
              <Icon size={20} />
            </div>
            <div>
              <p className="kpi-card__value">{value === null ? '—' : value}</p>
              <p className="kpi-card__label">{label}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="dashboard__hint">
        <p>
          Welcome back. Check <button className="link-btn" onClick={() => onNavigate('requests')}>Food Requests</button> for
          new opportunities from schools, or track your existing work under{' '}
          <button className="link-btn" onClick={() => onNavigate('orders')}>My Orders</button>.
        </p>
      </div>
    </div>
  );
}
