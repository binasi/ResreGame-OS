import React from 'react';
import { Scene } from '../types';
import { PhotoIcon, LoadingSpinner } from './Icons';

interface StoryboardGridProps {
  scenes: Scene[];
  isGenerating: boolean;
}

const StoryboardGrid: React.FC<StoryboardGridProps> = ({ scenes, isGenerating }) => {
  if (scenes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-4">
        <div className="w-24 h-24 rounded-3xl bg-zinc-900 border-2 border-dashed border-zinc-800 flex items-center justify-center">
            <PhotoIcon />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-medium text-zinc-300">No Scenes Yet</h3>
          <p className="max-w-xs mt-2 text-sm">Upload a script or ask the chatbot to generate a storyboard to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-8">
       <div className="flex items-center justify-between mb-8">
         <h1 className="text-3xl font-bold text-white tracking-tight">Storyboard</h1>
         <div className="text-zinc-400 text-sm">{scenes.length} Scenes</div>
       </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
        {scenes.map((scene) => (
          <div 
            key={scene.sceneNumber} 
            className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-300 shadow-xl"
          >
            {/* Image Container */}
            <div className="aspect-square w-full bg-zinc-950 relative border-b border-zinc-800">
              {scene.imageUrl ? (
                <img 
                  src={scene.imageUrl} 
                  alt={`Scene ${scene.sceneNumber}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 space-y-2">
                   {scene.isLoadingImage ? (
                     <>
                        <LoadingSpinner />
                        <span className="text-xs font-medium animate-pulse text-indigo-400">Generating Visual...</span>
                     </>
                   ) : (
                     <PhotoIcon />
                   )}
                </div>
              )}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                SCENE {scene.sceneNumber}
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <p className="text-zinc-300 text-sm leading-relaxed line-clamp-4">
                {scene.description}
              </p>
              
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 mb-1">Visual Prompt</p>
                <p className="text-xs text-zinc-600 italic line-clamp-2 group-hover:text-zinc-500 transition-colors">
                  {scene.visualPrompt}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryboardGrid;
