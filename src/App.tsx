import React, { useState, useEffect } from 'react';
import './mobile-styles.css';
import { AuthProvider, useAuth } from './AuthContext';

// Screens
import LoginScreen from './LoginScreen';
import MyProjectsScreen from './MyProjectsScreen';
import TemplateLibraryScreen from './TemplateLibraryScreen';
import UniversalInputsScreen from './UniversalInputsScreen';
import LoadingScreen from './LoadingScreen';
import SuccessScreen from './SuccessScreen';
import SettingsScreen from './SettingsScreen';
import NotificationCenterScreen from './NotificationCenterScreen';
import VoiceAssistantScreen from './VoiceAssistantScreen';
import DocumentScannerScreen from './DocumentScannerScreen';
import MarketingDashboardScreen from './MarketingDashboardScreen';
import GoogleAdsDashboard from './GoogleAdsDashboard';
import ChatAgentDashboard, { Chat } from './ChatAgentDashboard';
import ChatAgentSetup from './ChatAgentSetup';
import TeamManagementScreen from './TeamManagementScreen';
import MeetingSchedulerScreen from './MeetingSchedulerScreen';
import CRMPipelineScreen from './CRMPipelineScreen';
import BillingScreen from './BillingScreen';
import ServicesScreen from './ServicesScreen';
import ReferralProgramScreen from './ReferralProgramScreen';
import SupportTicketScreen from './SupportTicketScreen';
import KnowledgeBaseScreen from './KnowledgeBaseScreen';
import QRCodeScreen from './QRCodeScreen';
import PropertyValuationScreen from './PropertyValuationScreen';
import MortgageCalculatorScreen from './MortgageCalculatorScreen';
import CommissionCalculatorScreen from './CommissionCalculatorScreen';
import MarketTrendsScreen from './MarketTrendsScreen';
import CampaignBuilderScreen from './CampaignBuilderScreen';
import ConversationViewScreen from './ConversationViewScreen';

