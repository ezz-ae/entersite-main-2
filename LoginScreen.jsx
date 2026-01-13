import React, { useState } from 'react';
import ForgivingInput from './ForgivingInput';
import StickyFooter from './StickyFooter';
import './mobile-styles.css';

const LoginScreen = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Simulate auth delay
    onLogin(formData);
  };

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚀</div>
        <h1 className="screen-title" style={{ marginBottom: '8px' }}>
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
          {isSignup ? 'Start building your real estate empire.' : 'Login to manage your campaigns.'}
        </p>
      </div>

      {isSignup && (
        <ForgivingInput 
          label="Full Name" 
          placeholder="e.g. John Doe" 
          value={formData.name} 
          onChange={(e) => handleChange('name', e.target.value)} 
        />
      )}

      <ForgivingInput 
        label="Email Address" 
        type="email"
        placeholder="name@agency.com" 
        value={formData.email} 
        onChange={(e) => handleChange('email', e.target.value)} 
      />

      <ForgivingInput 
        label="Password" 
        type="password"
        placeholder="••••••••" 
        value={formData.password} 
        onChange={(e) => handleChange('password', e.target.value)} 
      />

      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <button 
          onClick={() => setIsSignup(!isSignup)}
          style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
        >
          {isSignup ? 'Already have an account? Login' : 'New here? Create Account'}
        </button>
      </div>

      <StickyFooter 
        label={isSignup ? 'Get Started' : 'Login'} 
        onClick={handleSubmit} 
        disabled={!formData.email || !formData.password}
      />
    </div>
  );
};

export default LoginScreen;