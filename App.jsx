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
import LeadNurtureScreen from './LeadNurtureScreen';
import ChatAgentSetup from './ChatAgentSetup';
import ChatAgentDashboard from './ChatAgentDashboard';
import KnowledgeBaseScreen from './KnowledgeBaseScreen';
import QRCodeScreen from './QRCodeScreen';
import ConversationViewScreen from './ConversationViewScreen';
import LiveSimulatorScreen from './LiveSimulatorScreen';
import NotificationCenterScreen from './NotificationCenterScreen';
import TeamManagementScreen from './TeamManagementScreen';
import IntegrationsScreen from './IntegrationsScreen';
import BillingScreen from './BillingScreen';
import ServicesScreen from './ServicesScreen';
import ReferralProgramScreen from './ReferralProgramScreen';
import SupportTicketScreen from './SupportTicketScreen';
import MarketingDashboardScreen from './MarketingDashboardScreen';
import CampaignBuilderScreen from './CampaignBuilderScreen';
import LeadScoringScreen from './LeadScoringScreen';
import MeetingSchedulerScreen from './MeetingSchedulerScreen';
import CRMPipelineScreen from './CRMPipelineScreen';
import VoiceAssistantScreen from './VoiceAssistantScreen';
import DocumentScannerScreen from './DocumentScannerScreen';
import PropertyValuationScreen from './PropertyValuationScreen';
import CommissionCalculatorScreen from './CommissionCalculatorScreen';
import MortgageCalculatorScreen from './MortgageCalculatorScreen';
import MarketTrendsScreen from './MarketTrendsScreen';
import BuilderScreen from './BuilderScreen';
import ProgressBar from './ProgressBar';
import './mobile-styles.css';

