import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import KPIOverview from './components/KPIOverview';
import CreateRequestForm from './components/CreateRequestForm';
import RequestsTable from './components/RequestsTable';
import OfferEvaluation from './components/OfferEvaluation';
import OrderFulfillment from './components/OrderFulfillment';
import { apiClient } from './api/client';
import './App.css';

const SCHOOL_ID = 1; // Primary School ID contextualized for current user view

export default function App() {
  const [activeView, setActiveView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const loadDashboardData = useCallback(async () => {
    try {
      // Endpoint 1: GET /schools/<id>/requests [cite: 280]
      const reqData = await apiClient.getSchoolRequests(SCHOOL_ID);
      setRequests(reqData);

      // Endpoint 2: GET /schools/<id>/orders [cite: 280, 281]
      const orderData = await apiClient.getSchoolOrders(SCHOOL_ID);
      setOrders(orderData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleCreateRequest = async (payload) => {
    await apiClient.createRequest(payload); // Endpoint: POST /requests [cite: 284, 285]
    await loadDashboardData();
  };

  const handleSelectRequestForOffers = (requestId) => {
    setSelectedRequestId(requestId);
    setActiveView('offers');
  };

  const getTitle = () => {
    switch (activeView) {
      case 'overview': return 'Overview & Active Food Requests';
      case 'offers': return 'Farmer Offer Evaluation';
      case 'fulfillment': return 'Confirmed Order Fulfillment Ledger';
      default: return 'School Admin Portal';
    }
  };

  return (
    <div className="shell">
      {toast && (
        <div className="toast-container">
          <div className="toast">
            <span>{toast}</span>
          </div>
        </div>
      )}

      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <main className="main">
        <Topbar title={getTitle()} onMenuToggle={() => setSidebarOpen(true)} />

        <div className="content-area">
          {activeView === 'overview' && (
            <>
              <KPIOverview requests={requests} orders={orders} />
              <div className="two-col">
                <CreateRequestForm
                  schoolId={SCHOOL_ID}
                  onRequestCreated={handleCreateRequest}
                  showToast={showToast}
                />
                <RequestsTable
                  requests={requests}
                  onSelectRequest={handleSelectRequestForOffers}
                />
              </div>
            </>
          )}

          {activeView === 'offers' && (
            <OfferEvaluation
            requests={requests}
            selectedRequestId={selectedRequestId}
            onOfferAccepted={loadDashboardData}
            onNavigate={setActiveView}
            showToast={showToast}
            />
          )}

          {activeView === 'fulfillment' && (
            <OrderFulfillment
            orders={orders}
            onPaymentComplete={loadDashboardData}
            />
          )}
        </div>
      </main>
    </div>
  );
}
