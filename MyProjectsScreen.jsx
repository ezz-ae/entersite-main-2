import React, { useState } from 'react';
import EmptyState from './EmptyState';
import StickyFooter from './StickyFooter';
import DashboardStats from './DashboardStats';
import LeadDetailsModal from './LeadDetailsModal';
import AgentSuccessWidget from './AgentSuccessWidget';
import './mobile-styles.css';

const MyProjectsScreen = ({ onCreateNew, onSettings, onLeadSelect, onNotifications, onOpenMarketing, onVoiceAssistant, onScanDocument }) => {
  // 1. This would normally come from your database or API
  // We initialize it with data so you can see the stats and swipe action
  const [projects, setProjects] = useState([
    { id: 1, name: "Downtown Luxury Loft", type: "website", status: "Live", views: 1240, leads: 45 },
    { id: 2, name: "October Newsletter", type: "email", status: "Sent", views: 560, leads: 12 },
    { id: 3, name: "Marina 2-Bed", type: "website", status: "Live", views: 850, leads: 12 },
    { id: 4, name: "SMS Blast - Leads", type: "sms", status: "Completed", views: 980, leads: 5 }
  ]); 

  const [selectedProject, setSelectedProject] = useState(null);

  // Pull to Refresh State
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullHeight, setPullHeight] = useState(0);
  const startY = React.useRef(0);

  const handlePullStart = (e) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handlePullMove = (e) => {
    if (window.scrollY === 0 && startY.current > 0 && !isRefreshing) {
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;
      if (diff > 0) {
        setPullHeight(Math.min(diff * 0.4, 100)); // Add resistance
      }
    }
  };

  const handlePullEnd = () => {
    if (pullHeight > 60) {
      setIsRefreshing(true);
      setPullHeight(60); // Snap to loading height
      // Simulate Refresh API Call
      setTimeout(() => {
        setProjects(prev => prev.map(p => ({
          ...p,
          views: p.views + Math.floor(Math.random() * 50),
          leads: p.leads + (Math.random() > 0.8 ? 1 : 0)
        })));
        setIsRefreshing(false);
        setPullHeight(0);
      }, 1500);
    } else {
      setPullHeight(0);
    }
    startY.current = 0;
  };

  // Calculate total stats
  const totalViews = projects.reduce((acc, p) => acc + (p.views || 0), 0);
  const totalLeads = projects.reduce((acc, p) => acc + (p.leads || 0), 0);

  const handleDelete = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleProjectClick = (project) => {
    if (project.type === 'email' || project.type === 'sms') {
      onOpenMarketing(project);
    } else {
      setSelectedProject(project);
    }
  };

  // 2. The "Empty State" Logic
  // If the agent has no work saved, we guide them immediately to the action.
  if (projects.length === 0) {
    return (
      <EmptyState 
        title="No Projects Yet"
        message="You haven't started any campaigns. Tap the button below to create your first website or ad."
        actionLabel="Start New Project"
        onAction={onCreateNew}
      />
    );
  }

  // 3. The "List State" (If they have data)
  return (
    <div 
      className="screen-container" 
      style={{ padding: '24px', paddingBottom: '100px', minHeight: '80vh' }}
      onTouchStart={handlePullStart}
      onTouchMove={handlePullMove}
      onTouchEnd={handlePullEnd}
    >
      {/* Refresh Indicator */}
      <div style={{ 
        height: `${pullHeight}px`, 
        overflow: 'hidden', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        transition: isRefreshing ? 'height 0.2s' : 'height 0.1s ease-out'
      }}>
        {isRefreshing ? (
          <div className="spinner" style={{ width: '24px', height: '24px', borderWidth: '3px' }}></div>
        ) : (
          <span style={{ transform: `rotate(${pullHeight * 3}deg)`, fontSize: '20px', opacity: Math.min(pullHeight / 40, 1) }}>⬇️</span>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>My Projects</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={onScanDocument}
            style={{ 
              background: '#F3F4F6', 
              border: 'none', 
              borderRadius: '50%', 
              width: '40px', 
              height: '40px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '20px', 
              cursor: 'pointer' 
            }}
          >
            📷
          </button>
          <button 
            onClick={onVoiceAssistant}
            style={{ 
              background: '#F3F4F6', 
              border: 'none', 
              borderRadius: '50%', 
              width: '40px', 
              height: '40px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '20px', 
              cursor: 'pointer' 
            }}
          >
            🎙️
          </button>
          <button 
            onClick={onNotifications}
            style={{ 
              background: '#F3F4F6', 
              border: 'none', 
              borderRadius: '50%', 
              width: '40px', 
              height: '40px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '20px', 
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            🔔
            <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%', border: '1px solid white' }}></span>
          </button>
          <button 
            onClick={onSettings}
            style={{ 
              background: '#F3F4F6', 
              border: 'none', 
              borderRadius: '50%', 
              width: '40px', 
              height: '40px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '20px', 
              cursor: 'pointer' 
            }}
          >
            ⚙️
          </button>
        </div>
      </div>
      
      <AgentSuccessWidget onAction={() => alert('Navigating to Sarah Miller...')} />

      <DashboardStats views={totalViews} leads={totalLeads} />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {projects.map((project) => (
          <SwipeableProjectItem 
            key={project.id} 
            project={project} 
            onDelete={handleDelete} 
            onSelect={() => handleProjectClick(project)}
          />
        ))}
      </div>

      {selectedProject && (
        <LeadDetailsModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
          onLeadSelect={onLeadSelect}
        />
      )}
      <StickyFooter label="Start New Project" onClick={onCreateNew} />
    </div>
  );
};

// Sub-component for swipe logic
const SwipeableProjectItem = ({ project, onDelete, onSelect }) => {
  const [offset, setOffset] = useState(0);
  const startX = React.useRef(0);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX.current;
    // Only allow swiping left (negative diff) up to -80px
    if (diff < 0 && diff > -100) {
      setOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    if (offset < -40) {
      setOffset(-80); // Snap open
    } else {
      setOffset(0); // Snap close
    }
  };

  const handleClick = () => {
    // Only trigger select if we aren't swiped open
    if (offset === 0) onSelect();
  };

  return (
    <div className="project-item-wrapper">
       <div className="delete-action" onClick={() => onDelete(project.id)}>
         🗑️
       </div>
       <div 
         className="project-item-content"
         style={{ 
           transform: `translateX(${offset}px)`,
           padding: '20px', borderRadius: '16px', backgroundColor: 'white', border: '1px solid #E5E7EB', position: 'relative', zIndex: 2, transition: 'transform 0.2s ease-out'
         }}
         onTouchStart={handleTouchStart}
         onTouchMove={handleTouchMove}
         onTouchEnd={handleTouchEnd}
         onClick={handleClick}
       >
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0' }}>{project.name}</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#6B7280' }}>{project.status}</span>
            {project.views > 0 && (
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#007AFF' }}>
                {project.views} views
              </span>
            )}
          </div>
       </div>
    </div>
  );
};

export default MyProjectsScreen;