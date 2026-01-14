import React, { useState, useEffect } from 'react';


const LoadingScreen = () => {
  const steps = [
    "Analyzing Market Data...",
    "Identifying Target Audience...",
    "Drafting High-Converting Copy...",
    "Selecting Best Images...",
    "Finalizing Your Blueprint..."
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Cycle through the "work" steps to keep the user engaged
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1500); // Change text every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '24px',
      textAlign: 'center'
    }}>
      {/* Spinner Circle (defined in mobile-styles.css) */}
      <div className="spinner"></div>

      <h2 style={{ 
        fontSize: '20px', 
        fontWeight: '700', 
        marginTop: '32px', 
        marginBottom: '12px',
        color: '#111827'
      }}>
        {steps[currentStep]}
      </h2>

      <p style={{ color: '#6B7280', fontSize: '14px' }}>
        This usually takes about 10 seconds.
      </p>
    </div>
  );
};

export default LoadingScreen;