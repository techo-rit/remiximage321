import React, { useState, useCallback } from 'react';
import type { Template, Stack } from '../types';
import { UploadZone } from './UploadZone';
import { Spinner } from './Spinner';
import { ArrowLeftIcon, DownloadIcon, RefreshIcon, SparklesIcon } from './Icons';
import { generateImage } from '../services/geminiService';

interface TemplateExecutionProps {
  template: Template;
  stack: Stack;
  onBack: () => void;
}

export const TemplateExecution: React.FC<TemplateExecutionProps> = ({ template, stack, onBack }) => {
  const [userImage, setUserImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleRemix = useCallback(async () => {
    if (!userImage) {
      setError("Please upload your image first.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const result = await generateImage(template, userImage);
      setGeneratedImage(result);
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [userImage, template]);

  const handleRemixAgain = () => {
    setUserImage(null);
    setGeneratedImage(null);
    setError(null);
  };
  
  const handleDownload = (format: 'png' | 'jpeg') => {
    if(!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `remixed-image.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-12">
        <button onClick={onBack} aria-label={`Back to ${stack.name} templates`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2">
            <ArrowLeftIcon />
            Back to {stack.name}
        </button>
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">{template.name}</h1>
            <p className="text-lg text-gray-500 mt-2">Upload your image and let the AI work its magic.</p>
        </div>

        {!generatedImage && !isLoading && (
            <>
                <div className="flex justify-center mb-8">
                    <div className="w-full max-w-md">
                        <UploadZone onFileChange={setUserImage} title="Upload Your Image" subtitle="Required" />
                    </div>
                </div>
                <div className="text-center">
                    <button
                        onClick={handleRemix}
                        disabled={!userImage || isLoading}
                        className="inline-flex items-center justify-center gap-3 px-12 py-4 bg-purple-500 text-white font-semibold text-lg rounded-xl shadow-lg shadow-purple-500/30 hover:bg-purple-600 transition-all duration-300 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
                    >
                        <SparklesIcon />
                        Remix Image
                    </button>
                </div>
            </>
        )}

        {isLoading && (
            <div className="flex flex-col items-center justify-center text-center p-16 bg-gray-50 rounded-2xl">
                <Spinner />
                <h2 className="text-2xl font-semibold text-gray-700 mt-6">Generating your image...</h2>
                <p className="text-gray-500 mt-2">This usually takes about 10-15 seconds. Please wait.</p>
            </div>
        )}
        
        {error && !isLoading && (
             <div className="text-center p-8 bg-red-50 border border-red-200 rounded-2xl">
                 <p className="text-red-600 font-semibold">Error</p>
                 <p className="text-red-500 mt-2">{error}</p>
                 <button onClick={handleRemix} className="mt-4 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2">Try Again</button>
             </div>
        )}

        {generatedImage && !isLoading && (
            <div className="text-center">
                <div className="max-w-4xl mx-auto mb-8 border-4 border-gray-100 rounded-2xl shadow-lg overflow-hidden">
                    <img src={generatedImage} alt="Generated result" className="w-full h-auto" />
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <button onClick={() => handleDownload('png')} className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2">
                      <DownloadIcon/>
                      Download PNG
                    </button>
                    <button onClick={() => handleDownload('jpeg')} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                      <DownloadIcon/>
                      Download JPG
                    </button>
                    <button onClick={handleRemixAgain} className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-700/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-800 focus-visible:ring-offset-2">
                      <RefreshIcon/>
                      Remix Again
                    </button>
                    <button onClick={onBack} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2">
                      Try Another Template
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};