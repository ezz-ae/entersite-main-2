import React, { useState } from 'react';
import MyProjectsScreen from './MyProjectsScreen';
import UniversalInputsScreen from './UniversalInputsScreen';
import LoadingScreen from './LoadingScreen';
import TemplateLibraryScreen from './TemplateLibraryScreen';
import SuccessScreen from './SuccessScreen';
import PaymentScreen from './PaymentScreen';
import LoginScreen from './LoginScreen';
import IntentSelectionScreen from './IntentSelectionScreen';
import SettingsScreen from './SettingsScreen';
import ToastNotification from './ToastNotification';
import ProgressBar from './ProgressBar';
import './mobile-styles.css';

const App = () => {
  // Simple State Machine: 'home' | 'inputs' | 'loading' | 'success'
  const [currentScreen, setCurrentScreen] = useState('login');
  const [projectData, setProjectData] = useState(null);
  const [toast, setToast] = useState(null); // { message: string } or null
  const [theme, setTheme] = useState('light');
  const [selectedIntent, setSelectedIntent] = useState(null);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // --- Navigation Handlers ---

  const handleLogin = (userData) => {
    console.log("User Logged In:", userData);
    setToast({ message: `Welcome, ${userData.name || 'Agent'}!` });
    setCurrentScreen('intent'); // Go to Start Here screen
  };

  const handleStartNew = () => {
    setCurrentScreen('intent');
  };

  const handleIntentSelect = (intentId) => {
    setSelectedIntent(intentId);
    setCurrentScreen('inputs'); // Go to dynamic inputs
  };

  const handleGenerate = (data) => {
    console.log("User Data Submitted:", data);
    setProjectData(data);
    setToast({ message: "Details Saved!" });
    // Go to Template Selection instead of loading immediately
    setCurrentScreen('templates');
  };

  const handleTemplateSelect = (template) => {
    console.log("Template Selected:", template);
    setToast({ message: "Template Applied" });
    setCurrentScreen('payment'); // Go to payment before loading
  };

  const handlePaymentComplete = () => {
    setToast({ message: "Payment Successful!" });
    setCurrentScreen('loading');
    // Simulate AI Generation (matches the LoadingScreen text duration)
    setTimeout(() => {
      setCurrentScreen('success');
    }, 8000); 
  };

  const handleDashboard = () => {
    setCurrentScreen('home');
  };

  const handleNextStep = (type) => {
    // In a real app, this would route to the specific ad builder
    alert(`Opening ${type === 'meta' ? 'Facebook' : 'Google'} Ads Builder...`);
  };

  const handleSettings = () => {
    setCurrentScreen('settings');
  };

  const handleSaveSettings = (data) => {
    console.log("Settings Saved:", data);
    setToast({ message: "Settings Updated" });
    handleDashboard();
  };

  // --- Screen Router ---

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
      case 'home':
        return <MyProjectsScreen onCreateNew={handleStartNew} onSettings={handleSettings} />;
      case 'intent':
        return <IntentSelectionScreen onSelect={handleIntentSelect} onBack={handleDashboard} />;
      case 'inputs':
        return <UniversalInputsScreen onNext={handleGenerate} onBack={() => setCurrentScreen('intent')} serviceType={selectedIntent} />;
      case 'templates':
        return <TemplateLibraryScreen onSelect={handleTemplateSelect} onBack={() => setCurrentScreen('inputs')} />;
      case 'payment':
        return <PaymentScreen amount={projectData?.budget} onPaymentComplete={handlePaymentComplete} onBack={() => setCurrentScreen('templates')} />;
      case 'loading':
        return <LoadingScreen />;
      case 'success':
        return (
          <SuccessScreen 
            publishedUrl="https://agent-site.com/p/dubai-hills-estate" 
            onDashboardClick={handleDashboard}
            onNextStepClick={handleNextStep}
          />
        );
      case 'settings':
        return <SettingsScreen onBack={handleDashboard} onSave={handleSaveSettings} theme={theme} onToggleTheme={toggleTheme} />;
      default:
        return <MyProjectsScreen onCreateNew={handleStartNew} onSettings={handleSettings} />;
    }
  };

  // Calculate Progress based on screen
  const getProgress = () => {
    switch (currentScreen) {
      case 'login': return 0;
      case 'home': return 0;
      case 'intent': return 10;
      case 'inputs': return 30;
      case 'templates': return 50;
      case 'payment': return 65;
      case 'loading': return 80;
      case 'success': return 100;
      default: return 0;
    }
  };

  return (
    // Mobile Container Wrapper
    <div data-theme={theme} style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', position: 'relative', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      {/* Top Progress Bar */}
      {currentScreen !== 'home' && currentScreen !== 'login' && <ProgressBar progress={getProgress()} />}
      
      {/* Toast Notification Layer */}
      {toast && <ToastNotification message={toast.message} onClose={() => setToast(null)} />}
      
      {renderScreen()}
    </div>
  );
};

export default App;