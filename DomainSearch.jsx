import React, { useState } from 'react';
import './mobile-styles.css';

const DomainSearch = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!query) return;
    setIsSearching(true);
    setResult(null);

    // Simulate API call
    setTimeout(() => {
      const isAvailable = Math.random() > 0.3; // 70% chance available
      const domainName = query.includes('.') ? query : `${query}.com`;
      
      setResult({
        domain: domainName,
        available: isAvailable,
        price: isAvailable ? 'AED 50/yr' : null
      });
      
      setIsSearching(false);
      
      if (isAvailable && onSelect) {
        onSelect(domainName);
      }
    }, 1500);
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
        Find your Domain
      </label>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. myluxuryhomes"
          style={{
            flex: 1,
            padding: '16px',
            fontSize: '16px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            outline: 'none'
          }}
        />
        <button
          onClick={handleSearch}
          disabled={isSearching}
          style={{
            padding: '0 20px',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            opacity: isSearching ? 0.7 : 1,
            minWidth: '80px'
          }}
        >
          {isSearching ? '...' : 'Search'}
        </button>
      </div>

      {result && (
        <div style={{ 
          marginTop: '12px', 
          padding: '12px', 
          borderRadius: '12px', 
          backgroundColor: result.available ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${result.available ? '#10B981' : '#EF4444'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ display: 'block', fontWeight: '700', color: result.available ? '#059669' : '#DC2626' }}>
              {result.domain}
            </span>
            <span style={{ fontSize: '12px', color: result.available ? '#059669' : '#DC2626' }}>
              {result.available ? 'Available' : 'Taken'}
            </span>
          </div>
          {result.available && (
            <span style={{ fontWeight: '700', color: '#059669', fontSize: '14px' }}>{result.price}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default DomainSearch;