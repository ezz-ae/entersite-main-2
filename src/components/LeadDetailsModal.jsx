import React, { useState } from 'react';


const LeadDetailsModal = ({ project, onClose, onLeadSelect }) => {
  const [recordingId, setRecordingId] = useState(null);
  const [notes, setNotes] = useState({}); // Store notes by lead ID

  const handleVoiceNote = (e, leadId) => {
    e.stopPropagation();
    
    if (recordingId === leadId) {
      // Stop recording
      setRecordingId(null);
      return;
    }

    // Start recording simulation (or actual API)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.start();
      setRecordingId(leadId);
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setNotes(prev => ({ ...prev, [leadId]: transcript }));
        setRecordingId(null);
      };
    } else {
      alert("Voice recording not supported on this browser.");
    }
  };

  if (!project) return null;

  // Dummy leads generator if not present in project data
  const leads = project.leadsList || [
    { id: 1, name: "Sarah Miller", time: "2 mins ago", phone: "+971501234567" },
    { id: 2, name: "Mohammed Ali", time: "1 hour ago", phone: "+971559876543" },
    { id: 3, name: "John Smith", time: "3 hours ago", phone: "+971523334444" },
    { id: 4, name: "Emma Wilson", time: "1 day ago", phone: "+971505556666" },
    { id: 5, name: "David Chen", time: "2 days ago", phone: "+971567778888" },
  ];

  // If project has 0 leads, show empty list
  const displayLeads = project.leads === 0 ? [] : leads;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#111827' }}>{project.name}</h3>
            <span style={{ fontSize: '12px', color: '#6B7280' }}>{project.leads} Leads Generated</span>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', cursor: 'pointer', color: '#4B5563' }}
          >
            ×
          </button>
        </div>

        {/* Leads List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          {displayLeads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
              <p>No leads received yet.</p>
            </div>
          ) : (
            displayLeads.map(lead => (
              <div key={lead.id} className="lead-item" onClick={() => onLeadSelect(lead)} style={{ cursor: 'pointer' }}>
                <div className="lead-info" style={{ flex: 1 }}>
                  <span className="lead-name">{lead.name}</span>
                  <span className="lead-time">{lead.time}</span>
                  {notes[lead.id] && (
                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px', fontStyle: 'italic' }}>
                      📝 "{notes[lead.id]}"
                    </div>
                  )}
                  {recordingId === lead.id && (
                    <div className="recording-ui">
                      🔴 Listening...
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={(e) => handleVoiceNote(e, lead.id)}
                    style={{ background: 'var(--bg-tertiary)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '16px' }}
                  >
                    {recordingId === lead.id ? '⏹️' : '🎙️'}
                  </button>
                  <a href={`tel:${lead.phone}`} className="lead-action" onClick={e => e.stopPropagation()}>
                    📞 Call
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Action */}
        <div style={{ padding: '20px', borderTop: '1px solid #E5E7EB' }}>
          <button className="primary-button" style={{ height: '48px', fontSize: '16px' }}>
            Download CSV
          </button>
        </div>

      </div>
    </div>
  );
};

export default LeadDetailsModal;