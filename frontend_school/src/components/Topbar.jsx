import React from 'react';
import { Menu, School } from 'lucide-react';

export default function Topbar({ title, onMenuToggle }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="mobile-toggle" onClick={onMenuToggle}>
          <Menu size={24} />
        </button>
        <h2 className="topbar-title">{title}</h2>
      </div>

      <div className="topbar-right">
        <span className="topbar-badge" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <School size={14} /> Kasarani Secondary School
        </span>
        <span className="text-mono" style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
          {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>
    </header>
  );
}