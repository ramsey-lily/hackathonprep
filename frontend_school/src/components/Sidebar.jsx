import React from 'react';
import { LayoutDashboard, Scale, Truck, X } from 'lucide-react';

export default function Sidebar({ activeView, setActiveView, isOpen, setIsOpen }) {
  const navItems = [
    { id: 'overview', label: 'Overview & Requests', icon: LayoutDashboard },
    { id: 'offers', label: 'Offer Evaluation', icon: Scale },
    { id: 'fulfillment', label: 'Order Fulfillment', icon: Truck },
  ];

  return (
    <>
      {isOpen && <div class="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>AgriSchool</h1>
            {isOpen && (
              <button 
                onClick={() => setIsOpen(false)} 
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            )}
          </div>
          <p>School Admin Portal</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`sidebar-nav-item ${activeView === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveView(item.id);
                  setIsOpen(false);
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">KS</div>
            <div className="sidebar-user-info">
              <span className="name">Kasarani Secondary</span>
              <span className="role">School ID: 1</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}