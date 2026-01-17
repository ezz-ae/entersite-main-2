import React from 'react';

interface ForgivingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const ForgivingInput: React.FC<ForgivingInputProps> = ({ label, style, ...props }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
      {label}
    </label>
    <input
      style={{
        width: '100%',
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-secondary)',
        fontSize: '16px',
        color: 'var(--text-primary)',
        outline: 'none',
        boxSizing: 'border-box',
        ...style
      }}
      {...props}
    />
  </div>
);

export default ForgivingInput;