import React from 'react';
import StickyFooter from './StickyFooter';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message, actionLabel, onAction }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center', padding: '24px' }}>
    <div style={{ fontSize: '64px', marginBottom: '16px' }}>📂</div>
    <h1 className="screen-title">{title}</h1>
    <p style={{ color: 'var(--text-secondary)', maxWidth: '300px', lineHeight: 1.5 }}>{message}</p>
    <StickyFooter label={actionLabel} onClick={onAction} />
  </div>
);

export default EmptyState;