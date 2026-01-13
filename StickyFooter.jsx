import React from 'react';
import '../mobile-styles.css';

const StickyFooter = ({ label, onClick, disabled = false }) => {
  return (
    <div className="sticky-footer-action">
      <button 
        className="primary-button" 
        onClick={onClick}
        disabled={disabled}
        style={{ opacity: disabled ? 0.6 : 1 }}
      >
        {label}
      </button>
    </div>
  );
};

export default StickyFooter;