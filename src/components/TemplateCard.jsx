import React, { useRef } from 'react';

const TemplateCard = ({ title, category, image, onSelect, onLongPress }) => {
  const timerRef = useRef(null);
  const isLongPress = useRef(false);

  const handleStart = () => {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      if (onLongPress) onLongPress();
    }, 600); // 600ms threshold for long press
  };

  const handleEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleClick = (e) => {
    if (isLongPress.current) return; // Ignore click if it was a long press
    onSelect();
  };

  return (
    <div 
      onClick={handleClick}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid #E5E7EB',
        backgroundColor: 'white',
        marginBottom: '20px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        cursor: 'pointer',
        userSelect: 'none', /* Prevents text selection during long press */
        WebkitUserSelect: 'none'
      }}
    >
      {/* Image Placeholder Area */}
      <div style={{ 
        height: '200px', 
        backgroundColor: '#F3F4F6', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#9CA3AF',
        fontSize: '14px'
      }}>
        {image ? <img src={image} alt={title} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : '📷 Template Preview'}
      </div>

      <div style={{ padding: '16px' }}>
        <span style={{ fontSize: '12px', color: '#007AFF', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{category}</span>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginTop: '4px', marginBottom: '12px' }}>{title}</h3>
        <button className="primary-button" style={{ height: '44px', fontSize: '16px' }}>Select Template</button>
      </div>
    </div>
  );
};

export default TemplateCard;