import React from 'react';
import TemplateCard from './TemplateCard';

const ResumeTemplates = ({ selectedTemplate, onSelectTemplate }) => {
  const templates = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and professional design with a modern touch',
      preview: '/templates/modern-preview.png',
      color: 'blue',
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional and timeless resume format',
      preview: '/templates/classic-preview.png',
      color: 'gray',
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Stand out with a colorful and unique design',
      preview: '/templates/creative-preview.png',
      color: 'purple',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Choose a Template</h2>
      <div className="grid grid-cols-1 gap-6">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate === template.id}
            onSelect={() => onSelectTemplate(template.id)}
          />
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Tips for Choosing a Template</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Modern:</strong> Best for tech and creative industries</li>
          <li>• <strong>Classic:</strong> Ideal for traditional fields like law, finance, academia</li>
          <li>• <strong>Creative:</strong> Perfect for designers, marketers, and artists</li>
        </ul>
      </div>
    </div>
  );
};

export default ResumeTemplates;