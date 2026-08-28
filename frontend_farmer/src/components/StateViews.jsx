import React from 'react';
import { RefreshCw, AlertTriangle, Inbox } from 'lucide-react';

export function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="state-view state-view--loading">
      <div className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="state-view state-view--error">
      <AlertTriangle size={28} />
      <p>{message || 'Something went wrong. Please try again.'}</p>
      {onRetry && (
        <button className="btn btn--secondary" onClick={onRetry}>
          <RefreshCw size={16} />
          Retry
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, subtitle, icon }) {
  return (
    <div className="state-view state-view--empty">
      {icon || <Inbox size={28} />}
      <p className="state-view__title">{title}</p>
      {subtitle && <p className="state-view__subtitle">{subtitle}</p>}
    </div>
  );
}
