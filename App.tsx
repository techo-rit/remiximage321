import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { TrendingCarousel } from './components/TrendingCarousel';
import { StackGrid } from './components/StackGrid';
import { TemplateGrid } from './components/TemplateGrid';
import { TemplateExecution } from './components/TemplateExecution';
import { HoverPreview } from './components/HoverPreview';
import type { Stack, Template } from './types';
import { STACKS, TEMPLATES } from './constants';
import { ArrowLeftIcon } from './components/Icons';

type Page = 'home' | 'stack' | 'template';
type NavCategory = 'Home' | 'Marketing' | 'Creators';

interface HoverPreviewState {
  imageUrl: string | null;
  rect: DOMRect | null;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [activeNav, setActiveNav] = useState<NavCategory>('Home');
  const [selectedStack, setSelectedStack] = useState<Stack | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [hoverPreview, setHoverPreview] = useState<HoverPreviewState>({ imageUrl: null, rect: null });
  
  const showPreviewTimer = useRef<number | null>(null);
  const hidePreviewTimer = useRef<number | null>(null);

  const handleShowPreview = useCallback((imageUrl: string, element: HTMLElement) => {
    if (hidePreviewTimer.current) clearTimeout(hidePreviewTimer.current);
    if (showPreviewTimer.current) clearTimeout(showPreviewTimer.current);
    showPreviewTimer.current = window.setTimeout(() => {
        setHoverPreview({ imageUrl, rect: element.getBoundingClientRect() });
    }, 150);
  }, []);

  const handleHidePreview = useCallback(() => {
    if (showPreviewTimer.current) clearTimeout(showPreviewTimer.current);
    hidePreviewTimer.current = window.setTimeout(() => {
        setHoverPreview({ imageUrl: null, rect: null });
    }, 100);
  }, []);

  const handleSelectStack = useCallback((stack: Stack) => {
    handleHidePreview();
    setSelectedStack(stack);
    setCurrentPage('stack');
  }, [handleHidePreview]);

  const handleSelectTemplate = useCallback((template: Template) => {
    handleHidePreview();
    setSelectedTemplate(template);
    setCurrentPage('template');
  }, [handleHidePreview]);
  
  const handleBack = useCallback(() => {
    if (currentPage === 'template') {
      setCurrentPage('stack');
      setSelectedTemplate(null);
    } else if (currentPage === 'stack') {
      setCurrentPage('home');
      setSelectedStack(null);
    }
  }, [currentPage]);
  
  const handleNavClick = useCallback((category: NavCategory) => {
    setActiveNav(category);
    setCurrentPage('home');
    setSelectedStack(null);
    setSelectedTemplate(null);
  }, []);

  const renderContent = () => {
    switch (currentPage) {
      case 'template':
        return selectedTemplate && selectedStack && (
          <TemplateExecution template={selectedTemplate} stack={selectedStack} onBack={handleBack} />
        );
      case 'stack':
        return selectedStack && (
          <div className="w-full max-w-[1440px] mx-auto px-8 py-12">
            <button
              onClick={handleBack}
              aria-label="Go back to all stacks"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
            >
              <ArrowLeftIcon />
              Back to Stacks
            </button>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{selectedStack.name}</h1>
            <p className="text-gray-500 mb-8">Choose a template to start remixing your image.</p>
            <TemplateGrid
              templates={TEMPLATES.filter(t => t.stackId === selectedStack.id)}
              onSelectTemplate={handleSelectTemplate}
              onHoverTemplate={handleShowPreview}
              onHoverEndTemplate={handleHidePreview}
            />
          </div>
        );
      case 'home':
      default:
        // Here you could filter stacks based on `activeNav`
        // For this MVP, we show all stacks for all nav categories.
        return (
          <>
            <TrendingCarousel templates={TEMPLATES.slice(0, 8)} onSelectTemplate={handleSelectTemplate} />
            <div className="w-full max-w-[1440px] mx-auto px-8 py-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">All Stacks</h2>
              <StackGrid 
                stacks={STACKS} 
                onSelectStack={handleSelectStack}
                onHoverStack={handleShowPreview}
                onHoverEndStack={handleHidePreview}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header activeNav={activeNav} onNavClick={handleNavClick} />
      <main className="pt-[80px]"> {/* Add padding to offset fixed header */}
        {renderContent()}
      </main>
      <HoverPreview imageUrl={hoverPreview.imageUrl} rect={hoverPreview.rect} />
    </div>
  );
};

export default App;