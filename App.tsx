

import React, { useState, useEffect, useRef } from 'react';
import { GAMES, Game, SystemState, ChatMessage } from './types';
import ChatInterface from './components/ChatInterface';
import { Battery, Wifi, Volume2, Play, Square, Gamepad2, Disc3, Terminal, Music, Power } from 'lucide-react';

const BOOT_TEXT = [
  "SYSTEM BIOS v1.02 (C) 1991",
  "CHECKING MEMORY... 640K OK",
  "DETECTING PERIPHERALS...",
  "  > KEYBOARD... OK",
  "  > MOUSE... DETECTED",
  "  > SOUND BLASTER... A220 I5 D1",
  "LOADING OS...",
  "MOUNTING DRIVE A: ... DONE",
  "INITIALIZING GRAPHICS... VGA MODE 13H",
  "WELCOME TO RETRO-OS"
];

// Virtual "Apps" mixed into the game list for the menu
const SYSTEM_APPS = [
  {
    id: 'app-chat',
    title: 'AI TERMINAL',
    category: 'SYSTEM',
    year: '2024',
    thumbnail: '🤖',
    url: 'internal',
    description: 'Neural Network Interface.'
  },
  {
    id: 'app-music',
    title: 'MUSIC STUDIO',
    category: 'MEDIA',
    year: '1995',
    thumbnail: '🎵',
    url: 'internal',
    description: 'Audio Visualizer.'
  }
];

