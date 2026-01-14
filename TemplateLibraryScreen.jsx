import React, { useState } from 'react';
import TemplateCard from './TemplateCard';
import PreviewModal from './PreviewModal';


const TemplateLibraryScreen = ({ onSelect, onBack }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  // Filters based on your flow-spec.json categories
  const filters = ["All", "Broker", "Developer", "Individual", "Luxury", "Minimal"];

  // Dummy Data for the demo
  const templates = [
    { id: 1, title: "Modern Brokerage", category: "Broker", image: null },
    { id: 2, title: "Luxury Villa Showcase", category: "Luxury", image: null },
    { id: 3, title: "Agent Personal Brand", category: "Individual", image: null },
    { id: 4, title: "Off-Plan Launch", category: "Developer", image: null },
    { id: 5, title: "Minimalist Portfolio", category: "Minimal", image: null },
    { id: 6, title: "Corporate Agency", category: "Broker", image: null },
  ];

  const filteredTemplates = activeFilter === 'All' 
    ? templates 
    : templates.filter(t => t.category === activeFilter || (activeFilter === 'Luxury' && t.title.includes('Luxury')));

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '40px' }}>
      
      {/* Header with Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button 
          onClick={onBack}
          style={{ 
            background: 'none', 
            border: 'none', 
            fontSize: '24px', 
            marginRight: '16px', 
            cursor: 'pointer', 
            padding: 0,
            color: '#374151'
          }}
        >
          ←
        </button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Select Design</h1>
      </div>

      {/* Horizontal Filter Scroll - Mobile Optimized */}
      <div style={{ 
        display: 'flex', 
        overflowX: 'auto', 
        gap: '10px', 
        marginBottom: '24px', 
        paddingBottom: '4px',
        scrollbarWidth: 'none', /* Firefox */
        msOverflowStyle: 'none' /* IE/Edge */
      }}>
        {/* Hide scrollbar for Chrome/Safari */}
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: activeFilter === filter ? 'none' : '1px solid #E5E7EB',
              backgroundColor: activeFilter === filter ? '#111827' : '#F9FAFB',
              color: activeFilter === filter ? 'white' : '#4B5563',
              fontSize: '14px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.2s'
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Templates List */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {filteredTemplates.map(template => (
          <TemplateCard 
            key={template.id}
            title={template.title}
            category={template.category}
            image={template.image}
            onSelect={() => onSelect(template)}
            onLongPress={() => setPreviewTemplate(template)}
          />
        ))}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <PreviewModal 
          template={previewTemplate} 
          onClose={() => setPreviewTemplate(null)} 
          onSelect={onSelect}
        />
      )}
    </div>
  );
};

export default TemplateLibraryScreen;