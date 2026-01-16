import React from 'react';
import StickyFooter from './StickyFooter';

const EmptyState = ({ title, message, onAction, actionLabel }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '70vh', 
      padding: '20px',
      textAlign: 'center' 
    }}>
      {/* Friendly Illustration Placeholder */}
      <div style={{ fontSize: '64px', marginBottom: '24px' }}>🏠</div>
      
      <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: '#111827' }}>
        {title}
      </h3>
      
      <p style={{ color: '#6B7280', marginBottom: '40px', lineHeight: '1.5', maxWidth: '300px' }}>
        {message}
      </p>
      
      <StickyFooter label={actionLabel} onClick={onAction} />
    </div>
  );
};

export default EmptyState;