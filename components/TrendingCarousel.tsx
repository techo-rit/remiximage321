import React from 'react';
import type { Template } from '../types';

interface TrendingCarouselProps {
    templates: Template[];
    onSelectTemplate: (template: Template) => void;
}

export const TrendingCarousel: React.FC<TrendingCarouselProps> = ({ templates, onSelectTemplate }) => {
    const handleKeyDown = (e: React.KeyboardEvent, template: Template) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectTemplate(template);
        }
    };

    return (
        <div className="bg-gray-50 py-12">
            <div className="w-full max-w-[1440px] mx-auto px-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Trending Now</h2>
                <div className="flex overflow-x-auto space-x-6 pb-4 -mx-8 px-8 scrollbar-hide">
                    {templates.map(template => (
                        <div
                            key={template.id}
                            role="button"
                            tabIndex={0}
                            aria-label={`Select trending template: ${template.name}`}
                            className="flex-shrink-0 w-[320px] h-[180px] group cursor-pointer rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-500 focus-visible:ring-offset-4 focus-visible:ring-offset-gray-50"
                            onClick={() => onSelectTemplate(template)}
                            onKeyDown={(e) => handleKeyDown(e, template)}
                        >
                            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-purple-500/20 group-hover:scale-105">
                                <img src={template.imageUrl} alt={template.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-4">
                                    <h3 className="text-white text-lg font-semibold">{template.name}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Simple utility to hide scrollbar, add to a global css or style tag if needed
const style = document.createElement('style');
style.textContent = `
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
`;
document.head.append(style);