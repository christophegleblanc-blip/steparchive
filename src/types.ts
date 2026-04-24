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
  year: number;
  songs: Song[];
}