const AppContent: React.FC = () =>
    
  const { login, isAuthenticated } = useAuth();
  const [currentScreen, setCurrentScreen] = useState(isAuthenticated ? 'dashboard' : 'login');
  const [theme, setTheme] = useState('light');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [serviceType, setServiceType] = useState('');

  useEffect(() => {
    if (!isAuthenticated && currentScreen !== 'login') {
      setCurrentScreen('login');
    }
  }, [isAuthenticated, currentScreen]);

  const navigateTo = (screen: string) => {
    window.scrollTo(0, 0);
    setCurrentScreen(screen);
  };

  const handleLogin = (userData: any) => {
    login(userData);
    navigateTo('dashboard');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    if (currentScreen === 'loading') {
      const timer = setTimeout(() => {
        navigateTo('success');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
      
      case 'dashboard':
        return (
          <MyProjectsScreen 
            onCreateNew={() => navigateTo('templateLibrary')}
            onSettings={() => navigateTo('settings')}
            onNotifications={() => navigateTo('notifications')}
            onVoiceAssistant={() => navigateTo('voiceAssistant')}
            onScanDocument={() => navigateTo('documentScanner')}
            onOpenMarketing={(project) => {
              setSelectedProject(project);
              navigateTo('marketingDashboard');
            }}
            onLeadSelect={(lead) => console.log('Lead selected', lead)}
          />
        );

      case 'templateLibrary':
        return (
          <TemplateLibraryScreen 
            onBack={() => navigateTo('dashboard')}
            onSelect={(template) => {
              setServiceType('website'); 
              navigateTo('universalInputs');
            }}
          />
        );

      case 'universalInputs':
        return (
          <UniversalInputsScreen 
            onBack={() => navigateTo('templateLibrary')}
            serviceType={serviceType}
            onNext={(data) => navigateTo('loading')}
          />
        );

      case 'loading':
        return <LoadingScreen />;

      case 'success':
        return (
          <SuccessScreen 
            publishedUrl="https://entersite.io/p/luxury-loft"
            onDashboardClick={() => navigateTo('dashboard')}
            onNextStepClick={(step) => {
               if (step === 'google') navigateTo('googleAdsDashboard');
               if (step === 'meta') navigateTo('marketingDashboard');
            }}
          />
        );

      case 'settings':
        return (
          <SettingsScreen 
            onBack={() => navigateTo('dashboard')}
            onSave={() => navigateTo('dashboard')}
            theme={theme}
            onToggleTheme={toggleTheme}
            onNavigateTo={(screen) => navigateTo(screen)}
          />
        );

      case 'notifications':
        return <NotificationCenterScreen onBack={() => navigateTo('dashboard')} />;

      case 'voiceAssistant':
        return <VoiceAssistantScreen onBack={() => navigateTo('dashboard')} />;

      case 'documentScanner':
        return (
          <DocumentScannerScreen 
            onBack={() => navigateTo('dashboard')}
            onScanComplete={(data) => {
              alert(`Scanned: ${data.name}`);
              navigateTo('dashboard');
            }}
          />
        );

      case 'marketingDashboard':
        return (
          <MarketingDashboardScreen 
            campaign={selectedProject}
            onBack={() => navigateTo('dashboard')}
          />
        );

      case 'googleAdsDashboard':
        return <GoogleAdsDashboard onBack={() => navigateTo('dashboard')} />;

      case 'chatAgentDashboard':
        return (
          <ChatAgentDashboard 
            onBack={() => navigateTo('dashboard')}
            onUpdateKnowledge={() => navigateTo('knowledgeBase')}
            onShowQR={() => navigateTo('qrCode')}
            onViewChat={(chat) => {
              setSelectedChat(chat);
              navigateTo('conversationView');
            }}
            onTestSimulator={() => alert('Simulator started')}
          />
        );

      case 'chatAgentSetup':
        return <ChatAgentSetup onBack={() => navigateTo('dashboard')} onComplete={() => navigateTo('chatAgentDashboard')} />;

      case 'teamManagement':
        return <TeamManagementScreen onBack={() => navigateTo('settings')} />;

      case 'meetingScheduler':
        return <MeetingSchedulerScreen onBack={() => navigateTo('settings')} onSave={() => navigateTo('settings')} />;

      case 'crmPipeline':
        return <CRMPipelineScreen onBack={() => navigateTo('settings')} />;

      case 'billing':
        return <BillingScreen onBack={() => navigateTo('settings')} />;

      case 'services':
        return (
          <ServicesScreen 
            onBack={() => navigateTo('settings')} 
            onManage={(serviceId) => {
              if (serviceId === 1) navigateTo('chatAgentDashboard');
              if (serviceId === 2) navigateTo('googleAdsDashboard');
            }}
          />
        );

      case 'referral':
        return <ReferralProgramScreen onBack={() => navigateTo('settings')} />;

      case 'support':
        return <SupportTicketScreen onBack={() => navigateTo('settings')} onSubmit={() => { alert('Ticket Submitted'); navigateTo('settings'); }} />;

      case 'knowledgeBase':
        return <KnowledgeBaseScreen onBack={() => navigateTo('chatAgentDashboard')} onSave={() => navigateTo('chatAgentDashboard')} />;

      case 'qrCode':
        return <QRCodeScreen onBack={() => navigateTo('chatAgentDashboard')} />;

      case 'conversationView':
        return <ConversationViewScreen chat={selectedChat} onBack={() => navigateTo('chatAgentDashboard')} />;

      case 'propertyValuation':
        return <PropertyValuationScreen onBack={() => navigateTo('dashboard')} />;

      case 'mortgageCalculator':
        return <MortgageCalculatorScreen onBack={() => navigateTo('dashboard')} />;

      case 'commissionCalculator':
        return <CommissionCalculatorScreen onBack={() => navigateTo('dashboard')} />;

      case 'marketTrends':
        return <MarketTrendsScreen onBack={() => navigateTo('dashboard')} />;
      
      case 'campaignBuilder':
        return <CampaignBuilderScreen onBack={() => navigateTo('dashboard')} onSend={() => navigateTo('success')} />;

      // Fallbacks
      case 'leadScoring':
        return <CRMPipelineScreen onBack={() => navigateTo('settings')} />;
      case 'integrations':
         return <SettingsScreen onBack={() => navigateTo('dashboard')} onSave={() => {}} theme={theme} onToggleTheme={toggleTheme} onNavigateTo={navigateTo} />;

      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="app-container">
      {renderScreen()}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;