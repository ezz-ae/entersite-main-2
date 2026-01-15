import React, { useState } from 'react';

interface DomainSearchProps {
  onSelect: (domain: string) => void;
}

const DomainSearch: React.FC<DomainSearchProps> = ({ onSelect }) => {
  const [domain, setDomain] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    if (!domain) return;
    setIsLoading(true);
    setIsAvailable(null);
    setTimeout(() => {
      const available = Math.random() > 0.3;
      setIsAvailable(available);
      if (available) {
        onSelect(`${domain}.entersite.me`);
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
        Find a Domain
      </label>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
          placeholder="your-brand-name"
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
        <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>.entersite.me</span>
      </div>
      <button 
        onClick={handleSearch}
        disabled={!domain || isLoading}
        style={{ width: '100%', padding: '12px', marginTop: '8px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--bg-accent)', color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer' }}
      >
        {isLoading ? 'Searching...' : 'Check Availability'}
      </button>
      {isAvailable === true && (
        <div style={{ marginTop: '8px', padding: '12px', borderRadius: '8px', backgroundColor: '#D1FAE5', color: '#065F46', fontWeight: 600, textAlign: 'center' }}>
          ✅ {domain}.entersite.me is available!
        </div>
      )}
      {isAvailable === false && (
        <div style={{ marginTop: '8px', padding: '12px', borderRadius: '8px', backgroundColor: '#FEE2E2', color: '#991B1B', fontWeight: 600, textAlign: 'center' }}>
          ❌ Sorry, that domain is taken.
        </div>
      )}
    </div>
  );
};

export default DomainSearch;