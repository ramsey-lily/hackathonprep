import React from 'react';
import { Sprout } from 'lucide-react';

const TITLES = {
  dashboard: 'Dashboard',
  requests: 'Food Requests',
  offers: 'My Offers',
  orders: 'My Orders',
  payments: 'Payments',
  profile: 'Profile',
};

export default function Topbar({ activeView }) {
  return (
    <header className="topbar">
      <h1 className="topbar__title">{TITLES[activeView] || 'Farmer Portal'}</h1>
      <div className="topbar__user">
        <Sprout size={18} />
        <span>Kasarani Supplier Network</span>
      </div>
    </header>
  );
}
