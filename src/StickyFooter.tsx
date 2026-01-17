import React from 'react';
import './mobile-styles.css';

interface StickyFooterProps {
  label: string;
  onClick: () => void;
}

const StickyFooter: React.FC<StickyFooterProps> = ({ label, onClick }) => {
  return (
    <div className="sticky-footer-action">
      <button className="primary-button" onClick={onClick}>
        {label}
      </button>
    </div>
  );
};

export default StickyFooter;