import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import Requests from './components/Requests';
import Offers from './components/Offers';
import Orders from './components/Orders';
import PaymentStatus from './components/PaymentStatus';
import Profile from './components/Profile';
import './App.css';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');

  function renderView() {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveView} />;
      case 'requests':
        return <Requests />;
      case 'offers':
        return <Offers />;
      case 'orders':
        return <Orders />;
      case 'payments':
        return <PaymentStatus />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard onNavigate={setActiveView} />;
    }
  }

  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <div className="app-main">
        <Topbar activeView={activeView} />
        <main className="app-content">{renderView()}</main>
      </div>
    </div>
  );
}
