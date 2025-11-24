

export interface Game {
  id: string;
  title: string;
  category: string;
  year: string;
  thumbnail: string; // Emoji or Color
  url: string; // URL for iframe embed
  description: string;
}

export interface SystemState {
  bootComplete: boolean;
  view: 'POWER_OFF' | 'BOOT' | 'MENU' | 'GAME' | 'MUSIC' | 'CHAT';
  selectedGameIndex: number;
  activeGameId: string | null;
  volume: number;
  isPlayingMusic: boolean;
}

export interface Scene {
  sceneNumber: number;
  description: string;
  visualPrompt: string;
  imageUrl?: string;
  isLoadingImage?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface AppState {
  scenes?: Scene[];
  messages?: ChatMessage[];
  isGenerating?: boolean;
}

export const GAMES: Game[] = [
  // --- THE CLASSICS (Xiaobawang Essentials) ---
  {
    id: 'contra',
    title: 'Contra',
    category: 'ACT',
    year: '1987',
    thumbnail: '🔫',
    url: 'https://www.retrogames.cc/embed/16885-contra-usa.html',
    description: 'UP UP DOWN DOWN LEFT RIGHT...'
  },
  {
    id: 'mario',
    title: 'Super Mario Bros',
    category: 'RPG',
    year: '1985',
    thumbnail: '🍄',
    url: 'https://www.retrogames.cc/embed/16879-super-mario-bros-world.html',
    description: 'It\'s me, Mario!'
  },
  {
    id: 'tank',
    title: 'Battle City',
    category: 'STG',
    year: '1985',
    thumbnail: '🛡️',
    url: 'https://www.retrogames.cc/embed/16664-battle-city-japan.html',
    description: 'Protect the Eagle base.'
  },
  {
    id: 'adventure',
    title: 'Adventure Island',
    category: 'ACT',
    year: '1986',
    thumbnail: '🛹',
    url: 'https://www.retrogames.cc/embed/16726-hudson-s-adventure-island-usa.html',
    description: 'Eat fruit, throw hammers.'
  },
  {
    id: 'twinbee',
    title: 'Twin Bee',
    category: 'STG',
    year: '1986',
    thumbnail: '🔔',
    url: 'https://www.retrogames.cc/embed/17182-twin-bee-japan.html',
    description: 'Shoot the bells!'
  },
  {
    id: 'circus',
    title: 'Circus Charlie',
    category: 'ACT',
    year: '1984',
    thumbnail: '🎪',
    url: 'https://www.retrogames.cc/embed/17528-circus-charlie-japan.html',
    description: 'Jump through fire rings.'
  },
  {
    id: 'kage',
    title: 'Legend of Kage',
    category: 'ACT',
    year: '1985',
    thumbnail: '🥷',
    url: 'https://www.retrogames.cc/embed/17498-legend-of-kage-the-usa.html',
    description: 'Rescue the princess.'
  },
  {
    id: 'ice',
    title: 'Ice Climber',
    category: 'ACT',
    year: '1985',
    thumbnail: '🔨',
    url: 'https://www.retrogames.cc/embed/16912-ice-climber-japan-usa.html',
    description: 'Climb the infinite mountain.'
  },
  {
    id: 'bomberman',
    title: 'Bomberman',
    category: 'PZL',
    year: '1983',
    thumbnail: '💣',
    url: 'https://www.retrogames.cc/embed/16676-bomberman-usa.html',
    description: 'Explosions everywhere.'
  },
  {
    id: 'galaga',
    title: 'Galaga',
    category: 'STG',
    year: '1981',
    thumbnail: '🚀',
    url: 'https://www.retrogames.cc/embed/16901-galaga-demons-of-death-usa.html',
    description: 'Space fighter classic.'
  },
   {
    id: 'pacman',
    title: 'Pac-Man',
    category: 'ARC',
    year: '1980',
    thumbnail: '👻',
    url: 'https://www.retrogames.cc/embed/17142-pac-man-usa.html',
    description: 'Waka waka waka.'
  },
  {
    id: 'tetris',
    title: 'Tetris',
    category: 'PZL',
    year: '1984',
    thumbnail: '🧱',
    url: 'https://www.retrogames.cc/embed/17300-tetris-usa.html',
    description: 'Line up the blocks.'
  },
   {
    id: 'mappy',
    title: 'Mappy',
    category: 'ACT',
    year: '1983',
    thumbnail: '🐭',
    url: 'https://www.retrogames.cc/embed/17062-mappy-japan.html',
    description: 'Police mouse vs cats.'
  },
  {
    id: 'city',
    title: 'City Connection',
    category: 'ACT',
    year: '1985',
    thumbnail: '🚗',
    url: 'https://www.retrogames.cc/embed/16881-city-connection-usa.html',
    description: 'Paint the roads white.'
  },
  // --- PC CLASSICS ---
  {
    id: 'doom',
    title: 'DOOM',
    category: 'FPS',
    year: '1993',
    thumbnail: '👿',
    url: 'https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fdoom.jsdos?anonymous=1',
    description: 'Knee-deep in the dead.'
  },
  {
    id: 'wolf3d',
    title: 'Wolfenstein 3D',
    category: 'FPS',
    year: '1992',
    thumbnail: '🏰',
    url: 'https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fwolf3d.jsdos?anonymous=1',
    description: 'Grandfather of FPS.'
  },
  {
    id: 'pop',
    title: 'Prince of Persia',
    category: 'ACT',
    year: '1989',
    thumbnail: '🗡️',
    url: 'https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fpop.jsdos?anonymous=1',
    description: 'Time is running out.'
  },
];

// Generate "9999 in 1" Bootleg Cartridge Filler
const BOOTLEG_TITLES = ['Super Mario 4', 'Contra 7', 'Tank 1999', 'Adventure X', 'Tetris 2', 'Hyper Olympics', 'Star Fighter', 'Galaxian 8'];
const BOOTLEG_ICONS = ['💾', '📼', '🎮', '🕹️'];

for(let i=1; i<=64; i++) {
  const randomTitle = BOOTLEG_TITLES[Math.floor(Math.random() * BOOTLEG_TITLES.length)];
  const randomIcon = BOOTLEG_ICONS[Math.floor(Math.random() * BOOTLEG_ICONS.length)];
  
  GAMES.push({
    id: `bootleg-${i}`,
    title: `${randomTitle} V${i}`,
    category: 'UNK',
    year: '19XX',
    thumbnail: randomIcon,
    url: 'about:blank', // Placeholder
    description: 'READ ERROR: INSERT CARTRIDGE'
  });
}