const App = () => {
  // Simple State Machine: 'home' | 'inputs' | 'loading' | 'success'
  const [currentScreen, setCurrentScreen] = useState('login');
  const [projectData, setProjectData] = useState(null);
  const [toast, setToast] = useState(null); // { message: string } or null
  
  // Theme Persistence Logic
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });
  const [selectedIntent, setSelectedIntent] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
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
    if (intentId === 'chatAgent') {
      setCurrentScreen('chatAgentSetup');
      return;
    }
    if (intentId === 'smsCampaign' || intentId === 'emailCampaign') {
      setCurrentScreen('campaignBuilder');
      return;
    }
    if (intentId === 'propertyValuation') {
      setCurrentScreen('propertyValuation');
      return;
    }
    if (intentId === 'commissionCalculator') {
      setCurrentScreen('commissionCalculator');
      return;
    }
    if (intentId === 'mortgageCalculator') {
      setCurrentScreen('mortgageCalculator');
      return;
    }
    if (intentId === 'marketTrends') {
      setCurrentScreen('marketTrends');
      return;
    }
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
    if (selectedIntent === 'website') {
      setCurrentScreen('builder');
    } else {
      setCurrentScreen('payment'); // Go to payment before loading
    }
  };

  const handlePaymentComplete = () => {
    setToast({ message: "Payment Successful!" });
    setCurrentScreen('loading');
    // Simulate AI Generation (matches the LoadingScreen text duration)
    setTimeout(() => {
      setCurrentScreen('success');
    }, 8000); 
  };

  const handlePublishWebsite = () => {
    setToast({ message: "Website Published!" });
    setCurrentScreen('success');
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

  const handleLeadSelect = (lead) => {
    setSelectedLead(lead);
    setCurrentScreen('leadNurture');
  };

  const handleKnowledgeBase = () => {
    setToast({ message: "Knowledge Base Updated!" });
    setCurrentScreen('chatAgentDashboard');
  };

  const handleViewChat = (chat) => {
    setSelectedChat(chat);
    setCurrentScreen('conversationView');
  };

  const handleShowQR = () => {
    setCurrentScreen('qrCode');
  };

  const handleLiveSimulator = () => {
    setCurrentScreen('liveSimulator');
  };

  const handleNotifications = () => {
    setCurrentScreen('notifications');
  };

  const handleTeamManagement = () => {
    setCurrentScreen('teamManagement');
  };

  const handleIntegrations = () => {
    setCurrentScreen('integrations');
  };

  const handleBilling = () => {
    setCurrentScreen('billing');
  };

  const handleServices = () => {
    setCurrentScreen('services');
  };

  const handleReferral = () => {
    setCurrentScreen('referral');
  };

  const handleSupport = () => {
    setCurrentScreen('support');
  };

  const handleSupportSubmit = (ticket) => {
    setToast({ message: "Ticket Submitted!" });
    handleDashboard();
  };

  const handleOpenMarketing = (campaign) => {
    setSelectedCampaign(campaign);
    setCurrentScreen('marketingDashboard');
  };

  const handleCampaignSend = (campaignData) => {
    setToast({ message: "Campaign Sent!" });
    setSelectedCampaign({
      name: campaignData.subject || (campaignData.type === 'sms' ? "SMS Blast" : "New Campaign"),
      type: campaignData.type === 'email' ? "Email Campaign" : "SMS Campaign",
      status: "Sent",
      sent: campaignData.recipients === 'all' ? 1250 : 45,
      delivered: 0,
      opened: 0,
      clicked: 0,
      preview: campaignData.content
    });
    setCurrentScreen('marketingDashboard');
  };

  const handleSaveScoring = (rules) => {
    console.log("Scoring Rules Saved:", rules);
    setToast({ message: "Scoring Updated!" });
    handleSettings(); // Go back to settings
  };

  const handleMeetingScheduler = () => {
    setCurrentScreen('meetingScheduler');
  };

  const handleCRMPipeline = () => {
    setCurrentScreen('crmPipeline');
  };

  const handleSaveAvailability = (data) => {
    console.log("Availability Saved:", data);
    setToast({ message: "Availability Updated!" });
    handleSettings();
  };

  const handleVoiceAssistant = () => {
    setCurrentScreen('voiceAssistant');
  };

  const handleDocumentScanner = () => {
    setCurrentScreen('documentScanner');
  };

  const handleScanComplete = (leadData) => {
    console.log("Scanned Lead:", leadData);
    setToast({ message: "Lead Added Successfully!" });
    handleDashboard();
  };

  // --- Screen Router ---

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
      case 'home':
        return <MyProjectsScreen 
          onCreateNew={handleStartNew} 
          onSettings={handleSettings} 
          onLeadSelect={handleLeadSelect} 
          onNotifications={handleNotifications}
          onOpenMarketing={handleOpenMarketing}
          onVoiceAssistant={handleVoiceAssistant}
          onScanDocument={handleDocumentScanner}
        />;
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
      case 'leadNurture':
        return <LeadNurtureScreen lead={selectedLead} onBack={handleDashboard} />;
      case 'chatAgentSetup':
        return <ChatAgentSetup onBack={() => setCurrentScreen('intent')} onComplete={() => setCurrentScreen('chatAgentDashboard')} />;
      case 'chatAgentDashboard':
        return (
          <ChatAgentDashboard 
            onBack={handleDashboard} 
            onUpdateKnowledge={() => setCurrentScreen('knowledgeBase')} 
            onViewChat={handleViewChat}
            onShowQR={handleShowQR}
            onTestSimulator={handleLiveSimulator}
          />
        );
      case 'knowledgeBase':
        return <KnowledgeBaseScreen onBack={() => setCurrentScreen('chatAgentDashboard')} onSave={handleKnowledgeBase} />;
      case 'qrCode':
        return <QRCodeScreen onBack={() => setCurrentScreen('chatAgentDashboard')} />;
      case 'conversationView':
        return <ConversationViewScreen chat={selectedChat} onBack={() => setCurrentScreen('chatAgentDashboard')} />;
      case 'liveSimulator':
        return <LiveSimulatorScreen onBack={() => setCurrentScreen('chatAgentDashboard')} />;
      case 'notifications':
        return <NotificationCenterScreen onBack={handleDashboard} />;
      default:
        return <MyProjectsScreen onCreateNew={handleStartNew} onSettings={handleSettings} />;
      case 'settings':
        return (
          <SettingsScreen 
            onBack={handleDashboard} 
            onSave={handleSaveSettings} 
            theme={theme} 
            onToggleTheme={toggleTheme}
            onNavigateTo={setCurrentScreen}
          />
        );
      case 'teamManagement':
        return <TeamManagementScreen onBack={handleSettings} />;
      case 'integrations':
        return <IntegrationsScreen onBack={handleSettings} />;
      case 'billing':
        return <BillingScreen onBack={handleSettings} />;
      case 'services':
        return <ServicesScreen onBack={handleSettings} />;
      case 'referral':
        return <ReferralProgramScreen onBack={handleSettings} />;
      case 'support':
        return <SupportTicketScreen onBack={handleSettings} onSubmit={handleSupportSubmit} />;
      case 'marketingDashboard':
        return <MarketingDashboardScreen campaign={selectedCampaign} onBack={handleDashboard} />;
      case 'campaignBuilder':
        return (
          <CampaignBuilderScreen 
            type={selectedIntent === 'smsCampaign' ? 'sms' : 'email'} 
            onBack={() => setCurrentScreen('intent')} 
            onSend={handleCampaignSend} 
          />
        );
      case 'leadScoring':
        return <LeadScoringScreen onBack={handleSettings} onSave={handleSaveScoring} />;
      case 'meetingScheduler':
        return <MeetingSchedulerScreen onBack={handleSettings} onSave={handleSaveAvailability} />;
      case 'crmPipeline':
        return <CRMPipelineScreen onBack={handleSettings} />;
      case 'voiceAssistant':
        return <VoiceAssistantScreen onBack={handleDashboard} />;
      case 'documentScanner':
        return <DocumentScannerScreen onBack={handleDashboard} onScanComplete={handleScanComplete} />;
      case 'propertyValuation':
        return <PropertyValuationScreen onBack={() => setCurrentScreen('intent')} />;
      case 'commissionCalculator':
        return <CommissionCalculatorScreen onBack={() => setCurrentScreen('intent')} />;
      case 'mortgageCalculator':
        return <MortgageCalculatorScreen onBack={() => setCurrentScreen('intent')} />;
      case 'marketTrends':
        return <MarketTrendsScreen onBack={() => setCurrentScreen('intent')} />;
      case 'builder':
        return <BuilderScreen onBack={() => setCurrentScreen('templates')} onPublish={handlePublishWebsite} />;
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