import React from 'react';

interface TemplateCardProps {
  title: string;
  category: string;
  image: string | null;
  onSelect: () => void;
  onLongPress: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ title, category, image, onSelect, onLongPress }) => {
  let longPressTimer: NodeJS.Timeout;

  const handleTouchStart = () => {
    longPressTimer = setTimeout(onLongPress, 500); // 500ms for long press
  };

  const handleTouchEnd = () => {
    clearTimeout(longPressTimer);
  };

  return (
    <div 
      onClick={onSelect}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onContextMenu={(e) => { e.preventDefault(); onLongPress(); }} // For desktop
      style={{
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        marginBottom: '16px',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
    >
      <div style={{ height: '180px', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        {image ? <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 'Preview'}
      </div>
      <div style={{ padding: '16px' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600 }}>{title}</h3>
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>{category}</p>
      </div>
    </div>
  );
};

export default TemplateCard;