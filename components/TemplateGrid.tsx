import React from 'react';
import type { Template } from '../types';

interface TemplateGridProps {
  templates: Template[];
  onSelectTemplate: (template: Template) => void;
  onHoverTemplate: (imageUrl: string, element: HTMLElement) => void;
  onHoverEndTemplate: () => void;
}

export const TemplateGrid: React.FC<TemplateGridProps> = ({ templates, onSelectTemplate, onHoverTemplate, onHoverEndTemplate }) => {
  const handleKeyDown = (e: React.KeyboardEvent, template: Template) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectTemplate(template);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {templates.map(template => (
        <div
          key={template.id}
          className="group cursor-pointer rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-500"
          role="button"
          tabIndex={0}
          aria-label={`Select template: ${template.name}`}
          onClick={() => onSelectTemplate(template)}
          onKeyDown={(e) => handleKeyDown(e, template)}
          onMouseEnter={(e) => onHoverTemplate(template.imageUrl, e.currentTarget)}
          onMouseLeave={onHoverEndTemplate}
        >
          <div className="aspect-[3/4] rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-purple-500 group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-all duration-300 transform group-hover:-translate-y-1">
            <img src={template.imageUrl} alt={template.name} className="w-full h-full object-cover" />
          </div>
        </div>
      ))}
    </div>
  );
};