export interface Difficulty {
  level: number;
  type: string; // e.g., 'Single', 'Double', 'Half-Double'
  steps?: number;
  freezes?: number;
  // Add other difficulty-specific properties as needed
}

export interface Song {
  title: string;
  artist: string;
  bpm?: number;
  length?: string; // e.g., '2:30'
  difficulties: Difficulty[];
}

export interface Pack {
  name: string;
  numberOfFiles: number;
  difficultyRange: string;
  type: string;
  stepartists: string;
  download: string;
  songs: Song[];
}

export const packsData: Pack[] = [
  {
    name: 'Sample Pack 1',
    numberOfFiles: 10,
    difficultyRange: 'Easy-Medium',
    type: 'Original',
    stepartists: 'Artist1',
    download: 'https://example.com/download1',
    songs: [
      {
        title: 'Song One',
        artist: 'Artist A',
        bpm: 140,
        length: '2:15',
        difficulties: [
          { level: 5, type: 'Single', steps: 450 },
          { level: 8, type: 'Single', steps: 680 },
          { level: 12, type: 'Single', steps: 1200 },
        ],
      },
      {
        title: 'Song Two',
        artist: 'Artist B',
        bpm: 160,
        length: '3:00',
        difficulties: [
          { level: 6, type: 'Single', steps: 520 },
          { level: 9, type: 'Single', steps: 750 },
          { level: 13, type: 'Single', steps: 1350 },
          { level: 10, type: 'Double', steps: 800 },
        ],
      },
      // Add more songs...
    ],
  },
  {
    name: 'Sample Pack 2',
    numberOfFiles: 15,
    difficultyRange: 'Medium-Hard',
    type: 'Remix',
    stepartists: 'Artist2, Artist3',
    download: 'https://example.com/download2',
    songs: [
      {
        title: 'Remix Song One',
        artist: 'Original Artist',
        bpm: 150,
        length: '2:45',
        difficulties: [
          { level: 10, type: 'Single', steps: 850 },
          { level: 14, type: 'Single', steps: 1450 },
          { level: 11, type: 'Double', steps: 920 },
        ],
      },
      // Add more songs...
    ],
  },
  // Add more packs...
];