const App: React.FC = () => {
  const [state, setState] = useState<SystemState>({
    bootComplete: false,
    view: 'POWER_OFF', // Starts off to require interaction
    selectedGameIndex: 0,
    activeGameId: null,
    volume: 80,
    isPlayingMusic: false,
  });

  const [bootLines, setBootLines] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Combine Apps and Games for the menu
  const menuItems = [...SYSTEM_APPS, ...GAMES];

  const handlePowerOn = () => {
    // User interaction here unlocks audio context
    setState(prev => ({ ...prev, view: 'BOOT' }));
  };

  // Background Music
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://upload.wikimedia.org/wikipedia/commons/2/2e/Bit_Pop_-_8-Bit_Music_-_Public_Domain_-_5.mp3');
      audioRef.current.loop = true;
    }

    audioRef.current.volume = state.volume / 200;

    if (state.isPlayingMusic) {
      // Audio play is now safe because we only set isPlayingMusic after the user clicked 'Power On'
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
           console.log("Audio play failed, likely interaction needed still:", error);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [state.isPlayingMusic, state.volume]);

  // Boot Sequence
  useEffect(() => {
    if (state.view !== 'BOOT') return;

    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex < BOOT_TEXT.length) {
        setBootLines(prev => [...prev, BOOT_TEXT[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setState(prev => ({ ...prev, view: 'MENU', bootComplete: true, isPlayingMusic: true }));
        }, 1000);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [state.view]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.view === 'MENU') {
        if (e.key === 'ArrowRight') {
          setState(prev => ({ 
            ...prev, 
            selectedGameIndex: Math.min(prev.selectedGameIndex + 1, menuItems.length - 1) 
          }));
        }
        if (e.key === 'ArrowLeft') {
          setState(prev => ({ 
            ...prev, 
            selectedGameIndex: Math.max(prev.selectedGameIndex - 1, 0) 
          }));
        }
        if (e.key === 'ArrowDown') {
          setState(prev => ({ 
             ...prev, 
             selectedGameIndex: Math.min(prev.selectedGameIndex + 4, menuItems.length - 1) 
          }));
        }
        if (e.key === 'ArrowUp') {
          setState(prev => ({ 
            ...prev, 
            selectedGameIndex: Math.max(prev.selectedGameIndex - 4, 0) 
          }));
        }
        if (e.key === 'Enter') {
          launchItem(state.selectedGameIndex);
        }
        if (e.key === 'm') {
          setState(prev => ({ ...prev, isPlayingMusic: !prev.isPlayingMusic }));
        }
      } else if (state.view === 'GAME' || state.view === 'MUSIC') {
        if (e.key === 'Escape') {
           setState(prev => ({ ...prev, view: 'MENU', activeGameId: null, isPlayingMusic: true }));
        }
      }
      // Note: Chat handles its own escape
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.view, state.selectedGameIndex]);

  // Auto scroll to selection
  useEffect(() => {
    if (scrollRef.current && state.view === 'MENU') {
      const selectedEl = document.getElementById(`item-${state.selectedGameIndex}`);
      if (selectedEl) {
        selectedEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [state.selectedGameIndex, state.view]);

  const launchItem = (index: number) => {
    const item = menuItems[index];
    if (item.id === 'app-chat') {
       setState(prev => ({ ...prev, view: 'CHAT', selectedGameIndex: index, isPlayingMusic: true })); 
    } else if (item.id === 'app-music') {
       setState(prev => ({ ...prev, view: 'MUSIC', selectedGameIndex: index, isPlayingMusic: true }));
    } else if (item.url !== 'about:blank') {
       setState(prev => ({ ...prev, view: 'GAME', activeGameId: item.id, isPlayingMusic: false, selectedGameIndex: index }));
    }
  };

  const renderPowerOff = () => (
    <div className="h-full flex items-center justify-center bg-black font-['Press_Start_2P']">
      <button 
        onClick={handlePowerOn}
        className="group flex flex-col items-center justify-center gap-6 outline-none"
      >
         <div className="relative">
           <div className="w-24 h-24 rounded-full bg-zinc-900 border-4 border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center group-hover:border-green-600 group-hover:shadow-[0_0_30px_rgba(74,222,128,0.3)] transition-all duration-300 group-active:scale-95 group-active:bg-zinc-800">
              <Power className="w-10 h-10 text-zinc-600 group-hover:text-green-500 transition-colors" />
           </div>
           {/* Led Indicator */}
           <div className="absolute top-0 right-0 w-3 h-3 bg-red-900 rounded-full border border-black group-hover:bg-red-500 transition-colors shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
         </div>
         <div className="text-zinc-500 text-xs animate-pulse group-hover:text-green-500 transition-colors">
            PRESS START
         </div>
      </button>
    </div>
  );

  const renderBoot = () => (
    <div className="h-full flex flex-col justify-end p-10 font-mono text-green-500 text-lg md:text-2xl leading-relaxed">
      {bootLines.map((line, i) => (
        <div key={i} className="mb-2">
          <span className="mr-2">{'>'}</span>
          {line}
        </div>
      ))}
      <div className="animate-pulse mt-2">_</div>
    </div>
  );

  const renderMenu = () => (
    <div className="h-full flex flex-col">
      {/* Top Bar */}
      <div className="h-12 bg-zinc-900 border-b-4 border-zinc-800 flex items-center justify-between px-4 text-green-400 font-['Press_Start_2P']">
        <div className="flex items-center gap-4">
          <Gamepad2 className="w-6 h-6" />
          <span className="text-xl tracking-widest hidden md:inline">RETRO-OS</span>
        </div>
        <div className="flex items-center gap-6 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <span className="hidden md:inline">VOL</span>
            <div className="w-16 h-4 bg-zinc-800 border border-green-900 relative">
              <div className="h-full bg-green-500" style={{ width: `${state.volume}%` }}></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Disc3 className={`w-4 h-4 ${state.isPlayingMusic ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">{state.isPlayingMusic ? 'ON' : 'OFF'} [M]</span>
          </div>
          <div className="flex items-center gap-2">
             <span>12:00 PM</span>
             <Battery className="w-5 h-5 fill-current" />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-8 relative scrollbar-hide" ref={scrollRef}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
          {menuItems.map((item, index) => {
            const isSelected = state.selectedGameIndex === index;
            const isApp = item.category === 'SYSTEM' || item.category === 'MEDIA';
            return (
              <div
                id={`item-${index}`}
                key={item.id}
                onClick={() => launchItem(index)}
                className={`
                  relative aspect-[4/3] rounded-lg border-4 transition-all cursor-pointer transform
                  flex flex-col overflow-hidden
                  ${isSelected 
                    ? 'border-green-400 scale-105 shadow-[0_0_20px_rgba(74,222,128,0.5)] z-10 bg-zinc-800' 
                    : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900 grayscale hover:grayscale-0'
                  }
                `}
              >
                {/* Thumbnail Area */}
                <div className={`flex-1 flex flex-col items-center justify-center p-4 border-b-2 border-zinc-700 ${isApp ? 'bg-zinc-800' : 'bg-gradient-to-br from-zinc-800 to-zinc-900'}`}>
                  <div className="text-6xl mb-2 filter drop-shadow-md transform hover:scale-110 transition-transform">
                    {item.thumbnail}
                  </div>
                  <h3 className={`text-center text-xs md:text-sm mt-2 leading-tight font-['Press_Start_2P'] ${isSelected ? 'text-green-400 text-glow' : 'text-zinc-500'}`}>
                    {item.title}
                  </h3>
                </div>
                
                {/* Metadata */}
                <div className="h-8 md:h-12 bg-zinc-950 flex items-center justify-between px-3 text-[8px] md:text-[10px] text-zinc-500 font-mono">
                  <span className={isApp ? 'text-green-600 font-bold' : ''}>{item.category.substring(0,8)}</span>
                  <span className="border border-zinc-700 px-1 rounded">{item.year}</span>
                </div>

                {isSelected && (
                  <div className="absolute -bottom-16 left-0 right-0 text-center pointer-events-none">
                    <div className="bg-green-900/90 text-green-100 text-xs p-2 rounded border border-green-500 font-['Press_Start_2P']">
                      {item.description}
                      <div className="mt-1 text-[10px] animate-pulse text-yellow-300">PRESS ENTER</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Helper Bar */}
      <div className="h-10 bg-zinc-900 border-t-2 border-zinc-800 flex items-center justify-center text-[10px] md:text-xs text-zinc-500 gap-4 md:gap-8 font-['Press_Start_2P']">
         <span className="flex items-center gap-1"><span className="border border-zinc-600 px-1">↑↓←→</span> NAV</span>
         <span className="flex items-center gap-1"><span className="border border-zinc-600 px-1">ENTER</span> GO</span>
         <span className="flex items-center gap-1"><span className="border border-zinc-600 px-1">M</span> AUDIO</span>
      </div>
    </div>
  );

  const renderGame = () => {
    const activeGame = GAMES.find(g => g.id === state.activeGameId);
    if (!activeGame) return null;

    return (
      <div className="h-full flex flex-col bg-black">
        <div className="bg-zinc-900 p-2 flex justify-between items-center border-b border-zinc-800 font-['Press_Start_2P']">
          <div className="flex gap-2 items-center text-green-500 text-xs">
             <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
             <span>RUNNING: {activeGame.title}</span>
          </div>
          <button 
            onClick={() => setState(prev => ({ ...prev, view: 'MENU', activeGameId: null, isPlayingMusic: true }))}
            className="text-white text-[10px] border border-white px-2 py-1 hover:bg-white hover:text-black transition-colors"
          >
            [ESC] EXIT
          </button>
        </div>
        <div className="flex-1 relative bg-black">
          <iframe 
            src={activeGame.url}
            className="w-full h-full border-0"
            allow="autoplay; gamepad"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            title={activeGame.title}
          />
        </div>
      </div>
    );
  };

  const renderMusicPlayer = () => (
    <div className="h-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
       {/* Visualizer bars */}
       <div className="absolute inset-0 flex items-end justify-center gap-1 opacity-50 px-10 pb-20">
         {Array.from({ length: 20 }).map((_, i) => (
           <div 
             key={i} 
             className="w-full bg-green-500 transition-all duration-75 ease-in-out" 
             style={{ 
               height: `${state.isPlayingMusic ? Math.random() * 80 + 10 : 10}%`,
               opacity: state.isPlayingMusic ? 1 : 0.3
             }}
           ></div>
         ))}
       </div>

       <div className="z-10 border-4 border-green-500 p-8 bg-black/90 text-green-500 text-center rounded-lg shadow-[0_0_50px_rgba(74,222,128,0.3)]">
          <Disc3 className={`w-24 h-24 mx-auto mb-6 ${state.isPlayingMusic ? 'animate-spin' : ''}`} />
          <h2 className="text-2xl font-['Press_Start_2P'] mb-4">8-BIT RADIO</h2>
          <p className="font-mono mb-8 text-lg">TRACK 01: CHIPTUNE DREAMS</p>
          
          <div className="flex items-center gap-4 justify-center">
            <button onClick={() => setState(prev => ({ ...prev, view: 'MENU' }))} className="border border-green-700 px-4 py-2 hover:bg-green-900 font-mono">[ESC] BACK</button>
            <button 
              onClick={() => setState(prev => ({ ...prev, isPlayingMusic: !prev.isPlayingMusic }))} 
              className="bg-green-600 text-black px-6 py-2 hover:bg-green-500 font-bold font-mono"
            >
              {state.isPlayingMusic ? 'PAUSE' : 'PLAY'}
            </button>
          </div>
       </div>
    </div>
  );

  return (
    <div className="w-screen h-screen bg-zinc-950 text-white overflow-hidden relative selection:bg-green-500 selection:text-black">
      {/* CRT Effects */}
      <div className="scanlines"></div>
      <div className="flicker"></div>
      <div className="crt-overlay"></div>

      {/* Main View */}
      <div className="relative z-10 h-full">
        {state.view === 'POWER_OFF' && renderPowerOff()}
        {state.view === 'BOOT' && renderBoot()}
        {state.view === 'MENU' && renderMenu()}
        {state.view === 'GAME' && renderGame()}
        {state.view === 'MUSIC' && renderMusicPlayer()}
        {state.view === 'CHAT' && (
          <div className="h-full p-4 md:p-10 bg-black">
            <ChatInterface 
              messages={chatMessages}
              setMessages={setChatMessages}
              appState={{}}
              onScriptUpload={() => {}}
              onBack={() => setState(prev => ({ ...prev, view: 'MENU' }))}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
