import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Package,
  Wallet,
  UserCircle,
  Wheat,
} from 'lucide-react';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'requests', label: 'Food Requests', icon: ClipboardList },
  { key: 'offers', label: 'My Offers', icon: FileText },
  { key: 'orders', label: 'My Orders', icon: Package },
  { key: 'payments', label: 'Payments', icon: Wallet },
  { key: 'profile', label: 'Profile', icon: UserCircle },
];

export default function Sidebar({ activeView, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <Wheat size={22} />
        <span>Farmer Portal</span>
      </div>
      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={`sidebar__link ${activeView === key ? 'is-active' : ''}`}
            onClick={() => onNavigate(key)}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
