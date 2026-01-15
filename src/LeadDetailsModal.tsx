import React from 'react';

const LeadDetailsModal: React.FC<{ project: any, onClose: () => void, onLeadSelect: (lead: any) => void }> = ({ project, onClose, onLeadSelect }) => {
  // Mock leads for the project
  const leads = [
    { id: 1, name: 'John Doe', time: '2h ago' },
    { id: 2, name: 'Jane Smith', time: '5h ago' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0' }}>Leads for {project.name}</h3>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {leads.map(lead => (
            <div key={lead.id} className="lead-item">
              <div className="lead-info">
                <span className="lead-name">{lead.name}</span>
                <span className="lead-time">{lead.time}</span>
              </div>
              <button className="lead-action" onClick={() => onLeadSelect(lead)}>View</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsModal;